import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = process.cwd();
const CARD_WIDTH = 1600;
const CARD_HEIGHT = 920;
const OUTPUT_SCALE = 4;
const OUTPUT_WIDTH = CARD_WIDTH * OUTPUT_SCALE;
const OUTPUT_HEIGHT = CARD_HEIGHT * OUTPUT_SCALE;
const OUT_SVG = path.join(ROOT, 'assets/comps/woodland-veigar-17.1b.svg');
const OUT_PNG = path.join(ROOT, 'assets/comps/woodland-veigar-17.1b.png');

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
  starGods: {
    varus: 'assets/s17/star-gods/韦鲁斯__TFT15_Varus.png',
    kayle: 'assets/s17/star-gods/凯尔__TFT15_Kayle.png',
    yasuo: 'assets/s17/star-gods/亚索__TFT5_Yasuo.png',
    ekko: 'assets/s17/star-gods/艾克__TFT14_Ekko.png',
    soraka: 'assets/s17/star-gods/索拉卡__TFT7_Soraka.png',
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
  const width = champ.w || 78;
  const height = champ.h || 104;
  const portraitX = champ.x + 7;
  const portraitY = champ.y + 7;
  const portraitW = width - 14;
  const portraitH = 54;
  const itemSize = champ.itemSize || 22;
  const itemStart = champ.x + 6;
  const itemY = champ.y + height - itemSize - 6;
  const items = (champ.items || []).map((key, i) => itemIcon(assets, key, itemStart + i * (itemSize + 3), itemY, itemSize)).join('');
  const border = COST_COLORS[champ.cost] || '#8d98a0';
  const star = champ.star ? `<text x="${champ.x + width / 2}" y="${champ.y + height - 30}" text-anchor="middle" class="stars">${champ.star}</text>` : '';
  return `
    <g>
      <rect x="${champ.x - 3}" y="${champ.y - 3}" width="${width + 6}" height="${height + 6}" rx="14" fill="rgba(242,189,99,.12)" stroke="${border}" stroke-width="2.5"/>
      <rect x="${champ.x}" y="${champ.y}" width="${width}" height="${height}" rx="12" fill="#071116" stroke="#061015" stroke-width="1"/>
      <clipPath id="clip-${champ.id}"><rect x="${portraitX}" y="${portraitY}" width="${portraitW}" height="${portraitH}" rx="9"/></clipPath>
      ${image(assets.champions[champ.id], portraitX, portraitY, portraitW, portraitH, `clip-path="url(#clip-${champ.id})"`)}
      <rect x="${portraitX}" y="${champ.y + 42}" width="${portraitW}" height="25" rx="8" fill="rgba(0,0,0,.7)"/>
      <text x="${champ.x + width / 2}" y="${champ.y + 60}" text-anchor="middle" class="champName">${esc(champ.name)}</text>
      <circle cx="${champ.x + width - 10}" cy="${champ.y + 16}" r="12" fill="${border}"/>
      <text x="${champ.x + width - 10}" y="${champ.y + 21}" text-anchor="middle" class="costText">${champ.cost}</text>
      ${star}
      ${items}
    </g>
  `;
}

function miniChampCard(assets, champ, x, y) {
  const border = COST_COLORS[champ.cost] || '#8d98a0';
  return `
    <g>
      <rect x="${x - 2}" y="${y - 2}" width="58" height="78" rx="9" fill="#0a1519" stroke="${border}" stroke-width="2"/>
      <clipPath id="mini-${champ.id}"><rect x="${x + 3}" y="${y + 3}" width="48" height="48" rx="7"/></clipPath>
      ${image(assets.champions[champ.id], x + 3, y + 3, 48, 48, `clip-path="url(#mini-${champ.id})"`)}
      <rect x="${x + 3}" y="${y + 42}" width="48" height="19" rx="6" fill="rgba(0,0,0,.72)"/>
      <text x="${x + 27}" y="${y + 57}" text-anchor="middle" class="miniName">${esc(champ.name)}</text>
      <circle cx="${x + 48}" cy="${y + 11}" r="9" fill="${border}"/>
      <text x="${x + 48}" y="${y + 15}" text-anchor="middle" class="miniCost">${champ.cost}</text>
    </g>
  `;
}

