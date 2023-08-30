import fs from "fs-extra";
import path from "path";
import { createPresignedUrl, queryDb } from "../aws";
import { createAdvertsRepository } from "./adverts-repository";
import { processDirectory, processJsonFile } from "../utils";
import type {
  RawAdvert,
  ItemImages,
  Image,
  BackupAdvert,
  AdvertMutationResult,
  AdvertInput,
} from "./types";

interface CreateAdvertFactory {
  (input: AdvertInput): Promise<AdvertMutationResult>;
}

async function createImageUrlMapper(item: ItemImages): Promise<Image> {
  return {
    url: (await createPresignedUrl(item?.src ?? "")) ?? "",
  };
}

async function createBackupAdvertMapper(raw: RawAdvert): Promise<BackupAdvert> {
  const images = await Promise.all(raw.images?.map(createImageUrlMapper) ?? []);
  return {
    ...raw,
    images,
  };
}

export async function getAdvertsFromAws(): Promise<BackupAdvert[]> {
  const rawAdverts = (await queryDb<RawAdvert[]>()).filter(
    ({ version }) => version === 0,
  );
  return Promise.all(rawAdverts.map(createBackupAdvertMapper));
}

export async function backupAdvert(advert: BackupAdvert): Promise<void> {
  const user = advert?.giver ?? "nobody";
  const advertId = advert.id;

  const fileName = `${advertId}.json`;
  const filePath = path.join(`./backups/${user}`, fileName);

  await fs.mkdirp(`./backups/${user}`);

  await fs.writeFile(filePath, JSON.stringify(advert, null, 2));
  console.log("Wrote advert to file:", filePath);
}

export function createAdvertsFromBackup(
  backupAdverts: BackupAdvert[],
): AdvertInput[] {
  return backupAdverts.map((adv: BackupAdvert) => ({
    title: adv.title,
    description: adv?.description ?? "",
    quantity: adv?.quantity ?? 0,
    images: adv?.images ?? [],
    unit: adv?.quantityUnit ?? "unknown",
    material: JSON.stringify(adv?.material) ?? "unknown",
    condition: JSON.stringify(adv?.condition) ?? "unknown",
    usage: JSON.stringify(adv?.areaOfUse) ?? "unknown",
    location: {
      adress: adv?.address ?? "unknown",
      zipCode: adv?.postalCode ?? "unknown",
      city: adv?.city ?? "unknown",
      country: "",
    },
    contact: {
      phone: "",
      email: "",
    },
  }));
}

export function readBackupAdverts(): BackupAdvert[] {
  return processDirectory(
    "./backups",
    processJsonFile,
  ) as unknown as BackupAdvert[];
}

export function createAdvertFactory(): CreateAdvertFactory {
  return createAdvertsRepository("").createAdvert;
}
