/**
 * 幻灵阿萝拉详情数据。源：docs/comps/幻灵阿萝拉.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 13 核心羁绊："幻灵战队、重装战士、牧羊人、法官"，未给 count。
 *     "法官" 在 src/data/assets.js traits 表里没有对应 id；TBD 复用 mana 占位。
 *   - .md 行 36 阿萝拉装备 "炽烈短弓" 在 items 映射表里没有对应 id；
 *     按用户指引 fallback 到 sterak（站点渲染时的 fallback 短名）。
 *   - .md 没有 ## 星神选择 段，starGods 留空数组。
 *   - .md 装备段（行 36-38）三组装备分别落到阿萝拉 / 俄洛伊 / 黛安娜。
 */
export default {
  traits: [
    { id: "anima",      count: 3, name: "幻灵战队", desc: "TBD：.md 未给 count，按 '3 幻灵' 取 3", tiers: [3, 5, 7] },
    { id: "shieldTank", count: 2, name: "重装战士", desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "summon",     count: 2, name: "牧羊人",   desc: "TBD：.md 未给 count", tiers: [3] },
    // "法官" 未在 traits 映射表，TBD：临时复用 mana
    { id: "mana",       count: 2, name: "法官",     desc: "TBD：法官 trait id 未确认，临时复用 mana 资源", tiers: [3] },
  ],
  // 棋盘 8 单位。.md 行 14-19：
  //   前排 | . 蕾欧娜 小木灵 俄洛伊 . 努努 .
  //   第二 | . . . . 黛安娜 . .
  //   后排 | 金克丝 . . 阿萝拉 . 乐芙兰 .
  boardUnits: [
    { id: "leona",   name: "蕾欧娜",       cost: 1, star: "★★", row: 1, col: 2 },
    { id: "ivern",   name: "小木灵",       cost: 2, star: "★★", row: 1, col: 3 },
    { id: "illaoi",  name: "俄洛伊",       cost: 3, star: "★★", row: 1, col: 4, items: ["gargoyle", "redemption", "warmog"] },
    { id: "nunu",    name: "努努和威朗普", cost: 4, star: "★★", row: 1, col: 6 },
    // 炽烈短弓 → fallback 到 sterak（站点 fallback 行为，详见 nova-95.js"血手"处理）
    { id: "diana",   name: "黛安娜",       cost: 3, star: "★★", row: 2, col: 5, items: ["bloodthirster", "titan", "crownguard"] },
    { id: "jinx",    name: "金克丝",       cost: 2, star: "★★", row: 4, col: 1 },
    { id: "aurora",  name: "阿萝拉",       cost: 4, star: "★★", row: 4, col: 4, items: ["jeweled", "nashor", "sterak"] },
    { id: "leblanc", name: "乐芙兰",       cost: 4, star: "★★", row: 4, col: 6 },
  ],
  builds: [
    // 炽烈短弓 没有 PNG 资源，列表里写 sterak 短名"炽烈短弓"以保留原文
    { title: "阿萝拉：珠光护手、纳什之牙、炽烈短弓", items: [["jeweled", "法爆"], ["nashor", "纳什"], ["sterak", "炽烈短弓"]] },
    { title: "俄洛伊：石像鬼石板甲、振奋盔甲、狂徒铠甲", items: [["gargoyle", "板甲"], ["redemption", "救赎"], ["warmog", "狂徒"]] },
    { title: "黛安娜：饮血剑、泰坦的坚决、冕卫", items: [["bloodthirster", "饮血"], ["titan", "泰坦"], ["crownguard", "冕卫"]] },
  ],
  // .md 没有星神段，留空数组。
  starGods: [],
  conditions: [
    "开局 3 幻灵或 3-2 前明确连败条件。",
    "阿萝拉装备能成型，前排有二星。",
    "能判断收菜节点，不继续贪。",
    "需要冲上限，而不是普通保分局。",
  ],
  risks: [
    "普通积分局不要硬玩，容易第七第八。",
    "收菜阈值判断错，血量直接崩。",
    "阿萝拉没装备，收菜后也锁不住。",
  ],
};
