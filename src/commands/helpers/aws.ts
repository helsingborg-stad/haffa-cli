import { fileTypeFromBuffer } from "file-type";
import { writeFileSync } from "fs";
import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandOutput,
} from "@aws-sdk/client-dynamodb";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminListGroupsForUserCommand,
  ListUserPoolsCommand,
  UserPoolDescriptionType,
  UserType,
  AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import { parallelScan } from "@shelf/dynamodb-parallel-scan";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { isValid } from "./utils";

const AWS_CONFIG = { region: process.env.AWS_REGION };

export function getDbClient() {
  return new DynamoDBClient(AWS_CONFIG);
}

export function getS3Client() {
  return new S3Client(AWS_CONFIG);
}

export function getCognitoClient() {
  return new CognitoIdentityProviderClient(AWS_CONFIG);
}

export async function listTables(): Promise<string[]> {
  const client = getDbClient();
  const command = new ListTablesCommand({});
  const response: ListTablesCommandOutput = await client.send(command);
  return response.TableNames ?? [];
}

export async function getTableNameFromEnv(): Promise<string | undefined> {
  const tables = await listTables();
  return tables.find((t) => t.includes(process.env.AWS_ENV as string));
}

export async function queryDb<T>(): Promise<T> {
  return (parallelScan(
    { TableName: await getTableNameFromEnv() },
    { concurrency: 500 },
  ) ?? []) as T;
}

export async function listCognitoPools(): Promise<UserPoolDescriptionType[]> {
  const client = getCognitoClient();
  const command = new ListUserPoolsCommand({
    MaxResults: 60,
  });
  const response = await client.send(command);
  return response.UserPools ?? [];
}

export async function getUserPoolFromEnv(): Promise<string | undefined> {
  const pools = await listCognitoPools();
  return pools.find(({ Name }) => Name?.endsWith(`-${process.env.AWS_ENV}`))
    ?.Id;
}

export async function listUsers(): Promise<UserType[]> {
  const client = getCognitoClient();
  const command = new ListUsersCommand({
    UserPoolId: await getUserPoolFromEnv(),
  });
  const response = await client.send(command);
  return response.Users ?? [];
}

export async function getUser(
  userName: string,
): Promise<AdminGetUserCommandOutput> {
  const client = getCognitoClient();
  const command = new AdminGetUserCommand({
    UserPoolId: await getUserPoolFromEnv(),
    Username: userName,
  });
  return client.send(command);
}

export async function listGroupsForUser(userName: string): Promise<string[]> {
  const client = getCognitoClient();
  const command = new AdminListGroupsForUserCommand({
    UserPoolId: await getUserPoolFromEnv(),
    Username: userName,
  });
  const response = await client.send(command);
  return response.Groups?.map(({ GroupName }) => GroupName ?? "") ?? [];
}

export async function getBuckets(): Promise<string[]> {
  const client = getS3Client();
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result.Buckets?.map(({ Name }) => Name).filter(isValid) ?? [];
}

export async function getBucket(): Promise<string> {
  const regex = new RegExp(`-${process.env.AWS_ENV}$`);
  const allBuckets = await getBuckets();
  const bucket = allBuckets.find((name) => regex.test(name));

  if (!bucket) {
    throw new Error(`Unable to find bucket matching pattern '${regex.source}'`);
  }

  return bucket;
}

async function createGetObjectCommand(key: string): Promise<GetObjectCommand> {
  return new GetObjectCommand({
    Bucket: await getBucket(),
    Key: `public/${key}`,
  });
}

export async function getObjectAsBase64DataUrl(key: string): Promise<string> {
  const client = getS3Client();
  const response = await client.send(await createGetObjectCommand(key));

  const data = (await response.Body?.transformToByteArray()) ?? Buffer.alloc(0);

  const mime = await getFileMime(data);
  const base64 = Buffer.from(data).toString("base64");

  return `data:${mime};base64,${base64}`;
}

async function getFileExtension(data: ArrayBuffer): Promise<string> {
  const { ext } = (await fileTypeFromBuffer(data)) ?? {};
  return ext ?? "";
}

async function getFileMime(data: ArrayBuffer): Promise<string> {
  const { mime } = (await fileTypeFromBuffer(data)) ?? {};
  return mime ?? "";
}

export async function saveObject(key: string): Promise<void> {
  const client = getS3Client();
  const response = await client.send(await createGetObjectCommand(key));

  const data = (await response.Body?.transformToByteArray()) ?? Buffer.alloc(0);
  const ext = await getFileExtension(data);
  writeFileSync(`./downloads/public/${key}.${ext}`, data);
}

export async function createPresignedUrl(
  key: string,
): Promise<string | undefined> {
  const client = getS3Client();
  const command = await createGetObjectCommand(key);

  return getSignedUrl(client, command, {
    expiresIn: Number(process.env.AWS_PRESIGNED_URL_EXPIRE_TIME),
  });
}

export function createAttributes(
  attributes: AttributeType[] = [],
): Record<string, string> {
  return attributes.reduce((prev, attr) => {
    const key = attr.Name!;
    return {
      ...prev,
      [key]: attr?.Value ?? "",
    };
  }, {});
}
