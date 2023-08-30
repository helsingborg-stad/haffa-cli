import type { CommandModule } from "yargs";
import type { AdvertMutationResult } from "./helpers/advert/types";
import {
  createAdvertFactory,
  createAdvertsFromBackup,
  readBackupAdverts,
} from "./helpers/advert";

const commandSpec: CommandModule = {
  command: "create-advert",
  describe: "Creates adverts from backup",
  async handler({}) {
    const backupAdverts = readBackupAdverts();
    const adverts = createAdvertsFromBackup(backupAdverts);

    const createAdvert = createAdvertFactory();
    const result = await Promise.all<AdvertMutationResult>(
      adverts.map(createAdvert),
    );
    console.log("Import result: ", result);
  },
};

export default commandSpec;
