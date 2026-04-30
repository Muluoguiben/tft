import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../site.css";
import CompDetailReact from "./components/CompDetailReact.jsx";

let legacyRendererLoaded = false;

/**
 * 路由策略：
 *   - hash 匹配 `#/react/comp/<id>`：用 React 组件渲染详情页
 *   - 其他 hash：fallback 到 site.js 的 vanilla 渲染（保留 snapshot / tier 等现有路由）
 *
 * 后续如果想把所有路由都迁到 React，把下面 fallback 分支删掉即可。
 */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function LegacyAppShell() {
  useEffect(() => {
    if (legacyRendererLoaded) {
      window.TFTSiteRoute?.();
      return;
    }
    legacyRendererLoaded = true;
    import("../site.js").then(() => window.TFTSiteRoute?.());
  }, []);
  return <main id="app" className="page-shell" />;
}

function App() {
  const hash = useHash();
  const reactCompMatch = hash.match(/^#\/react\/comp\/(.+)$/);
  const compId = reactCompMatch ? decodeURIComponent(reactCompMatch[1]) : "";

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">T</span>
          <div>
            <div className="brand-title">TFT 阵容库</div>
            <div className="brand-subtitle">按日期 / Patch / 状态归档，避免旧版本结论误用</div>
          </div>
        </a>
        <nav className="nav">
          <a href="#/">当前快照</a>
          <a href="#/snapshot/2026-04-30-17.2-day2">04-30</a>
          <a href="#/snapshot/watch">待复核</a>
          <a href="#/tier/OP">OP</a>
          <a href="#/tier/T1">T1</a>
          <a href="#/tier/T2">T2</a>
          <a href="./docs/静态站点部署.md">部署说明</a>
        </nav>
      </header>

      {reactCompMatch ? (
        <main className="page-shell">
          <CompDetailReact compId={compId} />
        </main>
      ) : (
        <LegacyAppShell />
      )}
    </>
  );
}

createRoot(document.querySelector("#root")).render(<App />);
