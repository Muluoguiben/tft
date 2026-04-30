/**
 * 6 机甲龙王详情数据。源：docs/comps/机甲龙王.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 没标精确装备分配；按 .md 行 41-45 装备段写入 boardUnits.items。
 *   - .md 写 "厄加特 / 烬：泰坦的坚决、饮血剑、死亡之刃等多余物理装"，
 *     该套装备同时挂在厄加特和烬上。
 */
export default {
  traits: [
    { id: "mecha",  count: 6, name: "霸天机甲", desc: "三张机甲单位变形后各算 2 个机甲，并且 6 机甲给 +1 人口上限", tiers: [3, 4, 5, 6] },
    { id: "hptank", count: 2, name: "斗士",     desc: "",                                                            tiers: [2, 4, 6] },
    { id: "darkStar", count: 2, name: "暗星",   desc: "",                                                            tiers: [2, 4, 6] },
    { id: "melee",  count: 2, name: "狂战士",   desc: "",                                                            tiers: [2, 4, 6] },
  ],
  // 棋盘 7 单位（变形后 3 个机甲各占 2 格）。.md 行 20-25：
  //   前排 | . . . 超级机甲 . . .
  //   第二 | . . . . . . .
  //   第三 | . 厄加特 茂凯 阿卡丽 . . .
  //   后排 | . 奥瑞利安·索尔 . 卡尔玛 . 烬 .
  boardUnits: [
    { id: "galio",   name: "超级机甲",     cost: 4, star: "★★", row: 1, col: 4, items: ["gargoyle", "bloodthirster", "sterak"] },
    { id: "urgot",   name: "厄加特",       cost: 3, star: "★★", row: 3, col: 2, items: ["titan", "bloodthirster", "deathblade"] },
    { id: "maokai",  name: "茂凯",         cost: 3, star: "★★", row: 3, col: 3 },
    { id: "akali",   name: "阿卡丽",       cost: 2, star: "★★", row: 3, col: 4 },
    { id: "asol",    name: "奥瑞利安·索尔", cost: 4, star: "★★", row: 4, col: 2, items: ["jeweled", "rabadon", "voidStaff"] },
    { id: "karma",   name: "卡尔玛",       cost: 4, star: "★★", row: 4, col: 4 },
    { id: "jhin",    name: "烬",           cost: 5, star: "★",   row: 4, col: 6, items: ["titan", "bloodthirster", "deathblade"] },
  ],
  builds: [
    { title: "超级机甲：石像鬼石板甲、饮血剑、斯特拉克的挑战护手", items: [["gargoyle", "板甲"], ["bloodthirster", "饮血"], ["sterak", "斯特拉克"]] },
    { title: "奥瑞利安·索尔：珠光护手、灭世者的死亡之帽、虚空之杖", items: [["jeweled", "法爆"], ["rabadon", "帽子"], ["voidStaff", "虚空"]] },
    { title: "厄加特 / 烬：泰坦的坚决、饮血剑、死亡之刃等多余物理装", items: [["titan", "泰坦"], ["bloodthirster", "饮血"], ["deathblade", "杀人剑"]] },
  ],
  starGods: [
    ["yasuo",  "亚索",         "格子给机甲或龙王，上限最高"],
    ["kayle",  "凯尔",         "补光明坦装或法装"],
    ["ekko",   "艾克",         "拆装修正机甲和龙王装备"],
    ["ahri",   "阿狸",         "经济好时提速上 9"],
    ["soraka", "索拉卡",       "低血只求锁血止损"],
  ],
  conditions: [
    "开局经济或战力好，能按快 8 节奏打。",
    "有机甲相关强化、战力强化或强经济。",
    "龙王法装和超级机甲坦装至少各两件。",
    "4-2 能上 8 搜到三机甲框架。",
  ],
  risks: [
    "只有 3 机甲，补不出 6 机甲框架。",
    "龙王没法装，超级机甲没坦装。",
    "低血还贪上 9，4 阶段容易掉大分。",
    "4-2 搜不到三机甲主框架，应该转新星九五或重装妖姬。",
  ],
};
