import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, '.tmp/comp-card-svgs');
const CARD_WIDTH = 1600;
const CARD_HEIGHT = 1080;
const OUTPUT_SCALE = 2;

const COST_COLORS = {
  1: '#7bbf77',
  2: '#5eb5ff',
  3: '#c47dff',
  4: '#f3c66a',
  5: '#f39d52',
};

const STAR_GODS = {
  '韦鲁斯': 'assets/s17/star-gods/韦鲁斯__TFT15_Varus.png',
  '凯尔': 'assets/s17/star-gods/凯尔__TFT15_Kayle.png',
  '亚索': 'assets/s17/star-gods/亚索__TFT5_Yasuo.png',
  '艾克': 'assets/s17/star-gods/艾克__TFT14_Ekko.png',
  '索拉卡': 'assets/s17/star-gods/索拉卡__TFT7_Soraka.png',
  '阿狸': 'assets/s17/star-gods/阿狸__TFT16_Ahri.png',
  '奥瑞利安·索尔': 'assets/s17/star-gods/奥瑞利安·索尔__TFT16_AurelionSol.png',
  '伊芙琳': 'assets/s17/star-gods/伊芙琳__TFT4_Evelynn.png',
};

const RECOMMENDATIONS = {
  'nova-95': {
    augments: [
      ['经济', '储蓄账户 / Hedge Fund', '高血上 9 的核心'],
      ['节奏', 'Money Monsoon / Upward Mobility', '加速 8/9 节奏'],
      ['战力', 'Late Game Scaling / Just Hit', '后期补质量'],
      ['装备', 'Max Build / 通用装备类', '修正双 C 装备'],
    ],
    emblems: [
      ['新星特攻队', '给塔姆/慎/五费，开 7 新星上限'],
      ['堡垒卫士', '给高费前排，补抗性和容错'],
      ['斗士', '给慎/五费前排，撑血量'],
    ],
  },
  'mecha-asol': {
    augments: [
      ['条件', 'Ahri’s Aura / Feeling Lucky', '经济好时冲 6 机甲'],
      ['经济', '储蓄账户 / AFK', '快 8 后仍有钱搜'],
      ['战力', 'Climb The Ladder / Charge Transfer', '补中期强度'],
      ['装备', 'Gold Collector / 光明法装', '补龙王和机甲装'],
    ],
    emblems: [
      ['霸天机甲', '优先给龙王/烬，稳定开 6 机甲'],
      ['暗星', '给龙王或副 C，补终盘伤害'],
      ['斗士', '给超级机甲/前排，提高锁血'],
    ],
  },
  'leblanc-vanguard': {
    augments: [
      ['经济', 'Money Monsoon / Hedge Fund', '保证 4-2 大搜质量'],
      ['节奏', 'Upward Mobility / Late Game Specialist', '稳血后上 9'],
      ['装备', 'Statikk Shiv / AP 装备类', '补魔抗削减和启动'],
      ['战力', 'Late Game Scaling / 战斗类', '弥补 T2 下限'],
    ],
    emblems: [
      ['重装战士', '给乐芙兰/卡尔玛外单位，开 6 重装'],
      ['法官', '给卡尔玛/努努，补法官收益'],
      ['牧羊人', '给卡尔玛/娜美，补前四稳定性'],
    ],
  },
  'stargazer-xayah': {
    augments: [
      ['条件', 'Battle Bunny Crossbow / 物理神器', '霞上限条件'],
      ['经济', '储蓄账户 / Feeling Lucky', '高血上 9 补烬'],
      ['战力', 'Speedy Double Kill / 物理战力', '提升收割能力'],
      ['装备', 'Backline Blueprint / 物理装备类', '保护后排输出'],
    ],
    emblems: [
      ['观星者', '给烬/巴德，开 4/5 观星上限'],
      ['狙神', '给副 C，补后排伤害'],
      ['重装战士', '给慎/前排，保护霞启动'],
    ],
  },
  'shepherd-viktor': {
    augments: [
      ['战力', 'Arcane Viktor-y / 珠光类', '维克托直接吃收益'],
      ['装备', 'Pandora’s Items / AP 装备类', '修正法装和前排装'],
      ['经济', 'Epic Rolldown / Feeling Lucky', '4-2 搜核心二星'],
      ['容错', 'Healing Orbs / Partial Ascension', '前排不足时补续航'],
    ],
    emblems: [
      ['牧羊人', '给维克托/娜美，冲 5/7 牧羊'],
      ['灵能特工', '给娜美/副 C，补技能爆发'],
      ['神谕', '给功能牌，提升技能频率'],
    ],
  },
  'space-riven': {
    augments: [
      ['必需', '太空律动转 / Voyager Emblem', '没转职不优先玩'],
      ['战力', 'Flickerblades / Radiant Guinsoo', '锐雯/易启动'],
      ['经济', 'Epic Rolldown / Feeling Lucky', '8 级找四费二星'],
      ['防线', 'Frontline Foundation / Hold the Line', '前排质量优先'],
    ],
    emblems: [
      ['太空律动', '优先给锐雯/易，是进阵条件'],
      ['狂战士', '给副 C，提高近战爆发'],
      ['堡垒卫士', '给塔姆/高费前排，补坦度'],
    ],
  },
  'woodling-corki': {
    augments: [
      ['条件', 'Gold Collector / 光明物理装', '库奇上限来源'],
      ['经济', '储蓄账户 / Money Hungry', '快 8 找库奇拉莫斯'],
      ['装备', 'Backline Blueprint / 装备类', '补库奇三件套'],
      ['战力', 'Frontline Foundation / 战斗类', '拉莫斯先站住'],
    ],
    emblems: [
      ['木灵族', '给非木灵高费，冲 7 木灵'],
      ['织命者', '给副 C，补暴击和输出'],
      ['堡垒卫士', '给高费前排，保护库奇'],
    ],
  },
  'mecha-flex': {
    augments: [
      ['经济', '储蓄账户 / AFK', '给 8 级大搜预算'],
      ['装备', '装备重随 / 光明装备类', '谁二星谁吃装'],
      ['战力', 'Charge Transfer / Climb The Ladder', '中期锁血'],
      ['转线', 'Trait Tree / Branching Out', '补机甲或暗星上限'],
    ],
    emblems: [
      ['霸天机甲', '能转 6 机甲就升为龙王线'],
      ['暗星', '给龙王/卡尔玛，补后期伤害'],
      ['狂战士', '给易/厄加特，补近战输出'],
    ],
  },
  'sea-belveth': {
    augments: [
      ['条件', 'Mittens / Missed Connections', '大卑胡牌才玩'],
      ['装备', 'Radiant Giant Slayer / Wit’s End', '补大卑输出'],
      ['战力', 'Kayle’s Exaltation / Crown of Demacia', '即时战力优先'],
      ['D牌', 'On a Roll / Prismatic Ticket', '追核心质量'],
    ],
    emblems: [
      ['海魔人', '给阿卡丽/千珏，冲 5 海魔'],
      ['游侠', '给副 C，补收割和切入'],
      ['新星特攻队', '给卑尔维斯/前排，补新星层级'],
    ],
  },
  'anima-aurora': {
    augments: [
      ['条件', 'Anima Commander / 经济收菜', '只在幻灵开局进'],
      ['D牌', 'Patience is a Virtue / Prismatic Ticket', '找阿萝拉和前排'],
      ['装备', 'AP 装备类 / 光明法装', '保证阿萝拉能收菜'],
      ['容错', 'Tiny Titans / 索拉卡类', '低血防第七第八'],
    ],
    emblems: [
      ['幻灵战队', '给乐芙兰/俄洛伊，冲高幻灵'],
      ['重装战士', '给阿萝拉外单位，补前排'],
      ['法官', '给阿萝拉/卡尔玛，补法系收益'],
    ],
  },
  'woodland-veigar': {
    augments: [
      ['最强', '值得等待：小法/波比', '直接抬到高上限'],
      ['D牌', '攀阶 / Prismatic Ticket', '帮助追小法三星'],
      ['经济', '储蓄账户 / AFK / Money Hungry', '快 8 找 7 木灵'],
      ['装备', '阿狸光环 / Gold Collector', '补小法和库奇装备'],
    ],
    emblems: [
      ['木灵族', '给卡尔玛/巴德，冲 7/9 木灵'],
      ['魔术师', '给库奇/卡尔玛，补小法输出'],
      ['暗星', '给小法/库奇，补后期伤害'],
    ],
  },
};

