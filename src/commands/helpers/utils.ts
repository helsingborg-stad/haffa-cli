import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { parallelScan } from "@shelf/dynamodb-parallel-scan";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const AWS_CONFIG = { region: "eu-west-1" };

export function print(output: string) {
  process.stdout.clearLine(0);
  process.stdout.write(`${output}\r`);
}

export function printEndLine() {
  process.stdout.write("\n");
}

export function isValid<T>(input: T | undefined): input is T {
  return !!input;
}

export function getDbClient() {
  return new DynamoDBClient(AWS_CONFIG);
}

export function getS3Client() {
  return new S3Client(AWS_CONFIG);
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

export async function getBuckets(): Promise<string[]> {
  const client = getS3Client();
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result.Buckets?.map(({ Name }) => Name).filter(isValid) ?? [];
}

export async function getBucket(): Promise<string> {
  const regex = new RegExp(`-${process.env.API_ENV}$`);
  const allBuckets = await getBuckets();
  const bucket = allBuckets.find((name) => regex.test(name));

  if (!bucket) {
    throw new Error(`Unable to find bucket matching pattern '${regex.source}'`);
  }

  return bucket;
}

export async function createPresignedUrl(
  key: string,
): Promise<string | undefined> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: await getBucket(),
    Key: `public/${key}`,
  });
  return getSignedUrl(client, command, { expiresIn: 300 });
}
