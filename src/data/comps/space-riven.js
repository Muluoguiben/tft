/**
 * 太空律动转详情数据。源：docs/comps/太空律动转.md。
 *
 * 注意：
 *   - .md 没标 star level；按默认规则：1-4 费 ★★，5 费 ★。
 *   - .md 行 12 核心羁绊："太空律动、堡垒卫士、狂战士、神谕"，未给 count；
 *     全部 TBD 注明，count 暂填默认值 2。
 *   - .md 没有 ## 星神选择 段，starGods 留空数组。
 *   - .md 装备段（行 36-38）三组装备分别落到锐雯 / 易 / 塔姆和慎。
 */
export default {
  traits: [
    { id: "space",    count: 2, name: "太空律动", desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "bastion",  count: 2, name: "堡垒卫士", desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "melee",    count: 2, name: "狂战士",   desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
    { id: "mana",     count: 2, name: "神谕",     desc: "TBD：.md 未给 count", tiers: [2, 4, 6] },
  ],
  // 棋盘 9 单位。.md 行 14-19：
  //   前排 | . 塔姆 . 慎 . 菲兹 .
  //   第二 | . . 锐雯 . 易 . 拉亚斯特
  //   后排 | 米利欧 . . 卡尔玛 . . 巴德
  boardUnits: [
    { id: "tahm",     name: "塔姆",     cost: 4, star: "★★", row: 1, col: 2, items: ["gargoyle", "warmog", "crownguard"] },
    { id: "shen",     name: "慎",       cost: 5, star: "★",   row: 1, col: 4, items: ["gargoyle", "warmog", "crownguard"] },
    { id: "fizz",     name: "菲兹",     cost: 3, star: "★★", row: 1, col: 6 },
    { id: "riven",    name: "锐雯",     cost: 4, star: "★★", row: 2, col: 3, items: ["bloodthirster", "titan", "infinity"] },
    { id: "masterYi", name: "易",       cost: 4, star: "★★", row: 2, col: 5, items: ["guinsoo", "qss", "giantSlayer"] },
    { id: "kayn",     name: "拉亚斯特", cost: 3, star: "★★", row: 2, col: 7 },
    { id: "milio",    name: "米利欧",   cost: 2, star: "★★", row: 4, col: 1 },
    { id: "karma",    name: "卡尔玛",   cost: 4, star: "★★", row: 4, col: 4 },
    { id: "bard",     name: "巴德",     cost: 5, star: "★",   row: 4, col: 7 },
  ],
  builds: [
    { title: "锐雯：饮血剑、泰坦的坚决、无尽之刃", items: [["bloodthirster", "饮血"], ["titan", "泰坦"], ["infinity", "无尽"]] },
    { title: "易：鬼索的狂暴之刃、水银、巨人杀手", items: [["guinsoo", "羊刀"], ["qss", "水银"], ["giantSlayer", "巨杀"]] },
    { title: "塔姆 / 慎：石像鬼石板甲、狂徒铠甲、冕卫", items: [["gargoyle", "板甲"], ["warmog", "狂徒"], ["crownguard", "冕卫"]] },
  ],
  // .md 没有星神段，留空数组。
  starGods: [],
  conditions: [
    "有太空律动转或明确转职路径。",
    "锐雯装备至少两件，易能吃副 C 装。",
    "前排慎、塔姆或菲兹来得早。",
    "四费核心同行少，4-2 能搜到二星。",
  ],
  risks: [
    "无转职时不要硬玩。",
    "锐雯一星且无续航，4 阶段容易掉大血。",
    "战士站位过前，被集火秒掉。",
  ],
};
