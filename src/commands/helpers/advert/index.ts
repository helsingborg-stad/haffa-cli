import { parallelScan } from "@shelf/dynamodb-parallel-scan";
import fs from "fs-extra";
import path from "path";
import { getTableNameFromEnv } from "../utils";
import { RawAdvert, Advert, ItemImages, Image } from "./types";

// const DEFAULT_PROJECTION = "";
// const DEFAULT_EXPRESSION_ATTRIBUTE_NAMES = {};

function createImageUrlMapper(item: ItemImages): Image {
  return {
    src: `https://some.url/${item.src}`,
  };
}

function createAdvertMapper(raw: RawAdvert): Advert {
  return {
    id: raw.id,
    title: raw.title,
    createdByUser: raw.giver ?? "nobody",
    createdAt: raw.createdAt,
    images: raw.images?.map(createImageUrlMapper) ?? [],
  };
}

export async function getAdverts(): Promise<Advert[]> {
  const result = (await parallelScan(
    {
      TableName: await getTableNameFromEnv(),
      FilterExpression: "version = :version",
      ExpressionAttributeValues: { ":version": 0 },
    },
    { concurrency: 500 },
  )) as RawAdvert[];

  return (result ?? []).map(createAdvertMapper);
}

export async function backupAdvert(advert: Advert): Promise<void> {
  const user = advert.createdByUser;
  const advertId = advert.id;

  const fileName = `${advertId}.json`;
  const filePath = path.join(`./backups/${user}`, fileName);

  await fs.mkdirp(`./backups/${user}`);

  await fs.writeFile(filePath, JSON.stringify(advert, null, 2));
  console.log("wrote case to file:", filePath);
}