const COMPS = [
  {
    id: 'nova-95',
    title: '新星九五',
    emblem: '新星特攻队',
    tier: 'T1',
    rating: 'A-',
    position: '高血速 9 / 优势局上限',
    headline: '只有高血量高经济才冲 9，用五费质量压制终盘。',
    subtitle: '17.2 经济更紧，低血局不要强行贪九五；4-2 先锁血。',
    traits: [
      { name: '新星特攻队', count: 5, desc: '凯特琳、亚托克斯、阿卡丽、茂凯、千珏', marks: [2, 5] },
      { name: '堡垒卫士', count: 2, desc: '亚托克斯 + 慎，补前排抗性', marks: [2, 4, 6] },
      { name: '斗士', count: 2, desc: '茂凯 + 塔姆，撑中期血量', marks: [2, 4, 6] },
      { name: '高费单卡', count: 4, desc: '男枪、薇古丝、塔姆、慎决定上限', marks: [4] },
    ],
    row: ['凯特琳', '亚托克斯', '阿卡丽', '茂凯', '千珏', '塔姆', '慎', '格雷福斯', '薇古丝'],
    board: [
      unit('亚托克斯', 1, 1, 1),
      unit('茂凯', 3, 1, 3, ['日炎斗篷', '狂徒铠甲']),
      unit('塔姆', 4, 1, 4, ['石像鬼石板甲', '狂徒铠甲', '适应性头盔']),
      unit('慎', 5, 1, 6, ['冕卫']),
      unit('阿卡丽', 2, 2, 2),
      unit('凯特琳', 1, 4, 1),
      unit('千珏', 4, 4, 2),
      unit('格雷福斯', 5, 4, 4, ['水银', '巨人杀手', '斯特拉克的挑战护手']),
      unit('薇古丝', 5, 4, 6, ['鬼索的狂暴之刃', '珠光护手', '海克斯科技枪刃']),
    ],
    builds: [
      { title: '男枪：水银 + 巨杀 + 血手', items: ['水银', '巨人杀手', '斯特拉克的挑战护手'] },
      { title: '薇古丝：羊刀 + 法爆 + 科技枪', items: ['鬼索的狂暴之刃', '珠光护手', '海克斯科技枪刃'] },
      { title: '塔姆 / 慎：板甲 + 狂徒 + 适应性', items: ['石像鬼石板甲', '狂徒铠甲', '适应性头盔'] },
    ],
    starGods: [
      ['阿狸', '高血速 9，经济和上限最好'],
      ['奥瑞利安·索尔', '优势任务局，冲 9/10 上限'],
      ['艾克', '拆装、突变，修正装备分配'],
      ['凯尔', '补光明装，补终盘爆发'],
      ['索拉卡', '低血止损，不再贪九五'],
    ],
    conditions: [
      '2 阶段能连胜或血量经济明显领先。',
      'AD/AP 装都能消化，前排有二星质量。',
      '4-2 上 8 后能稳住，随后存钱上 9。',
      '同行抢四费少，五费来牌能转高费拼。',
    ],
    risks: [
      '低血还贪 9，4 阶段会直接崩。',
      '前排不二星，五费输出没有启动时间。',
      '装备太散，男枪和薇古丝都缺核心装。',
    ],
    timeline: [
      ['2 阶段', '强打工连胜，能合就合保血装。'],
      ['3-2', '不乱搜，补人口和羁绊维持战力。'],
      ['4-2', '上 8 找四费二星和一张五费锁血。'],
      ['后期', '上 9 换五费，按装备决定男枪/薇古丝主 C。'],
    ],
    tips: [
      '男枪和薇古丝分侧站，避免同吃范围控制。',
      '慎/塔姆顶主 C 对侧，给后排争取启动时间。',
      '8 级质量不够时先保前四，不硬攒 9。',
    ],
    pivot: '血量低转重装妖姬或机甲龙王；AD 装多保留男枪线。',
  },
  {
    id: 'mecha-asol',
    title: '6机甲龙王',
    emblem: '霸天机甲',
    tier: 'OP',
    rating: 'A',
    position: '6机甲 / 快 8 高上限',
    headline: '三张机甲变形后各算 2 个机甲，6 机甲给 +1 人口上限。',
    subtitle: '核心是龙王法装和超级机甲坦装，不是普通 3 机甲拼多多。',
    traits: [
      { name: '霸天机甲', count: 6, desc: '三机甲全变形，均计 2', marks: [3, 4, 6] },
      { name: '斗士', count: 2, desc: '厄加特 + 茂凯', marks: [2, 4, 6] },
      { name: '暗星', count: 2, desc: '卡尔玛 + 烬', marks: [2, 4, 6, 9] },
      { name: '狂战士', count: 2, desc: '厄加特 + 阿卡丽', marks: [2, 4, 6] },
    ],
    row: ['厄加特', '奥瑞利安·索尔', '超级机甲', '茂凯', '阿卡丽', '卡尔玛', '烬'],
    board: [
      unit('超级机甲', 4, 1, 4, ['石像鬼石板甲', '饮血剑', '斯特拉克的挑战护手']),
      unit('厄加特', 3, 3, 2, ['泰坦的坚决', '饮血剑']),
      unit('茂凯', 3, 3, 3, ['日炎斗篷']),
      unit('阿卡丽', 2, 3, 4),
      unit('奥瑞利安·索尔', 4, 4, 2, ['珠光护手', '灭世者的死亡之帽', '虚空之杖']),
      unit('卡尔玛', 4, 4, 4, ['朔极之矛']),
      unit('烬', 5, 4, 6, ['死亡之刃']),
    ],
    builds: [
      { title: '超级机甲：板甲 + 饮血 + 血手', items: ['石像鬼石板甲', '饮血剑', '斯特拉克的挑战护手'] },
      { title: '龙王：法爆 + 帽子 + 虚空杖', items: ['珠光护手', '灭世者的死亡之帽', '虚空之杖'] },
      { title: '厄加特 / 烬：多余物理装', items: ['泰坦的坚决', '饮血剑', '死亡之刃'] },
    ],
    starGods: [
      ['亚索', '格子给机甲或龙王，上限最高'],
      ['凯尔', '补光明坦装或法装'],
      ['艾克', '拆装修正机甲和龙王装备'],
      ['阿狸', '经济好时提速上 9'],
      ['索拉卡', '低血只求锁血止损'],
    ],
    conditions: [
      '开局经济或战力好，能按快 8 节奏打。',
      '有机甲相关强化、战力强化或强经济。',
      '龙王法装和超级机甲坦装至少各两件。',
      '4-2 能上 8 搜到三机甲框架。',
    ],
    risks: [
      '只有 3 机甲不够，必须做出 6 机甲变形框架。',
      '龙王没法装，超级机甲没坦装，会锁不住。',
      '低血还贪上 9，4 阶段容易掉大分。',
    ],
    timeline: [
      ['2 阶段', '强打工保血，优先合前排装。'],
      ['3-2', '补人口稳连胜，留厄加特和机甲牌。'],
      ['4-2', '上 8 搜三机甲，先做 6 机甲框架。'],
      ['后期', '9 人口补烬/卡尔玛质量，找龙王二星。'],
    ],
    tips: [
      '超级机甲单顶中间，厄加特和茂凯第三排接战。',
      '龙王后排左侧或中间安全位，烬和卡尔玛分散。',
      '只有 3 机甲时不要当 OP 线打，要么补 6 要么转。',
    ],
    pivot: '机甲断档转新星九五或重装妖姬；只胡厄加特可降为机甲 Flex。',
  },
  {
    id: 'leblanc-vanguard',
    title: '重装妖姬',
    emblem: '重装战士',
    tier: 'T2',
    rating: 'B+',
    position: 'AP 四费兜底 / 4-2 锁血',
    headline: 'AP 装兜底线，前排和妖姬质量顺时能稳住中期。',
    subtitle: '多来源数据有分歧，比赛里不要把它当默认主练。',
    traits: [
      { name: '重装战士', count: 4, desc: '蕾欧娜、铁男、俄洛伊、努努', marks: [2, 4, 6] },
      { name: '法官', count: 3, desc: '蕾欧娜、佐伊、乐芙兰', marks: [2, 3] },
      { name: '牧羊人', count: 3, desc: '小木灵、俄洛伊、乐芙兰', marks: [3, 5, 7] },
      { name: '神谕', count: 2, desc: '佐伊 + 莫德凯撒，补回蓝', marks: [2, 3, 4, 5] },
    ],
    row: ['蕾欧娜', '佐伊', '莫德凯撒', '小木灵', '俄洛伊', '努努和威朗普', '卡尔玛', '乐芙兰'],
    board: [
      unit('蕾欧娜', 1, 1, 2),
      unit('莫德凯撒', 2, 1, 3, ['日炎斗篷']),
      unit('俄洛伊', 3, 1, 4, ['石像鬼石板甲', '狂徒铠甲', '离子火花']),
      unit('小木灵', 2, 1, 5),
      unit('努努和威朗普', 4, 1, 6, ['冕卫']),
      unit('佐伊', 2, 4, 1),
      unit('乐芙兰', 4, 4, 4, ['鬼索的狂暴之刃', '珠光护手', '大天使之杖']),
      unit('卡尔玛', 4, 4, 6, ['朔极之矛', '虚空之杖']),
    ],
    builds: [
      { title: '妖姬：羊刀 + 法爆 + 大天使', items: ['鬼索的狂暴之刃', '珠光护手', '大天使之杖'] },
      { title: '卡尔玛：青龙刀 + 虚空杖 + 法爆', items: ['朔极之矛', '虚空之杖', '珠光护手'] },
      { title: '俄洛伊 / 努努：板甲 + 狂徒 + 离子', items: ['石像鬼石板甲', '狂徒铠甲', '离子火花'] },
    ],
    starGods: [
      ['韦鲁斯', '找四费二星和整体星级'],
      ['凯尔', '补 AP 成装，提升启动'],
      ['艾克', '拆装修正妖姬/卡尔玛装备'],
      ['阿狸', '高血经济局上 9 补五费'],
      ['索拉卡', '低血补容错'],
    ],
    conditions: [
      '法系装多，能早做羊刀/法爆/青龙刀。',
      '4-2 有 40 金左右能上 8 大搜。',
      '重装牌来得顺，前排能二星。',
      '妖姬/卡尔玛同行少，至少一张核心能二星。',
    ],
    risks: [
      '无 AP 装或前排不成，妖姬输出会空转。',
      '4-2 搜不到妖姬二星且血量低，要立刻转。',
      '后排固定角落会被切入或范围控制针对。',
    ],
    timeline: [
      ['2 阶段', 'AP 打工，肉装能合就合保血。'],
      ['3-2', '明确 AP 四费方向，补质量别掉太多血。'],
      ['4-2', '上 8 大搜妖姬、卡尔玛、重装前排。'],
      ['后期', '稳住后上 9 补薇古丝、巴德或控制。'],
    ],
    tips: [
      '妖姬不要死站角落，避开对手切入侧。',
      '卡尔玛和妖姬分散，防同吃范围伤害。',
      '锁血后再补上限，不要在 8 级 D 到 0 追三星。',
    ],
    pivot: '妖姬卡住转牧羊维克托；AP 五费来得早转新星九五。',
  },
  {
    id: 'stargazer-xayah',
    title: '观星霞',
    emblem: '观星者',
    tier: 'OP',
    rating: 'A',
    position: '高登顶物理 / 观星格上限',
    headline: '强观星效果 + 霞装备齐时，是当前冲冠军物理主线。',
    subtitle: '必须有攻速、破甲和安全格子；观星效果差时直接转线。',
    traits: [
      { name: '观星者', count: 3, desc: '璐璐、努努、霞；看星座效果进场', marks: [3, 4, 5, 6] },
      { name: '狙神', count: 2, desc: '霞 + 烬，拉距离补伤害', marks: [2, 3, 4] },
      { name: '重装战士', count: 3, desc: '蕾欧娜、莫德凯撒、努努', marks: [2, 4, 6] },
      { name: '神谕', count: 2, desc: '莫德凯撒 + 巴德，补回蓝和功能', marks: [2, 3, 4, 5] },
    ],
    row: ['璐璐', '蕾欧娜', '莫德凯撒', '潘森', '努努和威朗普', '霞', '烬', '慎', '巴德'],
    board: [
      unit('蕾欧娜', 1, 1, 2, ['日炎斗篷']),
      unit('莫德凯撒', 2, 1, 3, ['石像鬼石板甲']),
      unit('努努和威朗普', 4, 1, 4, ['狂徒铠甲', '冕卫', '适应性头盔']),
      unit('慎', 5, 1, 6),
      unit('潘森', 2, 2, 2),
      unit('璐璐', 3, 4, 1),
      unit('霞', 4, 4, 3, ['鬼索的狂暴之刃', '无尽之刃', '最后的轻语']),
      unit('烬', 5, 4, 6, ['死亡之刃']),
      unit('巴德', 5, 4, 7),
    ],
    builds: [
      { title: '霞：羊刀 + 无尽 + 轻语', items: ['鬼索的狂暴之刃', '无尽之刃', '最后的轻语'] },
      { title: '努努：狂徒 + 冕卫 + 适应性', items: ['狂徒铠甲', '冕卫', '适应性头盔'] },
      { title: '烬：多余物理装', items: ['死亡之刃', '巨人杀手', '夜之锋刃'] },
    ],
    starGods: [
      ['阿狸', '经济好时速 9 补烬和五费'],
      ['奥瑞利安·索尔', '高血任务局冲上限'],
      ['凯尔', '补物理成装最直接'],
      ['亚索', '格子适合霞/努努才选'],
      ['索拉卡', '低血止损保前四'],
    ],
    conditions: [
      '2-1 观星效果强，且格子不逼霞站危险位。',
      '反曲弓/大剑/拳套多，霞装备能成型。',
      '4-2 能上 8 搜霞和努努质量。',
      '霞、努努同行少，有机会上 9 补烬。',
    ],
    risks: [
      '观星效果差，不要因为名字好听硬进。',
      '霞没轻语或破甲，对重前排会刮痧。',
      '霞和烬同侧被切，后排会一起蒸发。',
    ],
    timeline: [
      ['2 阶段', '先看观星效果，物理装打工保血。'],
      ['3-2', '能连胜就提速，留观星和狙神牌。'],
      ['4-2', '上 8 找霞、努努，先锁前四。'],
      ['后期', '上 9 补烬/巴德/慎，提高终盘控制。'],
    ],
    tips: [
      '霞后排安全位拉满狙神距离，不固定角落。',
      '努努对主 C 侧顶住，烬与霞分角。',
      '观星格危险时宁可少吃收益也要保主 C。',
    ],
    pivot: '观星不强转新星九五；AP 装多转重装妖姬。',
  },
  {
    id: 'shepherd-viktor',
    title: '牧羊维克托',
    emblem: '牧羊人',
    tier: 'OP',
    rating: 'A-',
    position: '高前四 AP / 低同行质量局',
    headline: '当前公开数据前四率突出，AP 装局优先作为稳定主线。',
    subtitle: '仍然要看维克托装备、前排质量和同行，不能无脑硬玩。',
    traits: [
      { name: '牧羊人', count: 3, desc: '丽桑卓、小木灵、俄洛伊', marks: [3, 5, 7] },
      { name: '神谕', count: 3, desc: '莫德凯撒、维克托、巴德', marks: [2, 3, 4, 5] },
      { name: '灵能特工', count: 2, desc: '派克 + 维克托', marks: [2, 4] },
      { name: '魔术师', count: 2, desc: '丽桑卓 + 娜美', marks: [2, 4] },
    ],
    row: ['丽桑卓', '莫德凯撒', '小木灵', '派克', '俄洛伊', '拉亚斯特', '维克托', '娜美', '巴德'],
    board: [
      unit('莫德凯撒', 2, 1, 2, ['日炎斗篷']),
      unit('小木灵', 2, 1, 3),
      unit('俄洛伊', 3, 1, 4, ['石像鬼石板甲', '狂徒铠甲', '离子火花']),
      unit('拉亚斯特', 3, 1, 6),
      unit('派克', 2, 2, 6),
      unit('丽桑卓', 1, 4, 1),
      unit('维克托', 3, 4, 3, ['珠光护手', '大天使之杖', '灭世者的死亡之帽']),
      unit('娜美', 4, 4, 5, ['虚空之杖', '朔极之矛']),
      unit('巴德', 5, 4, 7),
    ],
    builds: [
      { title: '维克托：法爆 + 大天使 + 帽子', items: ['珠光护手', '大天使之杖', '灭世者的死亡之帽'] },
      { title: '俄洛伊：板甲 + 狂徒 + 离子', items: ['石像鬼石板甲', '狂徒铠甲', '离子火花'] },
      { title: '娜美：虚空杖 + 青龙刀 + 法爆', items: ['虚空之杖', '朔极之矛', '珠光护手'] },
    ],
    starGods: [
      ['韦鲁斯', '最适合追星级和复制质量'],
      ['凯尔', '补法装或前排装'],
      ['艾克', '无人机/拆装修正装备'],
      ['亚索', '格子好再选，别牺牲站位'],
      ['索拉卡', '低血保容错'],
    ],
    conditions: [
      'AP 输出装多，维克托装备能直接成型。',
      '前排俄洛伊或莫德凯撒来得早。',
      '同行少，4-2 能搜到维克托二星。',
      '有灵能/无人机/装备类条件再提高优先级。',
    ],
    risks: [
      '无 AP 装或前排不成时不要强玩。',
      '前排弱时维克托放不出第二轮技能。',
      '同行卡维克托或俄洛伊，必须及时转阵。',
    ],
    timeline: [
      ['2 阶段', 'AP 打工，留牧羊和神谕底座。'],
      ['3-5', '能上 7 稳血，别为一张维克托乱搜。'],
      ['4-2', '上 8 搜维克托二星和前排质量。'],
      ['后期', '血量高上 9 补巴德；低血在 8 级补二星。'],
    ],
    tips: [
      '维克托站后排中间，技能覆盖更多目标。',
      '娜美与维克托分侧，防同吃控制。',
      '没有低同行和 AP 装时，转重装妖姬更稳。',
    ],
    pivot: '维克托被卡转重装妖姬；前排/机甲牌多转机甲龙王。',
  },
  {
    id: 'space-riven',
    title: '太空律动转',
    emblem: '太空律动',
    tier: 'T2',
    rating: 'B',
    position: '转职上限 / 战士 Flex',
    headline: '有太空律动转才进，不是普通局默认上分线。',
    subtitle: '锐雯和剑圣吃装备，前排必须先站住。',
    traits: [
      { name: '太空律动', count: 4, desc: '转职 + 米利欧 + 菲兹 + 巴德', marks: [2, 4, 6] },
      { name: '堡垒卫士', count: 2, desc: '慎 + 塔姆，稳前排', marks: [2, 4, 6] },
      { name: '狂战士', count: 2, desc: '锐雯 + 拉亚斯特', marks: [2, 4, 6] },
      { name: '神谕', count: 2, desc: '卡尔玛 + 巴德，补功能', marks: [2, 3, 4, 5] },
    ],
    row: ['锐雯', '易', '塔姆', '慎', '米利欧', '菲兹', '卡尔玛', '巴德', '拉亚斯特'],
    board: [
      unit('塔姆', 4, 1, 2, ['狂徒铠甲', '石像鬼石板甲']),
      unit('慎', 5, 1, 4, ['冕卫']),
      unit('菲兹', 3, 1, 6),
      unit('锐雯', 4, 2, 3, ['饮血剑', '泰坦的坚决', '无尽之刃']),
      unit('易', 4, 2, 5, ['鬼索的狂暴之刃', '水银', '巨人杀手']),
      unit('拉亚斯特', 3, 2, 7),
      unit('米利欧', 2, 4, 1),
      unit('卡尔玛', 4, 4, 4, ['朔极之矛']),
      unit('巴德', 5, 4, 7),
    ],
    builds: [
      { title: '锐雯：饮血 + 泰坦 + 无尽', items: ['饮血剑', '泰坦的坚决', '无尽之刃'] },
      { title: '易：羊刀 + 水银 + 巨杀', items: ['鬼索的狂暴之刃', '水银', '巨人杀手'] },
      { title: '塔姆 / 慎：板甲 + 狂徒 + 冕卫', items: ['石像鬼石板甲', '狂徒铠甲', '冕卫'] },
    ],
    starGods: [
      ['亚索', '格子好给战士位，抬上限'],
      ['凯尔', '补光明输出或前排装'],
      ['艾克', '拆装修正锐雯/剑圣装备'],
      ['韦鲁斯', '找四费二星质量'],
      ['索拉卡', '低血保容错'],
    ],
    conditions: [
      '有太空律动转或明确转职路径。',
      '锐雯装备至少两件，剑圣能吃副 C 装。',
      '前排慎、塔姆或菲兹来得早。',
      '同行少，四费核心能二星。',
    ],
    risks: [
      '无转职时强度降级，不要硬玩。',
      '锐雯一星且无续航，4 阶段会掉大血。',
      '战士站位太靠前，被集火秒掉。',
    ],
    timeline: [
      ['2 阶段', '用强战士或太空牌打工，优先保血。'],
      ['3-2', '有转职才定方向，没转就保留 Flex。'],
      ['4-2', '上 8 搜锐雯、剑圣和前排二星。'],
      ['后期', '上 9 补巴德、慎和控制，别硬追三星。'],
    ],
    tips: [
      '锐雯/剑圣第二排接战，别第一排被秒。',
      '后排功能位分散，避免同吃范围控制。',
      '没转职直接降级为四费拼，不要硬凑。',
    ],
    pivot: '无转职转机甲 Flex；AP 装多转重装妖姬。',
  },
  {
    id: 'woodling-corki',
    title: '木灵飞机',
    emblem: '木灵族',
    tier: 'T2',
    rating: 'B',
    position: '木灵快 8 / 条件上限',
    headline: '木灵开局和经济强化同时满足时，飞机能吃分也能冲上限。',
    subtitle: '核心不是硬赌，而是 8 级找四费二星质量。',
    traits: [
      { name: '木灵族', count: 5, desc: '波比、小木灵、库奇、拉莫斯、巴德', marks: [3, 5, 7, 9] },
      { name: '堡垒卫士', count: 2, desc: '波比 + 拉莫斯，前排底座', marks: [2, 4, 6] },
      { name: '旅人', count: 2, desc: '小木灵 + 卡尔玛/巴德', marks: [2] },
      { name: '织命者', count: 2, desc: '库奇 + 米利欧，补暴击', marks: [2, 4] },
    ],
    row: ['库奇', '拉莫斯', '锐雯', '巴德', '菲兹', '小木灵', '米利欧', '纳尔', '波比'],
    board: [
      unit('波比', 1, 1, 1),
      unit('拉莫斯', 4, 1, 3, ['冕卫', '日炎斗篷', '石像鬼石板甲']),
      unit('小木灵', 2, 1, 5),
      unit('菲兹', 3, 1, 7),
      unit('锐雯', 4, 2, 3, ['饮血剑', '泰坦的坚决']),
      unit('纳尔', 3, 2, 5),
      unit('库奇', 4, 4, 1, ['珠光护手', '无尽之刃', '正义之手']),
      unit('巴德', 5, 4, 4),
      unit('米利欧', 2, 4, 7),
    ],
    builds: [
      { title: '库奇：法爆 + 无尽 + 正义', items: ['珠光护手', '无尽之刃', '正义之手'] },
      { title: '拉莫斯：冕卫 + 日炎 + 板甲', items: ['冕卫', '日炎斗篷', '石像鬼石板甲'] },
      { title: '锐雯：饮血 + 泰坦 + 轻语', items: ['饮血剑', '泰坦的坚决', '最后的轻语'] },
    ],
    starGods: [
      ['韦鲁斯', '找四费二星和复制质量'],
      ['凯尔', '补库奇或拉莫斯装备'],
      ['艾克', '拆装修正库奇/拉莫斯装备'],
      ['亚索', '格子好给锐雯或拉莫斯'],
      ['索拉卡', '低血止损'],
    ],
    conditions: [
      '3 木灵或木灵牌自然来得多。',
      '经济强化或连胜开局，能快 8。',
      '库奇和拉莫斯装备至少各两件。',
      '同行少，4-2 能搜到四费二星。',
    ],
    risks: [
      '没有木灵底座时强玩，4 阶段会断质量。',
      '库奇没启动装，伤害不够锁血。',
      '拉莫斯一星或无肉装，前排会塌。',
    ],
    timeline: [
      ['2 阶段', '木灵/堡垒打工，肉装能合就合。'],
      ['3-2', '看木灵数量，经济好才定木灵飞机。'],
      ['4-2', '上 8 搜库奇、拉莫斯和锐雯质量。'],
      ['后期', '上 9 补巴德、米利欧或高费控制。'],
    ],
    tips: [
      '拉莫斯和小木灵默认第一排，保证后排启动。',
      '库奇后排安全位，不固定死角。',
      '木灵牌多但库奇慢，可以转木灵小法或机甲 Flex。',
    ],
    pivot: '库奇卡住转木灵小法；前排/机甲牌多转机甲 Flex。',
  },
  {
    id: 'mecha-flex',
    title: '机甲 Flex',
    emblem: '霸天机甲',
    tier: 'T2',
    rating: 'B',
    position: '8 级锁血 / 装备 Flex',
    headline: '装备散、需要 4 阶段稳血时，用机甲前排兜住。',
    subtitle: '这不是 6 机甲龙王主线，强度靠来牌和装备修正。',
    traits: [
      { name: '霸天机甲', count: 3, desc: '超级机甲 + 厄加特 + 龙王', marks: [3, 4, 6] },
      { name: '斗士', count: 2, desc: '厄加特 + 塔姆/茂凯', marks: [2, 4, 6] },
      { name: '暗星', count: 2, desc: '卡尔玛 + 烬', marks: [2, 4, 6, 9] },
      { name: '狂战士', count: 2, desc: '厄加特 + 阿卡丽', marks: [2, 4, 6] },
    ],
    row: ['超级机甲', '厄加特', '奥瑞利安·索尔', '塔姆', '易', '卡尔玛', '茂凯', '阿卡丽', '烬'],
    board: [
      unit('超级机甲', 4, 1, 4, ['石像鬼石板甲', '饮血剑', '斯特拉克的挑战护手']),
      unit('塔姆', 4, 1, 2, ['狂徒铠甲']),
      unit('茂凯', 3, 1, 6, ['日炎斗篷']),
      unit('厄加特', 3, 2, 3, ['泰坦的坚决', '饮血剑']),
      unit('易', 4, 2, 5, ['鬼索的狂暴之刃']),
      unit('阿卡丽', 2, 2, 7),
      unit('奥瑞利安·索尔', 4, 4, 2, ['珠光护手', '灭世者的死亡之帽']),
      unit('卡尔玛', 4, 4, 5, ['朔极之矛']),
      unit('烬', 5, 4, 7, ['死亡之刃']),
    ],
    builds: [
      { title: '机甲：板甲 + 饮血 + 血手', items: ['石像鬼石板甲', '饮血剑', '斯特拉克的挑战护手'] },
      { title: '龙王 / 卡尔玛：法爆 + 帽子 + 青龙刀', items: ['珠光护手', '灭世者的死亡之帽', '朔极之矛'] },
      { title: '厄加特 / 剑圣：泰坦 + 饮血 + 羊刀', items: ['泰坦的坚决', '饮血剑', '鬼索的狂暴之刃'] },
    ],
    starGods: [
      ['亚索', '格子给机甲或战士位'],
      ['凯尔', '补关键成装'],
      ['艾克', '拆装，修正双 C 装备'],
      ['韦鲁斯', '找四费二星质量'],
      ['索拉卡', '低血保前四'],
    ],
    conditions: [
      '8 级机甲牌和四费牌来得多。',
      '法装、物理装、肉装都能有人消化。',
      '需要立刻锁血，不适合继续贪经济。',
      '同行不多，至少一个主 C 能二星。',
    ],
    risks: [
      '把 3 机甲当 6 机甲打，会高估上限。',
      '装备太平均，没有一个主 C 成型。',
      '前排一星，后排再强也启动不了。',
    ],
    timeline: [
      ['2 阶段', '用强前排和通用装备保血。'],
      ['3-2', '装备散就保留机甲/四费 Flex 口。'],
      ['4-2', '上 8 大搜，谁二星谁先吃装备。'],
      ['后期', '能补 6 机甲再冲，否则稳前四。'],
    ],
    tips: [
      '机甲单顶，塔姆/茂凯分担第一波伤害。',
      '龙王、卡尔玛、烬分散第四排。',
      '找到 6 机甲条件后再转 6 机甲龙王。',
    ],
    pivot: '龙王胡转 6 机甲；AP 装多转重装妖姬。',
  },
  {
    id: 'sea-belveth',
    title: '海魔大卑',
    emblem: '海魔人',
    tier: 'OP',
    rating: 'A-',
    position: '稳定赌阵 / 胡牌进场',
    headline: '胡牌、装备和同行同时满足时，前四率和登顶率都能看。',
    subtitle: '赌阵不是默认路线；不胡要及时转新星或四费拼。',
    traits: [
      { name: '海魔人', count: 3, desc: '雷克塞、贝蕾亚、卑尔维斯', marks: [3, 5] },
      { name: '新星特攻队', count: 5, desc: '剑魔、阿卡丽、茂凯、千珏、凯特琳', marks: [2, 5] },
      { name: '狂战士', count: 2, desc: '阿卡丽 + 卑尔维斯', marks: [2, 4, 6] },
      { name: '游侠', count: 2, desc: '卑尔维斯 + 阿卡丽', marks: [2, 3, 4, 5] },
    ],
    row: ['雷克塞', '贝蕾亚', '亚托克斯', '凯特琳', '阿卡丽', '卑尔维斯', '茂凯', '千珏'],
    board: [
      unit('雷克塞', 2, 1, 2, ['日炎斗篷']),
      unit('亚托克斯', 1, 1, 4, ['狂徒铠甲']),
      unit('茂凯', 3, 1, 6, ['石像鬼石板甲']),
      unit('贝蕾亚', 3, 2, 2, ['饮血剑']),
      unit('卑尔维斯', 4, 2, 4, ['海妖之怒', '水银', '巨人杀手']),
      unit('阿卡丽', 2, 2, 6, ['正义之手', '夜之锋刃', '无尽之刃']),
      unit('凯特琳', 1, 4, 1),
      unit('千珏', 4, 4, 6),
    ],
    builds: [
      { title: '卑尔维斯：海妖 + 水银 + 巨杀', items: ['海妖之怒', '水银', '巨人杀手'] },
      { title: '阿卡丽：正义 + 夜刃 + 无尽', items: ['正义之手', '夜之锋刃', '无尽之刃'] },
      { title: '雷克塞 / 茂凯：日炎 + 板甲 + 狂徒', items: ['日炎斗篷', '石像鬼石板甲', '狂徒铠甲'] },
    ],
    starGods: [
      ['韦鲁斯', '追关键三星和整体星级'],
      ['凯尔', '补物理成装'],
      ['亚索', '格子好给近战主 C'],
      ['艾克', '拆装修正大卑装备'],
      ['索拉卡', '低血止损'],
    ],
    conditions: [
      '2 阶段海魔或新星牌特别胡。',
      '卑尔维斯装备能直接成型。',
      '同行少，核心对子多。',
      '3-2 小 D 能补出二星质量。',
    ],
    risks: [
      '开局不胡还硬赌，经济会炸。',
      '装备不对，大卑无法收割。',
      '同行多时追三星置信度很低。',
    ],
    timeline: [
      ['2 阶段', '留海魔和新星对子，能保血就保血。'],
      ['3-2', '小 D 补二星，质量不够就转阵。'],
      ['4-1', '确认主 C 和前排质量，别盲目 D 光。'],
      ['后期', '能上人口补千珏/高费，不硬追三星。'],
    ],
    tips: [
      '近战主 C 第二排接战，不要第一排被秒。',
      '阿卡丽和大卑分侧，避免同吃控制。',
      '胡牌才玩，普通局优先运营阵容。',
    ],
    pivot: '不胡转新星九五；AP 装多转重装妖姬。',
  },
  {
    id: 'anima-aurora',
    title: '幻灵阿萝拉',
    emblem: '幻灵战队',
    tier: 'T2',
    rating: 'C+',
    position: '高风险武器 / 连败收菜',
    headline: '只有明确幻灵开局和收菜条件时才进，普通局不要硬玩。',
    subtitle: '这套上限高但下限低，比赛里只作为特殊武器。',
    traits: [
      { name: '幻灵战队', count: 3, desc: '蕾欧娜、金克丝、阿萝拉', marks: [3, 5, 7, 10] },
      { name: '重装战士', count: 4, desc: '蕾欧娜、俄洛伊、黛安娜、努努', marks: [2, 4, 6] },
      { name: '牧羊人', count: 3, desc: '小木灵、俄洛伊、乐芙兰', marks: [3, 5, 7] },
      { name: '法官', count: 2, desc: '蕾欧娜 + 乐芙兰', marks: [2, 3] },
    ],
    row: ['蕾欧娜', '小木灵', '金克丝', '俄洛伊', '黛安娜', '阿萝拉', '乐芙兰', '努努和威朗普'],
    board: [
      unit('蕾欧娜', 1, 1, 2, ['日炎斗篷']),
      unit('小木灵', 2, 1, 3),
      unit('俄洛伊', 3, 1, 4, ['石像鬼石板甲', '振奋盔甲', '狂徒铠甲']),
      unit('努努和威朗普', 4, 1, 6, ['冕卫']),
      unit('黛安娜', 3, 2, 5, ['饮血剑', '泰坦的坚决']),
      unit('金克丝', 2, 4, 1),
      unit('阿萝拉', 4, 4, 4, ['珠光护手', '纳什之牙', '炽烈短弓']),
      unit('乐芙兰', 4, 4, 6, ['大天使之杖']),
    ],
    builds: [
      { title: '阿萝拉：法爆 + 纳什 + 短弓', items: ['珠光护手', '纳什之牙', '炽烈短弓'] },
      { title: '俄洛伊：板甲 + 振奋 + 狂徒', items: ['石像鬼石板甲', '振奋盔甲', '狂徒铠甲'] },
      { title: '黛安娜：饮血 + 泰坦 + 冕卫', items: ['饮血剑', '泰坦的坚决', '冕卫'] },
    ],
    starGods: [
      ['索拉卡', '低血收菜局保容错'],
      ['韦鲁斯', '找四费二星和复制质量'],
      ['凯尔', '补阿萝拉成装'],
      ['艾克', '拆装，修正 AP 装'],
      ['亚索', '格子好才选'],
    ],
    conditions: [
      '开局 3 幻灵或 3-2 前明确连败条件。',
      '阿萝拉装备能成型，前排有二星。',
      '能判断收菜节点，不继续贪。',
      '需要冲上限而不是普通保分局。',
    ],
    risks: [
      '普通积分局硬玩，容易第七第八。',
      '收菜阈值判断错，血量直接崩。',
      '阿萝拉没装备，收菜后也锁不住。',
    ],
    timeline: [
      ['2 阶段', '有 3 幻灵才进，可精致连败。'],
      ['3-2', '确认收菜条件和装备，不满足转阵。'],
      ['4-2', '上 8 搜阿萝拉、俄洛伊和前排质量。'],
      ['后期', '收菜后稳血，上 9 补高费控制。'],
    ],
    tips: [
      '这套是比赛里的高风险武器，不是默认主线。',
      '低血时先锁前四，不要继续贪层数。',
      '阿萝拉和乐芙兰分侧，避免同吃控制。',
    ],
    pivot: '收菜失败转重装妖姬；前排胡转机甲 Flex。',
  },
  {
    id: 'woodland-veigar',
    title: '木灵小法师',
    emblem: '木灵族',
    tier: 'T2',
    rating: 'C+',
    position: '7木灵 / 条件快 8',
    headline: '木灵/AP 胡牌线，不是默认 5 级硬赌小法。',
    subtitle: '关键是 4-2/4-5 上 8 找 7 木灵，用克隆格自然追三星。',
    traits: [
      { name: '木灵族', count: 7, desc: '主羁绊，克隆格做三星小法', marks: [3, 5, 7, 9] },
      { name: '魔术师', count: 2, desc: '小法 + 丽桑卓', marks: [2, 4, 6] },
      { name: '暗星', count: 2, desc: '丽桑卓 + 卡尔玛', marks: [2, 4, 6, 9] },
      { name: '旅人', count: 2, desc: '小木灵 + 卡尔玛', marks: [2] },
      { name: '堡垒卫士', count: 2, desc: '波比 + 拉莫斯', marks: [2, 4, 6] },
    ],
    row: ['波比', '小木灵', '拉莫斯', '菲兹', '丽桑卓', '库奇', '小法', '卡尔玛', '巴德'],
    board: [
      unit('波比', 1, 1, 1),
      unit('小木灵', 2, 1, 3),
      unit('拉莫斯', 4, 1, 5, ['日炎斗篷', '棘刺背心', '离子火花']),
      unit('菲兹', 3, 1, 7),
      unit('丽桑卓', 1, 4, 1),
      unit('库奇', 4, 4, 2, ['最后的轻语', '死亡之刃', '破防者']),
      unit('小法', 1, 4, 4, ['纳什之牙', '珠光护手', '朔极之矛']),
      unit('卡尔玛', 4, 4, 6),
      unit('巴德', 5, 4, 7),
    ],
    builds: [
      { title: '小法：纳什 + 法爆 + 青龙刀', items: ['纳什之牙', '珠光护手', '朔极之矛'] },
      { title: '库奇：轻语 + 杀人剑 + 破防', items: ['最后的轻语', '死亡之刃', '破防者'] },
      { title: '拉莫斯：日炎 + 反甲 + 离子', items: ['日炎斗篷', '棘刺背心', '离子火花'] },
    ],
    starGods: [
      ['韦鲁斯', '首选：三星/复制器'],
      ['凯尔', '补装备，抬上限'],
      ['亚索', '格子好才选'],
      ['艾克', '拆装/突变'],
      ['索拉卡', '低血止损'],
    ],
    conditions: [
      '木灵/AP 开局，小法或波比自然来得多。',
      '能早合纳什、法爆、青龙刀等启动装。',
      '4-2 或 4-5 上 8 找 7 木灵框架。',
      '有值得等待、攀阶、复制器、D 牌或经济强化。',
    ],
    risks: [
      '在 5/6 级硬 D 到经济崩。',
      '没有 7 木灵框架还继续空等小法三星。',
      '装备明显偏物理，无法做小法启动装。',
    ],
    timeline: [
      ['2 阶段', '木灵/AP 打工，优先保血和经济。'],
      ['3-2', '不为一张小法乱搜，保持快 8 节奏。'],
      ['4-2', '上 8 找 7 木灵和拉莫斯/库奇质量。'],
      ['后期', '用克隆格追三星小法，上 9 补卡尔玛/巴德。'],
    ],
    tips: [
      '拉莫斯和波比第一排，确保小法有启动时间。',
      '小法、库奇、巴德分散第四排，防范围伤害。',
      '自然小法不多时不要硬赌，优先转木灵飞机。',
    ],
    pivot: '小法不胡转木灵飞机；法装多可转重装妖姬。',
  },
];

