import chalk from "chalk";
import type { CommandModule } from "yargs";

const commandSpec: CommandModule = {
  command: "hello",
  describe: "Prints Hello",
  async handler({}) {
    console.log(chalk.green("Hello!"));
  },
};

export default commandSpec;
