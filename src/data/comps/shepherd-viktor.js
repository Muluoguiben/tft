/**
 * 牧羊维克托详情数据。源：docs/comps/牧羊维克托.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 装备段（行 41-43）三组装备分别落到维克托 / 俄洛伊 / 娜美。
 */
export default {
  traits: [
    { id: "summon",     count: 3, name: "牧羊人",   desc: "", tiers: [3] },
    { id: "mana",       count: 3, name: "神谕",     desc: "", tiers: [2, 4, 6] },
    { id: "psyops",     count: 2, name: "灵能特工", desc: "", tiers: [2, 4, 6] },
    { id: "magician",   count: 2, name: "魔术师",   desc: "", tiers: [2, 4, 6] },
    { id: "shieldTank", count: 2, name: "重装战士", desc: "", tiers: [2, 4, 6] },
  ],
  // 棋盘 9 单位。.md 行 18-23：
  //   前排 | . 莫德凯撒 小木灵 俄洛伊 . 拉亚斯特 .
  //   第二 | . . . . . 派克 .
  //   后排 | 丽桑卓 . 维克托 . 娜美 . 巴德
  boardUnits: [
    { id: "mordekaiser", name: "莫德凯撒", cost: 2, star: "★★", row: 1, col: 2 },
    { id: "ivern",       name: "小木灵",   cost: 2, star: "★★", row: 1, col: 3 },
    { id: "illaoi",      name: "俄洛伊",   cost: 3, star: "★★", row: 1, col: 4, items: ["gargoyle", "warmog", "ionic"] },
    { id: "kayn",        name: "拉亚斯特", cost: 3, star: "★★", row: 1, col: 6 },
    { id: "pyke",        name: "派克",     cost: 2, star: "★★", row: 2, col: 6 },
    { id: "lissandra",   name: "丽桑卓",   cost: 1, star: "★★", row: 4, col: 1 },
    { id: "viktor",      name: "维克托",   cost: 3, star: "★★", row: 4, col: 3, items: ["jeweled", "archangel", "rabadon"] },
    { id: "nami",        name: "娜美",     cost: 4, star: "★★", row: 4, col: 5, items: ["voidStaff", "shojin", "jeweled"] },
    { id: "bard",        name: "巴德",     cost: 5, star: "★",   row: 4, col: 7 },
  ],
  builds: [
    { title: "维克托：珠光护手、大天使之杖、灭世者的死亡之帽", items: [["jeweled", "法爆"], ["archangel", "大天使"], ["rabadon", "帽子"]] },
    { title: "俄洛伊：石像鬼石板甲、狂徒铠甲、离子火花", items: [["gargoyle", "板甲"], ["warmog", "狂徒"], ["ionic", "离子"]] },
    { title: "娜美：虚空之杖、朔极之矛、珠光护手", items: [["voidStaff", "虚空"], ["shojin", "青龙刀"], ["jeweled", "法爆"]] },
  ],
  starGods: [
    ["varus",  "韦鲁斯", "最适合追星级和复制质量"],
    ["kayle",  "凯尔",   "补法装或前排装"],
    ["ekko",   "艾克",   "无人机、拆装，修正装备"],
    ["yasuo",  "亚索",   "格子好再选，别牺牲站位"],
    ["soraka", "索拉卡", "低血保容错"],
  ],
  conditions: [
    "AP 输出装多，维克托装备能直接成型。",
    "前排俄洛伊或莫德凯撒来得早。",
    "同行少，4-2 能搜到维克托二星。",
    "有灵能、无人机或装备类条件再提高优先级。",
  ],
  risks: [
    "无维克托、无 AP 输出装。",
    "前排弱，维克托放不出第二轮技能。",
    "同行卡维克托或俄洛伊。",
    "4-2 低血大搜后仍锁不住。",
  ],
};
