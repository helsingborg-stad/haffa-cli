import type { CommandModule } from "yargs";
import { backupAdvert, getAdverts } from "./helpers/advert";

const commandSpec: CommandModule = {
  command: "backup-adverts",
  describe: "Backups adverts to files",
  async handler({}) {
    const adverts = await getAdverts();
    Promise.all(adverts.map(backupAdvert));
  },
};

export default commandSpec;
