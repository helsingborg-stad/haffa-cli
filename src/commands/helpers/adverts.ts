import { parallelScan } from "@shelf/dynamodb-parallel-scan";
import fs from "fs-extra";
import path from "path";
import { getTableNameFromEnv } from "./utils";

export interface Advert {
  id: string;
  giver: string | null;
}

// const DEFAULT_PROJECTION = "";
// const DEFAULT_EXPRESSION_ATTRIBUTE_NAMES = {};

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
      TableName: await getTableNameFromEnv(),
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
