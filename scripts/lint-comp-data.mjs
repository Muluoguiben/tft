/**
 * 阵容数据 lint：校验 src/data/comps/*.js 与 src/data/{champions,assets}.js 的引用一致性。
 *
 * 退出码：
 *   0  全部通过
 *   1  有错误，stderr 打印问题列表
 *
 * 用法：
 *   node scripts/lint-comp-data.mjs
 *
 * 校验内容：
 *   1. 11 个 comps[] 条目，每个都对应一个 src/data/comps/<id>.js（除非 hasFullDetail !== true）
 *   2. detail 文件结构齐全（traits / boardUnits / builds / starGods / conditions / risks 都是数组）
 *   3. boardUnits.id 在 champions 表里
 *   4. boardUnits.items[] 每个 id 在 assets.items 里（"guardbreaker" 是已知占位例外）
 *   5. boardUnits.row ∈ [1,4]，col ∈ [1,7]
 *   6. boardUnits.cost 与 champions[id].cost 一致
 *   7. traits[*].id 在 assets.traits 里
 *   8. starGods[*][0] 在 assets.starGods 里
 *   9. builds[*].items[*][0] 在 assets.items 里
 */
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPS_DIR = join(ROOT, "src/data/comps");

const { assets } = await import(join(ROOT, "src/data/assets.js"));
const { champions } = await import(join(ROOT, "src/data/champions.js"));
const { comps } = await import(join(ROOT, "src/data/comps-index.js"));

const errors = [];
const warnings = [];

function err(scope, msg) {
  errors.push(`✗ [${scope}] ${msg}`);
}
function warn(scope, msg) {
  warnings.push(`! [${scope}] ${msg}`);
}

const KNOWN_PLACEHOLDER_ITEMS = new Set(["guardbreaker"]);

// === Step 1: 找到所有 hasFullDetail 阵容，确认对应文件存在 ===
const expectedDetailIds = comps.filter((c) => c.hasFullDetail).map((c) => c.id);
const detailFiles = readdirSync(COMPS_DIR).filter((n) => n.endsWith(".js"));
const detailIdsOnDisk = new Set(detailFiles.map((n) => n.replace(/\.js$/, "")));

for (const id of expectedDetailIds) {
  if (!detailIdsOnDisk.has(id)) {
    err("missing-detail", `comps[].id=${id} 标记 hasFullDetail=true 但 src/data/comps/${id}.js 不存在`);
  }
}
for (const id of detailIdsOnDisk) {
  if (!expectedDetailIds.includes(id)) {
    warn("orphan-detail", `src/data/comps/${id}.js 存在但 comps-index.js 没有对应条目`);
  }
}

// === Step 2: 逐个 detail 文件校验 ===
const REQUIRED_ARRAYS = ["traits", "boardUnits", "builds", "starGods", "conditions", "risks"];

for (const id of expectedDetailIds) {
  if (!detailIdsOnDisk.has(id)) continue;
  const detail = (await import(join(COMPS_DIR, `${id}.js`))).default;

  // 必备字段
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(detail[key])) {
      err(id, `字段 ${key} 应该是数组，实际是 ${typeof detail[key]}`);
    }
  }

  // traits 校验
  for (const t of detail.traits ?? []) {
    if (!t.id || !(t.id in assets.traits)) {
      err(id, `traits[].id="${t.id}" 不在 assets.traits 里`);
    }
    if (typeof t.count !== "number" || t.count < 1) {
      err(id, `traits[id=${t.id}].count 缺失或非法`);
    }
  }

  // boardUnits 校验
  for (const u of detail.boardUnits ?? []) {
    if (!u.id || !(u.id in champions)) {
      err(id, `boardUnits[].id="${u.id}" 不在 champions 表里`);
    } else {
      // 比对 cost
      const expected = champions[u.id].cost;
      if (u.cost !== expected) {
        warn(id, `boardUnits[id=${u.id}].cost=${u.cost}，但 champions 表是 ${expected}`);
      }
    }
    if (!Number.isInteger(u.row) || u.row < 1 || u.row > 4) {
      err(id, `boardUnits[id=${u.id}].row=${u.row} 应在 [1,4]`);
    }
    if (!Number.isInteger(u.col) || u.col < 1 || u.col > 7) {
      err(id, `boardUnits[id=${u.id}].col=${u.col} 应在 [1,7]`);
    }
    if (typeof u.star !== "string" || u.star.length === 0) {
      err(id, `boardUnits[id=${u.id}].star 缺失或非字符串`);
    }
    for (const itemId of u.items ?? []) {
      if (!(itemId in assets.items) && !KNOWN_PLACEHOLDER_ITEMS.has(itemId)) {
        err(id, `boardUnits[id=${u.id}].items 引用未知 item "${itemId}"`);
      }
    }
  }

  // 棋盘格子重复校验
  const seen = new Set();
  for (const u of detail.boardUnits ?? []) {
    const key = `${u.row},${u.col}`;
    if (seen.has(key)) {
      err(id, `boardUnits 出现重复格子 (row=${u.row}, col=${u.col})，单元 ${u.id}`);
    }
    seen.add(key);
  }

  // builds 校验
  for (const b of detail.builds ?? []) {
    if (typeof b.title !== "string" || b.title.length === 0) {
      err(id, `builds[].title 缺失或非字符串`);
    }
    for (const pair of b.items ?? []) {
      if (!Array.isArray(pair) || pair.length !== 2) {
        err(id, `builds[title="${b.title}"].items 应是 [id, label] 二元组数组`);
        continue;
      }
      const [itemId] = pair;
      if (!(itemId in assets.items) && !KNOWN_PLACEHOLDER_ITEMS.has(itemId)) {
        err(id, `builds[title="${b.title}"] 引用未知 item "${itemId}"`);
      }
    }
  }

  // starGods 校验（允许空数组，部分 .md 没有星神段）
  for (const g of detail.starGods ?? []) {
    if (!Array.isArray(g) || g.length < 2) {
      err(id, `starGods[] 应是 [id, name, note?] 三元组`);
      continue;
    }
    const [godId] = g;
    if (!(godId in assets.starGods)) {
      err(id, `starGods 引用未知 starGod "${godId}"`);
    }
  }

  // conditions / risks 仅检查类型
  for (const c of detail.conditions ?? []) {
    if (typeof c !== "string") err(id, `conditions[] 应该是字符串数组`);
  }
  for (const r of detail.risks ?? []) {
    if (typeof r !== "string") err(id, `risks[] 应该是字符串数组`);
  }
}

// === 输出 ===
const fmt = (xs) => xs.map((x) => `  ${x}`).join("\n");
console.log(`\n阵容数据 lint：${expectedDetailIds.length} 个 hasFullDetail 阵容`);
console.log(`  src/data/comps/: ${detailIdsOnDisk.size} 个 .js`);
console.log(`  错误: ${errors.length}`);
console.log(`  警告: ${warnings.length}`);

if (warnings.length > 0) {
  console.log("\n警告:");
  console.log(fmt(warnings));
}

if (errors.length > 0) {
  console.error("\n错误:");
  console.error(fmt(errors));
  process.exit(1);
}

console.log("\n✓ 全部通过");
