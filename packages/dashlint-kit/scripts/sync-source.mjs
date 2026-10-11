import { copyFile, mkdir } from "node:fs/promises";
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

process.stdout.write(`Synced ${sourceFiles.length} DashLint kit source files.\n`);
