import type { CommandModule } from "yargs";
import { backupUser, getUsersFromAws } from "./helpers/user";

const commandSpec: CommandModule = {
  command: "backup-users-from-aws",
  describe: "Backups users from AWS DynamoDB to JSON files",
  async handler({}) {
    const users = await getUsersFromAws();
    await Promise.all(users.map(backupUser));
  },
};

export default commandSpec;
