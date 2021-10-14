import glob from "fast-glob";
import fs from "fs";

type Invalid = [Error, undefined];
type Files = [undefined, string[]];

type Response = Invalid | Files;

export async function getFilesFromInput(
  inputs: string[] = ["."]
): Promise<Response> {
  const paths: string[] = typeof inputs === "string" ? [inputs] : inputs;

  if (paths.length === 0) {
    return [
      new Error(
        "No path(s) provided. Run `tod --help` to see usage information."
      ),
      undefined,
    ];
  }

  const uniqueFiles = new Set<string>();

  for (const path of paths) {
    if (glob.isDynamicPattern(path)) {
      const files = await glob(path, { dot: true });

      for (const file of files) {
        uniqueFiles.add(file);
      }

      continue;
    }

    if (!fs.existsSync(path)) {
      return [new Error(`Path "${path}" does not exist.`), undefined];
    }

    if (fs.lstatSync(path).isDirectory()) {
      const files = await glob(`${path}/**/*`, { dot: true });

      for (const file of files) {
        uniqueFiles.add(file);
      }

      continue;
    }

    if (fs.lstatSync(path).isFile()) {
      uniqueFiles.add(path);

      continue;
    }

    if (path === ".") {
      const files = await glob("**/*", { dot: true });

      for (const file of files) {
        uniqueFiles.add(file);
      }

      continue;
    }

    throw new Error(`Invalid path: ${path}`);
  }

  return [undefined, Array.from(uniqueFiles)];
}
