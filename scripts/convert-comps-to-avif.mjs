import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  { inputDir: "assets/comps/preview", outputDir: "assets/comps/preview", pattern: /\.jpe?g$/i, crf: 32 },
  { inputDir: "assets/comps/full", outputDir: "assets/comps/full", pattern: /\.jpe?g$/i, crf: 30 },
  { inputDir: "assets/s17/champions/preview", outputDir: "assets/s17/champions/preview", pattern: /\.jpe?g$/i, crf: 30 },
  { inputDir: "assets/s17/items/preview", outputDir: "assets/s17/items/preview", pattern: /\.jpe?g$/i, crf: 30 },
  { inputDir: "assets/s17/star-gods/preview", outputDir: "assets/s17/star-gods/preview", pattern: /\.jpe?g$/i, crf: 30 },
  { inputDir: "assets/s17/traits", outputDir: "assets/s17/traits/preview", pattern: /\.png$/i, crf: 28 },
];

for (const target of targets) {
  const inputDir = join(repoRoot, target.inputDir);
  const outputDir = join(repoRoot, target.outputDir);
  mkdirSync(outputDir, { recursive: true });
  const files = readdirSync(inputDir)
    .filter((file) => target.pattern.test(file))
    .filter((file) => !file.startsWith("source-image-"));

  for (const file of files) {
    const input = join(inputDir, file);
    const output = join(outputDir, `${parse(file).name}.avif`);
    if (existsSync(output) && statSync(output).size > 0) continue;

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
