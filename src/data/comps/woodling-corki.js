/**
 * 木灵飞机详情数据。源：docs/comps/木灵飞机.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 13 核心羁绊："木灵族、堡垒卫士、旅人、织命者"，未给 count。
 *   - .md 装备段（行 36-38）三组装备分别落到库奇 / 拉莫斯 / 锐雯。
 */
export default {
  traits: [
    { id: "meeple",  count: 3, name: "木灵族",   desc: "TBD：.md 未给 count，按 '3 木灵' 取 3", tiers: [3, 5, 7, 9] },
    { id: "bastion", count: 2, name: "堡垒卫士", desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "flex",    count: 2, name: "旅人",     desc: "TBD：.md 未给 count", tiers: [2] },
    { id: "fateweaver", count: 2, name: "织命者", desc: "TBD：.md 未给 count", tiers: [2, 4] },
  ],
  // 棋盘 9 单位。.md 行 14-19：
  //   前排 | 波比 . 拉莫斯 . 小木灵 . 菲兹
  //   第二 | . . 锐雯 . 纳尔 . .
  //   后排 | 库奇 . . 巴德 . . 米利欧
  boardUnits: [
    { id: "poppy",  name: "波比",   cost: 1, star: "★★", row: 1, col: 1 },
    { id: "rammus", name: "拉莫斯", cost: 4, star: "★★", row: 1, col: 3, items: ["crownguard", "sunfire", "gargoyle"] },
    { id: "ivern",  name: "小木灵", cost: 2, star: "★★", row: 1, col: 5 },
    { id: "fizz",   name: "菲兹",   cost: 3, star: "★★", row: 1, col: 7 },
    { id: "riven",  name: "锐雯",   cost: 4, star: "★★", row: 2, col: 3, items: ["bloodthirster", "titan", "lastWhisper"] },
    { id: "gnar",   name: "纳尔",   cost: 3, star: "★★", row: 2, col: 5 },
    { id: "corki",  name: "库奇",   cost: 4, star: "★★", row: 4, col: 1, items: ["jeweled", "infinity", "hoj"] },
    { id: "bard",   name: "巴德",   cost: 5, star: "★",   row: 4, col: 4 },
    { id: "milio",  name: "米利欧", cost: 2, star: "★★", row: 4, col: 7 },
  ],
  builds: [
    { title: "库奇：珠光护手、无尽之刃、正义之手", items: [["jeweled", "法爆"], ["infinity", "无尽"], ["hoj", "正义"]] },
    { title: "拉莫斯：冕卫、日炎斗篷、石像鬼石板甲", items: [["crownguard", "冕卫"], ["sunfire", "日炎"], ["gargoyle", "板甲"]] },
    { title: "锐雯：饮血剑、泰坦的坚决、最后的轻语", items: [["bloodthirster", "饮血"], ["titan", "泰坦"], ["lastWhisper", "轻语"]] },
  ],
  starGods: [
    ["varus",  "韦鲁斯", "木灵核心和四费质量都吃星级，胡牌局收益高"],
    ["kayle",  "凯尔",   "补库奇输出装或拉莫斯坦装，立刻提战力"],
    ["ekko",   "艾克",   "拆装修正库奇、拉莫斯、锐雯的装备分配"],
    ["ahri",   "阿狸",   "高血高经济时上 9 补高费功能"],
    ["soraka", "索拉卡", "低血止损，不继续贪四费三星"],
  ],
  conditions: [
    "3 木灵或木灵牌自然来得多，并且有经济强化或连胜开局。",
    "能按快 8 节奏打，4-2 有钱搜库奇和拉莫斯。",
    "库奇和拉莫斯装备至少各两件，不为了完美装拖战力。",
    "TFTFlow 条件线给得高，但 OP.GG 当前同名数据偏弱；只在牌、装备、强化同时满足时玩。",
    "同行少，4-2 能搜到库奇 / 拉莫斯二星或接近二星。",
  ],
  risks: [
    "没有木灵底座时不要强玩。",
    "库奇没启动装，伤害不够锁血。",
    "拉莫斯一星或无肉装，前排会塌。",
    "如果 4-2 搜不到框架，优先转机甲 Flex、妖姬卡尔玛或新星九五。",
  ],
};
