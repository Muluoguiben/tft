/**
 * 新星九五详情数据。源：docs/comps/新星九五.md。
 * Tier OP / Rating A / Primary graves。
 *
 * 注意：
 *   - .md 没有标注每个棋子的 star level；boardUnits 里的 star 按 lvl 9
 *     典型场况设：1-4 费 ★★，5 费 ★（除主 C 假设上二星）。
 *   - 装备段（.md 行 41-43）只列出每个 carry 的 3 件套，没列出主坦"塔姆/慎"具体哪 3 件，
 *     用户原文给的是"石像鬼石板甲、狂徒铠甲、适应性头盔、冕卫、日炎斗篷"5 选 3 通用肉装。
 */
export default {
  traits: [
    { id: "drx",     count: 5, name: "新星特攻队", desc: "凯特琳 + 阿卡丽 + 千珏 + 格雷福斯 + 薇古丝", tiers: [3, 5, 7, 9] },
    { id: "bastion", count: 2, name: "堡垒卫士",   desc: "亚托克斯 + 慎",                              tiers: [2, 4, 6] },
    { id: "hptank",  count: 2, name: "斗士",       desc: "茂凯 + 塔姆",                                tiers: [2, 4, 6] },
  ],
  // 棋盘 9 单位，level 9。.md 行 18-23 ASCII 棋盘：
  //   前排 | 亚托克斯 . 茂凯 塔姆 . 慎 .
  //   第二 | . 阿卡丽 . . . . .
  //   第三 | . . . . . . .
  //   后排 | 凯特琳 千珏 . 格雷福斯 . 薇古丝 .
  boardUnits: [
    { id: "aatrox",  name: "亚托克斯", cost: 1, star: "★★", row: 1, col: 1 },
    { id: "maokai",  name: "茂凯",     cost: 3, star: "★★", row: 1, col: 3 },
    { id: "tahm",    name: "塔姆",     cost: 4, star: "★★", row: 1, col: 4, items: ["gargoyle", "warmog", "adaptive"] },
    { id: "shen",    name: "慎",       cost: 5, star: "★",   row: 1, col: 6 },
    { id: "akali",   name: "阿卡丽",   cost: 2, star: "★★", row: 2, col: 2 },
    { id: "caitlyn", name: "凯特琳",   cost: 1, star: "★★", row: 4, col: 1 },
    { id: "kindred", name: "千珏",     cost: 4, star: "★★", row: 4, col: 2 },
    { id: "graves",  name: "格雷福斯", cost: 5, star: "★★", row: 4, col: 4, items: ["qss", "giantSlayer", "sterak"] },
    { id: "vex",     name: "薇古丝",   cost: 5, star: "★",   row: 4, col: 6, items: ["guinsoo", "jeweled", "gunblade"] },
  ],
  builds: [
    { title: "格雷福斯：水银 + 巨人杀手 + 斯特拉克", items: [["qss", "水银"], ["giantSlayer", "巨人杀手"], ["sterak", "斯特拉克"]] },
    { title: "薇古丝：羊刀 + 法爆 + 科技枪",         items: [["guinsoo", "羊刀"], ["jeweled", "法爆"], ["gunblade", "科技枪"]] },
    { title: "塔姆 / 慎：通用肉装 5 选 3",           items: [["gargoyle", "板甲"], ["warmog", "狂徒"], ["adaptive", "适应性"], ["crownguard", "冕卫"], ["sunfire", "日炎"]] },
  ],
  starGods: [
    ["ahri",   "阿狸",         "高血经济局速 9"],
    ["asol",   "奥瑞利安·索尔", "优势任务局冲 9/10 上限"],
    ["ekko",   "艾克",         "拆装、突变，修正装备分配"],
    ["kayle",  "凯尔",         "补光明装，补终盘爆发"],
    ["soraka", "索拉卡",       "低血止损，不再贪九五"],
  ],
  conditions: [
    "2 阶段能连胜或血量、经济明显领先。",
    "AD/AP 装都能消化，前排有二星质量。",
    "4-2 上 8 后能稳住，随后有钱上 9。",
    "同行抢高费少，五费来牌能自然转换。",
    "这是优势局上限线，不是低血局强行贪九五。",
  ],
  risks: [
    "低血还想贪 9。",
    "前排不二星，五费输出没有启动时间。",
    "装备太散，格雷福斯和薇古丝都缺核心装。",
    "4-2 搜完仍不能锁血，应该转重装妖姬或机甲龙王。",
  ],
};