function traitRow(assets, trait, y) {
  const marks = (trait.marks || []).map((mark, i) => {
    const x = 246 + i * 28;
    const active = mark === trait.count;
    return `
      <rect x="${x}" y="${y + 20}" width="22" height="24" rx="5" class="${active ? 'traitMarkActive' : 'traitMark'}"/>
      <text x="${x + 11}" y="${y + 37}" text-anchor="middle" class="${active ? 'traitMarkTextActive' : 'traitMarkText'}">${mark}</text>
    `;
  }).join('');
  return `
    <g>
      <rect x="64" y="${y}" width="268" height="58" rx="12" class="traitRow"/>
      ${image(assets.traits[trait.id], 80, y + 10, 38, 38)}
      <text x="136" y="${y + 25}" class="traitName">${trait.count} ${esc(trait.name)}</text>
      <text x="136" y="${y + 46}" class="traitSub">${esc(trait.desc)}</text>
      ${marks}
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

function starGodPanel(assets) {
  const rows = [
    { key: 'varus', label: '韦鲁斯', text: '首选：三星 / 复制器' },
    { key: 'kayle', label: '凯尔', text: '补装备，抬上限' },
    { key: 'yasuo', label: '亚索', text: '格子好才选' },
    { key: 'ekko', label: '艾克', text: '拆装 / 突变' },
    { key: 'soraka', label: '索拉卡', text: '低血止损' },
  ];
  const rowSvg = rows.map((god, i) => {
    const y = 704 + i * 29;
    return `
      <g>
        <rect x="1254" y="${y - 22}" width="282" height="29" rx="10" class="godRow"/>
        ${image(assets.starGods[god.key], 1260, y - 19, 24, 24)}
        <text x="1294" y="${y}" class="godName">${esc(god.label)}</text>
        <text x="1354" y="${y}" class="godText">${esc(god.text)}</text>
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="1240" y="642" width="312" height="198" rx="16" class="godPanel"/>
      <text x="1258" y="670" class="panelLabel">推荐星神</text>
      <text x="1356" y="670" class="godHint">不优先：伊芙琳 / 阿狸 / 龙王</text>
      ${rowSvg}
    </g>
  `;
}

function boardSlots() {
  const startX = 452;
  const startY = 334;
  const gapX = 88;
  const gapY = 104;
  const rows = ['前排', '第二', '第三', '后排'];
  let out = '';
  for (let r = 0; r < 4; r++) {
    out += `
      <rect x="408" y="${startY + r * gapY + 34}" width="50" height="28" rx="8" class="rowBadge rowBadge${r}"/>
      <text x="433" y="${startY + r * gapY + 54}" text-anchor="middle" class="rowLabel">${rows[r]}</text>
    `;
    for (let c = 0; c < 7; c++) {
      const x = startX + c * gapX;
      const y = startY + r * gapY;
      const points = `${x + 39},${y} ${x + 78},${y + 22} ${x + 78},${y + 68} ${x + 39},${y + 90} ${x},${y + 68} ${x},${y + 22}`;
      out += `<polygon points="${points}" class="slot ${r < 2 ? 'frontSlot' : 'backSlot'}"/>`;
    }
  }
  return out;
}

async function main() {
  const assets = await loadAssets();
  const champs = [
    { id: 'poppy', name: '波比', cost: 1, star: '★★', x: 540, y: 330 },
    { id: 'rammus', name: '拉莫斯', cost: 4, star: '★★', x: 716, y: 330, items: ['sunfire', 'bramble', 'ionic'] },
    { id: 'fizz', name: '菲兹', cost: 3, star: '★★', x: 892, y: 330 },
    { id: 'ivern', name: '小木灵', cost: 2, star: '★', x: 628, y: 434 },
    { id: 'lissandra', name: '丽桑卓', cost: 1, star: '★★', x: 540, y: 538 },
    { id: 'karma', name: '卡尔玛', cost: 4, star: '★', x: 892, y: 538 },
    { id: 'corki', name: '库奇', cost: 4, star: '★★', x: 452, y: 642, items: ['lastWhisper', 'deathblade', 'guardbreaker'] },
    { id: 'veigar', name: '小法', cost: 1, star: '三星', x: 716, y: 642, items: ['nashor', 'jeweled', 'shojin'] },
    { id: 'bard', name: '巴德', cost: 5, star: '★', x: 980, y: 642 },
  ];
  const compRow = [
    { id: 'poppy', name: '波比', cost: 1 },
    { id: 'veigar', name: '小法', cost: 1 },
    { id: 'corki', name: '库奇', cost: 4 },
    { id: 'rammus', name: '拉莫斯', cost: 4 },
    { id: 'bard', name: '巴德', cost: 5 },
    { id: 'fizz', name: '菲兹', cost: 3 },
    { id: 'ivern', name: '小木灵', cost: 2 },
    { id: 'lissandra', name: '丽桑卓', cost: 1 },
    { id: 'karma', name: '卡尔玛', cost: 4 },
  ];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OUTPUT_WIDTH}" height="${OUTPUT_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101418"/>
      <stop offset="52%" stop-color="#18201d"/>
      <stop offset="100%" stop-color="#0c1014"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10262a"/>
      <stop offset="55%" stop-color="#07171c"/>
      <stop offset="100%" stop-color="#061016"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#1c7269" stop-opacity=".32"/>
      <stop offset="55%" stop-color="#0b2528" stop-opacity=".08"/>
      <stop offset="100%" stop-color="#010508" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#2d4a4a" stroke-width="1"/>
    </pattern>
    <style>
      .root { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif; }
      .title { font-size: 58px; font-weight: 900; fill: #f7e0aa; filter: drop-shadow(0 2px 2px rgba(0,0,0,.55)); }
      .subtitle { font-size: 18px; fill: #b6c0c6; }
      .patchPill { font-size: 16px; fill: #fff2cd; font-weight: 900; }
      .headerPanel { fill: rgba(4,12,17,.86); stroke: #b68c4a; stroke-width: 1.3; }
      .emblemRing { fill: #0a201b; stroke: #c8a25f; stroke-width: 2; }
      .navTag { fill: rgba(9,35,35,.8); stroke: #4f846f; stroke-width: 1.2; }
      .navTagActive { fill: rgba(41,31,13,.85); stroke: #d4a853; stroke-width: 1.5; }
      .navTagText { font-size: 17px; fill: #f5ebd1; font-weight: 900; }
      .tierBox { fill: rgba(12,17,20,.92); stroke: #6c6045; stroke-width: 1.2; }
      .tierLabel { font-size: 13px; fill: #f4e6c1; font-weight: 900; }
      .tierText { font-size: 41px; fill: #ffae47; font-weight: 900; }
      .tierNote { font-size: 15px; fill: #ffcb72; font-weight: 900; }
      .headlineBox { fill: rgba(9,34,29,.72); stroke: #2a8367; stroke-width: 1.2; }
      .headline { font-size: 19px; fill: #eaf7e9; font-weight: 900; }
      .headlineSub { font-size: 16px; fill: #b9c9c5; font-weight: 800; }
      .sectionTitle { font-size: 25px; font-weight: 900; fill: #f2bd63; }
      .panel { fill: url(#panel); stroke: #48615e; stroke-width: 1.7; filter: drop-shadow(0 8px 12px rgba(0,0,0,.28)); }
      .traitRow { fill: rgba(5,15,20,.88); stroke: #3d5b58; stroke-width: 1.4; }
      .traitName { font-size: 18px; fill: #f7f1e7; font-weight: 900; }
      .traitSub { font-size: 12px; fill: #aeb9b7; }
      .traitMark { fill: rgba(8,22,24,.95); stroke: #314845; stroke-width: 1; }
      .traitMarkActive { fill: rgba(207,168,73,.28); stroke: #d2ad55; stroke-width: 1.5; }
      .traitMarkText { font-size: 12px; fill: #6f817d; font-weight: 900; }
      .traitMarkTextActive { font-size: 12px; fill: #fff2b0; font-weight: 900; }
      .slot { fill: rgba(11,31,38,.58); stroke: #735b38; stroke-width: 1.2; }
      .frontSlot { fill: rgba(19,45,38,.58); }
      .backSlot { fill: rgba(10,31,44,.58); }
      .rowBadge { stroke-width: 1.1; }
      .rowBadge0 { fill: rgba(84,26,31,.5); stroke: #9b4b4e; }
      .rowBadge1 { fill: rgba(104,70,16,.45); stroke: #c79339; }
      .rowBadge2 { fill: rgba(58,89,19,.42); stroke: #8bbf4b; }
      .rowBadge3 { fill: rgba(16,78,89,.45); stroke: #42b9c4; }
      .rowLabel { font-size: 15px; fill: #f6e5b8; font-weight: 900; }
      .champName { font-size: 16px; fill: #fff7e4; font-weight: 900; }
      .costText { font-size: 14px; fill: #121212; font-weight: 900; }
      .stars { font-size: 12px; fill: #ffd96a; font-weight: 900; }
      .miniName { font-size: 12px; fill: #fff7e4; font-weight: 900; }
      .miniCost { font-size: 10px; fill: #121212; font-weight: 900; }
      .itemFrame { fill: #11181b; stroke: #d8a85a; stroke-width: 1.5; }
      .placeholderItem { fill: #25303a; stroke: #d8a85a; stroke-width: 1.5; }
      .itemPanel { fill: rgba(5,15,20,.92); stroke: #354249; stroke-width: 1.8; }
      .panelLabel { font-size: 19px; fill: #f0f4f5; font-weight: 900; }
      .itemLabel { font-size: 13px; fill: #dfe5e8; font-weight: 800; }
      .godPanel { fill: rgba(5,15,20,.92); stroke: #354249; stroke-width: 1.8; }
      .godRow { fill: #0c1316; stroke: #263238; stroke-width: 1.1; }
      .godName { font-size: 15px; fill: #ffe2a3; font-weight: 900; }
      .godText { font-size: 14px; fill: #dce4e6; font-weight: 900; }
      .godHint { font-size: 11px; fill: #aeb8be; font-weight: 800; }
      .small { font-size: 14px; fill: #d9e0e3; }
      .smallBold { font-size: 16px; fill: #f7e2a6; font-weight: 900; }
      .note { font-size: 15px; fill: #aeb8be; }
      .warn { font-size: 16px; fill: #ffca68; font-weight: 900; }
      .danger { font-size: 14px; fill: #ff9a8d; font-weight: 900; }
      .tempoBox { fill: #10161a; stroke: #354249; stroke-width: 1.6; }
      .tempoGreen { stroke: #52bd7b; }
      .tempoBlue { stroke: #4ba1df; }
      .tempoOrange { stroke: #d28a39; }
      .tempoPurple { stroke: #9b5edc; }
      .tempoTitle { font-size: 16px; fill: #f2bd63; font-weight: 900; }
      .tempoText { font-size: 13px; fill: #d9e0e3; font-weight: 700; }
      .tag { fill: #172521; stroke: #61d394; stroke-width: 1.6; }
      .tagText { font-size: 15px; fill: #e8fff2; font-weight: 900; }
      .riskPanel { fill: rgba(45,9,19,.78); stroke: #b74754; stroke-width: 1.7; }
      .riskTitle { font-size: 22px; fill: #ff8f8f; font-weight: 900; }
      .riskLine { font-size: 14px; fill: #ffd0d0; font-weight: 800; }
      .conditionTitle { font-size: 22px; fill: #c8f5c4; font-weight: 900; }
      .conditionDot { fill: rgba(49,157,89,.28); stroke: #78df94; stroke-width: 1.4; }
      .conditionNum { font-size: 13px; fill: #dfffe2; font-weight: 900; }
      .conditionText { font-size: 14px; fill: #d9eee3; font-weight: 800; }
      .arrow { fill: #d8d5ca; opacity: .8; }
    </style>
  </defs>
  <rect class="root" width="1600" height="920" fill="url(#bg)"/>
  <rect width="1600" height="920" fill="url(#grid)" opacity=".2"/>
  <g class="root">
    <rect x="24" y="18" width="1552" height="112" rx="16" class="headerPanel"/>
    <circle cx="72" cy="72" r="42" class="emblemRing"/>
    ${image(assets.traits.meeple, 43, 43, 58, 58)}
    <text x="126" y="74" class="title">木灵小法师</text>
    <text x="126" y="104" class="patchPill">金铲铲 S17「星神」 / TFT Set 17 / 17.1b</text>
    <rect x="454" y="38" width="160" height="42" rx="6" class="navTagActive"/>
    <text x="504" y="64" class="navTagText">阵容定位</text>
    <rect x="626" y="38" width="374" height="42" rx="6" class="navTag"/>
    <text x="646" y="64" class="navTagText">观察阵容 / 条件赌阵 / 低同行胡牌时冲上限</text>
    <rect x="1020" y="36" width="118" height="78" rx="6" class="tierBox"/>
    <text x="1042" y="58" class="tierLabel">强度标记</text>
    <text x="1044" y="99" class="tierText">C+</text>
    <text x="1102" y="96" class="tierNote">观察</text>
    <rect x="1160" y="36" width="390" height="78" rx="8" class="headlineBox"/>
    <text x="1192" y="64" class="headline">胡牌时三星小法配合 7 木灵爆发极强</text>
    <text x="1192" y="96" class="headlineSub">前排厚度和站位保护决定上限；不胡不硬赌。</text>

    <rect x="40" y="142" width="316" height="570" rx="10" class="panel"/>
    <text x="106" y="172" class="sectionTitle">核心羁绊</text>
    ${traitRow(assets, { id: 'meeple', count: 7, name: '木灵族', desc: '主羁绊，克隆格做三星小法', marks: [3, 5, 7, 9] }, 194)}
    ${traitRow(assets, { id: 'magician', count: 2, name: '魔术师', desc: '小法 + 丽桑卓', marks: [2, 4, 6] }, 262)}
    ${traitRow(assets, { id: 'darkStar', count: 2, name: '暗星', desc: '丽桑卓 + 卡尔玛', marks: [2, 4, 6] }, 330)}
    ${traitRow(assets, { id: 'traveler', count: 2, name: '旅人', desc: '小木灵 + 卡尔玛', marks: [2] }, 398)}
    ${traitRow(assets, { id: 'bastion', count: 2, name: '堡垒卫士', desc: '波比 + 拉莫斯', marks: [2, 4, 6] }, 466)}
    <text x="106" y="562" class="conditionTitle">适玩条件</text>
    <circle cx="82" cy="596" r="12" class="conditionDot"/><text x="82" y="601" text-anchor="middle" class="conditionNum">1</text>
    <text x="104" y="601" class="conditionText">2 阶段小法多，至少有对子。</text>
    <circle cx="82" cy="628" r="12" class="conditionDot"/><text x="82" y="633" text-anchor="middle" class="conditionNum">2</text>
    <text x="104" y="633" class="conditionText">能做纳什、法爆、青龙刀。</text>
    <circle cx="82" cy="660" r="12" class="conditionDot"/><text x="82" y="665" text-anchor="middle" class="conditionNum">3</text>
    <text x="104" y="665" class="conditionText">同行少，8 级有 7 木灵路径。</text>
    <circle cx="82" cy="692" r="12" class="conditionDot"/><text x="82" y="697" text-anchor="middle" class="conditionNum">4</text>
    <text x="104" y="697" class="conditionText">有复制器、D 牌或装备强化。</text>

    <rect x="40" y="724" width="316" height="136" rx="10" class="riskPanel"/>
    <text x="76" y="758" class="riskTitle">放弃条件 / 风险</text>
    <text x="70" y="790" class="riskLine">1. 3-2 仍看不到三星小法路径。</text>
    <text x="70" y="816" class="riskLine">2. 装备偏物理，无法做启动装。</text>
    <text x="70" y="842" class="riskLine">3. 同行多或 8 级搜不出 7 木灵。</text>

    <rect x="382" y="142" width="812" height="718" rx="18" class="panel"/>
    <text x="650" y="176" class="sectionTitle">阵容组成</text>
    <text x="408" y="207" class="note">8 人口成型；9 人口补卡尔玛，上限更高。</text>
    ${compRow.map((champ, i) => miniChampCard(assets, champ, 420 + i * 70, 222)).join('\n')}
    <text x="650" y="320" class="sectionTitle">棋盘站位</text>
    <text x="790" y="320" class="note">从上到下：前排 -> 后排；第三排可放保护位。</text>
    ${boardSlots()}
    ${champs.map(champ => champCard(assets, champ)).join('\n')}

    <g>
      <text x="650" y="790" class="sectionTitle">运营节点</text>
      <rect x="408" y="808" width="178" height="42" rx="8" class="tempoBox tempoGreen"/>
      <text x="426" y="826" class="tempoTitle">2 阶段</text>
      <text x="426" y="843" class="tempoText">不升人口，留体系牌</text>
      <polygon points="614,826 596,816 596,836" class="arrow"/>
      <rect x="626" y="808" width="178" height="42" rx="8" class="tempoBox tempoBlue"/>
      <text x="644" y="826" class="tempoTitle">3-1 / 3-2</text>
      <text x="644" y="843" class="tempoText">看小法数量，保持经济</text>
      <polygon points="832,826 814,816 814,836" class="arrow"/>
      <rect x="844" y="808" width="178" height="42" rx="8" class="tempoBox tempoOrange"/>
      <text x="862" y="826" class="tempoTitle">4-2</text>
      <text x="862" y="843" class="tempoText">8 级搜 7 木灵框架</text>
      <polygon points="1050,826 1032,816 1032,836" class="arrow"/>
      <rect x="1062" y="808" width="108" height="42" rx="8" class="tempoBox tempoPurple"/>
      <text x="1080" y="826" class="tempoTitle">后期</text>
      <text x="1080" y="843" class="tempoText">补卡尔玛</text>
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
      y: 354,
      title: '飞机：轻语 + 杀人剑 + 破防',
      items: [
        { key: 'lastWhisper', label: '轻语' },
        { key: 'deathblade', label: '杀人剑' },
        { key: 'guardbreaker', label: '破防者' },
      ],
    })}
    ${itemPanel(assets, {
      x: 1240,
      y: 494,
      title: '拉莫斯：日炎 + 反甲 + 离子',
      items: [
        { key: 'sunfire', label: '日炎' },
        { key: 'bramble', label: '反甲' },
        { key: 'ionic', label: '离子' },
      ],
    })}
    ${starGodPanel(assets)}
    <text x="1250" y="852" class="warn">无 7 木灵别空等；同行多转飞机。</text>
  </g>
</svg>`;

  const cleanSvg = svg.replace(/[ \t]+$/gm, '');
  await writeFile(OUT_SVG, cleanSvg);
  await sharp(Buffer.from(cleanSvg)).png().toFile(OUT_PNG);
  console.log(JSON.stringify({ svg: OUT_SVG, png: OUT_PNG }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
