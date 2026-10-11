import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const sourceFiles = [
  "dashboard-kit.ts",
  "dashboard-template.ts",
  "shell-contract.ts",
  "domain-packs.ts",
];

for (const file of sourceFiles) {
  const destination = resolve(packageRoot, "src/lib", file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(repositoryRoot, "src/lib", file), destination);
}

const serverPackage = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
const kitPackage = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
const versionsSource = [
  `export const SERVER_VERSION = ${JSON.stringify(serverPackage.version)};`,
  `export const DASHBOARD_KIT_VERSION = ${JSON.stringify(kitPackage.version)};`,
  "",
].join("\n");
await writeFile(resolve(packageRoot, "src/lib/versions.ts"), versionsSource, "utf8");

process.stdout.write(`Synced ${sourceFiles.length} DashLint kit source files and package versions.\n`);
