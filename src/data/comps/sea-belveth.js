/**
 * 海魔大卑详情数据。源：docs/comps/海魔大卑.md。
 *
 * 注意：
 *   - .md 没标 star level；1-4 费默认 ★★，但这是赌阵：
 *     .md 行 41-44 "小 D 补二星"、"4-1 确认主 C"、"不硬追三星"，
 *     语境暗示卑尔维斯目标三星（赌阵主 C），但 .md 没有显式写"三星卑尔维斯"。
 *     保守做法：1-4 费按 ★★，5 费按 ★，不擅自把卑尔维斯改三星。
 *   - .md 行 13 核心羁绊："海魔人、新星特攻队、狂战士、游侠"，未给 count。
 *     "游侠" 在 src/data/assets.js traits 表里没有对应 id；fallback 到 ranged(狙神)。
 *   - .md 没有 ## 星神选择 段，starGods 留空数组。
 *   - .md 装备段（行 36-38）三组装备分别落到卑尔维斯 / 阿卡丽 / 雷克塞和茂凯。
 */
export default {
  traits: [
    { id: "primordian", count: 2, name: "海魔人",     desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "drx",        count: 3, name: "新星特攻队", desc: "TBD：.md 未给 count，按棋盘三个新星单位", tiers: [3, 5, 7, 9] },
    { id: "melee",      count: 2, name: "狂战士",     desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    // "游侠" 未在 traits 映射表，fallback 到 ranged(狙神)
    { id: "ranged",     count: 2, name: "游侠",       desc: "TBD：游侠 trait id 未确认，fallback 到 ranged(狙神)", tiers: [2, 4, 6] },
  ],
  // 棋盘 8 单位。.md 行 14-19：
  //   前排 | . 雷克塞 . 亚托克斯 . 茂凯 .
  //   第二 | . 贝蕾亚 . 卑尔维斯 . 阿卡丽 .
  //   后排 | 凯特琳 . . . . 千珏 .
  boardUnits: [
    { id: "reksai",  name: "雷克塞",   cost: 2, star: "★★", row: 1, col: 2, items: ["sunfire", "gargoyle", "warmog"] },
    { id: "aatrox",  name: "亚托克斯", cost: 1, star: "★★", row: 1, col: 4 },
    { id: "maokai",  name: "茂凯",     cost: 3, star: "★★", row: 1, col: 6, items: ["sunfire", "gargoyle", "warmog"] },
    { id: "briar",   name: "贝蕾亚",   cost: 3, star: "★★", row: 2, col: 2 },
    { id: "belveth", name: "卑尔维斯", cost: 4, star: "★★", row: 2, col: 4, items: ["runaan", "qss", "giantSlayer"] },
    { id: "akali",   name: "阿卡丽",   cost: 2, star: "★★", row: 2, col: 6, items: ["hoj", "nightEdge", "infinity"] },
    { id: "caitlyn", name: "凯特琳",   cost: 1, star: "★★", row: 4, col: 1 },
    { id: "kindred", name: "千珏",     cost: 4, star: "★★", row: 4, col: 6 },
  ],
  builds: [
    { title: "卑尔维斯：海妖之怒、水银、巨人杀手", items: [["runaan", "海妖"], ["qss", "水银"], ["giantSlayer", "巨杀"]] },
    { title: "阿卡丽：正义之手、夜之锋刃、无尽之刃", items: [["hoj", "正义"], ["nightEdge", "夜刃"], ["infinity", "无尽"]] },
    { title: "雷克塞 / 茂凯：日炎斗篷、石像鬼石板甲、狂徒铠甲", items: [["sunfire", "日炎"], ["gargoyle", "板甲"], ["warmog", "狂徒"]] },
  ],
  // .md 没有星神段，留空数组。
  starGods: [],
  conditions: [
    "2 阶段海魔或新星牌特别胡。",
    "卑尔维斯装备能直接成型。",
    "同行少，核心对子多。",
    "3-2 小 D 能补出二星质量。",
  ],
  risks: [
    "开局不胡还硬赌，经济会炸。",
    "装备不对，卑尔维斯无法收割。",
    "同行多时追三星置信度很低。",
  ],
};
