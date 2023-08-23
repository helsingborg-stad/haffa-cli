import fs from "fs-extra";
import path from "path";
import { UserType } from "@aws-sdk/client-cognito-identity-provider";
import { createAttributes, listGroupsForUser, listUsers } from "../utils";
import { User } from "./types";

const BACKUP_USERS_PATH = "./backups/users";

async function createUserMapper(u: UserType): Promise<User> {
  const attributes = createAttributes(u.Attributes);
  return {
    id: attributes.sub,
    userName: u.Username,
    email: attributes.email?.toLowerCase(),
    name: attributes.name,
    address: attributes.address,
    department: attributes["custom:department"],
    postalCode: attributes["custom:postalcode"],
    company: attributes["custom:company"],
    isNew: attributes["custom:newUser"] === "true",
    createDate: u.UserCreateDate,
    modifiedDate: u.UserLastModifiedDate,
    status: u.UserStatus,
    groups: await listGroupsForUser(u.Username!),
  };
}

export async function getUsersFromAws(): Promise<User[]> {
  const rawUsers = await listUsers();
  return Promise.all(rawUsers.map(createUserMapper));
}

export async function backupUser(user: User): Promise<void> {
  await fs.mkdirp(BACKUP_USERS_PATH);

  const fileName = `${user.id}.json`;
  const filePath = path.join(BACKUP_USERS_PATH, fileName);

  await fs.writeFile(filePath, JSON.stringify(user, null, 2));
  console.log("Wrote user to file:", filePath);
}
