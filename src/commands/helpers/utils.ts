import fs from "fs";
import path from "path";

export function print(output: string) {
  process.stdout.clearLine(0);
  process.stdout.write(`${output}\r`);
}

export function printEndLine() {
  process.stdout.write("\n");
}

export function isValid<T>(input: T | undefined): input is T {
  return !!input;
}

export function processJsonFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export function processDirectory(
  directoryPath: string,
  callback: (filePath: string) => any,
  processedFiles: Record<string, unknown>[] = [],
) {
  const files = fs.readdirSync(directoryPath, "utf-8");
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    stat.isDirectory()
      ? processDirectory(filePath, callback, processedFiles)
      : processedFiles.push(callback(filePath));
  });
  return processedFiles;
}
