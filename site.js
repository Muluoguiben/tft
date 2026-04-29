const costColors = {
  1: "#7ad77a",
  2: "#51b7ff",
  3: "#c875ff",
  4: "#ffd061",
  5: "#ff9b42",
};

const assets = {
  champions: {
    aatrox: "./assets/s17/champions/亚托克斯__TFT17_Aatrox.png",
    akali: "./assets/s17/champions/阿卡丽__TFT17_Akali.png",
    aurora: "./assets/s17/champions/阿萝拉__TFT17_Aurora.png",
    asol: "./assets/s17/champions/奥瑞利安·索尔__TFT17_AurelionSol.png",
    bard: "./assets/s17/champions/巴德__TFT17_Bard.png",
    belveth: "./assets/s17/champions/卑尔维斯__TFT17_Belveth.png",
    briar: "./assets/s17/champions/贝蕾亚__TFT17_Briar.png",
    caitlyn: "./assets/s17/champions/凯特琳__TFT17_Caitlyn.png",
    corki: "./assets/s17/champions/库奇__TFT17_Corki.png",
    diana: "./assets/s17/champions/黛安娜__TFT17_Diana.png",
    fiora: "./assets/s17/champions/菲奥娜__TFT17_Fiora.png",
    fizz: "./assets/s17/champions/菲兹__TFT17_Fizz.png",
    galio: "./assets/s17/champions/超级机甲__TFT17_Galio.png",
    graves: "./assets/s17/champions/格雷福斯__TFT17_Graves.png",
    illaoi: "./assets/s17/champions/俄洛伊__TFT17_Illaoi.png",
    ivern: "./assets/s17/champions/小木灵__TFT17_IvernMinion.png",
    jhin: "./assets/s17/champions/烬__TFT17_Jhin.png",
    jinx: "./assets/s17/champions/金克丝__TFT17_Jinx.png",
    karma: "./assets/s17/champions/卡尔玛__TFT17_Karma.png",
    kayn: "./assets/s17/champions/拉亚斯特__TFT17_Rhaast.png",
    kindred: "./assets/s17/champions/千珏__TFT17_Kindred.png",
    leblanc: "./assets/s17/champions/乐芙兰__TFT17_Leblanc.png",
    leona: "./assets/s17/champions/蕾欧娜__TFT17_Leona.png",
    lissandra: "./assets/s17/champions/丽桑卓__TFT17_Lissandra.png",
    lulu: "./assets/s17/champions/璐璐__TFT17_Lulu.png",
    maokai: "./assets/s17/champions/茂凯__TFT17_Maokai.png",
    masterYi: "./assets/s17/champions/易__TFT17_MasterYi.png",
    milio: "./assets/s17/champions/米利欧__TFT17_Milio.png",
    mordekaiser: "./assets/s17/champions/莫德凯撒__TFT17_Mordekaiser.png",
    morgana: "./assets/s17/champions/莫甘娜__TFT17_Morgana.png",
    nami: "./assets/s17/champions/娜美__TFT17_Nami.png",
    gnar: "./assets/s17/champions/纳尔__TFT17_Gnar.png",
    nunu: "./assets/s17/champions/努努和威朗普__TFT17_Nunu.png",
    pantheon: "./assets/s17/champions/潘森__TFT17_Pantheon.png",
    poppy: "./assets/s17/champions/波比__TFT17_Poppy.png",
    pyke: "./assets/s17/champions/派克__TFT17_Pyke.png",
    rammus: "./assets/s17/champions/拉莫斯__TFT17_Rammus.png",
    reksai: "./assets/s17/champions/雷克塞__TFT17_RekSai.png",
    riven: "./assets/s17/champions/锐雯__TFT17_Riven.png",
    shen: "./assets/s17/champions/慎__TFT17_Shen.png",
    tahm: "./assets/s17/champions/塔姆__TFT17_TahmKench.png",
    urgot: "./assets/s17/champions/厄加特__TFT17_Urgot.png",
    veigar: "./assets/s17/champions/维迦__TFT17_Veigar.png",
    vex: "./assets/s17/champions/薇古丝__TFT17_Vex.png",
    viktor: "./assets/s17/champions/维克托__TFT17_Viktor.png",
    xayah: "./assets/s17/champions/霞__TFT17_Xayah.png",
    zoe: "./assets/s17/champions/佐伊__TFT17_Zoe.png",
  },
  traits: {
    anima: "./assets/s17/traits/幻灵战队__TFT17_AnimaSquad.png",
    bastion: "./assets/s17/traits/堡垒卫士__TFT17_ResistTank.png",
    darkStar: "./assets/s17/traits/暗星__TFT17_DarkStar.png",
    drx: "./assets/s17/traits/新星特攻队__TFT17_DRX.png",
    flex: "./assets/s17/traits/旅人__TFT17_FlexTrait.png",
    hptank: "./assets/s17/traits/斗士__TFT17_HPTank.png",
    magician: "./assets/s17/traits/魔术师__TFT17_APTrait.png",
    mana: "./assets/s17/traits/神谕__TFT17_ManaTrait.png",
    melee: "./assets/s17/traits/狂战士__TFT17_MeleeTrait.png",
    mecha: "./assets/s17/traits/霸天机甲__TFT17_Mecha.png",
    meeple: "./assets/s17/traits/木灵族__TFT17_Astronaut.png",
    primordian: "./assets/s17/traits/海魔人__TFT17_Primordian.png",
    psyops: "./assets/s17/traits/灵能特工__TFT17_PsyOps.png",
    ranged: "./assets/s17/traits/狙神__TFT17_RangedTrait.png",
    shieldTank: "./assets/s17/traits/重装战士__TFT17_ShieldTank.png",
    space: "./assets/s17/traits/太空律动__TFT17_SpaceGroove.png",
    stargazer: "./assets/s17/traits/观星者__TFT17_Stargazer.png",
    summon: "./assets/s17/traits/牧羊人__TFT17_SummonTrait.png",
  },
  items: {
    nashor: "./assets/s17/items/纳什之牙__TFT_Item_Leviathan.png",
    jeweled: "./assets/s17/items/珠光护手__TFT_Item_JeweledGauntlet.png",
    shojin: "./assets/s17/items/朔极之矛__TFT_Item_SpearOfShojin.png",
    lastWhisper: "./assets/s17/items/最后的轻语__TFT_Item_LastWhisper.png",
    deathblade: "./assets/s17/items/死亡之刃__TFT_Item_Deathblade.png",
    sunfire: "./assets/s17/items/日炎斗篷__TFT_Item_RedBuff.png",
    bramble: "./assets/s17/items/棘刺背心__TFT_Item_BrambleVest.png",
    gargoyle: "./assets/s17/items/石像鬼石板甲__TFT_Item_GargoyleStoneplate.png",
    giantSlayer: "./assets/s17/items/巨人杀手__TFT_Item_MadredsBloodrazor.png",
    rabadon: "./assets/s17/items/灭世者的死亡之帽__TFT_Item_RabadonsDeathcap.png",
    gunblade: "./assets/s17/items/海克斯科技枪刃__TFT_Item_HextechGunblade.png",
    ionic: "./assets/s17/items/离子火花__TFT_Item_IonicSpark.png",
    guinsoo: "./assets/s17/items/鬼索的狂暴之刃__TFT_Item_GuinsoosRageblade.png",
    archangel: "./assets/s17/items/大天使之杖__TFT_Item_ArchangelsStaff.png",
    bloodthirster: "./assets/s17/items/饮血剑__TFT_Item_Bloodthirster.png",
    titan: "./assets/s17/items/泰坦的坚决__TFT_Item_TitansResolve.png",
    hoj: "./assets/s17/items/正义之手__TFT_Item_UnstableConcoction.png",
    infinity: "./assets/s17/items/无尽之刃__TFT_Item_InfinityEdge.png",
    qss: "./assets/s17/items/水银__TFT_Item_Quicksilver.png",
    nightEdge: "./assets/s17/items/夜之锋刃__TFT_Item_GuardianAngel.png",
    sterak: "./assets/s17/items/斯特拉克的挑战护手__TFT_Item_SteraksGage.png",
    runaan: "./assets/s17/items/海妖之怒__TFT_Item_RunaansHurricane.png",
    crownguard: "./assets/s17/items/冕卫__TFT_Item_Crownguard.png",
    redemption: "./assets/s17/items/振奋盔甲__TFT_Item_Redemption.png",
    warmog: "./assets/s17/items/狂徒铠甲__TFT_Item_WarmogsArmor.png",
    adaptive: "./assets/s17/items/适应性头盔__TFT_Item_AdaptiveHelm.png",
    voidStaff: "./assets/s17/items/虚空之杖__TFT_Item_StatikkShiv.png",
  },
  starGods: {
    varus: "./assets/s17/star-gods/韦鲁斯__TFT15_Varus.png",
    kayle: "./assets/s17/star-gods/凯尔__TFT15_Kayle.png",
    yasuo: "./assets/s17/star-gods/亚索__TFT5_Yasuo.png",
    ekko: "./assets/s17/star-gods/艾克__TFT14_Ekko.png",
    soraka: "./assets/s17/star-gods/索拉卡__TFT7_Soraka.png",
  },
};

