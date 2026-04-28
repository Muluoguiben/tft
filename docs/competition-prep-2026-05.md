# 2026-05 Golden Spatula Competition Prep

Last updated: 2026-04-28

This plan targets the May 3-5 Golden Spatula competition. The default assumption is an 8-player multi-game points format, so the main goal is stable top-four conversion and low bottom-two rate before chasing first place.

## Operating Model

Baseline version: Golden Spatula 17.1 / 17.1B, S17 "Star Gods" season.

Core patch facts to keep in mind:

- Star God selection replaces the old carousel flow.
- Star God choices happen around 2-4, 3-4, and 4-4.
- 4-7 becomes a Star God blessing / armory moment.
- Lower-health players receive compensation through the new reward flow, but the old carousel item priority no longer exists.
- Early season data is noisy; a comp only enters the tournament pool when data, public high-rank guidance, and your practice results point in the same direction.

## Daily Source Loop

Before the first practice block each day, spend 15-20 minutes updating `data/daily-comp-review-template.csv`.

Source priority:

1. In-game popular comp / event recommendation pages.
2. Golden Spatula data and helper sites.
3. High-rank guide aggregation from 17173 / JinChanChan / known creators.
4. TFT Set 17 data sites as auxiliary evidence only.

Promotion rule:

- Promote a comp into the main pool only if at least two sources support it, or one high-sample data source plus your own practice supports it.
- Do not replace more than one final pool comp after 2026-05-02 unless an official hotfix clearly invalidates a core comp.

## Scoring Model

Use this formula for `data/comp-pool-2026-04-28.csv`:

```text
score = 0.40 * stability + 0.20 * top1 + 0.15 * anti_contest + 0.15 * flex + 0.10 * familiarity
```

Definitions:

- `stability`: average placement and top-four rate.
- `top1`: first-place rate and capped-board strength.
- `anti_contest`: lower contest risk, stronger pivots, and lower core-unit overlap.
- `flex`: item flexibility, transition flexibility, and Stage 4 recovery power.
- `familiarity`: your own sample, not public data.

Do not fill exact percentage columns unless the number comes from a visible data source. Use `TBD` until verified.

## Initial Comp Pool

Main tournament pool:

- `新星九五`: first-choice late-game flex when economy, streak, or HP is high.
- `重装妖姬`: AP-heavy Stage 4 stabilization comp; use when LeBlanc/Karma/Nunu/Illaoi lines are natural.
- `木灵飞机`: high-upside 4-cost line; use only with Woodling opener, economy support, or strong Corki/Rammus access.
- `机甲Flex / 太空律动转`: fallback Stage 4 lock line; prioritize when tank + AP items are clear or Space Groove emblem appears.
- `海魔大卑` or `牧羊维克托`: conditional reroll / mid-cost line; enter only with clear units, items, or augment support.

High-risk weapon:

- `幻灵阿萝拉`: keep as a final-round or must-high-roll option. Enter only with 3 Anima opener or a clean loss-streak setup before 3-2.

Watchlist:

- `成双莎弥拉`
- `无限火力佐伊`
- `薇古丝九五`
- `观星霞`
- `多拼莎鱼`
- `重装提莫`

The watchlist is not the active tournament pool. Add one only if it beats an existing pool comp on current data and practice results.

## Training Schedule

2026-04-28:

- Build the comp pool table.
- Play 3 practice games.
- Focus on Star God decisions at 2-4, 3-4, 4-4, and spending discipline at 4-7.

2026-04-29:

- Main practice: `新星九五` and `重装妖姬`.
- Minimum sample: 2 games each.
- Record level, gold, HP, comp direction, and final placement at 3-2 and 4-2.

2026-04-30:

- Practice `木灵飞机`, `机甲Flex`, and one conditional reroll line.
- Lock the final four tournament comps by the end of the day.

2026-05-01:

- Play one 5-6 game simulated points block.
- Do not look up new comps mid-block.
- Review every sixth-place-or-worse game.

2026-05-02:

- Play only 2-3 confidence games.
- Stop learning new comps after 20:00.
- Finalize the cheat sheet: openers, item priority, augment priority, Star God choices, 4-2 roll-down line, and positioning notes.

2026-05-03 to 2026-05-05:

- During the tournament, optimize for preservation first: save HP, identify contest risk, and choose stable top four unless points require a first-place push.

## Match Policy

Early game:

- Do not greed perfect items if a strong generic item saves HP.
- A saved 20 HP is often worth more than one perfect late-game item in a multi-game points format.

3-2 decision:

- High HP + good economy: play toward level 8/9, usually `新星九五` or another high-cost flex board.
- Medium HP: plan a 4-2 level 8 roll-down into `重装妖姬`, `机甲Flex`, or `木灵飞机`.
- Low HP or extreme high-roll reroll spot: enter a conditional reroll line and play for top four.

Contest rule:

- If two or more players are holding the same core carry and you are not the strongest copy, pivot to the closest adjacent line.
- Do not contest just because the guide says the comp is strong.

Star God rule:

- Ahead: prefer economy, level cap, or capped-board scaling.
- Behind: prefer immediate combat, sustain, or stabilization.
- At 4-7, spend only for rewards that improve the current board or next immediate roll-down.

Final-round risk switch:

- If a first place is required to win the event, increase risk tolerance and allow high-upside lines such as 4-cost three-star chase or Anima cashout.
- Otherwise, default to top-four discipline.

## Acceptance Criteria

By 2026-05-02 night:

- Last 20 practice games average placement is 4.0 or better.
- Top-four rate is at least 60%.
- Seventh/eighth rate is 15% or lower.
- Each final comp has at least 3 practice games.
- You can describe each final comp without notes: opener, items, roll timing, Star God preference, abandon condition, and main pivot.

## Sources

- 17.1 update announcement: https://news.17173.com/content/04222026/161402748.shtml
- Star God season mechanics interview: https://www.gamersky.com/news/202604/2130414.shtml
- Official popular comp activity note: https://www.sina.cn/news/detail/5291257678529846.html
- JinChanChan S17 guide aggregation: https://jinchanchan.fun/articles/8cbd9ccc-f353-4eea-8287-1f25f43ea480
- 17.1B comp tier article: https://news.17173.com/content/04212026/161700039.shtml
- LeBlanc Vanguard guide reference: https://www.dadighost.com/help/73873.html
- MetaBot Set 17 auxiliary data: https://metabot.gg/en/TFT/17/comps/8/placement
