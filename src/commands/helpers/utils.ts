export function print(output: string) {
  process.stdout.clearLine(0);
  process.stdout.write(`${output}\r`);
}

export function printEndLine() {
  process.stdout.write("\n");
}