const comps = [
  {
    id: "nova-95",
    name: "新星九五",
    tier: "OP",
    label: "运营九五",
    rating: "A",
    primary: "graves",
    traits: ["drx", "bastion", "hptank"],
    units: ["caitlyn", "aatrox", "akali", "maokai", "kindred", "tahm", "shen", "graves", "vex"],
    itemsText: "男枪：水银 + 巨杀 + 血手；薇古丝：羊刀 + 法爆 + 科技枪；塔姆/慎吃通用肉装。",
    play: "连胜、高血量、高经济，有 4-2 上 8 稳住并上 9 的节奏。",
    avoid: "低血量、前排不二星、装备太散，或 4 阶段没有上 9 经济。",
    gods: "阿狸/龙王用于高血速 9；艾克修装备；索拉卡低血止损。",
    pivot: "血量低转重装妖姬或机甲龙王；AD 装多保留男枪线。",
    image: "./assets/comps/nova-95-17.2-early.png",
    doc: "./docs/comps/新星九五.md",
    hasFullDetail: true,
  },
  {
    id: "mecha-asol",
    name: "6机甲龙王",
    tier: "OP",
    label: "快8机甲",
    rating: "A",
    primary: "asol",
    traits: ["mecha", "hptank", "darkStar", "melee"],
    units: ["urgot", "asol", "galio", "maokai", "akali", "karma", "jhin"],
    itemsText: "超级机甲：板甲 + 饮血 + 血手；龙王：法爆 + 帽子 + 虚空杖；厄加特/烬吃多余物理装。",
    play: "经济或战力好，4-2 上 8 能搜出三机甲变形框架，目标是 6 机甲。",
    avoid: "只有 3 机甲、龙王没法装、超级机甲没坦装，或低血还想贪上 9。",
    gods: "亚索格子最契合；凯尔补光明装；艾克拆装；索拉卡低血止损。",
    pivot: "机甲断档转新星九五或重装妖姬；只胡厄加特可降为机甲 Flex。",
    image: "./assets/comps/mecha-asol-17.2-early.png",
    doc: "./docs/comps/机甲龙王.md",
    hasFullDetail: true,
  },
  {
    id: "leblanc-vanguard",
    name: "重装妖姬",
    tier: "T1",
    label: "AP 运营",
    rating: "A-",
    primary: "leblanc",
    traits: ["shieldTank", "summon", "mana"],
    units: ["leblanc", "karma", "nunu", "illaoi", "ivern", "mordekaiser", "zoe", "leona"],
    itemsText: "妖姬：羊刀 + 法爆 + 大天使；卡尔玛：青龙刀 + 虚空杖 + 法爆；俄洛伊/努努吃肉装。",
    play: "法系装，8 级能 D 体系四费二星，前期能稳血或经济好。",
    avoid: "无 AP 装，妖姬/卡尔玛被多人卡，或 4-2 经济过差。",
    gods: "韦鲁斯找四费二星；凯尔补装备；艾克拆装；高血可选阿狸。",
    pivot: "妖姬卡住转牧羊维克托；AP 五费来得早转新星九五。",
    image: "./assets/comps/leblanc-vanguard-17.2-early.png",
    doc: "./docs/comps/重装妖姬.md",
    hasFullDetail: true,
  },
  {
    id: "stargazer-xayah",
    name: "观星霞",
    tier: "T1",
    label: "物理运营",
    rating: "A-",
    primary: "xayah",
    traits: ["stargazer", "ranged", "shieldTank"],
    units: ["lulu", "leona", "mordekaiser", "pantheon", "nunu", "xayah", "jhin", "shen", "bard"],
    itemsText: "霞：羊刀 + 无尽 + 轻语；努努：狂徒 + 冕卫 + 适应性；烬吃多余物理装。",
    play: "观星效果强、物理装顺，4-2 能上 8 找霞和努努质量。",
    avoid: "观星效果差、格子危险、无破甲装，或霞/努努被多人卡。",
    gods: "阿狸/龙王适合高血速 9；凯尔补物理装；亚索只在格子好时选。",
    pivot: "观星不强转新星九五；AP 装多转重装妖姬。",
    image: "./assets/comps/stargazer-xayah-17.2-early.png",
    doc: "./docs/comps/观星霞.md",
    hasFullDetail: true,
  },
  {
    id: "shepherd-viktor",
    name: "牧羊维克托",
    tier: "T1",
    label: "条件 AP",
    rating: "B+",
    primary: "viktor",
    traits: ["summon", "mana", "psyops", "magician"],
    units: ["lissandra", "mordekaiser", "ivern", "pyke", "illaoi", "kayn", "viktor", "nami", "bard"],
    itemsText: "维克托：法爆 + 大天使 + 帽子；俄洛伊：板甲 + 狂徒 + 离子；娜美：虚空杖 + 青龙刀。",
    play: "有维克托装备/灵能装备，前排来得早，同行少。",
    avoid: "无维克托、无 AP 输出装，前排弱，或同行卡维克托/俄洛伊。",
    gods: "韦鲁斯首选追星级；凯尔补装备；艾克修装备；索拉卡低血止损。",
    pivot: "维克托被卡转重装妖姬；前排/机甲牌多转机甲龙王。",
    image: "./assets/comps/shepherd-viktor-17.2-early.png",
    doc: "./docs/comps/牧羊维克托.md",
    hasFullDetail: true,
  },
  {
    id: "space-riven",
    name: "太空律动转",
    tier: "T2",
    label: "转职上限",
    rating: "B",
    primary: "riven",
    traits: ["space", "bastion", "melee", "mana"],
    units: ["riven", "masterYi", "tahm", "shen", "milio", "fizz", "karma", "bard", "kayn"],
    itemsText: "锐雯：饮血 + 泰坦 + 无尽/巨杀；易：羊刀 + 水银 + 巨杀；慎/塔姆吃通用肉装。",
    play: "有太空律动转、有铲/转职，锐雯装备好。",
    avoid: "无转职时降级，同行多，锐雯无法二星。",
    gods: "有转职时优先上限和即时战力。",
    pivot: "无转职可转机甲 Flex 或四费拼。",
    image: "./assets/comps/space-riven-17.2-early.png",
    doc: "./docs/comps/太空律动转.md",
    hasFullDetail: true,
  },
  {
    id: "woodling-corki",
    name: "木灵飞机",
    tier: "T2",
    label: "条件上限",
    rating: "B",
    primary: "corki",
    traits: ["meeple", "bastion"],
    units: ["corki", "rammus", "riven", "bard", "fizz", "ivern", "milio", "gnar", "poppy"],
    itemsText: "库奇：法爆 + 无尽 + 正义/蓝 BUFF；拉莫斯：冕卫 + 日炎 + 板甲。",
    play: "3 木灵开、经济强化、4-2 能上 8，体系牌多。",
    avoid: "无木灵基础、血量太低、同行抢四费，或无法二星主 C 主 T。",
    gods: "优先经济、复制器、装备类支持。",
    pivot: "可转机甲 Flex 或其他四费拼。",
    image: "./assets/comps/woodling-corki-17.2-early.png",
    doc: "./docs/comps/木灵飞机.md",
    hasFullDetail: true,
  },
  {
    id: "mecha-flex",
    name: "机甲 Flex",
    tier: "T2",
    label: "稳定兜底",
    rating: "B",
    primary: "urgot",
    traits: ["mecha", "hptank", "darkStar", "melee"],
    units: ["galio", "urgot", "asol", "tahm", "masterYi", "karma", "maokai", "akali", "jhin"],
    itemsText: "主 C 按装备给龙王/剑圣/卡尔玛；加里奥吃通用肉装。",
    play: "法装 + 肉装，需要 4 阶段锁血，拿到光装/神器/幻灵装备。",
    avoid: "没有前排质量，或者没有可用主 C 装备。",
    gods: "亚索/凯尔优先，其次艾克。",
    pivot: "可转重装妖姬、薇古丝九五、太空律动转。",
    image: "./assets/comps/mecha-flex-17.2-early.png",
    doc: "./docs/comps/机甲Flex.md",
    hasFullDetail: true,
  },
  {
    id: "sea-belveth",
    name: "海魔大卑",
    tier: "T2",
    label: "条件赌阵",
    rating: "B",
    primary: "belveth",
    traits: ["primordian", "drx"],
    units: ["reksai", "briar", "aatrox", "caitlyn", "akali", "belveth", "maokai", "kindred"],
    itemsText: "大卑：海妖 + 水银 + 巨杀；阿卡丽：正义 + 夜刃 + 无尽。",
    play: "3 海魔/NOVA 胡，装备对，同行少，3-2 能 D 出二星核心。",
    avoid: "开局不胡、装备不对，或 3 阶段 D 不出二星核心。",
    gods: "按局势选即时战力或经济。",
    pivot: "可转新星战士或其他 NOVA 线。",
    image: "./assets/comps/sea-belveth-17.2-early.png",
    doc: "./docs/comps/海魔大卑.md",
    hasFullDetail: true,
  },
  {
    id: "anima-aurora",
    name: "幻灵阿萝拉",
    tier: "T2",
    label: "高风险武器",
    rating: "C+",
    primary: "aurora",
    traits: ["anima", "shieldTank"],
    units: ["leona", "ivern", "jinx", "illaoi", "diana", "aurora", "leblanc"],
    itemsText: "阿萝拉：法爆 + 纳什 + 炽烈短弓/破防；俄洛伊吃肉装。",
    play: "开局 3 幻灵，3-2 前明确连败，装备合适，需要冲上限。",
    avoid: "普通积分局、无连败节奏、收菜阈值不清，或血量不足。",
    gods: "索拉卡/韦鲁斯/凯尔较优。",
    pivot: "收菜后转稳血，不继续贪。",
    image: "./assets/comps/anima-aurora-17.2-early.png",
    doc: "./docs/comps/幻灵阿萝拉.md",
    hasFullDetail: true,
  },
  {
    id: "woodland-veigar",
    name: "木灵小法师",
    tier: "T2",
    label: "观察阵容",
    rating: "C+",
    primary: "veigar",
    traits: ["meeple", "magician", "darkStar", "flex", "bastion"],
    units: ["poppy", "veigar", "corki", "rammus", "bard", "fizz", "ivern", "lissandra", "karma"],
    itemsText: "小法：纳什 + 法爆 + 青龙刀；库奇：轻语 + 杀人剑 + 破防；拉莫斯：日炎 + 反甲 + 离子。",
    play: "开局小法多，有宝宝学院/复制器，木灵牌自然，8 级能搜 7 木灵，同行少。",
    avoid: "4-2 搜不出 7 木灵框架，装备偏物理，拉莫斯/库奇不能二星，同行抢木灵。",
    gods: "韦鲁斯首选；凯尔补装备；亚索/艾克看格子和突变；索拉卡低血止损。",
    pivot: "小法不胡转木灵飞机；法装多可转重装妖姬；8 级质量差转机甲 Flex。",
    image: "./assets/comps/woodland-veigar-17.1b.png",
    doc: "./docs/comps/木灵小法师.md",
    hasFullDetail: true,
  },
];

