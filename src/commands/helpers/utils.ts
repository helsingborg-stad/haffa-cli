import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { parallelScan } from "@shelf/dynamodb-parallel-scan";

// import { S3Client } from "@aws-sdk/client-s3";
// import { RawAdvert } from "./advert/types";

export function print(output: string) {
  process.stdout.clearLine(0);
  process.stdout.write(`${output}\r`);
}

export function printEndLine() {
  process.stdout.write("\n");
}

export function getDbClient() {
  return new DynamoDBClient({
    region: "eu-west-1",
  });
}

export async function listTables(): Promise<string[]> {
  const client = getDbClient();
  const command = new ListTablesCommand({});
  const response: ListTablesCommandOutput = await client.send(command);
  return response.TableNames ?? [];
}

export async function getTableNameFromEnv(): Promise<string | undefined> {
  const tables = await listTables();
  return tables.find((t) => t.includes(process.env.API_ENV as string));
}

export async function queryDb<T>(): Promise<T> {
  return (parallelScan(
    { TableName: await getTableNameFromEnv() },
    { concurrency: 500 },
  ) ?? []) as T;
}