function unit(name, cost, row, col, items = [], star = null) {
  return { name, cost, row, col, items, star };
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(ROOT, relPath), 'utf8'));
}

function indexByName(rows) {
  const map = new Map();
  for (const row of rows) {
    if (row.zhName && row.assetPath && !map.has(row.zhName)) {
      map.set(row.zhName, row.assetPath);
    }
  }
  return map;
}

async function dataUri(relPath) {
  const ext = path.extname(relPath).slice(1).toLowerCase() || 'png';
  const bytes = await readFile(path.join(ROOT, relPath));
  return `data:image/${ext};base64,${bytes.toString('base64')}`;
}

async function loadAssetMaps() {
  const [champions, traits, items] = await Promise.all([
    readJson('data/s17/champions.zh.json'),
    readJson('data/s17/traits.zh.json'),
    readJson('data/s17/items.zh.json'),
  ]);
  return {
    champions: indexByName(champions),
    traits: indexByName(traits),
    items: indexByName(items),
    starGods: new Map(Object.entries(STAR_GODS)),
  };
}

async function loadDetailStars(compId) {
  const detailPath = path.join(ROOT, 'src/data/comps', `${compId}.js`);
  try {
    const { default: detail } = await import(pathToFileURL(detailPath).href);
    return new Map((detail.boardUnits || []).map((unitData) => [unitData.name, unitData.star]));
  } catch {
    return new Map();
  }
}

