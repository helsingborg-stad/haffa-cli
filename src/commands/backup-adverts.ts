import type { CommandModule } from "yargs";
import { backupAdvert, getAdverts } from "./helpers/adverts";

const commandSpec: CommandModule = {
  command: "backup-adverts",
  describe: "Backups adverts to files",
  async handler({}) {
    const adverts = await getAdverts();
    adverts.forEach(backupAdvert);
  },
};

export default commandSpec;
