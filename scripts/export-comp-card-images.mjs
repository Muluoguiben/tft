import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = join(repoRoot, ".tmp/comp-card-svgs");
const fullDir = join(repoRoot, "assets/comps/full");
const previewDir = join(repoRoot, "assets/comps/preview");
const tmpDir = join(repoRoot, ".tmp/comp-card-export");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const fullSize = "3000:-2";
const previewSize = "1500:-2";

mkdirSync(fullDir, { recursive: true });
mkdirSync(previewDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForScreenshot(file, timeoutMs = 60000) {
  const started = Date.now();
  let lastSize = -1;
  let stableCount = 0;

  while (Date.now() - started < timeoutMs) {
    if (existsSync(file)) {
      const size = statSync(file).size;
      if (size > 0 && size === lastSize) stableCount += 1;
      if (stableCount >= 2) return;
      lastSize = size;
    }
    await sleep(300);
  }

  throw new Error(`Chrome screenshot timed out: ${file}`);
}

async function chromeScreenshot(svgPath, pngPath, name) {
  await rm(pngPath, { force: true });
  const profileDir = join(tmpDir, `chrome-profile-${name}`);
  const htmlPath = join(tmpDir, `${name}.html`);
  await rm(profileDir, { recursive: true, force: true });
  await writeFile(htmlPath, `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: #101418;
      }
      img {
        display: block;
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <img src="${pathToFileURL(svgPath).href}" alt="">
  </body>
</html>`);
  const proc = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-sync",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=1000",
    `--user-data-dir=${profileDir}`,
    `--screenshot=${pngPath}`,
    "--window-size=3200,2160",
    pathToFileURL(htmlPath).href,
  ], { stdio: "ignore" });

  try {
    await waitForScreenshot(pngPath);
  } finally {
    proc.kill("SIGTERM");
    await sleep(300);
    if (!proc.killed) proc.kill("SIGKILL");
  }
}

function runFfmpeg(args) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${args.join(" ")}`);
  }
}

async function exportOne(svgFile) {
  const name = parse(svgFile).name;
  const svgPath = join(svgDir, svgFile);
  const tmpPng = join(tmpDir, `${name}.png`);
  const fullJpg = join(fullDir, `${name}.jpg`);
  const previewJpg = join(previewDir, `${name}.jpg`);
  const fullAvif = join(fullDir, `${name}.avif`);
  const previewAvif = join(previewDir, `${name}.avif`);

  await chromeScreenshot(svgPath, tmpPng, name);
  runFfmpeg(["-i", tmpPng, "-vf", `scale=${fullSize}`, "-q:v", "3", fullJpg]);
  runFfmpeg(["-i", tmpPng, "-vf", `scale=${previewSize}`, "-q:v", "4", previewJpg]);
  runFfmpeg(["-i", fullJpg, "-frames:v", "1", "-c:v", "libsvtav1", "-preset", "8", "-crf", "30", "-pix_fmt", "yuv420p", fullAvif]);
  runFfmpeg(["-i", previewJpg, "-frames:v", "1", "-c:v", "libsvtav1", "-preset", "8", "-crf", "32", "-pix_fmt", "yuv420p", previewAvif]);

  return { fullAvif, previewAvif };
}

const svgFiles = readdirSync(svgDir)
  .filter((file) => file.endsWith("-17.2-early.svg"))
  .sort();

const outputs = [];
for (const svgFile of svgFiles) {
  outputs.push(await exportOne(svgFile));
}

console.log(JSON.stringify({ count: outputs.length, outputs }, null, 2));
