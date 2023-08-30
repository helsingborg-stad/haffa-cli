import type { CommandModule } from "yargs";
import type {
  AdvertInput,
  AdvertMutationResult,
  BackupAdvert,
} from "./helpers/advert/types";
import {
  createAdvertFactory,
  createAdvertsFromBackup,
  readBackupAdverts,
} from "./helpers/advert";

function createAdvertMapper(adv: BackupAdvert): AdvertInput {
  return {
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
  };
}

const commandSpec: CommandModule = {
  command: "create-advert",
  describe: "Creates adverts from backup",
  async handler({}) {
    const backupAdverts = readBackupAdverts();
    const adverts = createAdvertsFromBackup(backupAdverts, createAdvertMapper);

    const createAdvert = createAdvertFactory();
    const result = await Promise.all<AdvertMutationResult>(
      adverts.map(createAdvert),
    );
    console.log("Import result: ", result);
  },
};

export default commandSpec;
