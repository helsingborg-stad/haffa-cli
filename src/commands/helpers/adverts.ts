import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { parallelScan } from "@shelf/dynamodb-parallel-scan";
import fs from "fs-extra";
import path from "path";

export interface Advert {
  id: string;
  giver: string | null;
}
export interface ScanProps {
  filterExpression?: string;
  expressionAttributeValues?: Record<string, unknown>;
  limit?: number;
  filterFunction?: (advertData: Advert) => boolean;
}
type AdvertTable = string;

// const DEFAULT_PROJECTION = "";
// const DEFAULT_EXPRESSION_ATTRIBUTE_NAMES = {};

function getDbClient() {
  return new DynamoDBClient({
    region: "eu-west-1",
  });
}

async function listTables(): Promise<AdvertTable[]> {
  const client = getDbClient();
  const command = new ListTablesCommand({});
  const response: ListTablesCommandOutput = await client.send(command);
  return response.TableNames ?? [];
}

async function getAdvertTableNameFromEnv(): Promise<AdvertTable | undefined> {
  const tables = await listTables();
  return tables.find((t) => t.includes(process.env.API_ENV as string));
}

function mapToAdvert(rawMap: Record<string, unknown>): Advert {
  return {
    id: rawMap.id as string,
    giver: rawMap.giver as string,
    ...(rawMap as Record<string, unknown>),
  };
}

export async function getAdverts(): Promise<Advert[]> {
  const result = await parallelScan(
    {
      TableName: await getAdvertTableNameFromEnv(),
      FilterExpression: "version = :version",
      ExpressionAttributeValues: { ":version": 0 },
    },
    { concurrency: 500 },
  );

  return (result ?? []).map(mapToAdvert);
}

export async function backupAdvert(advert: Advert): Promise<void> {
  const user = advert.giver ?? "anonymous";
  const advertId = advert.id;

  const fileName = `${advertId}.json`;
  const filePath = path.join(`./backups/${user}`, fileName);

  await fs.mkdirp(`./backups/${user}`);

  await fs.writeFile(filePath, JSON.stringify(advert, null, 2));
  console.log("wrote case to file:", filePath);
}