const woodlingDetail = {
  traits: [
    { id: "meeple", count: 7, name: "木灵族", desc: "主羁绊，克隆格做三星小法", tiers: [3, 5, 7, 9] },
    { id: "magician", count: 2, name: "魔术师", desc: "小法 + 丽桑卓", tiers: [2, 4, 6] },
    { id: "darkStar", count: 2, name: "暗星", desc: "丽桑卓 + 卡尔玛", tiers: [2, 4, 6] },
    { id: "flex", count: 2, name: "旅人", desc: "小木灵 + 卡尔玛", tiers: [2] },
    { id: "bastion", count: 2, name: "堡垒卫士", desc: "波比 + 拉莫斯", tiers: [2, 4, 6] },
  ],
  boardUnits: [
    { id: "poppy", name: "波比", cost: 1, star: "★★", row: 1, col: 1 },
    { id: "ivern", name: "小木灵", cost: 2, star: "★", row: 1, col: 3 },
    { id: "rammus", name: "拉莫斯", cost: 4, star: "★★", row: 1, col: 5, items: ["sunfire", "bramble", "ionic"] },
    { id: "fizz", name: "菲兹", cost: 3, star: "★★", row: 1, col: 7 },
    { id: "lissandra", name: "丽桑卓", cost: 1, star: "★★", row: 4, col: 1 },
    { id: "corki", name: "库奇", cost: 4, star: "★★", row: 4, col: 2, items: ["lastWhisper", "deathblade", "guardbreaker"] },
    { id: "veigar", name: "小法", cost: 1, star: "三星", row: 4, col: 4, items: ["nashor", "jeweled", "shojin"] },
    { id: "karma", name: "卡尔玛", cost: 4, star: "★", row: 4, col: 6 },
    { id: "bard", name: "巴德", cost: 5, star: "★", row: 4, col: 7 },
  ],
  builds: [
    { title: "小法：纳什 + 法爆 + 青龙刀", items: [["nashor", "纳什"], ["jeweled", "法爆"], ["shojin", "青龙刀"]] },
    { title: "库奇：轻语 + 杀人剑 + 破防", items: [["lastWhisper", "轻语"], ["deathblade", "杀人剑"], ["guardbreaker", "破防者"]] },
    { title: "拉莫斯：日炎 + 反甲 + 离子", items: [["sunfire", "日炎"], ["bramble", "反甲"], ["ionic", "离子"]] },
  ],
  starGods: [
    ["varus", "韦鲁斯", "首选：三星 / 复制器"],
    ["kayle", "凯尔", "补装备，抬上限"],
    ["yasuo", "亚索", "格子好才选"],
    ["ekko", "艾克", "拆装 / 突变"],
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

const app = document.querySelector("#app");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function previewAsset(src) {
  if (!src) return src;
  if (src.startsWith("./assets/s17/champions/")) {
    return src.replace("./assets/s17/champions/", "./assets/s17/champions/preview/").replace(/\.png$/, ".jpg");
  }
  if (src.startsWith("./assets/s17/star-gods/")) {
    return src.replace("./assets/s17/star-gods/", "./assets/s17/star-gods/preview/").replace(/\.png$/, ".jpg");
  }
  return src;
}

function compPreviewImage(comp) {
  if (!comp.image) return "";
  return comp.image.replace("./assets/comps/", "./assets/comps/preview/").replace(/\.png$/, ".jpg");
}

function img(src, alt, options = {}) {
  const node = document.createElement("img");
  node.src = src;
  node.alt = alt;
  node.loading = options.loading || "lazy";
  node.decoding = "async";
  if (options.fetchPriority) node.fetchPriority = options.fetchPriority;
  return node;
}

function iconForUnit(id) {
  return previewAsset(assets.champions[id]) || assets.traits.meeple;
}

function miniCard(unitId) {
  const unit = findUnit(unitId);
  const card = el("div", "mini-card");
  card.style.setProperty("--cost", costColors[unit.cost || 3]);
  card.append(img(iconForUnit(unitId), unit.name || unitId));
  if (unit.cost) card.append(el("span", "cost-bubble", String(unit.cost)));
  card.append(el("span", "mini-name", unit.name || unitId));
  return card;
}

function findUnit(id) {
  const named = {
    aatrox: ["亚托克斯", 1], akali: ["阿卡丽", 2], aurora: ["阿萝拉", 4], asol: ["龙王", 4], bard: ["巴德", 5],
    belveth: ["卑尔维斯", 4], briar: ["贝蕾亚", 3], caitlyn: ["凯特琳", 1], corki: ["库奇", 4],
    diana: ["黛安娜", 3], fiora: ["菲奥娜", 5], fizz: ["菲兹", 3], galio: ["超级机甲", 4],
    graves: ["格雷福斯", 5], illaoi: ["俄洛伊", 3], ivern: ["小木灵", 2], jhin: ["烬", 5], jinx: ["金克丝", 2],
    karma: ["卡尔玛", 4], kayn: ["拉亚斯特", 3], kindred: ["千珏", 4], leblanc: ["妖姬", 4],
    leona: ["蕾欧娜", 1], lissandra: ["丽桑卓", 1], lulu: ["璐璐", 3], maokai: ["茂凯", 3], masterYi: ["易", 4],
    milio: ["米利欧", 2], mordekaiser: ["莫德凯撒", 2], morgana: ["莫甘娜", 5], nami: ["娜美", 4],
    gnar: ["纳尔", 3], nunu: ["努努", 4], pantheon: ["潘森", 2], poppy: ["波比", 1], pyke: ["派克", 2],
    rammus: ["拉莫斯", 4], reksai: ["雷克塞", 2], riven: ["锐雯", 4], shen: ["慎", 5],
    tahm: ["塔姆", 4], urgot: ["厄加特", 3], veigar: ["小法", 1], vex: ["薇古丝", 5],
    viktor: ["维克托", 3], xayah: ["霞", 4], zoe: ["佐伊", 2],
  };
  const [name, cost] = named[id] || [id, 3];
  return { name, cost };
}

function itemNode(key, label) {
  const wrap = el("div", "item-cell");
  if (key === "guardbreaker") {
    wrap.append(el("div", "placeholder-item", "破"));
  } else {
    const icon = img(assets.items[key], label);
    icon.className = "item-icon";
    wrap.append(icon);
  }
  wrap.append(el("span", "", label));
  return wrap;
}

function renderHome(filterTier) {
  app.replaceChildren();
  const hero = el("section", "tier-hero");
  hero.innerHTML = `
    <div>
      <div class="eyebrow">Set 17 Meta Comps</div>
      <h1>阵容梯度首页</h1>
      <p>按 OP / T1 / T2 管理阵容池。点击阵容卡进入详情页，查看站位、装备、星神和运营节奏。</p>
    </div>
    <div class="tier-tabs">
      <a href="#/" class="${filterTier ? "" : "active"}">全部</a>
      <a href="#/tier/OP" class="${filterTier === "OP" ? "active" : ""}">OP</a>
      <a href="#/tier/T1" class="${filterTier === "T1" ? "active" : ""}">T1</a>
      <a href="#/tier/T2" class="${filterTier === "T2" ? "active" : ""}">T2</a>
    </div>
  `;
  app.append(hero);

  const layout = el("section", "tier-layout");
  const board = el("div", "tier-board");
  ["OP", "T1", "T2"].forEach((tier) => {
    if (filterTier && filterTier !== tier) return;
    const section = el("section", "tier-section");
    section.append(el("div", `tier-section-title tier-${tier.toLowerCase()}`, tier));
    const grid = el("div", "tier-card-grid");
    comps.filter((comp) => comp.tier === tier).forEach((comp) => grid.append(compCard(comp)));
    section.append(grid);
    board.append(section);
  });
  layout.append(board);

  const aside = el("aside", "meta-aside");
  aside.innerHTML = `
    <section class="panel">
      <div class="section-heading">OP 条件</div>
      <div class="condition-tags">
        <span>高血量</span><span>经济好</span><span>装备契合</span><span>低同行</span>
      </div>
    </section>
    <section class="panel">
      <div class="section-heading">版本提醒</div>
      <ul class="bullet-list">
        <li>当前按 17.2 早期判断整理，金铲铲端内更新后仍需复核。</li>
        <li>早期赛季波动大，阵容强度必须继续用实战和数据站复核。</li>
        <li>比赛目标冠军，优先练 OP 和 T1，T2 只在胡牌或特殊条件下进。</li>
      </ul>
    </section>
  `;
  layout.append(aside);
  app.append(layout);
}

function compCard(comp) {
  const card = document.createElement("a");
  card.className = `comp-card tier-${comp.tier.toLowerCase()}`;
  card.href = `#/comp/${comp.id}`;
  card.innerHTML = `
    <div class="comp-card-bg"><img src="${iconForUnit(comp.primary)}" alt="${comp.name}" loading="lazy" decoding="async" /></div>
    <div class="comp-card-top">
      <span class="tier-chip">${comp.tier}</span>
      <span class="label-chip">${comp.label}</span>
    </div>
    <div class="comp-card-traits">${comp.traits.map((id) => `<img src="${assets.traits[id]}" alt="${id}" loading="lazy" decoding="async" />`).join("")}</div>
    <div class="comp-card-name">${comp.name}</div>
    <div class="comp-card-rating">${comp.rating}</div>
  `;
  return card;
}

function renderDetail(id) {
  const comp = comps.find((item) => item.id === id) || comps[0];
  if (comp.id === "woodland-veigar") {
    renderWoodlingDetail(comp);
    return;
  }
  renderBasicDetail(comp);
}

function renderBasicDetail(comp) {
  app.replaceChildren();
  app.append(detailHero(comp));
  const grid = el("section", "layout-grid basic-detail-grid");
  const left = el("aside", "left-column");
  left.append(textPanel("适玩条件", [comp.play], "condition-panel"));
  left.append(textPanel("放弃条件 / 风险", [comp.avoid], "danger-panel"));
  const center = el("section", "center-column");
  if (comp.image) {
    center.append(renderOneflowImage(comp));
  }
  const unitsPanel = el("section", "panel");
  unitsPanel.append(el("div", "section-heading", "阵容组成"));
  const row = el("div", "comp-row flexible");
  comp.units.forEach((id) => row.append(miniCard(id)));
  unitsPanel.append(row);
  center.append(unitsPanel);
  center.append(textPanel("装备与运营", [comp.itemsText, comp.gods, comp.pivot]));
  const right = el("aside", "right-column");
  const traitsPanel = el("section", "panel");
  traitsPanel.append(el("div", "section-heading", "核心羁绊"));
  const tags = el("div", "condition-tags");
  comp.traits.forEach((id) => {
    const tag = el("span");
    tag.append(img(assets.traits[id], id));
    tag.append(document.createTextNode(traitName(id)));
    tags.append(tag);
  });
  traitsPanel.append(tags);
  right.append(traitsPanel);
  right.append(textPanel("后续状态", [comp.hasFullDetail ? "已完成一图流结构稿。" : "基础详情已接入；完整站位图卡后续补齐。"]));
  if (comp.doc) {
    const docPanel = el("section", "panel");
    docPanel.innerHTML = `<a class="image-link" href="${comp.doc}">查看中文阵容卡</a>`;
    right.append(docPanel);
  }
  grid.append(left, center, right);
  app.append(grid);
}

function renderOneflowImage(comp) {
  const panel = el("section", "panel oneflow-panel");
  const header = el("div", "panel-title-row");
  header.innerHTML = `
    <div>
      <div class="section-heading">阵容一图流</div>
      <p class="muted">包含阵容组成、站位、装备、星神、运营节奏和风险点。</p>
    </div>
    <a class="image-link" href="${comp.image}">查看原图</a>
  `;
  panel.append(header);
  const link = document.createElement("a");
  link.href = comp.image;
  link.className = "oneflow-link";
  const preview = img(compPreviewImage(comp), `${comp.name} 一图流预览`);
  preview.className = "oneflow-image";
  preview.width = 2200;
  preview.height = 1265;
  link.append(preview);
  panel.append(link);
  return panel;
}

function detailHero(comp) {
  const hero = el("section", "hero-panel");
  hero.innerHTML = `
    <div class="comp-identity">
      <img class="comp-avatar" src="${iconForUnit(comp.primary)}" alt="${comp.name}" loading="eager" decoding="async" fetchpriority="high" />
      <div>
        <div class="eyebrow">${comp.label} / ${comp.tier}</div>
        <h1>${comp.name}</h1>
        <p>${comp.play}</p>
      </div>
    </div>
    <div class="hero-badges">
      <a class="back-link" href="#/">返回梯度首页</a>
      <div class="tier-badge"><span>强度标记</span><strong>${comp.rating}</strong><em>${comp.tier}</em></div>
    </div>
  `;
  return hero;
}

function textPanel(title, lines, className = "") {
  const panel = el("section", `panel ${className}`);
  panel.append(el("div", "section-heading", title));
  const list = el("ul", "bullet-list");
  lines.forEach((line) => list.append(el("li", "", line)));
  panel.append(list);
  return panel;
}

function traitName(id) {
  return {
    anima: "幻灵战队", bastion: "堡垒卫士", darkStar: "暗星", drx: "新星特攻队",
    flex: "旅人", hptank: "斗士", magician: "魔术师", mana: "神谕", melee: "狂战士", mecha: "霸天机甲", meeple: "木灵族",
    primordian: "海魔人", psyops: "灵能特工", shieldTank: "重装战士",
    ranged: "狙神", space: "太空律动", stargazer: "观星者", summon: "牧羊人",
  }[id] || id;
}

function renderWoodlingDetail(comp) {
  app.replaceChildren();
  app.append(detailHero(comp));
  const grid = el("section", "layout-grid");
  const left = el("aside", "left-column");
  left.append(renderTraits(woodlingDetail.traits));
  left.append(numberPanel("适玩条件", woodlingDetail.conditions, "condition-panel"));
  left.append(numberPanel("放弃条件 / 风险", woodlingDetail.risks, "danger-panel"));
  const center = el("section", "center-column");
  if (comp.image) {
    center.append(renderOneflowImage(comp));
  }
  center.append(renderBoardPanel(comp, woodlingDetail.boardUnits));
  center.append(renderTimeline());
  center.append(renderTwoUp());
  const right = el("aside", "right-column");
  right.append(renderBuilds(woodlingDetail.builds));
  right.append(renderStarGods(woodlingDetail.starGods));
  right.append(textPanel("强条件", ["宝宝学院、复制器、D 牌强化、装备补充、低同行。"]));
  grid.append(left, center, right);
  app.append(grid);
}

function numberPanel(title, lines, className) {
  const panel = el("section", `panel ${className}`);
  panel.append(el("div", "section-heading", title));
  const list = el("ol", "number-list");
  lines.forEach((line) => list.append(el("li", "", line)));
  panel.append(list);
  return panel;
}

function renderTraits(traits) {
  const panel = el("section", "panel");
  panel.append(el("div", "section-heading", "核心羁绊"));
  const root = el("div", "traits-list");
  traits.forEach((trait) => {
    const row = el("div", "trait-row");
    row.append(img(assets.traits[trait.id], trait.name));
    const text = el("div");
    text.append(el("div", "trait-main", `${trait.count} ${trait.name}`));
    text.append(el("div", "trait-sub", trait.desc));
    row.append(text);
    const tiers = el("div", "trait-tiers");
    trait.tiers.forEach((tier) => tiers.append(el("span", `trait-tier${tier === trait.count ? " active" : ""}`, String(tier))));
    row.append(tiers);
    root.append(row);
  });
  panel.append(root);
  return panel;
}

function renderBoardPanel(comp, units) {
  const panel = el("section", "panel board-panel");
  panel.id = "board";
  const title = el("div", "panel-title-row");
  title.innerHTML = `
    <div>
      <div class="section-heading">阵容组成</div>
      <p class="muted">8 人口成型，9 人口补卡尔玛；棋盘从上到下是前排到后排。</p>
    </div>
    <a class="image-link" href="./assets/comps/woodland-veigar-17.1b.png">查看大图</a>
  `;
  panel.append(title);
  const row = el("div", "comp-row");
  comp.units.forEach((id) => row.append(miniCard(id)));
  panel.append(row);
  const wrap = el("div", "board-wrap");
  const labels = el("div", "row-labels");
  ["前排", "第二", "第三", "后排"].forEach((label) => labels.append(el("span", "", label)));
  const board = el("div", "board-grid");
  for (let r = 1; r <= 4; r += 1) {
    for (let c = 1; c <= 7; c += 1) {
      const cell = el("div", "hex-cell");
      Object.assign(cell.style, cellPosition(r, c));
      board.append(cell);
    }
  }
  units.forEach((unit) => board.append(unitCard(unit)));
  wrap.append(labels, board);
  panel.append(wrap);
  return panel;
}

function unitCard(unit) {
  const card = el("div", "unit-card");
  card.style.setProperty("--cost", costColors[unit.cost]);
  Object.assign(card.style, cellPosition(unit.row, unit.col));
  card.append(img(iconForUnit(unit.id), unit.name));
  card.append(el("span", "cost-bubble", String(unit.cost)));
  card.append(el("span", "unit-name", unit.name));
  card.append(el("span", "stars", unit.star));
  if (unit.items?.length) {
    const items = el("div", "unit-items");
    unit.items.forEach((key) => {
      if (key === "guardbreaker") {
        const placeholder = el("span", "placeholder-item", "破");
        placeholder.style.width = "20px";
        placeholder.style.height = "20px";
        placeholder.style.fontSize = "12px";
        items.append(placeholder);
      } else {
        items.append(img(assets.items[key], key));
      }
    });
    card.append(items);
  }
  return card;
}

function cellPosition(row, col) {
  const xStep = 88;
  const yStep = 102;
  const offset = row % 2 === 0 ? 44 : 0;
  return { left: `${(col - 1) * xStep + offset}px`, top: `${(row - 1) * yStep}px` };
}

function renderBuilds(builds) {
  const panel = el("section", "panel");
  panel.append(el("div", "section-heading", "核心装备"));
  const root = el("div", "build-list");
  builds.forEach((build) => {
    const card = el("div", "build-card");
    card.append(el("div", "build-title", build.title));
    const row = el("div", "item-row");
    build.items.forEach(([key, label]) => row.append(itemNode(key, label)));
    card.append(row);
    root.append(card);
  });
  panel.append(root);
  return panel;
}

function renderStarGods(gods) {
  const panel = el("section", "panel");
  panel.append(el("div", "section-heading", "推荐星神"));
  const root = el("div", "star-god-list");
  gods.forEach(([key, name, desc]) => {
    const row = el("div", "star-god-row");
    row.append(img(previewAsset(assets.starGods[key]), name));
    row.append(el("div", "star-god-name", name));
    row.append(el("div", "star-god-desc", desc));
    root.append(row);
  });
  panel.append(root);
  panel.append(el("div", "warning-strip", "不优先：伊芙琳 / 阿狸 / 奥瑞利安·索尔 / 锤石"));
  return panel;
}

function renderTimeline() {
  const panel = el("section", "panel");
  panel.innerHTML = `
    <div class="section-heading">运营节奏</div>
    <div class="timeline">
      <div class="timeline-card green"><strong>2 阶段</strong><span>不升人口，木灵 + 牧羊过渡，优先保血和留体系牌。</span></div>
      <div class="timeline-card blue"><strong>3-1 / 3-2</strong><span>看小法数量，不为一张牌乱搜；保持经济进 4 阶段。</span></div>
      <div class="timeline-card orange"><strong>4-2</strong><span>8 级大搜 7 木灵框架，先保拉莫斯和库奇二星。</span></div>
      <div class="timeline-card purple"><strong>后期</strong><span>木灵格子做三星小法，9 人口补卡尔玛和整体质量。</span></div>
    </div>
  `;
  return panel;
}

function renderTwoUp() {
  const panel = el("section", "panel two-up");
  panel.innerHTML = `
    <div>
      <div class="section-heading">操作细节</div>
      <ul class="bullet-list">
        <li>小法不要固定角落，防切入和钩子时往中间收。</li>
        <li>库奇和巴德分角站，拉开范围伤害并保护小法。</li>
        <li>没有 7 木灵不要空等；木灵牌多但小法慢，可以转木灵飞机。</li>
      </ul>
    </div>
    <div>
      <div class="section-heading">转阵出口</div>
      <ul class="bullet-list">
        <li>木灵飞机：木灵牌多，但小法三星太慢。</li>
        <li>重装妖姬：法装多但木灵断档。</li>
        <li>机甲 Flex：装备杂，8 级需要马上锁血。</li>
      </ul>
    </div>
  `;
  return panel;
}

function route() {
  const hash = window.location.hash || "#/";
  const [, type, value] = hash.split("/");
  if (type === "comp") {
    renderDetail(value);
  } else if (type === "tier") {
    renderHome(value);
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
