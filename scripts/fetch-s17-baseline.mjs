import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DATA = path.join(ROOT, 'data/s17');
const OUT_ASSETS = path.join(ROOT, 'assets/s17');
const OUT_DOCS = path.join(ROOT, 'docs');

const SOURCES = {
  cdragonZh: 'https://raw.communitydragon.org/latest/cdragon/tft/zh_cn.json',
  youxiaTraits: 'https://m.ali213.net/news/gl2603/1758483.html',
  youxiaChampions: 'https://m.ali213.net/news/gl2603/1758465.html',
  youxiaStarGods: 'https://app.ali213.net/gl/1767593.html',
};

const OFFICIAL_ANNOUNCEMENT_SOURCES = [
  {
    key: 'riotTftPatch17_1',
    name: 'Teamfight Tactics patch 17.1',
    url: 'https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-17-1',
    authorityTier: 0,
    platform: 'TFT',
    role: 'TFT 全球服官方版本公告，用于确认 Set 17、版本号、机制和补丁方向。',
  },
  {
    key: 'riotTftPatchNotesIndex',
    name: 'Teamfight Tactics Patch Notes',
    url: 'https://teamfighttactics.leagueoflegends.com/en-us/news/tags/patch-notes/',
    authorityTier: 0,
    platform: 'TFT',
    role: 'TFT 官方补丁列表，用于确认最新官方补丁入口。',
  },
  {
    key: 'goldenSpatulaOfficialSite',
    name: '金铲铲之战官网',
    url: 'https://jcc.qq.com/',
    authorityTier: 0,
    platform: '金铲铲之战',
    role: '金铲铲官方站点，用于确认官方主体；该页面依赖 JavaScript，简单脚本通常无法直接抓取公告正文。',
  },
  {
    key: 'goldenSpatulaPatch17_1OfficialMirror17173',
    name: '《金铲铲之战》17.1版本 4月23日更新公告',
    url: 'https://news.17173.com/content/04222026/161402748.shtml',
    authorityTier: 1,
    platform: '金铲铲之战',
    role: '金铲铲 17.1 公告正文镜像，用于补充官网动态页无法直接抓取时的文本校准；最终仍以游戏内和官网为准。',
  },
];

const STAR_GOD_ICON_FALLBACKS = {
  '阿狸': 'TFT16_Ahri',
  '奥瑞利安·索尔': 'TFT16_AurelionSol',
  '艾克': 'TFT14_Ekko',
  '伊芙琳': 'TFT4_Evelynn',
  '凯尔': 'TFT15_Kayle',
  '索拉卡': 'TFT7_Soraka',
  '锤石': 'TFT7_Thresh',
  '韦鲁斯': 'TFT15_Varus',
  '亚索': 'TFT5_Yasuo',
};

const TRAIT_NAME_OVERRIDES = {
  '织命人': '织命者',
};

const KNOWN_SOURCE_CONFLICTS = [
  {
    field: 'trait.name',
    communityDragon: '织命人',
    goldSpatulaZh: '织命者',
    decision: '项目展示、阵容卡和图卡提示词使用“织命者”；保留 CommunityDragon 原名用于溯源。',
  },
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, '—')
    .replace(/&times;/g, '×')
    .replace(/&middot;/g, '·');
}

function htmlToText(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/h\d>|<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function normalizeUrl(url, base) {
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  return new URL(url, base).toString();
}

function extractLinks(html, base) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gsi)]
    .map(match => ({
      href: normalizeUrl(match[1], base),
      text: htmlToText(match[2]).replace(/\s+/g, ' ').trim(),
    }))
    .filter(item => item.href && item.text);
}

function extractImages(html, base) {
  const images = [];
  for (const match of html.matchAll(/<img[^>]+>/gsi)) {
    const tag = match[0];
    const src = tag.match(/\s(?:data-original|data-src|src)=["']([^"']+)["']/i)?.[1];
    if (!src) continue;
    const url = normalizeUrl(src, base);
    if (!url) continue;
    if (!/ali213|communitydragon|raw\.communitydragon/.test(url)) continue;
    if (/weixin|qrcode|down_ios|down_android|cover\/0\/10321687|head_/.test(url)) continue;
    images.push(url);
  }
  return [...new Set(images)];
}

function cdragonAssetUrl(assetPath) {
  if (!assetPath) return null;
  return `https://raw.communitydragon.org/latest/game/${assetPath.toLowerCase().replace(/\.tex$/i, '.png')}`;
}

function safeName(name) {
  return String(name || 'unknown')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 120);
}

