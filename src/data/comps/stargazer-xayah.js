/**
 * 观星霞详情数据。源：docs/comps/观星霞.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 21 核心羁绊："3 观星者、2 狙神、重装前排、神谕功能"。
 *     "重装前排" 写法接近 shieldTank 重装战士，count 未指定，TBD 注明。
 *     "神谕功能" 同理 count 未指定。
 *   - .md 装备段（行 41-43）三组装备分别落到霞 / 努努 / 烬。
 */
export default {
  traits: [
    { id: "stargazer",  count: 3, name: "观星者", desc: "", tiers: [3, 5] },
    { id: "ranged",     count: 2, name: "狙神",   desc: "", tiers: [2, 4, 6] },
    // .md 写"重装前排"，count 未指定；TBD 暂填 2
    { id: "shieldTank", count: 2, name: "重装战士", desc: "TBD：.md 写'重装前排'未给 count", tiers: [2, 4, 6] },
    // .md 写"神谕功能"，count 未指定；TBD 暂填 2
    { id: "mana",       count: 2, name: "神谕",   desc: "TBD：.md 写'神谕功能'未给 count", tiers: [2, 4, 6] },
  ],
  // 棋盘 9 单位。.md 行 18-23：
  //   前排 | . 蕾欧娜 莫德凯撒 努努 . 慎 .
  //   第二 | . 潘森 . . . . .
  //   后排 | 璐璐 . 霞 . . 烬 巴德
  boardUnits: [
    { id: "leona",       name: "蕾欧娜",       cost: 1, star: "★★", row: 1, col: 2 },
    { id: "mordekaiser", name: "莫德凯撒",     cost: 2, star: "★★", row: 1, col: 3 },
    { id: "nunu",        name: "努努和威朗普", cost: 4, star: "★★", row: 1, col: 4, items: ["warmog", "crownguard", "adaptive"] },
    { id: "shen",        name: "慎",           cost: 5, star: "★",   row: 1, col: 6 },
    { id: "pantheon",    name: "潘森",         cost: 2, star: "★★", row: 2, col: 2 },
    { id: "lulu",        name: "璐璐",         cost: 3, star: "★★", row: 4, col: 1 },
    { id: "xayah",       name: "霞",           cost: 4, star: "★★", row: 4, col: 3, items: ["guinsoo", "infinity", "lastWhisper"] },
    { id: "jhin",        name: "烬",           cost: 5, star: "★",   row: 4, col: 6, items: ["deathblade", "giantSlayer", "nightEdge"] },
    { id: "bard",        name: "巴德",         cost: 5, star: "★",   row: 4, col: 7 },
  ],
  builds: [
    { title: "霞：鬼索的狂暴之刃、无尽之刃、最后的轻语", items: [["guinsoo", "羊刀"], ["infinity", "无尽"], ["lastWhisper", "轻语"]] },
    { title: "努努：狂徒铠甲、冕卫、适应性头盔", items: [["warmog", "狂徒"], ["crownguard", "冕卫"], ["adaptive", "适应性"]] },
    { title: "烬：死亡之刃、巨人杀手、夜之锋刃等多余物理装", items: [["deathblade", "杀人剑"], ["giantSlayer", "巨杀"], ["nightEdge", "夜刃"]] },
  ],
  starGods: [
    ["ahri",   "阿狸",         "经济好时速 9 补烬和五费"],
    ["asol",   "奥瑞利安·索尔", "高血任务局冲上限"],
    ["kayle",  "凯尔",         "补物理成装最直接"],
    ["yasuo",  "亚索",         "格子适合霞或努努才选"],
    ["soraka", "索拉卡",       "低血止损保前四"],
  ],
  conditions: [
    "2-1 观星效果强，且格子不逼霞站危险位。",
    "反曲弓、大剑、拳套多，霞装备能成型。",
    "4-2 能上 8 搜霞和努努质量。",
    "霞、努努同行少，有机会上 9 补烬。",
    "当前 17.2 数据和梯度都支持作为冲冠军物理主线，但必须保证破甲或重前排处理能力。",
  ],
  risks: [
    "观星效果差。",
    "霞没轻语或破甲，对重前排会刮痧。",
    "霞和烬同侧被切，后排会一起蒸发。",
    "4 阶段血量低且搜不到霞、努努质量。",
    "同桌 2 家以上抢霞且你不是最胡，直接转新星九五或海魔大卑。",
  ],
};
