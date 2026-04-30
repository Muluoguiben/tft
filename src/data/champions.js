/**
 * 棋子中文名 + 费用映射表。从 site.js 行 546-562 (findUnit) 抽出来。
 *
 * 用 cost 值在 1-5 之间区分稀有度；命名跟 assets.champions 对齐。
 * 注意：assets.champions 里 PNG 文件名带的"小法"实际是"维迦"，这里
 * 我们沿用 site.js 的"小法"短称作为显示名。
 */
export const champions = {
  aatrox:      { name: "亚托克斯",   cost: 1 },
  akali:       { name: "阿卡丽",     cost: 2 },
  aurora:      { name: "阿萝拉",     cost: 4 },
  asol:        { name: "龙王",       cost: 4 },
  bard:        { name: "巴德",       cost: 5 },
  belveth:     { name: "卑尔维斯",   cost: 4 },
  briar:       { name: "贝蕾亚",     cost: 3 },
  caitlyn:     { name: "凯特琳",     cost: 1 },
  corki:       { name: "库奇",       cost: 4 },
  diana:       { name: "黛安娜",     cost: 3 },
  fiora:       { name: "菲奥娜",     cost: 5 },
  fizz:        { name: "菲兹",       cost: 3 },
  galio:       { name: "超级机甲",   cost: 4 },
  gnar:        { name: "纳尔",       cost: 3 },
  graves:      { name: "格雷福斯",   cost: 5 },
  illaoi:      { name: "俄洛伊",     cost: 3 },
  ivern:       { name: "小木灵",     cost: 2 },
  jhin:        { name: "烬",         cost: 5 },
  jinx:        { name: "金克丝",     cost: 2 },
  karma:       { name: "卡尔玛",     cost: 4 },
  kayn:        { name: "拉亚斯特",   cost: 3 },
  kindred:     { name: "千珏",       cost: 4 },
  leblanc:     { name: "妖姬",       cost: 4 },
  leona:       { name: "蕾欧娜",     cost: 1 },
  lissandra:   { name: "丽桑卓",     cost: 1 },
  lulu:        { name: "璐璐",       cost: 3 },
  maokai:      { name: "茂凯",       cost: 3 },
  masterYi:    { name: "易",         cost: 4 },
  milio:       { name: "米利欧",     cost: 2 },
  mordekaiser: { name: "莫德凯撒",   cost: 2 },
  morgana:     { name: "莫甘娜",     cost: 5 },
  nami:        { name: "娜美",       cost: 4 },
  nunu:        { name: "努努",       cost: 4 },
  pantheon:    { name: "潘森",       cost: 2 },
  poppy:       { name: "波比",       cost: 1 },
  pyke:        { name: "派克",       cost: 2 },
  rammus:      { name: "拉莫斯",     cost: 4 },
  reksai:      { name: "雷克塞",     cost: 2 },
  riven:       { name: "锐雯",       cost: 4 },
  shen:        { name: "慎",         cost: 5 },
  tahm:        { name: "塔姆",       cost: 4 },
  urgot:       { name: "厄加特",     cost: 3 },
  veigar:      { name: "小法",       cost: 1 },
  vex:         { name: "薇古丝",     cost: 5 },
  viktor:      { name: "维克托",     cost: 3 },
  xayah:       { name: "霞",         cost: 4 },
  zoe:         { name: "佐伊",       cost: 2 },
};

/**
 * 安全查找：未知 id 走 fallback ({ name: id, cost: 3 })，跟 site.js 行为一致。
 */
export function findUnit(id) {
  return champions[id] ?? { name: id, cost: 3 };
}
