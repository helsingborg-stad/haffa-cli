import type { CommandModule } from "yargs";
import { backupAdvert, getAdvertsFromAws } from "./helpers/advert";

const commandSpec: CommandModule = {
  command: "backup-adverts-from-aws",
  describe: "Backups adverts from AWS DynamoDB to JSON files",
  async handler({}) {
    const adverts = await getAdvertsFromAws();
    await Promise.all(adverts.map(backupAdvert));
  },
};

export default commandSpec;
