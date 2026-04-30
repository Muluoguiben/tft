/**
 * 阵容详情页 React 版。
 *
 * 数据源：src/data/comps-index.js + src/data/comps/<id>.js + src/data/{assets,champions}.js
 * CSS：复用 site.css 现有 class（.panel / .board-grid / .hex-cell / .unit-card 等），
 *      不新增样式，保证跟 vanilla 版本视觉一致。
 *
 * 入口：main.jsx 检测 #/react/comp/<id> 路由时渲染 <CompDetailReact compId={id} />，
 *      其他 hash 仍 fallback 到 site.js 的 vanilla 渲染。
 */
import React, { useState, useEffect } from "react";
import { assets, compFullImageAvif, previewAsset } from "../data/assets.js";
import { findUnit } from "../data/champions.js";
import { comps } from "../data/comps-index.js";
import { costColors } from "../data/cost-colors.js";

// 同 site.js cellPosition()：偶数行右偏移半个 cell。
const X_STEP = 88;
const Y_STEP = 102;
function cellPos(row, col) {
  const offset = row % 2 === 0 ? X_STEP / 2 : 0;
  return { left: `${(col - 1) * X_STEP + offset}px`, top: `${(row - 1) * Y_STEP}px` };
}

// 已知占位（site.js 同处理）
const PLACEHOLDER_ITEMS = new Set(["guardbreaker"]);

function ItemIcon({ id, label }) {
  if (PLACEHOLDER_ITEMS.has(id)) {
    return <div className="placeholder-item" title={label}>破</div>;
  }
  const src = assets.items[id];
  if (!src) return <div className="placeholder-item" title={label}>?</div>;
  return <img className="item-icon" src={previewAsset(src)} alt={label} loading="lazy" />;
}

function HexCell({ row, col }) {
  return <div className="hex-cell" style={cellPos(row, col)} />;
}

function UnitCard({ unit }) {
  const meta = findUnit(unit.id);
  const cost = unit.cost ?? meta.cost;
  const name = unit.name ?? meta.name;
  return (
    <div
      className="unit-card"
      style={{ ...cellPos(unit.row, unit.col), "--cost": costColors[cost] || "currentColor" }}
    >
      <img src={previewAsset(assets.champions[unit.id])} alt={name} loading="lazy" />
      <span className="cost-bubble">{cost}</span>
      <span className="unit-name">{name}</span>
      <span className="stars">{unit.star}</span>
      {unit.items?.length > 0 && (
        <div className="unit-items">
          {unit.items.map((it, i) => (
            <ItemIcon key={i} id={it} label={it} />
          ))}
        </div>
      )}
    </div>
  );
}

