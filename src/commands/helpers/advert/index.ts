import fs from "fs-extra";
import path from "path";
import { createPresignedUrl, queryDb } from "../aws";
import { RawAdvert, Advert, ItemImages, Image } from "./types";

// const DEFAULT_PROJECTION = "";
// const DEFAULT_EXPRESSION_ATTRIBUTE_NAMES = {};

async function createImageUrlMapper(item: ItemImages): Promise<Image> {
  return {
    url: (await createPresignedUrl(item?.src ?? "")) ?? "",
  };
}

async function createAdvertMapper(raw: RawAdvert): Promise<Advert> {
  const images = await Promise.all(raw.images?.map(createImageUrlMapper) ?? []);
  return {
    ...raw,
    createdByUser: raw.giver ?? "nobody",
    images,
  };
}

export async function getAdvertsFromAws(): Promise<Advert[]> {
  const rawAdverts = (await queryDb<RawAdvert[]>()).filter(
    ({ version }) => version === 0,
  );
  return Promise.all(rawAdverts.map(createAdvertMapper));
}

export async function backupAdvert(advert: Advert): Promise<void> {
  const user = advert.createdByUser;
  const advertId = advert.id;

  const fileName = `${advertId}.json`;
  const filePath = path.join(`./backups/${user}`, fileName);

  await fs.mkdirp(`./backups/${user}`);

  await fs.writeFile(filePath, JSON.stringify(advert, null, 2));
  console.log("Wrote advert to file:", filePath);
}
