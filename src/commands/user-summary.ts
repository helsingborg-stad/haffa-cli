import chalk from "chalk";
import type { CommandModule } from "yargs";

const commandSpec: CommandModule = {
  command: "user-summary",
  describe: "Prints user summary",
  async handler({}) {
    console.log(chalk.red("Not implemented yet..."));
  },
};

export default commandSpec;