function BoardPanel({ comp, detail }) {
  const cells = [];
  for (let r = 1; r <= 4; r += 1) {
    for (let c = 1; c <= 7; c += 1) {
      cells.push(<HexCell key={`${r}-${c}`} row={r} col={c} />);
    }
  }
  return (
    <section className="panel board-panel" id="board">
      <div className="panel-title-row">
        <div>
          <div className="section-heading">阵容组成</div>
          <p className="muted">8 人口成型，9 人口补全；棋盘从上到下是前排到后排。</p>
        </div>
        {comp.image && (
          <a className="image-link" href={compFullImageAvif(comp)} target="_blank" rel="noreferrer">
            查看大图
          </a>
        )}
      </div>
      <div className="board-wrap">
        <div className="row-labels">
          <span>前排</span><span>第二</span><span>第三</span><span>后排</span>
        </div>
        <div className="board-grid">
          {cells}
          {detail.boardUnits.map((u) => (
            <UnitCard key={u.id} unit={u} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TraitsPanel({ traits }) {
  return (
    <section className="panel">
      <div className="section-heading">核心羁绊</div>
      <div className="traits-list">
        {traits.map((t) => (
          <div key={t.id} className="trait-row">
            <img src={previewAsset(assets.traits[t.id])} alt={t.name} loading="lazy" />
            <div>
              <div className="trait-main">{t.count} {t.name}</div>
              {t.desc && <div className="trait-sub">{t.desc}</div>}
            </div>
            <div className="trait-tiers">
              {t.tiers.map((tier) => (
                <span
                  key={tier}
                  className={`trait-tier${tier === t.count ? " active" : ""}`}
                >
                  {tier}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BuildsPanel({ builds }) {
  if (!builds?.length) return null;
  return (
    <section className="panel">
      <div className="section-heading">核心装备</div>
      <div className="build-list">
        {builds.map((b, i) => (
          <div key={i} className="build-card">
            <div className="build-title">{b.title}</div>
            <div className="item-row">
              {b.items.map(([id, label], j) => (
                <div key={j} className="item-cell">
                  <ItemIcon id={id} label={label} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StarGodsPanel({ starGods }) {
  if (!starGods?.length) {
    return (
      <section className="panel">
        <div className="section-heading">星神选择</div>
        <p className="muted">该阵容卡未给出星神段；按通用规则按局势取舍。</p>
      </section>
    );
  }
  return (
    <section className="panel">
      <div className="section-heading">星神选择</div>
      <div className="star-god-list">
        {starGods.map(([id, name, note]) => (
          <div key={id} className="star-god-row">
            <img src={previewAsset(assets.starGods[id])} alt={name} loading="lazy" />
            <div>
              <div className="star-god-name">{name}</div>
              {note && <div className="star-god-note">{note}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AugmentsPanel({ augments }) {
  if (!augments?.length) return null;
  return (
    <section className="panel">
      <div className="section-heading">推荐海克斯</div>
      <div className="recommend-list">
        {augments.map((augment, i) => (
          <div key={i} className="recommend-row">
            <span className="recommend-type">{augment.type}</span>
            <div>
              <div className="recommend-name">{augment.name}</div>
              {augment.note && <div className="recommend-note">{augment.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmblemsPanel({ emblems }) {
  if (!emblems?.length) return null;
  return (
    <section className="panel">
      <div className="section-heading">纹章 / 转职</div>
      <div className="recommend-list">
        {emblems.map((emblem, i) => (
          <div key={i} className="recommend-row">
            <img src={previewAsset(assets.traits[emblem.trait])} alt={emblem.name} loading="lazy" />
            <div>
              <div className="recommend-name">{emblem.name}</div>
              {emblem.note && <div className="recommend-note">{emblem.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConditionPanel({ title, items, className = "" }) {
  if (!items?.length) return null;
  return (
    <section className={`panel ${className}`}>
      <div className="section-heading">{title}</div>
      <ol className="number-list">
        {items.map((line, i) => <li key={i}>{line}</li>)}
      </ol>
    </section>
  );
}

function DetailHero({ comp }) {
  return (
    <section className="hero-panel">
      <img
        className="comp-avatar"
        src={previewAsset(assets.champions[comp.primary])}
        alt={comp.name}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div>
        <div className={`tier-badge tier-${comp.tier?.toLowerCase()}`}>{comp.tier} · {comp.rating}</div>
        <h1>{comp.name}</h1>
        <p className="muted">{comp.label} · {comp.patch} · {comp.confidence}</p>
        {comp.doc && (
          <a className="doc-link" href={comp.doc} target="_blank" rel="noreferrer">
            查看完整中文卡 (Markdown)
          </a>
        )}
      </div>
    </section>
  );
}

export default function CompDetailReact({ compId }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const comp = comps.find((c) => c.id === compId);

  useEffect(() => {
    if (!comp) {
      setError(`阵容 id "${compId}" 在 comps-index.js 里不存在`);
      return;
    }
    let cancelled = false;
    import(`../data/comps/${compId}.js`)
      .then((mod) => {
        if (!cancelled) setDetail(mod.default);
      })
      .catch((e) => {
        if (!cancelled) setError(`detail 加载失败：${e.message}`);
      });
    return () => { cancelled = true; };
  }, [compId, comp]);

  if (error) {
    return (
      <section className="panel" style={{ padding: "2rem" }}>
        <div className="section-heading">阵容详情加载失败</div>
        <p>{error}</p>
        <a href="#/">返回首页</a>
      </section>
    );
  }
  if (!comp || !detail) {
    return (
      <section className="panel" style={{ padding: "2rem" }}>
        <p className="muted">加载中…</p>
      </section>
    );
  }

  return (
    <div className="comp-detail-react">
      <DetailHero comp={comp} />
      <BoardPanel comp={comp} detail={detail} />
      <TraitsPanel traits={detail.traits} />
      <BuildsPanel builds={detail.builds} />
      <AugmentsPanel augments={comp.augments} />
      <EmblemsPanel emblems={comp.emblems} />
      <ConditionPanel title="适玩条件" items={detail.conditions} className="condition-panel" />
      <ConditionPanel title="放弃条件 / 风险" items={detail.risks} className="danger-panel" />
      <StarGodsPanel starGods={detail.starGods} />
      <section className="panel">
        <div className="section-heading">运营总览（来自 comps-index）</div>
        <p><strong>适玩：</strong>{comp.play}</p>
        <p><strong>避免：</strong>{comp.avoid}</p>
        <p><strong>转线：</strong>{comp.pivot}</p>
      </section>
    </div>
  );
}
