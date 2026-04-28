# TFT

本仓库用于整理 **Teamfight Tactics（TFT，云顶之弈）** 和 **金铲铲之战** 相关资料。

当前重点是比赛备赛、阵容研究、数据复盘和训练记录。

## 内容导航

- `docs/what-is-tft.md` - 云顶之弈基础介绍
- `docs/tft-vs-golden-spatula.md` - 云顶之弈与金铲铲之战的关系
- `docs/competition-prep-2026-05.md` - 2026 年 5 月金铲铲比赛备赛方案
- `docs/competition-cheatsheet-2026-05.md` - 比赛临场小抄
- `docs/S17中文翻译对照.md` - S17 羁绊和阵容中文名对照，避免英文直译错误
- `docs/S17资源基线.md` - S17 棋子、羁绊、技能、星神、装备、图片和官方公告校准源说明
- `docs/三站交叉阵容推荐-2026-04-28.md` - 基于 tactics.tools、DataTFT、TFTAcademy，并保留 MetaTFT、LoLCHESS.GG、MetaBot 补充复核的阵容推荐
- `docs/阵容图卡规范.md` - 阵容组成、站位和装备合成一张图的制作规范
- `docs/阵容图卡工作流.md` - 从阵容卡到 GPT Image2 图卡的完整生产流程
- `docs/comps/` - 比赛训练阵容卡
- `data/` - 阵容池、训练日志、数据复核表和 `data/s17/` 资源基线
- `assets/` - 装备、弈子、羁绊、站位、阵容截图和 `assets/s17/` 本地图片素材
- `templates/` - 单局复盘和训练模板
- `templates/GPT-Image2-阵容图卡提示词.md` - 用 GPT Image2 生成最终阵容图卡的提示词模板

## 怎么读

你不需要直接阅读 CSV 文件。CSV 更像“底层数据表”，主要给后续排序、筛选、脚本处理和版本复核使用。

日常备赛优先看这些 Markdown：

1. 先看 `docs/三站交叉阵容推荐-2026-04-28.md`，确定今天主练哪些阵容。
2. 再看 `docs/comps/` 下的单套阵容卡，照着练阵容组成、装备、运营和站位。
3. 比赛当天看 `docs/competition-cheatsheet-2026-05.md`，只做临场决策。

如果某个结论只存在于 CSV，而没有写成 Markdown 阵容卡或小抄，那它还不算可用备赛资料。

Markdown 可以附加图片。最终阵容卡应优先配一张“阵容图卡”：同一张图里展示阵容组成、棋盘站位、羁绊和每个关键棋子携带的装备。最终视觉图优先用 GPT Image2 生成；文字 Markdown 负责解释运营节奏、适玩条件和放弃条件。

## 目标

本仓库会持续补充：

- 新手友好的 TFT / 金铲铲说明
- 游戏术语、弈子、羁绊、装备和机制笔记
- 金铲铲与云顶之弈的版本差异记录
- 阵容数据、训练日志和复盘模板
- 面向比赛的阵容卡、运营思路和临场决策小抄
