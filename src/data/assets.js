/**
 * 资源路径表（champions / traits / items / starGods）。
 *
 * 原始路径保留 PNG，便于和 data/s17 的资源名一致；页面渲染时必须使用
 * previewAsset() 转成 preview/*.avif，避免 Pages 上重新加载大体积 PNG。
 */
export function previewAsset(src) {
  if (!src) return src;
  if (src.includes("/preview/")) return src.replace(/\.(?:png|jpe?g)$/i, ".avif");
  if (src.startsWith("./assets/s17/champions/")) {
    return src.replace("./assets/s17/champions/", "./assets/s17/champions/preview/").replace(/\.png$/, ".avif");
  }
  if (src.startsWith("./assets/s17/items/")) {
    return src.replace("./assets/s17/items/", "./assets/s17/items/preview/").replace(/\.png$/, ".avif");
  }
  if (src.startsWith("./assets/s17/traits/")) {
    return src.replace("./assets/s17/traits/", "./assets/s17/traits/preview/").replace(/\.png$/, ".avif");
  }
  if (src.startsWith("./assets/s17/star-gods/")) {
    return src.replace("./assets/s17/star-gods/", "./assets/s17/star-gods/preview/").replace(/\.png$/, ".avif");
  }
  return src;
}

export function imageExtension(src, extension) {
  return src.replace(/\.(?:png|jpe?g)$/i, `.${extension}`);
}

export function compPreviewImage(comp) {
  if (!comp.image) return "";
  if (comp.image.startsWith("./assets/comps/full/")) {
    return comp.image.replace("./assets/comps/full/", "./assets/comps/preview/");
  }
  if (comp.image.startsWith("./assets/comps/preview/")) return comp.image;
  return comp.image.replace("./assets/comps/", "./assets/comps/preview/").replace(/\.png$/, ".jpg");
}

export function compFullImage(comp) {
  if (!comp.image) return "";
  if (comp.image.startsWith("./assets/comps/full/")) return comp.image;
  if (comp.image.startsWith("./assets/comps/preview/")) {
    return comp.image.replace("./assets/comps/preview/", "./assets/comps/full/");
  }
  return comp.image.replace("./assets/comps/", "./assets/comps/full/").replace(/\.png$/, ".jpg");
}

export function compFullImageAvif(comp) {
  return imageExtension(compFullImage(comp), "avif");
}

export const assets = {
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
    arbiter: "./assets/s17/traits/法官__TFT17_ADMIN.png",
    bastion: "./assets/s17/traits/堡垒卫士__TFT17_ResistTank.png",
    challenger: "./assets/s17/traits/挑战者__TFT17_ASTrait.png",
    darkStar: "./assets/s17/traits/暗星__TFT17_DarkStar.png",
    drx: "./assets/s17/traits/新星特攻队__TFT17_DRX.png",
    fateweaver: "./assets/s17/traits/织命者__TFT17_Fateweaver.png",
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
    rogue: "./assets/s17/traits/游侠__TFT17_AssassinTrait.png",
    shieldTank: "./assets/s17/traits/重装战士__TFT17_ShieldTank.png",
    space: "./assets/s17/traits/太空律动__TFT17_SpaceGroove.png",
    stargazer: "./assets/s17/traits/观星者__TFT17_Stargazer.png",
    summon: "./assets/s17/traits/牧羊人__TFT17_SummonTrait.png",
    timebreaker: "./assets/s17/traits/未来战士__TFT17_Timebreaker.png",
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
    // 注意：starGods 与 champions 是两套独立的资源，key 不冲突。
    // 例如 starGods.asol 指向 TFT16_AurelionSol.png（旧赛季皮肤当星神），
    // champions.asol 指向 TFT17_AurelionSol.png（本赛季棋子）。
    varus: "./assets/s17/star-gods/韦鲁斯__TFT15_Varus.png",
    kayle: "./assets/s17/star-gods/凯尔__TFT15_Kayle.png",
    yasuo: "./assets/s17/star-gods/亚索__TFT5_Yasuo.png",
    ekko: "./assets/s17/star-gods/艾克__TFT14_Ekko.png",
    soraka: "./assets/s17/star-gods/索拉卡__TFT7_Soraka.png",
    ahri: "./assets/s17/star-gods/阿狸__TFT16_Ahri.png",
    asol: "./assets/s17/star-gods/奥瑞利安·索尔__TFT16_AurelionSol.png",
    thresh: "./assets/s17/star-gods/锤石__TFT7_Thresh.png",
    evelynn: "./assets/s17/star-gods/伊芙琳__TFT4_Evelynn.png",
  },
};
