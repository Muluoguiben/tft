/**
 * 木灵小法师详情数据。抽自 site.js 行 409-452 的 woodlingDetail。
 *
 * 结构约定（其他 10 套阵容也按此模板补齐）：
 *   - traits:     5 个激活羁绊 + tiers 阈值
 *   - boardUnits: 棋盘 row/col 1-indexed，row 1 是前排，row 4 是后排
 *   - builds:     主 C / 副 C / 主坦的装备组合
 *   - starGods:   星神优先级，[id, 中文名, 备注]
 *   - conditions: 适玩条件
 *   - risks:      放弃 / 转线条件
 *
 * 注意：boardUnits 的 (row, col) 跟 site.js cellPosition() 配合，
 * 偶数行 (row 2, 4) 右偏移半个 cell。详见 docs/comps/木灵小法师.md 第 109-114 行棋盘。
 */
export default {
  traits: [
    { id: "meeple",   count: 7, name: "木灵族",     desc: "主羁绊，克隆格做三星小法", tiers: [3, 5, 7, 9] },
    { id: "magician", count: 2, name: "魔术师",     desc: "小法 + 丽桑卓",             tiers: [2, 4, 6] },
    { id: "darkStar", count: 2, name: "暗星",       desc: "丽桑卓 + 卡尔玛",           tiers: [2, 4, 6] },
    { id: "flex",     count: 2, name: "旅人",       desc: "小木灵 + 卡尔玛",           tiers: [2] },
    { id: "bastion",  count: 2, name: "堡垒卫士",   desc: "波比 + 拉莫斯",             tiers: [2, 4, 6] },
  ],
  boardUnits: [
    { id: "poppy",     name: "波比",     cost: 1, star: "★★",   row: 1, col: 1 },
    { id: "ivern",     name: "小木灵",   cost: 2, star: "★",     row: 1, col: 3 },
    { id: "rammus",    name: "拉莫斯",   cost: 4, star: "★★",   row: 1, col: 5, items: ["sunfire", "bramble", "ionic"] },
    { id: "fizz",      name: "菲兹",     cost: 3, star: "★★",   row: 1, col: 7 },
    { id: "lissandra", name: "丽桑卓",   cost: 1, star: "★★",   row: 4, col: 1 },
    { id: "corki",     name: "库奇",     cost: 4, star: "★★",   row: 4, col: 2, items: ["lastWhisper", "deathblade", "guardbreaker"] },
    { id: "veigar",    name: "小法",     cost: 1, star: "三星", row: 4, col: 4, items: ["nashor", "jeweled", "shojin"] },
    { id: "karma",     name: "卡尔玛",   cost: 4, star: "★",     row: 4, col: 6 },
    { id: "bard",      name: "巴德",     cost: 5, star: "★",     row: 4, col: 7 },
  ],
  builds: [
    { title: "小法：纳什 + 法爆 + 青龙刀", items: [["nashor", "纳什"], ["jeweled", "法爆"], ["shojin", "青龙刀"]] },
    { title: "库奇：轻语 + 杀人剑 + 破防", items: [["lastWhisper", "轻语"], ["deathblade", "杀人剑"], ["guardbreaker", "破防者"]] },
    { title: "拉莫斯：日炎 + 反甲 + 离子", items: [["sunfire", "日炎"], ["bramble", "反甲"], ["ionic", "离子"]] },
  ],
  starGods: [
    ["varus",  "韦鲁斯", "首选：三星 / 复制器"],
    ["kayle",  "凯尔",   "补装备，抬上限"],
    ["yasuo",  "亚索",   "格子好才选"],
    ["ekko",   "艾克",   "拆装 / 突变"],
    ["soraka", "索拉卡", "低血止损"],
  ],
  conditions: [
    "2 阶段小法多，至少有小法对子。",
    "能做纳什之牙、珠光护手、朔极之矛。",
    "木灵牌来得自然，8 级有 7 木灵路径。",
    "同行少，并且有复制器、D 牌或装备强化。",
  ],
  risks: [
    "3-2 仍看不到三星小法路径。",
    "装备明显偏物理，无法做小法启动装。",
    "同行多，或 4-2 上 8 搜不出 7 木灵。",
    "拉莫斯和库奇不能二星，中期锁不住血。",
  ],
};
