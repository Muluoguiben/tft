// 数据层全部从 ./src/data/ 导入，site.js 只保留渲染、路由、工具函数。
// 详情见 src/data/*.js 和 src/data/comps/*.js 的文件顶部注释。
import { costColors } from "./src/data/cost-colors.js";
import { assets } from "./src/data/assets.js";
import {
  CURRENT_SNAPSHOT_ID,
  REVIEW_DATE,
  snapshots,
  snapshotFilters,
} from "./src/data/snapshots.js";
import { findUnit } from "./src/data/champions.js";
import { comps } from "./src/data/comps-index.js";
import woodlingDetail from "./src/data/comps/woodland-veigar.js";

let app = document.querySelector("#app");

function mountApp() {
  app = document.querySelector("#app");
  return app;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function previewAsset(src) {
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

function compPreviewImage(comp) {
  if (!comp.image) return "";
  if (comp.image.startsWith("./assets/comps/full/")) {
    return comp.image.replace("./assets/comps/full/", "./assets/comps/preview/");
  }
  if (comp.image.startsWith("./assets/comps/preview/")) return comp.image;
  return comp.image.replace("./assets/comps/", "./assets/comps/preview/").replace(/\.png$/, ".jpg");
}

function compFullImage(comp) {
  if (!comp.image) return "";
  if (comp.image.startsWith("./assets/comps/full/")) return comp.image;
  if (comp.image.startsWith("./assets/comps/preview/")) {
    return comp.image.replace("./assets/comps/preview/", "./assets/comps/full/");
  }
  return comp.image.replace("./assets/comps/", "./assets/comps/full/").replace(/\.png$/, ".jpg");
}

function imageExtension(src, extension) {
  return src.replace(/\.(?:png|jpe?g)$/i, `.${extension}`);
}

function compFullImageAvif(comp) {
  return imageExtension(compFullImage(comp), "avif");
}

function img(src, alt, options = {}) {
  const node = document.createElement("img");
  node.src = options.raw ? src : previewAsset(src);
  node.alt = alt;
  node.loading = options.loading || "lazy";
  node.decoding = "async";
  if (options.fetchPriority) node.fetchPriority = options.fetchPriority;
  return node;
}

function picture(src, alt, options = {}) {
  const node = document.createElement("picture");
  const source = document.createElement("source");
  source.type = "image/avif";
  source.srcset = imageExtension(src, "avif");
  node.append(source);

  const fallback = img(src, alt, { raw: true, loading: options.loading, fetchPriority: options.fetchPriority });
  if (options.className) fallback.className = options.className;
  if (options.width) fallback.width = options.width;
  if (options.height) fallback.height = options.height;
  node.append(fallback);
  return node;
}

function iconForUnit(id) {
  return previewAsset(assets.champions[id]) || previewAsset(assets.traits.meeple);
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

function snapshotById(id) {
  return snapshots.find((snapshot) => snapshot.id === id) || snapshots[0];
}

function statusText(status) {
  return {
    current: "当前推荐",
    watch: "待复核",
    archived: "已归档",
  }[status] || status;
}

function statusClass(status) {
  return {
    current: "status-current",
    watch: "status-watch",
    archived: "status-archived",
  }[status] || "status-watch";
}

function resolveSnapshotFilter(id = "current") {
  return snapshotFilters.find((filter) => filter.id === id) || snapshotFilters[0];
}

function homeHref({ tier, snapshotId = "current" } = {}) {
  const tierSuffix = tier ? `/tier/${tier}` : "";
  if (snapshotId === "current" && tier) return `#/tier/${tier}`;
  if (snapshotId === "current") return "#/";
  return `#/snapshot/${snapshotId}${tierSuffix}`;
}

function filteredComps(filterTier, snapshotFilterId) {
  const snapshotFilter = resolveSnapshotFilter(snapshotFilterId);
  return comps.filter((comp) => (!filterTier || comp.tier === filterTier) && snapshotFilter.matches(comp));
}

function tierCounts(items) {
  return ["OP", "T1", "T2"].reduce((acc, tier) => {
    acc[tier] = items.filter((comp) => comp.tier === tier).length;
    return acc;
  }, {});
}

function renderHome(filterTier, snapshotFilterId = "current") {
  app.replaceChildren();
  const snapshotFilter = resolveSnapshotFilter(snapshotFilterId);
  const allVisible = filteredComps(undefined, snapshotFilter.id);
  const counts = tierCounts(allVisible);
  const hero = el("section", "tier-hero");
  hero.innerHTML = `
    <div>
      <div class="eyebrow">Set 17 Meta Comps · ${snapshotFilter.title}</div>
      <h1>阵容梯度首页</h1>
      <p>${snapshotFilter.description}</p>
      <div class="snapshot-summary">
        <span>OP ${counts.OP || 0}</span>
        <span>T1 ${counts.T1 || 0}</span>
        <span>T2 ${counts.T2 || 0}</span>
        <span>更新时间 ${REVIEW_DATE}</span>
      </div>
    </div>
    <div class="hero-filter-stack">
      <div class="snapshot-tabs">
        ${snapshotFilters.map((filter) => `<a href="${homeHref({ snapshotId: filter.id, tier: filterTier })}" class="${snapshotFilter.id === filter.id ? "active" : ""}">${filter.label}</a>`).join("")}
      </div>
      <div class="tier-tabs">
        <a href="${homeHref({ snapshotId: snapshotFilter.id })}" class="${filterTier ? "" : "active"}">全部</a>
        <a href="${homeHref({ snapshotId: snapshotFilter.id, tier: "OP" })}" class="${filterTier === "OP" ? "active" : ""}">OP</a>
        <a href="${homeHref({ snapshotId: snapshotFilter.id, tier: "T1" })}" class="${filterTier === "T1" ? "active" : ""}">T1</a>
        <a href="${homeHref({ snapshotId: snapshotFilter.id, tier: "T2" })}" class="${filterTier === "T2" ? "active" : ""}">T2</a>
      </div>
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
    const tierItems = filteredComps(tier, snapshotFilter.id);
    if (tierItems.length) {
      tierItems.forEach((comp) => grid.append(compCard(comp)));
    } else {
      grid.append(el("div", "empty-state", "这个时间分类下暂无该梯度阵容。"));
    }
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
        <li>当前快照是 ${snapshotById(CURRENT_SNAPSHOT_ID).label} / ${snapshotById(CURRENT_SNAPSHOT_ID).patch}。</li>
        <li>待复核阵容不能当无脑答案，必须看来源版本、同行和实战条件。</li>
        <li>旧日期内容会保留在时间筛选里，不再覆盖当前判断。</li>
      </ul>
    </section>
  `;
  layout.append(aside);
  app.append(layout);
}

function compCard(comp) {
  const card = document.createElement("a");
  card.className = `comp-card tier-${comp.tier.toLowerCase()}`;
  card.href = `#/react/comp/${comp.id}`;
  const traitTags = comp.traits
    .map((id) => {
      const name = traitName(id);
      return `<span title="${name}">${name.slice(0, 2)}</span>`;
    })
    .join("");
  card.innerHTML = `
    <div class="comp-card-bg"><img src="${iconForUnit(comp.primary)}" alt="${comp.name}" loading="lazy" decoding="async" /></div>
    <div class="comp-card-top">
      <span class="tier-chip">${comp.tier}</span>
      <span class="label-chip">${comp.label}</span>
    </div>
    <div class="comp-card-traits" aria-label="${comp.traits.map(traitName).join("、")}">${traitTags}</div>
    <div class="comp-card-status ${statusClass(comp.status)}">${statusText(comp.status)}</div>
    <div class="comp-card-name">${comp.name}</div>
    <div class="comp-card-meta">${comp.patch} · ${comp.reviewedAt}</div>
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
  right.append(renderSnapshotPanel(comp));
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
    <a class="image-link" href="${compFullImageAvif(comp)}">查看高清图</a>
  `;
  panel.append(header);
  const link = document.createElement("a");
  link.href = compFullImageAvif(comp);
  link.className = "oneflow-link";
  const preview = picture(compPreviewImage(comp), `${comp.name} 一图流预览`, {
    className: "oneflow-image",
    width: 2200,
    height: 1265,
  });
  link.append(preview);
  panel.append(link);
  return panel;
}

function detailHero(comp) {
  const sourceNote = comp.sourcePatch === comp.patch ? comp.patch : `${comp.sourcePatch} 数据`;
  const hero = el("section", "hero-panel");
  hero.innerHTML = `
    <div class="comp-identity">
      <img class="comp-avatar" src="${iconForUnit(comp.primary)}" alt="${comp.name}" loading="eager" decoding="async" fetchpriority="high" />
      <div>
        <div class="eyebrow">${comp.label} / ${comp.tier} / ${comp.patch}</div>
        <h1>${comp.name}</h1>
        <p>${comp.play}</p>
        <div class="detail-meta-row">
          <span>${statusText(comp.status)}</span>
          <span>评估 ${comp.reviewedAt}</span>
          <span>来源 ${sourceNote}</span>
        </div>
      </div>
    </div>
    <div class="hero-badges">
      <a class="back-link" href="#/">返回梯度首页</a>
      <div class="tier-badge"><span>强度标记</span><strong>${comp.rating}</strong><em>${comp.tier}</em></div>
    </div>
  `;
  return hero;
}

function renderSnapshotPanel(comp) {
  const snapshot = snapshotById(comp.snapshotId);
  const origin = comp.originSnapshotId ? snapshotById(comp.originSnapshotId) : null;
  const panel = el("section", "panel snapshot-panel");
  panel.append(el("div", "section-heading", "数据快照"));
  const rows = [
    ["当前归类", `${snapshot.label} · ${snapshot.patch}`],
    ["阵容状态", statusText(comp.status)],
    ["来源版本", comp.sourcePatch],
    ["来源更新", comp.sourceUpdatedAt],
    ["上次梯度", comp.previousTier],
    ["置信度", comp.confidence],
  ];
  if (origin) rows.splice(1, 0, ["历史来源", `${origin.label} · ${origin.patch}`]);
  const table = el("div", "snapshot-table");
  rows.forEach(([key, value]) => {
    const row = el("div", "snapshot-row");
    row.append(el("span", "", key));
    row.append(el("strong", "", value));
    table.append(row);
  });
  panel.append(table);
  if (comp.status === "watch") {
    panel.append(el("div", "warning-strip", "这套阵容仍需当前版本数据或实战复核，比赛里不要无条件强玩。"));
  }
  return panel;
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
    anima: "幻灵战队", arbiter: "法官", bastion: "堡垒卫士", challenger: "挑战者",
    darkStar: "暗星", drx: "新星特攻队", fateweaver: "织命者",
    flex: "旅人", hptank: "斗士", magician: "魔术师", mana: "神谕", melee: "狂战士", mecha: "霸天机甲", meeple: "木灵族",
    primordian: "海魔人", psyops: "灵能特工", rogue: "游侠", shieldTank: "重装战士",
    ranged: "狙神", space: "太空律动", stargazer: "观星者", summon: "牧羊人", timebreaker: "未来战士",
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
  right.append(renderSnapshotPanel(comp));
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
    <a class="image-link" href="${compFullImageAvif(comp)}">查看高清图</a>
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
  if (!mountApp()) return;
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [type, value] = parts;
  if (type === "react") return;
  if (type === "comp") {
    renderDetail(value);
  } else if (type === "tier") {
    renderHome(value, "current");
  } else if (type === "snapshot") {
    const tierIndex = parts.indexOf("tier");
    renderHome(tierIndex >= 0 ? parts[tierIndex + 1] : undefined, value || "current");
  } else {
    renderHome(undefined, "current");
  }
  window.scrollTo(0, 0);
}

window.TFTSiteRoute = route;
window.addEventListener("hashchange", route);
route();
