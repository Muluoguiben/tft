import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = process.cwd();
const OUT_SVG = path.join(ROOT, 'assets/comps/木灵小法师-17.1b.svg');
const OUT_PNG = path.join(ROOT, 'assets/comps/木灵小法师-17.1b.png');

const A = {
  champions: {
    poppy: 'assets/s17/champions/波比__TFT17_Poppy.png',
    veigar: 'assets/s17/champions/维迦__TFT17_Veigar.png',
    fizz: 'assets/s17/champions/菲兹__TFT17_Fizz.png',
    corki: 'assets/s17/champions/库奇__TFT17_Corki.png',
    rammus: 'assets/s17/champions/拉莫斯__TFT17_Rammus.png',
    bard: 'assets/s17/champions/巴德__TFT17_Bard.png',
    karma: 'assets/s17/champions/卡尔玛__TFT17_Karma.png',
    ivern: 'assets/s17/champions/小木灵__TFT17_IvernMinion.png',
    lissandra: 'assets/s17/champions/丽桑卓__TFT17_Lissandra.png',
  },
  traits: {
    meeple: 'assets/s17/traits/木灵族__TFT17_Astronaut.png',
    magician: 'assets/s17/traits/魔术师__TFT17_APTrait.png',
    darkStar: 'assets/s17/traits/暗星__TFT17_DarkStar.png',
    traveler: 'assets/s17/traits/旅人__TFT17_FlexTrait.png',
    bastion: 'assets/s17/traits/堡垒卫士__TFT17_ResistTank.png',
  },
  items: {
    nashor: 'assets/s17/items/纳什之牙__TFT_Item_Leviathan.png',
    jeweled: 'assets/s17/items/珠光护手__TFT_Item_JeweledGauntlet.png',
    shojin: 'assets/s17/items/朔极之矛__TFT_Item_SpearOfShojin.png',
    lastWhisper: 'assets/s17/items/最后的轻语__TFT_Item_LastWhisper.png',
    deathblade: 'assets/s17/items/死亡之刃__TFT_Item_Deathblade.png',
    sunfire: 'assets/s17/items/日炎斗篷__TFT_Item_RedBuff.png',
    bramble: 'assets/s17/items/棘刺背心__TFT_Item_BrambleVest.png',
    ionic: 'assets/s17/items/离子火花__TFT_Item_IonicSpark.png',
  },
};