async function assetUri(maps, group, name) {
  const relPath = maps[group].get(name);
  if (!relPath) return null;
  return dataUri(relPath);
}

async function buildAssets(comp, maps) {
  const names = {
    champions: new Set([...comp.row, ...comp.board.map((u) => u.name)]),
    traits: new Set([comp.emblem, ...comp.traits.map((t) => t.name), ...(comp.emblems || []).map(([name]) => name)]),
    items: new Set(comp.board.flatMap((u) => u.items || []).concat(comp.builds.flatMap((b) => b.items))),
    starGods: new Set(comp.starGods.map(([name]) => name)),
  };
  const out = { champions: {}, traits: {}, items: {}, starGods: {} };
  for (const group of Object.keys(names)) {
    for (const name of names[group]) {
      out[group][name] = await assetUri(maps, group, name);
    }
  }
  return out;
}

function image(href, x, y, w, h, extra = '') {
  if (!href) return '';
  return `<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" ${extra}/>`;
}

function wrapText(text, maxChars = 18, maxLines = 3) {
  const source = String(text);
  const lines = [];
  let current = '';
  for (const char of source) {
    current += char;
    if (current.length >= maxChars || /[；。]/.test(char)) {
      lines.push(current);
      current = '';
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function compact(text, maxChars = 12) {
  const value = String(text);
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars - 1)}…`;
}

function textLines(text, x, y, cls, maxChars, lineHeight = 18, maxLines = 3) {
  return wrapText(text, maxChars, maxLines)
    .map((line, i) => `<text x="${x}" y="${y + i * lineHeight}" class="${cls}">${esc(line)}</text>`)
    .join('');
}

function itemIcon(assets, name, x, y, size = 24) {
  const href = assets.items[name];
  if (!href) {
    return `
      <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="6" class="placeholderItem"/>
      <text x="${x + size / 2}" y="${y + size / 2 + 5}" text-anchor="middle" class="tiny">${esc(name.slice(0, 1))}</text>
    `;
  }
  return `
    <rect x="${x - 1}" y="${y - 1}" width="${size + 2}" height="${size + 2}" rx="7" class="itemFrame"/>
    ${image(href, x, y, size, size)}
  `;
}

function champCard(assets, champ) {
  const x = 452 + (champ.col - 1) * 88 + (champ.row % 2 === 0 ? 44 : 0);
  const y = 334 + (champ.row - 1) * 104;
  const width = 78;
  const height = 104;
  const border = COST_COLORS[champ.cost] || '#8d98a0';
  const href = assets.champions[champ.name];
  const star = starLabel(champ.star, champ.cost);
  const starWidth = Math.min(58, 8 + star.length * 12);
  const itemSize = 22;
  const itemStart = x + 6;
  const itemY = y + height - itemSize - 6;
  const items = (champ.items || []).slice(0, 3).map((name, i) => itemIcon(assets, name, itemStart + i * 25, itemY, itemSize)).join('');
  return `
    <g>
      <rect x="${x - 3}" y="${y - 3}" width="${width + 6}" height="${height + 6}" rx="14" fill="rgba(242,189,99,.12)" stroke="${border}" stroke-width="2.5"/>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="#071116" stroke="#061015" stroke-width="1"/>
      <clipPath id="clip-${esc(champ.name)}"><rect x="${x + 7}" y="${y + 7}" width="64" height="54" rx="9"/></clipPath>
      ${image(href, x + 7, y + 7, 64, 54, `clip-path="url(#clip-${esc(champ.name)})"`)}
      <rect x="${x + 9}" y="${y + 9}" width="${starWidth}" height="16" rx="6" class="starBadge"/>
      <text x="${x + 13}" y="${y + 22}" class="starText">${esc(star)}</text>
      <rect x="${x + 7}" y="${y + 42}" width="64" height="25" rx="8" fill="rgba(0,0,0,.7)"/>
      <text x="${x + width / 2}" y="${y + 60}" text-anchor="middle" class="champName">${esc(shortName(champ.name))}</text>
      <circle cx="${x + width - 10}" cy="${y + 16}" r="12" fill="${border}"/>
      <text x="${x + width - 10}" y="${y + 21}" text-anchor="middle" class="costText">${champ.cost}</text>
      ${items}
    </g>
  `;
}

function starLabel(star, cost) {
  if (star === 3 || star === '3' || star === '三星' || star === '★★★') return '★★★';
  if (star === 2 || star === '2' || star === '二星' || star === '★★') return '★★';
  if (star === 1 || star === '1' || star === '一星' || star === '★') return '★';
  return cost === 5 ? '★' : '★★';
}

function shortName(name) {
  return {
    '奥瑞利安·索尔': '龙王',
    '努努和威朗普': '努努',
    '莫德凯撒': '铁男',
    '超级机甲': '机甲',
    '格雷福斯': '男枪',
    '乐芙兰': '妖姬',
  }[name] || name;
}

function miniChampCard(assets, name, cost, x, y, star) {
  const border = COST_COLORS[cost] || '#8d98a0';
  const starText = starLabel(star, cost);
  const starWidth = Math.min(44, 7 + starText.length * 9);
  return `
    <g>
      <rect x="${x - 2}" y="${y - 2}" width="58" height="78" rx="9" fill="#0a1519" stroke="${border}" stroke-width="2"/>
      <clipPath id="mini-${esc(name)}"><rect x="${x + 3}" y="${y + 3}" width="48" height="48" rx="7"/></clipPath>
      ${image(assets.champions[name], x + 3, y + 3, 48, 48, `clip-path="url(#mini-${esc(name)})"`)}
      <rect x="${x + 5}" y="${y + 5}" width="${starWidth}" height="13" rx="5" class="starBadge"/>
      <text x="${x + 8}" y="${y + 15}" class="miniStarText">${esc(starText)}</text>
      <rect x="${x + 3}" y="${y + 42}" width="48" height="19" rx="6" fill="rgba(0,0,0,.72)"/>
      <text x="${x + 27}" y="${y + 57}" text-anchor="middle" class="miniName">${esc(shortName(name))}</text>
      <circle cx="${x + 48}" cy="${y + 11}" r="9" fill="${border}"/>
      <text x="${x + 48}" y="${y + 15}" text-anchor="middle" class="miniCost">${cost}</text>
    </g>
  `;
}

function traitRow(assets, trait, y) {
  const marks = (trait.marks || []).map((mark, i) => {
    const x = 244 + i * 28;
    const active = mark === trait.count;
    return `
      <rect x="${x}" y="${y + 20}" width="22" height="24" rx="5" class="${active ? 'traitMarkActive' : 'traitMark'}"/>
      <text x="${x + 11}" y="${y + 37}" text-anchor="middle" class="${active ? 'traitMarkTextActive' : 'traitMarkText'}">${mark}</text>
    `;
  }).join('');
  return `
    <g>
      <rect x="64" y="${y}" width="268" height="58" rx="12" class="traitRow"/>
      ${image(assets.traits[trait.name], 80, y + 10, 38, 38)}
      <text x="136" y="${y + 25}" class="traitName">${esc(`${trait.count} ${trait.name}`)}</text>
      <text x="136" y="${y + 46}" class="traitSub">${esc(compact(trait.desc, 8))}</text>
      ${marks}
    </g>
  `;
}

function boardSlots() {
  const startX = 452;
  const startY = 334;
  const gapX = 88;
  const gapY = 104;
  const rows = ['前排', '第二', '第三', '后排'];
  let out = '';
  for (let r = 0; r < 4; r++) {
    out += `
      <rect x="408" y="${startY + r * gapY + 34}" width="50" height="28" rx="8" class="rowBadge rowBadge${r}"/>
      <text x="433" y="${startY + r * gapY + 54}" text-anchor="middle" class="rowLabel">${rows[r]}</text>
    `;
    for (let c = 0; c < 7; c++) {
      const x = startX + c * gapX + (r % 2 === 1 ? 44 : 0);
      const y = startY + r * gapY;
      const points = `${x + 39},${y} ${x + 78},${y + 22} ${x + 78},${y + 68} ${x + 39},${y + 90} ${x},${y + 68} ${x},${y + 22}`;
      out += `<polygon points="${points}" class="slot ${r < 2 ? 'frontSlot' : 'backSlot'}"/>`;
    }
  }
  return out;
}

function itemPanel(assets, panel) {
  const items = panel.items.map((item, i) => {
    const x = panel.x + 18 + i * 92;
    return `
      <g>
        <rect x="${x - 2}" y="${panel.y + 44}" width="48" height="48" rx="11" class="itemFrame"/>
        ${assets.items[item] ? image(assets.items[item], x, panel.y + 46, 44, 44) : `<rect x="${x}" y="${panel.y + 46}" width="44" height="44" rx="10" class="placeholderItem"/><text x="${x + 22}" y="${panel.y + 73}" text-anchor="middle" class="smallBold">${esc(item.slice(0, 1))}</text>`}
        <text x="${x + 22}" y="${panel.y + 111}" text-anchor="middle" class="itemLabel">${esc(shortItem(item))}</text>
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="${panel.x}" y="${panel.y}" width="312" height="132" rx="16" class="itemPanel"/>
      <text x="${panel.x + 18}" y="${panel.y + 28}" class="panelLabel">${esc(panel.title)}</text>
      ${items}
    </g>
  `;
}

function shortItem(name) {
  return {
    '鬼索的狂暴之刃': '羊刀',
    '珠光护手': '法爆',
    '朔极之矛': '青龙刀',
    '海克斯科技枪刃': '科技枪',
    '斯特拉克的挑战护手': '血手',
    '石像鬼石板甲': '板甲',
    '灭世者的死亡之帽': '帽子',
    '最后的轻语': '轻语',
  }[name] || name;
}

function starGodDisplay(name) {
  return name === '奥瑞利安·索尔' ? '龙王' : name;
}

function starGodPanel(assets, comp) {
  const rows = comp.starGods.slice(0, 5).map(([name, text], i) => {
    const y = 704 + i * 29;
    return `
      <g>
        <rect x="1254" y="${y - 22}" width="282" height="29" rx="10" class="godRow"/>
        ${image(assets.starGods[name], 1260, y - 19, 24, 24)}
        <text x="1294" y="${y}" class="godName">${esc(starGodDisplay(name))}</text>
        ${textLines(text, 1360, y, 'godText', 13, 13, 1)}
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="1240" y="642" width="312" height="198" rx="16" class="godPanel"/>
      <text x="1258" y="670" class="panelLabel">推荐星神</text>
      <text x="1356" y="670" class="godHint">按血量和经济选择，不硬贪</text>
      ${rows}
    </g>
  `;
}

function augmentPanel(comp) {
  const rows = (comp.augments || []).slice(0, 4).map(([type, name, note], i) => {
    const y = 898 + i * 31;
    return `
      <g>
        <rect x="410" y="${y - 22}" width="360" height="29" rx="9" class="recommendRow"/>
        <rect x="420" y="${y - 18}" width="46" height="21" rx="7" class="augmentTag"/>
        <text x="443" y="${y - 3}" text-anchor="middle" class="augmentTagText">${esc(type)}</text>
        <text x="476" y="${y}" class="recommendName">${esc(compact(name, 18))}</text>
        <text x="622" y="${y}" class="recommendNote">${esc(compact(note, 14))}</text>
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="398" y="866" width="390" height="146" rx="14" class="recommendPanel"/>
      <text x="420" y="892" class="panelLabel">推荐海克斯</text>
      ${rows}
    </g>
  `;
}

function emblemPanel(assets, comp) {
  const rows = (comp.emblems || []).slice(0, 3).map(([trait, note], i) => {
    const y = 902 + i * 38;
    return `
      <g>
        <rect x="816" y="${y - 28}" width="350" height="35" rx="10" class="recommendRow"/>
        ${image(assets.traits[trait], 826, y - 25, 28, 28)}
        <text x="864" y="${y - 5}" class="recommendName">${esc(`${trait}纹章`)}</text>
        <text x="960" y="${y - 5}" class="recommendNote">${esc(compact(note, 18))}</text>
      </g>
    `;
  }).join('');
  return `
    <g>
      <rect x="804" y="866" width="374" height="146" rx="14" class="recommendPanel"/>
      <text x="826" y="892" class="panelLabel">纹章 / 转职</text>
      ${rows}
    </g>
  `;
}

function renderList(items, x, y, colorClass, maxChars = 18, rowGap = 52) {
  return items.map((text, index) => {
    const rowY = y + index * rowGap;
    return `
      <circle cx="${x}" cy="${rowY - 6}" r="12" class="${colorClass === 'riskLine' ? 'riskDot' : 'conditionDot'}"/>
      <text x="${x}" y="${rowY - 1}" text-anchor="middle" class="conditionNum">${index + 1}</text>
      ${textLines(text, x + 22, rowY, colorClass, maxChars, 17, 2)}
    `;
  }).join('');
}

function timeline(comp) {
  const boxes = comp.timeline.map(([title, text], i) => {
    const x = 408 + i * 190;
    const cls = ['tempoGreen', 'tempoBlue', 'tempoOrange', 'tempoPurple'][i] || 'tempoBlue';
    const arrow = i < comp.timeline.length - 1 ? `<polygon points="${x + 180},824 ${x + 164},815 ${x + 164},833" class="arrow"/>` : '';
    return `
      <rect x="${x}" y="806" width="160" height="48" rx="8" class="tempoBox ${cls}"/>
      <text x="${x + 14}" y="826" class="tempoTitle">${esc(title)}</text>
      ${textLines(text, x + 14, 844, 'tempoText', 13, 13, 1)}
      ${arrow}
    `;
  }).join('');
  return `
    <g>
      <text x="650" y="784" class="sectionTitle">运营节点</text>
      ${boxes}
    </g>
  `;
}

async function renderComp(comp, maps) {
  comp = { ...comp, ...(RECOMMENDATIONS[comp.id] || {}) };
  const detailStars = await loadDetailStars(comp.id);
  comp.board = comp.board.map((unitData) => ({
    ...unitData,
    star: unitData.star || detailStars.get(unitData.name) || starLabel(null, unitData.cost),
  }));
  const assets = await buildAssets(comp, maps);
  const conditionTitleY = Math.max(496, 194 + comp.traits.length * 68 + 30);
  const conditionListY = conditionTitleY + 32;
  const riskY = Math.max(842, conditionListY + comp.conditions.slice(0, 4).length * 52 + 38);
  const leftPanelHeight = riskY - 154;
  const compRow = comp.row.map((name, i) => {
    const u = comp.board.find((unitData) => unitData.name === name);
    return miniChampCard(assets, name, u?.cost || 3, 420 + i * 70, 222, u?.star);
  }).join('\n');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH * OUTPUT_SCALE}" height="${CARD_HEIGHT * OUTPUT_SCALE}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101418"/>
      <stop offset="52%" stop-color="#18201d"/>
      <stop offset="100%" stop-color="#0c1014"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10262a"/>
      <stop offset="55%" stop-color="#07171c"/>
      <stop offset="100%" stop-color="#061016"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#2d4a4a" stroke-width="1"/>
    </pattern>
    <style>
      .root { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif; }
      .title { font-size: 58px; font-weight: 900; fill: #f7e0aa; filter: drop-shadow(0 2px 2px rgba(0,0,0,.55)); }
      .patchPill { font-size: 16px; fill: #fff2cd; font-weight: 900; }
      .headerPanel { fill: rgba(4,12,17,.86); stroke: #b68c4a; stroke-width: 1.3; }
      .emblemRing { fill: #0a201b; stroke: #c8a25f; stroke-width: 2; }
      .navTag { fill: rgba(9,35,35,.8); stroke: #4f846f; stroke-width: 1.2; }
      .navTagActive { fill: rgba(41,31,13,.85); stroke: #d4a853; stroke-width: 1.5; }
      .navTagText { font-size: 17px; fill: #f5ebd1; font-weight: 900; }
      .tierBox { fill: rgba(12,17,20,.92); stroke: #6c6045; stroke-width: 1.2; }
      .tierLabel { font-size: 13px; fill: #f4e6c1; font-weight: 900; }
      .tierText { font-size: 41px; fill: #ffae47; font-weight: 900; }
      .tierNote { font-size: 15px; fill: #ffcb72; font-weight: 900; }
      .headlineBox { fill: rgba(9,34,29,.72); stroke: #2a8367; stroke-width: 1.2; }
      .headline { font-size: 19px; fill: #eaf7e9; font-weight: 900; }
      .headlineSub { font-size: 16px; fill: #b9c9c5; font-weight: 800; }
      .sectionTitle { font-size: 24px; font-weight: 900; fill: #f2bd63; }
      .panel { fill: url(#panel); stroke: #48615e; stroke-width: 1.7; filter: drop-shadow(0 8px 12px rgba(0,0,0,.28)); }
      .traitRow { fill: rgba(5,15,20,.88); stroke: #3d5b58; stroke-width: 1.4; }
      .traitName { font-size: 18px; fill: #f7f1e7; font-weight: 900; }
      .traitSub { font-size: 12px; fill: #aeb9b7; }
      .traitMark { fill: rgba(8,22,24,.95); stroke: #314845; stroke-width: 1; }
      .traitMarkActive { fill: rgba(207,168,73,.28); stroke: #d2ad55; stroke-width: 1.5; }
      .traitMarkText { font-size: 12px; fill: #6f817d; font-weight: 900; }
      .traitMarkTextActive { font-size: 12px; fill: #fff2b0; font-weight: 900; }
      .slot { fill: rgba(11,31,38,.58); stroke: #735b38; stroke-width: 1.2; }
      .frontSlot { fill: rgba(19,45,38,.58); }
      .backSlot { fill: rgba(10,31,44,.58); }
      .rowBadge { stroke-width: 1.1; }
      .rowBadge0 { fill: rgba(84,26,31,.5); stroke: #9b4b4e; }
      .rowBadge1 { fill: rgba(104,70,16,.45); stroke: #c79339; }
      .rowBadge2 { fill: rgba(58,89,19,.42); stroke: #8bbf4b; }
      .rowBadge3 { fill: rgba(16,78,89,.45); stroke: #42b9c4; }
      .rowLabel { font-size: 15px; fill: #f6e5b8; font-weight: 900; }
      .champName { font-size: 16px; fill: #fff7e4; font-weight: 900; }
      .costText { font-size: 14px; fill: #121212; font-weight: 900; }
      .miniName { font-size: 12px; fill: #fff7e4; font-weight: 900; }
      .miniCost { font-size: 10px; fill: #121212; font-weight: 900; }
      .starBadge { fill: rgba(0,0,0,.72); stroke: rgba(255,216,105,.5); stroke-width: .8; }
      .starText { font-size: 13px; fill: #ffd75e; font-weight: 900; letter-spacing: 0; }
      .miniStarText { font-size: 9px; fill: #ffd75e; font-weight: 900; letter-spacing: 0; }
      .itemFrame { fill: #11181b; stroke: #d8a85a; stroke-width: 1.5; }
      .placeholderItem { fill: #25303a; stroke: #d8a85a; stroke-width: 1.5; }
      .itemPanel { fill: rgba(5,15,20,.92); stroke: #354249; stroke-width: 1.8; }
      .panelLabel { font-size: 18px; fill: #f0f4f5; font-weight: 900; }
      .itemLabel { font-size: 13px; fill: #dfe5e8; font-weight: 800; }
      .godPanel { fill: rgba(5,15,20,.92); stroke: #354249; stroke-width: 1.8; }
      .godRow { fill: #0c1316; stroke: #263238; stroke-width: 1.1; }
      .godName { font-size: 15px; fill: #ffe2a3; font-weight: 900; }
      .godText { font-size: 13px; fill: #dce4e6; font-weight: 900; }
      .godHint { font-size: 11px; fill: #aeb8be; font-weight: 800; }
      .recommendPanel { fill: rgba(5,15,20,.92); stroke: #3e5e59; stroke-width: 1.7; }
      .recommendRow { fill: #0c1316; stroke: #263238; stroke-width: 1.1; }
      .augmentTag { fill: rgba(72,150,214,.22); stroke: #66b3ef; stroke-width: 1.2; }
      .augmentTagText { font-size: 12px; fill: #d9f1ff; font-weight: 900; }
      .recommendName { font-size: 14px; fill: #ffe2a3; font-weight: 900; }
      .recommendNote { font-size: 12px; fill: #dce4e6; font-weight: 800; }
      .smallBold { font-size: 16px; fill: #f7e2a6; font-weight: 900; }
      .note { font-size: 15px; fill: #aeb8be; }
      .warn { font-size: 16px; fill: #ffca68; font-weight: 900; }
      .tempoBox { fill: #10161a; stroke: #354249; stroke-width: 1.6; }
      .tempoGreen { stroke: #52bd7b; }
      .tempoBlue { stroke: #4ba1df; }
      .tempoOrange { stroke: #d28a39; }
      .tempoPurple { stroke: #9b5edc; }
      .tempoTitle { font-size: 15px; fill: #f2bd63; font-weight: 900; }
      .tempoText { font-size: 12px; fill: #d9e0e3; font-weight: 800; }
      .conditionDot { fill: rgba(49,157,89,.28); stroke: #78df94; stroke-width: 1.4; }
      .riskDot { fill: rgba(196,54,72,.28); stroke: #ff8f8f; stroke-width: 1.4; }
      .conditionNum { font-size: 13px; fill: #dfffe2; font-weight: 900; }
      .conditionText { font-size: 13px; fill: #d9eee3; font-weight: 800; }
      .riskLine { font-size: 13px; fill: #ffd0d0; font-weight: 800; }
      .riskPanel { fill: rgba(45,9,19,.78); stroke: #b74754; stroke-width: 1.7; }
      .riskTitle { font-size: 21px; fill: #ff8f8f; font-weight: 900; }
      .tipLine { font-size: 14px; fill: #d9e0e3; font-weight: 800; }
      .arrow { fill: #d8d5ca; opacity: .8; }
      .tiny { font-size: 12px; fill: #f7e2a6; font-weight: 900; }
    </style>
  </defs>
  <rect class="root" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#bg)"/>
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#grid)" opacity=".2"/>
  <g class="root">
    <rect x="24" y="18" width="1552" height="112" rx="16" class="headerPanel"/>
    <circle cx="72" cy="72" r="42" class="emblemRing"/>
    ${image(assets.traits[comp.emblem], 43, 43, 58, 58)}
    <text x="126" y="74" class="title">${esc(comp.title)}</text>
    <text x="126" y="104" class="patchPill">金铲铲 S17「星神」 / TFT Set 17 / 17.2 早期判断</text>
    <rect x="454" y="38" width="160" height="42" rx="6" class="navTagActive"/>
    <text x="504" y="64" class="navTagText">阵容定位</text>
    <rect x="626" y="38" width="374" height="42" rx="6" class="navTag"/>
    <text x="646" y="64" class="navTagText">${esc(comp.position)}</text>
    <rect x="1020" y="36" width="118" height="78" rx="6" class="tierBox"/>
    <text x="1042" y="58" class="tierLabel">强度标记</text>
    <text x="1044" y="99" class="tierText">${esc(comp.rating)}</text>
    <text x="1102" y="96" class="tierNote">${esc(comp.tier)}</text>
    <rect x="1160" y="36" width="390" height="78" rx="8" class="headlineBox"/>
    ${textLines(comp.headline, 1192, 64, 'headline', 18, 24, 2)}
    ${textLines(comp.subtitle, 1192, 104, 'headlineSub', 18, 18, 1)}

    <rect x="40" y="142" width="316" height="${leftPanelHeight}" rx="10" class="panel"/>
    <text x="106" y="172" class="sectionTitle">核心羁绊</text>
    ${comp.traits.map((trait, i) => traitRow(assets, trait, 194 + i * 68)).join('\n')}
    <text x="106" y="${conditionTitleY}" class="sectionTitle">适玩条件</text>
    ${renderList(comp.conditions.slice(0, 4), 82, conditionListY, 'conditionText', 18)}

    <rect x="40" y="${riskY}" width="316" height="176" rx="10" class="riskPanel"/>
    <text x="76" y="${riskY + 34}" class="riskTitle">放弃条件 / 风险</text>
    ${renderList(comp.risks.slice(0, 3), 82, riskY + 66, 'riskLine', 20, 38)}

    <rect x="382" y="142" width="812" height="900" rx="18" class="panel"/>
    <text x="650" y="176" class="sectionTitle">阵容组成</text>
    <text x="408" y="207" class="note">终盘结构可按装备和来牌替换高费；棋盘从上到下是前排到后排。</text>
    ${compRow}
    <text x="650" y="320" class="sectionTitle">棋盘站位</text>
    <text x="790" y="320" class="note">前排第一排吃伤害，常规后排第四排；第三排只放接战或防切功能位。</text>
    ${boardSlots()}
    ${comp.board.map((champ) => champCard(assets, champ)).join('\n')}
    ${timeline(comp)}
    ${augmentPanel(comp)}
    ${emblemPanel(assets, comp)}

    <rect x="1222" y="142" width="338" height="900" rx="18" class="panel"/>
    <text x="1250" y="184" class="sectionTitle">核心装备</text>
    ${comp.builds.map((build, i) => itemPanel(assets, { x: 1240, y: 214 + i * 140, title: build.title, items: build.items })).join('\n')}
    ${starGodPanel(assets, comp)}
    <rect x="1240" y="868" width="312" height="146" rx="16" class="recommendPanel"/>
    <text x="1258" y="896" class="panelLabel">转线提醒</text>
    ${textLines(comp.pivot, 1258, 930, 'warn', 19, 21, 3)}
  </g>
</svg>`;
  const outPath = path.join(OUT_DIR, `${comp.id}-17.2-early.svg`);
  await writeFile(outPath, svg.replace(/[ \t]+$/gm, ''));
  return outPath;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const maps = await loadAssetMaps();
  const outputs = [];
  for (const comp of COMPS) {
    outputs.push(await renderComp(comp, maps));
  }
  console.log(JSON.stringify({ outputs }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
