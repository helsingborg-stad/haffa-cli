import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands";
import * as dotenv from "dotenv";

dotenv.config();

const y = yargs(hideBin(process.argv));
commands.forEach((cmd) => y.command(cmd));
y.demandCommand().help().argv;
