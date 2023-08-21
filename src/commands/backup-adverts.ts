import chalk from "chalk";
import type { CommandModule } from "yargs";

const commandSpec: CommandModule = {
  command: "backup-adverts",
  describe: "Backups adverts to local file system",
  async handler({}) {
    console.log(chalk.red("Not implemented yet..."));
  },
};

export default commandSpec;
