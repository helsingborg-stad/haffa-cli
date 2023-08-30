import type { CommandModule } from "yargs";
import type { AdvertMutationResult } from "./helpers/advert/types";
import { createAdvertFactory, createAdvertsFromBackup } from "./helpers/advert";

const commandSpec: CommandModule = {
  command: "create-advert",
  describe: "Creates adverts from backup",
  async handler({}) {
    const adverts = createAdvertsFromBackup();

    const createAdvert = createAdvertFactory();
    const result = await Promise.all<AdvertMutationResult>(
      adverts.map(createAdvert),
    );
    console.log("Import result: ", result);
  },
};

export default commandSpec;