const COST_COLORS = {
  1: '#7bbf77',
  2: '#5eb5ff',
  3: '#c47dff',
  4: '#f3c66a',
  5: '#f39d52',
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function dataUri(relPath) {
  const ext = path.extname(relPath).slice(1).toLowerCase() || 'png';
  const bytes = await readFile(path.join(ROOT, relPath));
  return `data:image/${ext};base64,${bytes.toString('base64')}`;
}

async function loadAssets() {
  const result = {};
  for (const [group, entries] of Object.entries(A)) {
    result[group] = {};
    for (const [key, relPath] of Object.entries(entries)) {
      result[group][key] = await dataUri(relPath);
    }
  }
  return result;
}

function image(href, x, y, w, h, extra = '') {
  return `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" ${extra}/>`;
}

function itemIcon(assets, key, x, y, size = 28) {
  if (key === 'guardbreaker') {
    return `
      <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="7" class="placeholderItem"/>
      <text x="${x + size / 2}" y="${y + size / 2 + 5}" text-anchor="middle" class="tiny">破</text>
    `;
  }
  return `
    <rect x="${x - 1}" y="${y - 1}" width="${size + 2}" height="${size + 2}" rx="7" class="itemFrame"/>
    ${image(assets.items[key], x, y, size, size)}
  `;
}

function champCard(assets, champ) {
  const itemStart = champ.x + 8;
  const itemY = champ.y + 86;
  const items = (champ.items || []).map((key, i) => itemIcon(assets, key, itemStart + i * 31, itemY, 28)).join('');
  const border = COST_COLORS[champ.cost] || '#8d98a0';
  const star = champ.star ? `<text x="${champ.x + 45}" y="${champ.y + 78}" text-anchor="middle" class="stars">${champ.star}</text>` : '';
  return `
    <g>
      <rect x="${champ.x}" y="${champ.y}" width="90" height="122" rx="13" fill="#0f1519" stroke="${border}" stroke-width="3"/>
      <clipPath id="clip-${champ.id}"><rect x="${champ.x + 8}" y="${champ.y + 8}" width="74" height="62" rx="10"/></clipPath>
      ${image(assets.champions[champ.id], champ.x + 8, champ.y + 8, 74, 62, `clip-path="url(#clip-${champ.id})"`)}
      <rect x="${champ.x + 8}" y="${champ.y + 52}" width="74" height="24" rx="8" fill="rgba(0,0,0,.62)"/>
      <text x="${champ.x + 45}" y="${champ.y + 69}" text-anchor="middle" class="champName">${esc(champ.name)}</text>
      <circle cx="${champ.x + 75}" cy="${champ.y + 19}" r="12" fill="${border}"/>
      <text x="${champ.x + 75}" y="${champ.y + 24}" text-anchor="middle" class="costText">${champ.cost}</text>
      ${star}
      ${items}
    </g>
  `;
}

function traitRow(assets, trait, y) {
  return `
    <g>
      <rect x="64" y="${y}" width="268" height="62" rx="14" class="traitRow"/>
      ${image(assets.traits[trait.id], 80, y + 11, 40, 40)}
      <text x="138" y="${y + 27}" class="traitName">${trait.count} ${esc(trait.name)}</text>
      <text x="138" y="${y + 48}" class="traitSub">${esc(trait.desc)}</text>
    </g>
  `;
}

function itemPanel(assets, panel) {
  const items = panel.items.map((item, i) => {
    const x = panel.x + 18 + i * 94;
    const icon = item.key === 'guardbreaker'
      ? `<rect x="${x}" y="${panel.y + 46}" width="44" height="44" rx="10" class="placeholderItem"/><text x="${x + 22}" y="${panel.y + 73}" text-anchor="middle" class="smallBold">破</text>`
      : image(assets.items[item.key], x, panel.y + 46, 44, 44);
    return `
      <g>
        <rect x="${x - 2}" y="${panel.y + 44}" width="48" height="48" rx="11" class="itemFrame"/>
        ${icon}
        <text x="${x + 22}" y="${panel.y + 111}" text-anchor="middle" class="itemLabel">${esc(item.label)}</text>
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="${panel.x}" y="${panel.y}" width="312" height="132" rx="16" class="itemPanel"/>
      <text x="${panel.x + 18}" y="${panel.y + 28}" class="panelLabel">${esc(panel.title)}</text>
      ${items}
    </g>
  `;
}

function boardSlots() {
  const startX = 434;
  const startY = 238;
  const gapX = 100;
  const gapY = 132;
  const rows = ['前排', '第二', '第三', '后排'];
  let out = '';
  for (let r = 0; r < 4; r++) {
    out += `<text x="398" y="${startY + r * gapY + 58}" class="rowLabel">${rows[r]}</text>`;
    for (let c = 0; c < 7; c++) {
      out += `<rect x="${startX + c * gapX}" y="${startY + r * gapY}" width="90" height="122" rx="16" class="slot ${r < 2 ? 'frontSlot' : 'backSlot'}"/>`;
    }
  }
  return out;
}

async function main() {
  const assets = await loadAssets();
  const champs = [
    { id: 'poppy', name: '波比', cost: 1, star: '★★', x: 534, y: 238 },
    { id: 'rammus', name: '拉莫斯', cost: 4, star: '★★', x: 734, y: 238, items: ['sunfire', 'bramble', 'ionic'] },
    { id: 'fizz', name: '菲兹', cost: 3, star: '★★', x: 934, y: 238 },
    { id: 'ivern', name: '小木灵', cost: 2, star: '★', x: 634, y: 370 },
    { id: 'lissandra', name: '丽桑卓', cost: 1, star: '★★', x: 534, y: 502 },
    { id: 'karma', name: '卡尔玛', cost: 4, star: '★', x: 934, y: 502 },
    { id: 'corki', name: '库奇', cost: 4, star: '★★', x: 434, y: 634, items: ['lastWhisper', 'deathblade', 'guardbreaker'] },
    { id: 'veigar', name: '小法', cost: 1, star: '三星', x: 734, y: 634, items: ['nashor', 'jeweled', 'shojin'] },
    { id: 'bard', name: '巴德', cost: 5, star: '★', x: 1034, y: 634 },
  ];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="920" viewBox="0 0 1600 920" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101418"/>
      <stop offset="52%" stop-color="#18201d"/>
      <stop offset="100%" stop-color="#0c1014"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#232a2d"/>
      <stop offset="100%" stop-color="#14191c"/>
    </linearGradient>
    <style>
      .root { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif; }
      .title { font-size: 42px; font-weight: 900; fill: #f7f1e7; }
      .subtitle { font-size: 18px; fill: #b6c0c6; }
      .sectionTitle { font-size: 25px; font-weight: 900; fill: #f2bd63; }
      .panel { fill: url(#panel); stroke: #333d42; stroke-width: 2; }
      .traitRow { fill: #10161a; stroke: #36434a; stroke-width: 1.6; }
      .traitName { font-size: 19px; fill: #f2f4f5; font-weight: 900; }
      .traitSub { font-size: 13px; fill: #9faab0; }
      .slot { fill: #202828; stroke: #323d3d; stroke-width: 1.8; }
      .frontSlot { fill: #252d29; }
      .backSlot { fill: #1d2529; }
      .rowLabel { font-size: 18px; fill: #9aa6ab; font-weight: 800; }
      .champName { font-size: 16px; fill: #fff7e4; font-weight: 900; }
      .costText { font-size: 14px; fill: #121212; font-weight: 900; }
      .stars { font-size: 12px; fill: #ffd96a; font-weight: 900; }
      .itemFrame { fill: #11181b; stroke: #d8a85a; stroke-width: 1.5; }
      .placeholderItem { fill: #25303a; stroke: #d8a85a; stroke-width: 1.5; }
      .itemPanel { fill: #10161a; stroke: #354249; stroke-width: 1.8; }
      .panelLabel { font-size: 19px; fill: #f0f4f5; font-weight: 900; }
      .itemLabel { font-size: 13px; fill: #dfe5e8; font-weight: 800; }
      .small { font-size: 14px; fill: #d9e0e3; }
      .smallBold { font-size: 16px; fill: #f7e2a6; font-weight: 900; }
      .note { font-size: 15px; fill: #aeb8be; }
      .warn { font-size: 16px; fill: #ffca68; font-weight: 900; }
      .danger { font-size: 14px; fill: #ff9a8d; font-weight: 900; }
      .tempoBox { fill: #10161a; stroke: #354249; stroke-width: 1.6; }
      .tempoTitle { font-size: 16px; fill: #f2bd63; font-weight: 900; }
      .tempoText { font-size: 13px; fill: #d9e0e3; font-weight: 700; }
      .tag { fill: #172521; stroke: #61d394; stroke-width: 1.6; }
      .tagText { font-size: 15px; fill: #e8fff2; font-weight: 900; }
    </style>
  </defs>
  <rect class="root" width="1600" height="920" fill="url(#bg)"/>
  <g class="root">
    <rect x="36" y="28" width="1528" height="88" rx="18" fill="#151b1e" stroke="#2d373d" stroke-width="2"/>
    <text x="66" y="78" class="title">木灵小法一图流</text>
    <text x="365" y="60" class="subtitle">金铲铲 S17「星神」｜五羁绊版本｜实战吃鸡分支</text>
    <text x="365" y="90" class="subtitle">核心：8 人口搜 7 木灵，木灵格子做三星小法；9 人口补卡尔玛成型</text>
    <rect x="1232" y="48" width="104" height="38" rx="10" fill="#2a2112" stroke="#f2bd63"/>
    <text x="1260" y="72" class="tagText" fill="#ffe2a3">条件阵容</text>
    <rect x="1350" y="48" width="138" height="38" rx="10" class="tag"/>
    <text x="1374" y="72" class="tagText">胡牌可冲鸡</text>

    <rect x="40" y="142" width="316" height="718" rx="18" class="panel"/>
    <text x="66" y="184" class="sectionTitle">羁绊组成</text>
    ${traitRow(assets, { id: 'meeple', count: 7, name: '木灵族', desc: '主羁绊，克隆格做三星小法' }, 214)}
    ${traitRow(assets, { id: 'magician', count: 2, name: '魔术师', desc: '小法 + 丽桑卓' }, 288)}
    ${traitRow(assets, { id: 'darkStar', count: 2, name: '暗星', desc: '丽桑卓 + 卡尔玛' }, 362)}
    ${traitRow(assets, { id: 'traveler', count: 2, name: '旅人', desc: '小木灵 + 卡尔玛' }, 436)}
    ${traitRow(assets, { id: 'bastion', count: 2, name: '堡垒卫士', desc: '波比 + 拉莫斯' }, 510)}

    <text x="66" y="612" class="sectionTitle">过渡思路</text>
    <text x="70" y="648" class="small">2 阶段：木灵 + 牧羊过渡，优先保血。</text>
    <text x="70" y="676" class="small">装备：小法先拿纳什、法爆、青龙刀。</text>
    <text x="70" y="704" class="small">3 阶段：不为一张牌乱搜，保持经济。</text>
    <text x="70" y="732" class="small">4-2：8 级启动搜 7 木灵框架。</text>
    <text x="70" y="760" class="small">9 级：补卡尔玛，开 2 暗星 + 2 旅人。</text>
    <text x="70" y="806" class="warn">不胡小法 / 无法装 / 同行多时不要硬玩。</text>

    <rect x="382" y="142" width="812" height="718" rx="18" class="panel"/>
    <text x="408" y="184" class="sectionTitle">站位与棋子装备</text>
    <text x="625" y="184" class="note">人类读取顺序：前排在第一、第二排；后排在第三、第四排。</text>
    ${boardSlots()}
    ${champs.map(champ => champCard(assets, champ)).join('\n')}

    <g>
      <text x="408" y="790" class="sectionTitle">D 牌节奏</text>
      <rect x="408" y="808" width="176" height="42" rx="12" class="tempoBox"/>
      <text x="426" y="826" class="tempoTitle">2-1 到 3-2</text>
      <text x="426" y="843" class="tempoText">不搜，留小法木灵牌</text>
      <rect x="596" y="808" width="176" height="42" rx="12" class="tempoBox"/>
      <text x="614" y="826" class="tempoTitle">4-2 上 8</text>
      <text x="614" y="843" class="tempoText">大搜 7 木灵 + 两星前排</text>
      <rect x="784" y="808" width="176" height="42" rx="12" class="tempoBox"/>
      <text x="802" y="826" class="tempoTitle">成型后</text>
      <text x="802" y="843" class="tempoText">克隆格做三星小法</text>
      <rect x="972" y="808" width="176" height="42" rx="12" class="tempoBox"/>
      <text x="990" y="826" class="tempoTitle">9 人口</text>
      <text x="990" y="843" class="tempoText">补卡尔玛，补整体质量</text>
    </g>

    <rect x="1222" y="142" width="338" height="718" rx="18" class="panel"/>
    <text x="1250" y="184" class="sectionTitle">核心装备</text>
    ${itemPanel(assets, {
      x: 1240,
      y: 214,
      title: '小法：纳什 + 法爆 + 青龙刀',
      items: [
        { key: 'nashor', label: '纳什' },
        { key: 'jeweled', label: '法爆' },
        { key: 'shojin', label: '青龙刀' },
      ],
    })}
    ${itemPanel(assets, {
      x: 1240,
      y: 374,
      title: '飞机：轻语 + 杀人剑 + 破防',
      items: [
        { key: 'lastWhisper', label: '轻语' },
        { key: 'deathblade', label: '杀人剑' },
        { key: 'guardbreaker', label: '破防者' },
      ],
    })}
    ${itemPanel(assets, {
      x: 1240,
      y: 534,
      title: '拉莫斯：日炎 + 反甲 + 离子',
      items: [
        { key: 'sunfire', label: '日炎' },
        { key: 'bramble', label: '反甲' },
        { key: 'ionic', label: '离子' },
      ],
    })}
    <text x="1250" y="706" class="sectionTitle">注意事项</text>
    <text x="1244" y="738" class="note">1. 破防者用文字占位，别误配错图标。</text>
    <text x="1244" y="764" class="note">2. 8 级搜不到 7 木灵，别继续空等。</text>
    <text x="1244" y="790" class="note">3. 龙龟和飞机不二星，中期很难锁血。</text>
    <text x="1244" y="816" class="danger">4. 同行多或小法少，直接转木灵飞机。</text>
    <text x="1244" y="842" class="warn">优势局小法三星早，可以冲第一。</text>
  </g>
</svg>`;

  await writeFile(OUT_SVG, svg);
  await sharp(Buffer.from(svg)).png().toFile(OUT_PNG);
  console.log(JSON.stringify({ svg: OUT_SVG, png: OUT_PNG }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
