import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  { dir: "assets/comps/preview", crf: 32 },
  { dir: "assets/comps/full", crf: 30 },
];

for (const target of targets) {
  const dir = join(repoRoot, target.dir);
  const files = readdirSync(dir).filter((file) => /\.jpe?g$/i.test(file));

  for (const file of files) {
    const input = join(dir, file);
    const output = input.replace(/\.jpe?g$/i, ".avif");
    const result = spawnSync("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      input,
      "-frames:v",
      "1",
      "-c:v",
      "libsvtav1",
      "-preset",
      "8",
      "-crf",
      String(target.crf),
      "-pix_fmt",
      "yuv420p",
      output,
    ], { stdio: "inherit" });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}
