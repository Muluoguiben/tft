/**
 * 木灵飞机详情数据。源：docs/comps/木灵飞机.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 13 核心羁绊："木灵族、堡垒卫士、旅人、织命者"，未给 count。
 *     "织命者" 在 src/data/assets.js traits 表里没有对应 id；TBD 暂用 flex 占位。
 *   - .md 没有 ## 星神选择 段，starGods 留空数组。
 *   - .md 装备段（行 36-38）三组装备分别落到库奇 / 拉莫斯 / 锐雯。
 */
export default {
  traits: [
    { id: "meeple",  count: 3, name: "木灵族",   desc: "TBD：.md 未给 count，按 '3 木灵' 取 3", tiers: [3, 5, 7, 9] },
    { id: "bastion", count: 2, name: "堡垒卫士", desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "flex",    count: 2, name: "旅人",     desc: "TBD：.md 未给 count", tiers: [2] },
    // "织命者" 未在 traits 映射表，TBD：临时复用 flex
    { id: "flex",    count: 2, name: "织命者",   desc: "TBD：织命者 trait id 未确认，临时复用 flex 资源", tiers: [2] },
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
  // .md 没有星神段，留空数组。
  starGods: [],
  conditions: [
    "3 木灵或木灵牌自然来得多。",
    "有经济强化或连胜开局，能按快 8 节奏打。",
    "库奇和拉莫斯装备至少各两件。",
    "同行少，4-2 能搜到四费二星。",
  ],
  risks: [
    "没有木灵底座时不要强玩。",
    "库奇没启动装，伤害不够锁血。",
    "拉莫斯一星或无肉装，前排会塌。",
  ],
};
