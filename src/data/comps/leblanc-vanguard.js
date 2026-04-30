/**
 * 重装妖姬详情数据。源：docs/comps/重装妖姬.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 18 列出"4 重装战士、3 法官、3 牧羊人、2 神谕"。
 *   - .md 装备段（行 42-44）只列出三组装备，棋盘上对应单位写到 items。
 */
export default {
  traits: [
    { id: "shieldTank", count: 4, name: "重装战士", desc: "", tiers: [2, 4, 6] },
    { id: "arbiter",    count: 3, name: "法官",     desc: "", tiers: [3] },
    { id: "summon",     count: 3, name: "牧羊人",   desc: "", tiers: [3] },
    { id: "mana",       count: 2, name: "神谕",     desc: "", tiers: [2, 4, 6] },
  ],
  // 棋盘 8 单位。.md 行 19-24：
  //   前排 | . 蕾欧娜 莫德凯撒 俄洛伊 小木灵 努努 .
  //   后排 | 佐伊 . . 乐芙兰 . 卡尔玛 .
  boardUnits: [
    { id: "leona",       name: "蕾欧娜",       cost: 1, star: "★★", row: 1, col: 2 },
    { id: "mordekaiser", name: "莫德凯撒",     cost: 2, star: "★★", row: 1, col: 3 },
    { id: "illaoi",      name: "俄洛伊",       cost: 3, star: "★★", row: 1, col: 4, items: ["gargoyle", "warmog", "ionic"] },
    { id: "ivern",       name: "小木灵",       cost: 2, star: "★★", row: 1, col: 5 },
    { id: "nunu",        name: "努努和威朗普", cost: 4, star: "★★", row: 1, col: 6, items: ["gargoyle", "warmog", "ionic"] },
    { id: "zoe",         name: "佐伊",         cost: 2, star: "★★", row: 4, col: 1 },
    { id: "leblanc",     name: "乐芙兰",       cost: 4, star: "★★", row: 4, col: 4, items: ["guinsoo", "jeweled", "archangel"] },
    { id: "karma",       name: "卡尔玛",       cost: 4, star: "★★", row: 4, col: 6, items: ["shojin", "voidStaff", "jeweled"] },
  ],
  builds: [
    { title: "乐芙兰：鬼索的狂暴之刃、珠光护手、大天使之杖", items: [["guinsoo", "羊刀"], ["jeweled", "法爆"], ["archangel", "大天使"]] },
    { title: "卡尔玛：朔极之矛、虚空之杖、珠光护手", items: [["shojin", "青龙刀"], ["voidStaff", "虚空"], ["jeweled", "法爆"]] },
    { title: "俄洛伊 / 努努：石像鬼石板甲、狂徒铠甲、离子火花", items: [["gargoyle", "板甲"], ["warmog", "狂徒"], ["ionic", "离子"]] },
  ],
  starGods: [
    ["varus",  "韦鲁斯", "找四费二星和整体星级"],
    ["kayle",  "凯尔",   "补 AP 成装，提升启动"],
    ["ekko",   "艾克",   "拆装修正乐芙兰和卡尔玛装备"],
    ["ahri",   "阿狸",   "高血经济局上 9 补五费"],
    ["soraka", "索拉卡", "低血补容错"],
  ],
  conditions: [
    "法系装多，能早做羊刀、法爆或青龙刀。",
    "4-2 有足够金币上 8 大搜。",
    "重装牌来得顺，前排能二星。",
    "乐芙兰和卡尔玛同行少。",
    "当前多来源对同名阵容评价分歧较大，比赛里更适合作为 AP 装兜底线。",
  ],
  risks: [
    "无 AP 装或前排不成。",
    "4-2 搜不到乐芙兰二星且血量低。",
    "乐芙兰、卡尔玛被多人卡。",
    "后排站位被切入或范围控制针对。",
    "如果 OP.GG 同名数据继续偏低，不把它作为主练阵容。",
  ],
};
