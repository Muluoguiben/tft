import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyFile(source, target) {
  ensureDir(dirname(target));
  cpSync(source, target);
}

function copyMatching(sourceDir, targetDir, matcher) {
  if (!existsSync(sourceDir)) return;
  ensureDir(targetDir);
  for (const name of readdirSync(sourceDir)) {
    const source = join(sourceDir, name);
    if (!statSync(source).isFile() || !matcher(name)) continue;
    copyFile(source, join(targetDir, name));
  }
}

function copyDir(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return;
  ensureDir(dirname(targetDir));
  cpSync(sourceDir, targetDir, { recursive: true });
}

copyMatching(join(root, "assets/comps/full"), join(dist, "assets/comps/full"), (name) => name.endsWith(".avif"));
copyMatching(join(root, "assets/comps/preview"), join(dist, "assets/comps/preview"), (name) => name.endsWith(".avif") || name.endsWith(".jpg"));

for (const dir of ["champions", "items", "traits", "star-gods"]) {
  copyMatching(
    join(root, `assets/s17/${dir}/preview`),
    join(dist, `assets/s17/${dir}/preview`),
    (name) => name.endsWith(".avif"),
  );
}

copyDir(join(root, "docs"), join(dist, "docs"));
copyFile(join(root, "_config.yml"), join(dist, basename("_config.yml")));
