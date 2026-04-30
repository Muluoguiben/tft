/**
 * 机甲 Flex 详情数据。源：docs/comps/机甲Flex.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 12 核心羁绊："霸天机甲、斗士、暗星、狂战士"，未给 count，TBD 注明。
 *   - .md 装备段（行 36-38）三组装备分别落到超级机甲 / 龙王和卡尔玛 / 厄加特和易。
 */
export default {
  traits: [
    { id: "mecha",    count: 3, name: "霸天机甲", desc: "TBD：.md 未给 count，'8 级机甲' 假设 3 机甲", tiers: [3, 4, 5, 6] },
    { id: "hptank",   count: 2, name: "斗士",     desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "darkStar", count: 2, name: "暗星",     desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "melee",    count: 2, name: "狂战士",   desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
  ],
  // 棋盘 9 单位。.md 行 14-19：
  //   前排 | . 塔姆 . 超级机甲 . 茂凯 .
  //   第二 | . . 厄加特 . 易 . 阿卡丽
  //   后排 | . 奥瑞利安·索尔 . . 卡尔玛 . 烬
  boardUnits: [
    { id: "tahm",     name: "塔姆",         cost: 4, star: "★★", row: 1, col: 2 },
    { id: "galio",    name: "超级机甲",     cost: 4, star: "★★", row: 1, col: 4, items: ["gargoyle", "bloodthirster", "sterak"] },
    { id: "maokai",   name: "茂凯",         cost: 3, star: "★★", row: 1, col: 6 },
    { id: "urgot",    name: "厄加特",       cost: 3, star: "★★", row: 2, col: 3, items: ["titan", "bloodthirster", "guinsoo"] },
    { id: "masterYi", name: "易",           cost: 4, star: "★★", row: 2, col: 5, items: ["titan", "bloodthirster", "guinsoo"] },
    { id: "akali",    name: "阿卡丽",       cost: 2, star: "★★", row: 2, col: 7 },
    { id: "asol",     name: "奥瑞利安·索尔", cost: 4, star: "★★", row: 4, col: 2, items: ["jeweled", "rabadon", "shojin"] },
    { id: "karma",    name: "卡尔玛",       cost: 4, star: "★★", row: 4, col: 5, items: ["jeweled", "rabadon", "shojin"] },
    { id: "jhin",     name: "烬",           cost: 5, star: "★",   row: 4, col: 7 },
  ],
  builds: [
    { title: "超级机甲：石像鬼石板甲、饮血剑、斯特拉克的挑战护手", items: [["gargoyle", "板甲"], ["bloodthirster", "饮血"], ["sterak", "斯特拉克"]] },
    { title: "奥瑞利安·索尔 / 卡尔玛：珠光护手、灭世者的死亡之帽、朔极之矛", items: [["jeweled", "法爆"], ["rabadon", "帽子"], ["shojin", "青龙刀"]] },
    { title: "厄加特 / 易：泰坦的坚决、饮血剑、鬼索的狂暴之刃", items: [["titan", "泰坦"], ["bloodthirster", "饮血"], ["guinsoo", "羊刀"]] },
  ],
  starGods: [
    ["yasuo",  "亚索",   "机甲或主 C 格子好时提上限"],
    ["kayle",  "凯尔",   "补光明坦装、法装或物理装"],
    ["ekko",   "艾克",   "拆装，把杂装修成主 C 装"],
    ["soraka", "索拉卡", "低血锁血兜底"],
  ],
  conditions: [
    "8 级机甲牌和四费牌来得多。",
    "法装、物理装、肉装都能有人消化。",
    "需要立刻锁血，不适合继续贪经济。",
    "同行不多，至少一个主 C 能二星。",
  ],
  risks: [
    "把 3 机甲当 6 机甲打，会高估上限。",
    "装备太平均，没有一个主 C 成型。",
    "前排一星，后排再强也启动不了。",
  ],
};
