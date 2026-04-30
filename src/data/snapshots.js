/**
 * 阵容池快照系统：按日期 + Patch 给阵容池打版本，避免历史结论被误用。
 * 抽自 site.js 行 117-181。
 *
 * 当前快照（CURRENT_SNAPSHOT_ID）的 review/patch 都用 REVIEW_DATE 标注。
 * 历史快照只能作为对比 / 待复核入口，不能直接当成当前版本答案。
 */
export const CURRENT_SNAPSHOT_ID = "2026-04-30-17.2-day2";
export const REVIEW_DATE = "2026-04-30";

export const snapshots = [
  {
    id: CURRENT_SNAPSHOT_ID,
    label: "2026-04-30",
    shortLabel: "04-30",
    patch: "17.2 第二天",
    status: "当前",
    description: "云顶 17.2 新版本第二天的阵容池判断。金铲铲端内更新节奏可能滞后，比赛前需要继续复核。",
    sourceUpdatedAt: "2026-04-30",
  },
  {
    id: "2026-04-28-17.1b-personal",
    label: "2026-04-28",
    shortLabel: "04-28",
    patch: "17.1B",
    status: "归档",
    description: "赛季初个人样本与早期数据归档，只能作为条件阵容参考，不能直接当成当前版本答案。",
    sourceUpdatedAt: "2026-04-28",
  },
];

export const snapshotFilters = [
  {
    id: "current",
    label: "当前",
    title: "当前快照",
    description: "只看当前仍建议纳入备赛判断的阵容；过期阵容必须进入历史快照或待复核。",
    matches: (comp) => comp.snapshotId === CURRENT_SNAPSHOT_ID && comp.status !== "archived",
  },
  ...snapshots.map((snapshot) => ({
    id: snapshot.id,
    label: snapshot.shortLabel,
    title: `${snapshot.label} · ${snapshot.patch}`,
    description: snapshot.description,
    matches: (comp) => comp.snapshotId === snapshot.id || comp.originSnapshotId === snapshot.id,
  })),
  {
    id: "watch",
    label: "待复核",
    title: "待复核阵容",
    description: "来源版本、样本量或端内环境仍不够确定；比赛里只能在条件非常好时启用。",
    matches: (comp) => comp.status === "watch",
  },
  {
    id: "all",
    label: "全部",
    title: "全部快照",
    description: "展示当前与历史归档。旧版本条目必须看清日期和 Patch 后再使用。",
    matches: () => true,
  },
];

/**
 * 阵容默认 meta：所有 comps[] 条目通过 {...defaultCompMeta, ...comp} 合并应用。
 */
export const defaultCompMeta = {
  snapshotId: CURRENT_SNAPSHOT_ID,
  reviewedAt: REVIEW_DATE,
  patch: "17.2 第二天",
  sourceUpdatedAt: REVIEW_DATE,
  sourcePatch: "17.2",
  status: "current",
  previousTier: "未记录",
  confidence: "早期判断",
};