function displayTraitName(name) {
  return TRAIT_NAME_OVERRIDES[name] || name;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function cleanCdragonDesc(desc) {
  return decodeHtml(String(desc || ''))
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function sortText(value) {
  return cleanCdragonDesc(value) || 'zzzz';
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 Codex TFT resource baseline crawler',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 Codex TFT resource baseline crawler',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function downloadBinary(url, outPath, failures) {
  if (!url) return false;
  if (existsSync(outPath)) return true;
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 Codex TFT resource baseline crawler',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 64) throw new Error('too small');
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, buffer);
    return true;
  } catch (error) {
    failures.push({ url, outPath: path.relative(ROOT, outPath), error: error.message });
    return false;
  }
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function extractBlock(text, start, endPatterns) {
  const startIndex = text.indexOf(start);
  if (startIndex < 0) return '';
  let endIndex = text.length;
  for (const end of endPatterns) {
    const idx = text.indexOf(end, startIndex + start.length);
    if (idx >= 0 && idx < endIndex) endIndex = idx;
  }
  return text.slice(startIndex + start.length, endIndex).trim();
}

function parseYouxiaTraitPage(name, url, html) {
  const text = htmlToText(html);
  const effect = extractBlock(text, '一、羁绊效果', ['二、羁绊棋子', '以上就是']);
  const unitsBlock = extractBlock(text, '二、羁绊棋子', ['以上就是', 'S17赛季攻略']);
  const units = unitsBlock
    .replace(/【.*?】/g, '')
    .split(/[、，,\n]/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => !/Image|以上|安卓版|苹果版/.test(s));
  return {
    name,
    source: url,
    effect,
    units,
    images: extractImages(html, url),
  };
}

function parseYouxiaChampionPage(name, url, html) {
  const text = htmlToText(html);
  const skillBlock = extractBlock(text, '一、技能', ['二、棋子介绍', '以上就是']);
  const introBlock = extractBlock(text, '二、棋子介绍', ['以上就是', 'S17赛季攻略']);
  const cost = introBlock.match(/费用：\s*([^\n]+)/)?.[1]?.trim() || null;
  const traits = introBlock.match(/羁绊：\s*([^\n]+)/)?.[1]
    ?.split(/[、，,]/)
    .map(s => s.trim())
    .filter(Boolean) || [];
  const skillName = skillBlock.match(/^〖([^〗]+)〗/)?.[1] || null;
  const skillText = skillName ? skillBlock.replace(/^〖[^〗]+〗\s*/, '').trim() : skillBlock.trim();
  return {
    name,
    source: url,
    cost,
    traits,
    skillName,
    skillText,
    images: extractImages(html, url),
  };
}

function parseStarGods(html, url) {
  const text = htmlToText(html);
  const start = text.indexOf('一、阿狸一财富之神');
  const end = text.indexOf('以上就是金铲铲之战s17星神奖励汇总');
  const body = text.slice(start >= 0 ? start : 0, end >= 0 ? end : text.length);
  const headingRegex = /(?:^|\n)([一二三四五六七八九])、([^\n]+?)一([^\n]+?神)\n/g;
  const headings = [...body.matchAll(headingRegex)];
  const gods = [];
  for (let i = 0; i < headings.length; i++) {
    const match = headings[i];
    const next = headings[i + 1];
    const block = body.slice(match.index + match[0].length, next ? next.index : body.length).trim();
    const lines = block.split('\n').map(s => s.trim()).filter(Boolean);
    const grace = lines.find(line => /恩赐：/.test(line)) || '';
    const stage2 = lines.find(line => /^二阶段：/.test(line)) || '';
    const stage3 = lines.find(line => /^三阶段/.test(line)) || '';
    const stage4 = lines.find(line => /^四阶段/.test(line)) || '';
    gods.push({
      order: i + 1,
      championName: match[2].trim(),
      godTitle: match[3].trim(),
      fullName: `${match[2].trim()} · ${match[3].trim()}`,
      grace,
      stage2,
      stage3,
      stage4,
      rawBlock: block,
      source: url,
    });
  }
  return {
    gods,
    images: extractImages(html, url),
  };
}

function parseOfficialAnnouncement(source, html) {
  const text = htmlToText(html);
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const title = lines.find(line => line.length >= 4 && !/^We're sorry/.test(line)) || source.name;
  const publishTime = text.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)?.[0]
    || text.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/)?.[0]
    || text.match(/\d{4}年\d{1,2}月\d{1,2}日/)?.[0]
    || null;
  const signals = [
    ['17.1', /17\.1/.test(text)],
    ['17.1B', /17\.1B/i.test(text)],
    ['Set 17', /Set 17|S17/.test(text)],
    ['Space Gods', /Space Gods|SPACE GODS/.test(text)],
    ['星神', /星神/.test(text)],
    ['Realm of the Gods', /Realm of the Gods/.test(text)],
    ['星神领域', /星神领域/.test(text)],
    ['4月23日', /4月23日/.test(text)],
    ['装备轮换调整', /装备轮换调整/.test(text)],
  ].filter(([, matched]) => matched).map(([label]) => label);
  return {
    key: source.key,
    name: source.name,
    url: source.url,
    authorityTier: source.authorityTier,
    platform: source.platform,
    role: source.role,
    title,
    publishTime,
    parserStatus: text.length > 200 && !/^We're sorry/.test(text) ? 'parsed' : 'metadata-only',
    matchedSignals: signals,
  };
}

function apiBucket(apiName) {
  const value = String(apiName || '');
  if (value.startsWith('TFT17_')) return 'TFT17';
  if (value.startsWith('TFT_Item_')) return 'TFT_Item';
  const numbered = value.match(/^TFT\d+_/)?.[0];
  if (numbered) return numbered.slice(0, -1);
  if (value.startsWith('TFT_')) return 'TFT_Shared';
  return 'Other';
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function duplicateGroups(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([key, values]) => ({ key, count: values.length, apiNames: values.map(item => item.apiName) }));
}

function buildS17Audit(championCatalog, traitCatalog, itemCatalog, starGodCatalog) {
  const championApiNotTFT17 = championCatalog.filter(champion => !String(champion.apiName).startsWith('TFT17_'));
  const traitApiNotTFT17 = traitCatalog.filter(trait => !String(trait.apiName).startsWith('TFT17_'));
  const nonTFT17Items = itemCatalog.filter(item => !String(item.apiName).startsWith('TFT17_'));
  const historicalStarGodIcons = starGodCatalog.filter(god => /historical TFT champion icon/.test(god.iconSource || ''));
  const duplicateTraitNames = duplicateGroups(traitCatalog, trait => trait.zhName);
  return {
    generatedAt: new Date().toISOString(),
    conclusion: '棋子与羁绊为 Set 17；装备/物品来自 Set 17 item 清单，但包含通用和历史 apiName 复用资源；星神为 Set 17 机制，头像为历史弈子图兜底。',
    checks: {
      champions: {
        total: championCatalog.length,
        apiPrefixRule: 'apiName 必须以 TFT17_ 开头',
        apiNotTFT17: championApiNotTFT17.length,
        status: championApiNotTFT17.length === 0 ? 'pass' : 'fail',
      },
      traits: {
        total: traitCatalog.length,
        apiPrefixRule: 'apiName 必须以 TFT17_ 开头',
        apiNotTFT17: traitApiNotTFT17.length,
        duplicateDisplayNames: duplicateTraitNames,
        status: traitApiNotTFT17.length === 0 ? 'pass-with-variants' : 'fail',
        note: '重复展示名是 Set 17 内部变体。例如观星者有多个子类型，写阵容卡时应按展示名合并理解。',
      },
      items: {
        total: itemCatalog.length,
        sourceRule: '来自 CommunityDragon setData[number=17].items 清单',
        apiBuckets: countBy(itemCatalog, item => apiBucket(item.apiName)),
        nonTFT17ApiCount: nonTFT17Items.length,
        nonTFT17ApiExamples: nonTFT17Items.slice(0, 30).map(item => ({
          apiName: item.apiName,
          zhName: item.zhName,
        })),
        status: 'pass-with-shared-api-names',
        note: '装备、金币、复制器、拆卸器、光明装备、神器和奖励包经常复用通用或旧赛季 apiName。它们出现在 Set 17 items 清单中，因此属于当前资源基线，但不能用 apiName 前缀简单判断为非 S17。',
      },
      starGods: {
        total: starGodCatalog.length,
        dataSourceRule: '来自 S17 星神奖励页面',
        historicalFallbackIconCount: historicalStarGodIcons.length,
        historicalFallbackIconExamples: historicalStarGodIcons.map(god => ({
          fullName: god.fullName,
          assetPath: god.assetPath,
          iconSource: god.iconSource,
        })),
        status: historicalStarGodIcons.length ? 'pass-with-fallback-icons' : 'pass',
        note: '星神本身是 S17 机制；当前本地头像是用历史 TFT 弈子头像兜底，不能当作官方 S17 星神原画。',
      },
    },
  };
}

function dedupeByApi(items) {
  const map = new Map();
  for (const item of items) {
    if (item?.apiName && !map.has(item.apiName)) map.set(item.apiName, item);
  }
  return [...map.values()];
}

async function main() {
  await mkdir(OUT_DATA, { recursive: true });
  await mkdir(OUT_ASSETS, { recursive: true });

  const failures = [];

  const [cdragon, traitsHtml, championsHtml, starGodsHtml] = await Promise.all([
    fetchJson(SOURCES.cdragonZh),
    fetchText(SOURCES.youxiaTraits),
    fetchText(SOURCES.youxiaChampions),
    fetchText(SOURCES.youxiaStarGods),
  ]);
  const officialAnnouncements = await mapLimit(OFFICIAL_ANNOUNCEMENT_SOURCES, 4, async source => {
    try {
      const html = await fetchText(source.url);
      return parseOfficialAnnouncement(source, html);
    } catch (error) {
      return {
        key: source.key,
        name: source.name,
        url: source.url,
        authorityTier: source.authorityTier,
        platform: source.platform,
        role: source.role,
        parserStatus: 'failed',
        error: error.message,
        matchedSignals: [],
      };
    }
  });

  const set17 = cdragon.setData.find(set => Number(set.number) === 17);
  if (!set17) throw new Error('Set 17 not found in CommunityDragon data');

  const itemByApi = new Map(cdragon.items.map(item => [item.apiName, item]));
  const cdragonChampions = set17.champions
    .filter(champion => champion.apiName?.startsWith('TFT17_') && champion.traits?.length)
    .sort((a, b) => a.cost - b.cost || sortText(a.name).localeCompare(sortText(b.name), 'zh-CN'));
  const cdragonTraits = set17.traits
    .filter(trait => trait.apiName?.startsWith('TFT17_'))
    .sort((a, b) => sortText(a.name).localeCompare(sortText(b.name), 'zh-CN'));
  const cdragonItems = dedupeByApi(set17.items.map(apiName => itemByApi.get(apiName)).filter(Boolean))
    .sort((a, b) => sortText(a.name).localeCompare(sortText(b.name), 'zh-CN'));

  const traitLinks = uniqueBy(extractLinks(traitsHtml, SOURCES.youxiaTraits), link => link.href)
    .filter(link => /gl2603\/1758\d+\.html/.test(link.href))
    .filter(link => !['棋子大全', '羁绊大全', '更新时间'].includes(link.text));
  const championLinks = uniqueBy(extractLinks(championsHtml, SOURCES.youxiaChampions), link => link.href)
    .filter(link => /gl2603\/1758\d+\.html/.test(link.href))
    .filter(link => !['棋子大全', '羁绊大全', '更新时间'].includes(link.text));

  const knownTraitNames = new Set(cdragonTraits.flatMap(trait => [trait.name, displayTraitName(trait.name)]));
  const youxiaTraitLinks = traitLinks.filter(link =>
    knownTraitNames.has(link.text) ||
    ['汪星机器人', '军工1号', '灭星尊', '天煞', '救世主', '斗神', '黑暗魔女', '最高指挥官', '命运祭司', '暮光铁壁', '末日使者', '武装战姬'].includes(link.text),
  );

  const knownChampionNames = new Set(cdragonChampions.flatMap(champion => [
    champion.name,
    champion.name.replace('奥瑞利安·索尔', '龙王'),
    champion.name.replace('努努和威朗普', '努努'),
    champion.name.replace('布里茨', '机器人'),
    champion.name.replace('格雷福斯', '男枪'),
    champion.name.replace('库奇', '飞机'),
    champion.name.replace('拉莫斯', '龙龟'),
    champion.name.replace('维迦', '小法'),
    champion.name.replace('菲兹', '小鱼人'),
    champion.name.replace('易', '剑圣'),
    champion.name.replace('乐芙兰', '妖姬'),
    champion.name.replace('黛安娜', '皎月'),
    champion.name.replace('厄运小姐', '女枪'),
    champion.name.replace('崔斯特', '卡牌'),
    champion.name.replace('泰隆', '男刀'),
    champion.name.replace('雷克塞', '挖掘机'),
    champion.name.replace('科加斯', '大虫子'),
    champion.name.replace('亚托克斯', '剑魔'),
    champion.name.replace('凯特琳', '女警'),
    champion.name.replace('茂凯', '大树'),
    champion.name.replace('伊泽瑞尔', 'EZ'),
    champion.name.replace('菲奥娜', '剑姬'),
    champion.name.replace('丽桑卓', '冰女'),
    champion.name.replace('内瑟斯', '狗头'),
    champion.name.replace('古拉加斯', '酒桶'),
    champion.name.replace('莫德凯撒', '铁男'),
    champion.name.replace('阿萝拉', '兔子'),
    champion.name.replace('超级机甲', '加里奥'),
    champion.name.replace('娑娜', '琴女'),
  ]));
  const youxiaChampionLinks = championLinks.filter(link => knownChampionNames.has(link.text));

  const youxiaTraits = [];
  for (const [index, link] of youxiaTraitLinks.entries()) {
    const html = await fetchText(link.href);
    youxiaTraits.push(parseYouxiaTraitPage(link.text, link.href, html));
    if ((index + 1) % 8 === 0) await sleep(100);
  }

  const youxiaChampions = [];
  for (const [index, link] of youxiaChampionLinks.entries()) {
    const html = await fetchText(link.href);
    youxiaChampions.push(parseYouxiaChampionPage(link.text, link.href, html));
    if ((index + 1) % 8 === 0) await sleep(100);
  }

  const starGods = parseStarGods(starGodsHtml, SOURCES.youxiaStarGods);

  const youxiaTraitByName = new Map(youxiaTraits.map(trait => [trait.name, trait]));
  const youxiaChampionByName = new Map();
  for (const champion of youxiaChampions) {
    youxiaChampionByName.set(champion.name, champion);
  }

  const championAliases = {
    '奥瑞利安·索尔': ['龙王'],
    '努努和威朗普': ['努努'],
    '布里茨': ['机器人'],
    '格雷福斯': ['男枪'],
    '库奇': ['飞机'],
    '拉莫斯': ['龙龟'],
    '维迦': ['小法', '小法师'],
    '菲兹': ['小鱼人'],
    '易': ['剑圣'],
    '乐芙兰': ['妖姬'],
    '黛安娜': ['皎月'],
    '厄运小姐': ['女枪'],
    '崔斯特': ['卡牌'],
    '泰隆': ['男刀'],
    '雷克塞': ['挖掘机'],
    '科加斯': ['大虫子'],
    '亚托克斯': ['剑魔'],
    '凯特琳': ['女警'],
    '茂凯': ['大树'],
    '伊泽瑞尔': ['EZ'],
    '菲奥娜': ['剑姬'],
    '丽桑卓': ['冰女'],
    '内瑟斯': ['狗头'],
    '古拉加斯': ['酒桶'],
    '莫德凯撒': ['铁男'],
    '阿萝拉': ['兔子'],
    '超级机甲': ['加里奥'],
    '娑娜': ['琴女'],
  };

  function findYouxiaChampion(cdragonChampion) {
    const names = [cdragonChampion.name, ...(championAliases[cdragonChampion.name] || [])];
    for (const name of names) {
      if (youxiaChampionByName.has(name)) return youxiaChampionByName.get(name);
    }
    return null;
  }

  const traitCatalog = cdragonTraits.map(trait => {
    const zhName = displayTraitName(trait.name);
    const youxia = youxiaTraitByName.get(zhName) || youxiaTraitByName.get(trait.name);
    return {
      apiName: trait.apiName,
      zhName,
      cdragonZhName: trait.name,
      desc: cleanCdragonDesc(trait.desc),
      effects: trait.effects || [],
      icon: trait.icon,
      assetUrl: cdragonAssetUrl(trait.icon),
      assetPath: `assets/s17/traits/${safeName(zhName)}__${trait.apiName}.png`,
      youxia: youxia ? {
        name: youxia.name,
        effect: youxia.effect,
        units: youxia.units,
        source: youxia.source,
      } : null,
    };
  });

  const championCatalog = cdragonChampions.map(champion => {
    const youxia = findYouxiaChampion(champion);
    return {
      apiName: champion.apiName,
      characterName: champion.characterName,
      zhName: champion.name,
      aliases: championAliases[champion.name] || [],
      cost: champion.cost,
      role: champion.role,
      traits: champion.traits.map(displayTraitName),
      cdragonTraits: champion.traits,
      stats: champion.stats,
      ability: champion.ability ? {
        name: champion.ability.name,
        desc: cleanCdragonDesc(champion.ability.desc),
        icon: champion.ability.icon,
        assetUrl: cdragonAssetUrl(champion.ability.icon),
        assetPath: `assets/s17/abilities/${safeName(champion.name)}__${champion.apiName}.png`,
      } : null,
      squareIcon: champion.squareIcon,
      assetUrl: cdragonAssetUrl(champion.squareIcon || champion.icon),
      assetPath: `assets/s17/champions/${safeName(champion.name)}__${champion.apiName}.png`,
      youxia: youxia ? {
        name: youxia.name,
        cost: youxia.cost,
        traits: youxia.traits,
        skillName: youxia.skillName,
        skillText: youxia.skillText,
        source: youxia.source,
      } : null,
    };
  });

  const itemCatalog = cdragonItems.map(item => {
    const zhName = cleanCdragonDesc(item.name) || item.apiName;
    return {
      apiName: item.apiName,
      zhName,
      cdragonZhName: cleanCdragonDesc(item.name) || null,
      desc: cleanCdragonDesc(item.desc),
      composition: item.composition || null,
      from: item.from || [],
      tags: item.tags || [],
      icon: item.icon,
      assetUrl: cdragonAssetUrl(item.icon),
      assetPath: `assets/s17/items/${safeName(zhName)}__${item.apiName}.png`,
      unique: item.unique || false,
    };
  });

  const starGodCatalog = starGods.gods.map(god => {
    const fallbackApi = STAR_GOD_ICON_FALLBACKS[god.championName];
    let fallbackChampion = null;
    if (fallbackApi) {
      for (const set of cdragon.setData) {
        fallbackChampion = (set.champions || []).find(champion => champion.apiName === fallbackApi);
        if (fallbackChampion) break;
      }
    }
    return {
      ...god,
      iconSource: fallbackChampion ? 'CommunityDragon historical TFT champion icon' : 'Youxia article image/manual',
      assetUrl: fallbackChampion ? cdragonAssetUrl(fallbackChampion.squareIcon || fallbackChampion.icon) : null,
      assetPath: fallbackChampion ? `assets/s17/star-gods/${safeName(god.championName)}__${fallbackApi}.png` : null,
    };
  });

  const downloads = [];
  for (const trait of traitCatalog) downloads.push({ url: trait.assetUrl, path: path.join(ROOT, trait.assetPath) });
  for (const champion of championCatalog) {
    downloads.push({ url: champion.assetUrl, path: path.join(ROOT, champion.assetPath) });
    if (champion.ability?.assetUrl) downloads.push({ url: champion.ability.assetUrl, path: path.join(ROOT, champion.ability.assetPath) });
  }
  for (const item of itemCatalog) downloads.push({ url: item.assetUrl, path: path.join(ROOT, item.assetPath) });
  for (const god of starGodCatalog) {
    if (god.assetUrl && god.assetPath) downloads.push({ url: god.assetUrl, path: path.join(ROOT, god.assetPath) });
  }
  starGods.images.forEach((url, index) => {
    downloads.push({
      url,
      path: path.join(OUT_ASSETS, `star-gods/source-image-${String(index + 1).padStart(2, '0')}${path.extname(new URL(url).pathname) || '.jpg'}`),
    });
  });

  await mapLimit(downloads, 12, async item => {
    await downloadBinary(item.url, item.path, failures);
  });

  const s17Audit = buildS17Audit(championCatalog, traitCatalog, itemCatalog, starGodCatalog);
  const report = {
    generatedAt: new Date().toISOString(),
    sources: SOURCES,
    officialAnnouncementSources: officialAnnouncements,
    knownSourceConflicts: KNOWN_SOURCE_CONFLICTS,
    s17AuditSummary: s17Audit.conclusion,
    counts: {
      cdragonChampions: championCatalog.length,
      cdragonTraits: traitCatalog.length,
      cdragonItems: itemCatalog.length,
      youxiaTraits: youxiaTraits.length,
      youxiaChampions: youxiaChampions.length,
      starGods: starGodCatalog.length,
      officialAnnouncements: officialAnnouncements.length,
      downloads: downloads.length,
      failedDownloads: failures.length,
    },
    gaps: {
      missingYouxiaChampionPages: championCatalog
        .filter(champion => !champion.youxia)
        .map(champion => ({
          zhName: champion.zhName,
          apiName: champion.apiName,
          reason: '未在游侠手游棋子大全主列表中匹配到独立页面；技能文本和图片使用 CommunityDragon 兜底。',
        })),
      missingYouxiaTraitPages: traitCatalog
        .filter(trait => !trait.youxia)
        .map(trait => ({
          zhName: trait.zhName,
          apiName: trait.apiName,
          reason: '未在游侠手游羁绊大全主列表中匹配到独立页面；效果和图片使用 CommunityDragon 兜底。',
        })),
      itemsWithoutCdragonZhName: itemCatalog
        .filter(item => !item.cdragonZhName)
        .map(item => ({
          apiName: item.apiName,
          reason: 'CommunityDragon 未提供中文展示名，项目暂用 apiName 兜底。',
        })),
    },
    failures,
  };

  await writeFile(path.join(OUT_DATA, 'traits.zh.json'), JSON.stringify(traitCatalog, null, 2));
  await writeFile(path.join(OUT_DATA, 'champions.zh.json'), JSON.stringify(championCatalog, null, 2));
  await writeFile(path.join(OUT_DATA, 'items.zh.json'), JSON.stringify(itemCatalog, null, 2));
  await writeFile(path.join(OUT_DATA, 'star-gods.zh.json'), JSON.stringify(starGodCatalog, null, 2));
  await writeFile(path.join(OUT_DATA, 'official-announcements.zh.json'), JSON.stringify(officialAnnouncements, null, 2));
  await writeFile(path.join(OUT_DATA, 's17-audit-report.json'), JSON.stringify(s17Audit, null, 2));
  await writeFile(path.join(OUT_DATA, 'source-report.json'), JSON.stringify(report, null, 2));
  await writeFile(path.join(OUT_DATA, 'resource-manifest.json'), JSON.stringify(report, null, 2));

  const summary = [
    '# S17 资源基线',
    '',
    `更新时间：${new Date().toISOString().slice(0, 10)}`,
    '',
    '本目录由 `scripts/fetch-s17-baseline.mjs` 生成，用于避免后续阵容卡、图卡和提示词中出现羁绊、棋子、装备、技能或星神名称错误。',
    '',
    '## 文件',
    '',
    '- `traits.zh.json`：S17 羁绊中文名、效果、棋子和图标路径。',
    '- `champions.zh.json`：S17 棋子中文名、别名、费用、羁绊、技能、技能图标和棋子头像路径。',
    '- `items.zh.json`：S17 装备、消耗品、转职、特殊机制装备和图片路径。',
    '- `star-gods.zh.json`：S17 星神名称、恩赐、阶段奖励和图片路径。',
    '- `official-announcements.zh.json`：TFT 与金铲铲官方公告/官方渠道镜像的校准清单。',
    '- `s17-audit-report.json`：数据是否属于 S17 的审计报告，重点解释装备通用 apiName 和星神兜底头像。',
    '- `source-report.json`：抓取来源、数量和失败下载记录。',
    '- `resource-manifest.json`：资源清单，内容与 `source-report.json` 一致，方便脚本按固定名字读取。',
    '',
    '## 使用规则',
    '',
    '- 写阵容卡前先查本目录，不要临时猜中文名。',
    '- 版本号、赛季机制、热补丁和端内差异优先看官方公告或游戏内公告，再看数据站和攻略页。',
    '- 图卡提示词中的羁绊、装备、棋子名必须来自本目录或明确标注人工复核。',
    '- `CommunityDragon` 作为结构化数据和图片来源；游侠手游作为金铲铲中文名、羁绊和技能页面的中文复核来源。',
    '- 已知中文名冲突必须显式记录。当前 `CommunityDragon` 的 `织命人` 在项目展示中统一写作金铲铲页面的 `织命者`。',
    '- 判断是否属于 S17 时，不能只看 `apiName` 前缀。装备/奖励类资源会复用通用或历史 apiName，应以 Set 17 item 清单和 `s17-audit-report.json` 为准。',
    '- 如果金铲铲端内显示与本目录冲突，以游戏内为准，并更新本目录和 `docs/S17中文翻译对照.md`。',
    '',
    '## 当前数量',
    '',
    `- 棋子：${championCatalog.length}`,
    `- 羁绊：${traitCatalog.length}`,
    `- 装备/物品：${itemCatalog.length}`,
    `- 星神：${starGodCatalog.length}`,
    `- 官方公告/官方渠道镜像：${officialAnnouncements.length}`,
    `- S17 审计：${s17Audit.conclusion}`,
    `- 下载失败：${failures.length}`,
    `- 中文棋子页缺口：${report.gaps.missingYouxiaChampionPages.length} 个，使用结构化数据兜底。`,
    `- 中文羁绊页缺口：${report.gaps.missingYouxiaTraitPages.length} 个，使用结构化数据兜底。`,
    `- 无中文名物品条目：${report.gaps.itemsWithoutCdragonZhName.length} 个，使用 \`apiName\` 兜底。`,
    '',
  ].join('\n');
  await writeFile(path.join(OUT_DATA, 'README.md'), summary);

  const doc = [
    '# S17 资源基线',
    '',
    `更新时间：${new Date().toISOString().slice(0, 10)}`,
    '',
    '本页记录已经抓取到本仓库的 S17 基础资源。后续写阵容卡、生成 GPT Image2 图卡、核对羁绊和装备时，先查这里和 `data/s17/`，不要临时猜中文名或让图像模型自行发挥。',
    '',
    '## 已抓取内容',
    '',
    `- 棋子：${championCatalog.length} 个，含费用、羁绊、技能文本、棋子头像和技能图标。`,
    `- 羁绊：${traitCatalog.length} 个，含中文名、层级效果、关联棋子和羁绊图标。`,
    `- 装备/物品：${itemCatalog.length} 个，含装备、消耗品、特殊装备、说明文本和图标。`,
    `- 星神：${starGodCatalog.length} 个，含恩赐、阶段奖励和本地图片。`,
    `- 官方公告/官方渠道镜像：${officialAnnouncements.length} 条，用于确认版本、赛季机制、热补丁和端内差异。`,
    `- S17 审计结论：${s17Audit.conclusion}`,
    `- 下载失败：${failures.length} 个，详情见 \`data/s17/source-report.json\`。`,
    `- 中文棋子页缺口：${report.gaps.missingYouxiaChampionPages.length} 个，当前为 ${report.gaps.missingYouxiaChampionPages.map(item => item.zhName).join('、') || '无'}。`,
    `- 中文羁绊页缺口：${report.gaps.missingYouxiaTraitPages.length} 个，当前为 ${report.gaps.missingYouxiaTraitPages.map(item => item.zhName).join('、') || '无'}。`,
    `- 无中文名物品条目：${report.gaps.itemsWithoutCdragonZhName.length} 个，已用 \`apiName\` 兜底。`,
    '',
    '## 本地目录',
    '',
    '- `data/s17/champions.zh.json`：棋子与技能结构化数据。',
    '- `data/s17/traits.zh.json`：羁绊结构化数据。',
    '- `data/s17/items.zh.json`：装备和物品结构化数据。',
    '- `data/s17/star-gods.zh.json`：星神结构化数据。',
    '- `data/s17/official-announcements.zh.json`：官方公告与官方渠道镜像清单。',
    '- `data/s17/s17-audit-report.json`：S17 数据审计报告。',
    '- `assets/s17/champions/`：棋子头像。',
    '- `assets/s17/abilities/`：技能图标。',
    '- `assets/s17/traits/`：羁绊图标。',
    '- `assets/s17/items/`：装备和物品图标。',
    '- `assets/s17/star-gods/`：星神图片。',
    '',
    '## 来源优先级',
    '',
    '- 版本号、赛季机制、热补丁、装备轮换和端内差异：优先参考 Riot TFT 官方公告、金铲铲官网、游戏内公告和官方渠道公告。',
    '- 中文展示名、金铲铲羁绊名和技能页面：在官方公告未覆盖到逐个棋子/羁绊详情时，参考游侠手游金铲铲 S17 页面。',
    '- 结构化字段、图标和可批量下载图片：使用 `CommunityDragon` 中文 TFT 数据。',
    '- 如果两者冲突，阵容卡和图卡展示优先使用金铲铲中文名，同时在 `source-report.json` 里保留冲突记录。',
    '',
    '## S17 审计说明',
    '',
    '- 棋子与羁绊：`apiName` 全部为 `TFT17_`，属于 Set 17。',
    '- 羁绊里 `观星者` 有多个 `TFT17_Stargazer_*` 内部变体，写阵容卡时按同一展示名合并理解。',
    '- 装备/物品：来自 `CommunityDragon` 的 Set 17 `items` 清单，但部分 `apiName` 是 `TFT_Item_*`、`TFT_Assist_*` 或旧赛季前缀，属于通用资源复用。',
    '- 星神：星神奖励数据属于 S17；当前星神头像使用历史弈子头像兜底，不等同于官方 S17 星神原画。',
    '',
    '## 已知冲突',
    '',
    '- `CommunityDragon` 写作 `织命人`，金铲铲中文页面写作 `织命者`；项目展示统一使用 `织命者`。',
    '',
    '## 更新命令',
    '',
    '```bash',
    'node scripts/fetch-s17-baseline.mjs',
    '```',
    '',
    '重新抓取后需要检查 `data/s17/source-report.json` 的失败项，并确认阵容卡没有继续引用旧的临时翻译。',
    '',
  ].join('\n');
  await writeFile(path.join(OUT_DOCS, 'S17资源基线.md'), doc);

  console.log(JSON.stringify(report, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
