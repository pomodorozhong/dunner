# Rent sharing: interactive share-image comparison plan

Companion: [Prototype comparison review guide](rent-sharing-prototype-review-guide.md). Background: [product brief](rent-sharing-brief.md) and [MVP plan](rent-sharing-mvp-implementation-plan.md).

## Goal and boundary

Compare three runnable versions of the same shareable expense card, using Apache ECharts, Nivo (`@nivo/sankey`), and Plotly.js. Open the fixture immediately, click the card to change its presentation, explore each package's native animation and interactions, and download a static PNG. Package selection follows hands-on review.

This is a local, fixture-backed interaction study. It deliberately narrows the prototype to expense allocation and image presentation; it does not change the broader brief or MVP scope. Household setup, data entry, contribution rules and tracking, monthly record creation/history, persistence, data backup/import, accounts, and deployment are deferred. Users do not need to prepare or enter any data. The eventual MVP's launch policy is unchanged; these checkpoints steer the comparison prototype.

## Shared fixture

Use October 2026 and a fictional household with the same 40/35/25 split across every expense and both months. Snapshot date: October 4, 2026.

| Expense | October | September | Increase |
| --- | ---: | ---: | ---: |
| Rent | NT$30,000 | NT$30,000 | NT$0 |
| Electricity | NT$2,400 | NT$1,800 | NT$600 |
| Water | NT$600 | NT$500 | NT$100 |
| Internet | NT$1,000 | NT$1,000 | NT$0 |
| Groceries | NT$6,000 | NT$4,700 | NT$1,300 |
| **Total** | **NT$40,000** | **NT$38,000** | **NT$2,000 (+5.3%)** |

Wen's share is NT$16,000 (40%, +NT$800); Jonathan's is NT$14,000 (35%, +NT$700); Mei's is NT$10,000 (25%, +NT$500). These amounts describe allocated expenses, not received payments. Use integer NT$ values; this fixture has no fractional allocations or rounding discrepancy. Keep fixtures immutable and create separate renderer inputs and presentation state.

## Comparison behavior

Use React, TypeScript, Vite, npm, and Tailwind CSS. Show three equal-sized cards together on wide screens and provide a single-renderer view for closer inspection and phone use. Display package names, installed versions, native capabilities, and limitations outside the exported cards.

- Render total → expenses → roommates with the same content, colors, and dimensions. The detailed utilities mode adds Utilities → Electricity / Water / Internet → roommates, while rent and groceries continue directly to roommates. Category ribbons retain their color throughout the path. Allow native layout differences to remain visible.
- Preserve package-native animation, tooltips, connected hover highlighting, and dragging where supported. Do not implement substitute chart animation or dragging. ECharts supports initial reveal and dragging; Nivo supports spring updates but no native dragging; Plotly supports dragging and snapping. Plotly's general animation API does not smoothly interpolate Sankey frames, while native redraw fades, node transitions, and snapping may still occur: [animation API](https://plotly.com/javascript/animations/), [native renderer](https://github.com/plotly/plotly.js/blob/master/src/traces/sankey/render.js).
- Clicking a category, ribbon, or roommate pins an exact breakdown for that renderer. Click it again to clear or another target to replace it. Use native emphasis APIs where exposed; label application-provided selection and grouping separately from native capabilities.
- Cycle individual expenses → grouped Utilities · NT$4,000 → Utilities with its three bill nodes → individual expenses using an on-card control or the comparison toolbar. In detailed mode, total flows to rent, utilities and groceries; utilities flows to electricity, water and internet, each then split among roommates. Do not count both the aggregate and bills as new expenses. Click the aggregate in grouped mode to show details; in detailed mode it selects the exact bill breakdown. Synchronize grouping and month-comparison detail expansion across variants. Clear selections that disappear under grouping.
- Keep hover, selection, and native dragged positions independent per renderer. Preserve native positions when switching views; regrouping switches directly to a fresh, reconciled layout. Indexed native transitions must not morph unrelated categories or roommates; grouping uses no geometry tween. Hover, dragging, and replay retain native motion. Reset restores the default grouping, detail panel, selections, and positions. Replay clears dragged positions and remounts the charts to show initial rendering while retaining the current grouping and selections.
- Keep exact roommate shares visible in every presentation. Provide text allocations and keyboard selection/grouping controls. Respect reduced motion: disable ECharts reveal/state motion and Nivo springs; rebuild Plotly from a first render and use perpendicular dragging to avoid animated redraws and snapping. Provide a Reduce motion control for comparison; OS reduced-motion preferences always take precedence.
- Each PNG captures the complete selected card after its SVG stops changing, including exact shares, month, snapshot date, and any selected breakdown. Exclude comparison controls, tooltips, grouping controls, and focus outlines. Export a static image; recipients cannot interact with the PNG. Lock presentation controls during capture and expose a retryable export error.

## Phase 1 — Three working renderers

**Deliverable:** A local comparison app that immediately renders the fixture in all three packages, plus shared total/share checks and explicit package capability labels.

**Dependencies:** The fixture and existing category-color mockups; no data-entry workflow or payment-model decision is required.

**Completion condition:** Both months reconcile; every chart conserves flow; all individual shares agree across renderers and text. Cards render on desktop and phone without missing labels or chart failures. Initial render, native tooltips, hover, and supported dragging are available for comparison.

### Checkpoint 1: compare the first render

- **Implementer prepares:** A runnable local URL, all three variants, package/version labels, reset/replay controls, and the ready-loaded fixture.
- **User tries:** Follow rent to each roommate, replay rendering, compare labels and tooltips, and try native dragging where supported. About 10 minutes. No example or data entry is needed.
- **Feedback that changes Phase 2:** Incorrect amounts, unreadable labels, missing capabilities, or a misleading capability description must be resolved before finalizing interactions. Different native layouts are comparison findings rather than automatic defects.
- **Work that can continue:** Export experiments and shared presentation controls. Final interaction polish waits for material findings.

## Phase 2 — Direct presentation interaction

**Deliverable:** Per-renderer click selection and exact breakdowns; synchronized utilities grouping, comparison-detail expansion, reset, and replay; keyboard controls and phone inspection.

**Dependencies:** The three renderers and resolved checkpoint 1 findings.

**Completion condition:** Grouping and expansion preserve all amounts. Selecting and clearing nodes/ribbons works in each package. Grouping removes stale selections safely; native positions remain local to their renderer. Keyboard users can inspect the same allocations. Reduced-motion mode avoids animated presentation changes.

### Checkpoint 2: repeat the same tasks in each package

- **Implementer prepares:** The same fixture and tasks in all three variants, a text breakdown, capability notes, and phone-sized views.
- **User tries:** Click Jonathan, inspect Rent → Jonathan (NT$10,500), select another category, clear selection, group utilities, expand the aggregate, collapse/expand the increase explanation, and reset. Repeat using keyboard controls and on a phone. Compare responsiveness, discoverability, hover, drag, and motion. About 10–15 minutes.
- **Feedback that changes Phase 3:** Broken or confusing interactions, incorrect breakdowns, motion discomfort, or unclear grouping must be resolved before reviewing final exports. Native feature gaps remain labeled rather than filled with custom animations.
- **Work that can continue:** PNG capture and export-error handling. Final export composition waits for material findings.

## Phase 3 — Static image export comparison

**Deliverable:** PNG download and preview for each variant, including grouped and selected states, plus a short meeting demo and package-comparison notes.

**Dependencies:** Reviewed interactions and settled chart rendering.

**Completion condition:** All three PNG downloads succeed. Exports match the visible card's fixture and presentation, omit transient controls/tooltips, and show all exact roommate shares and the dated snapshot. Images remain understandable on a phone without interaction.

### Checkpoint 3: compare the shared images

- **Implementer prepares:** Three PNGs, a runnable comparison build, and a demo: open fixture → replay → select Jonathan → group/expand utilities → download each card.
- **User tries:** Customize and download each variant, compare phone readability, then ask an unfamiliar recipient to identify their share and explain the increase. About 10 minutes.
- **Feedback that changes the result:** Fix inaccurate, misleading, clipped, or unreadable output and repeat the task. Record a package preference with reasons; do not silently choose a production package before review.
- **Work that can continue:** Meeting notes and recommendation drafting. The study is ready when its comparison tasks work and remaining differences are explicit.

## Verification and feedback

The implementer owns fixture reconciliation and reversible grouping tests, TypeScript checks, production build, browser checks of native node/ribbon interaction and dragging, keyboard inspection, responsive layouts, reduced motion, and all three PNG downloads. Avoid persistence and backup/restore tests because those features are outside this study.

Record findings as **task → expected result → actual result → impact**. A checkpoint is complete when material findings are reflected in the running comparison, not just when someone has viewed it. Keep native limitations visible and reserve package choice for hands-on review.

## Package comparison evidence

Use the comparison table below the cards to review GitHub stars, latest default-branch commit age, license, extensibility, performance tradeoffs, load cost, native motion/dragging, framework fit, accessibility, and PNG integration. Stats show a dated, refreshable snapshot with source links; repository-wide activity does not prove Sankey-specific maintenance. Performance notes distinguish architectural tradeoffs and measured build sizes from runtime benchmarks, which have not been collected.

During checkpoint 2, cycle all three grouping modes in all three variants. Expect a direct layout switch: electricity 2,400 + water 600 + internet 1,000 becomes Utilities 4,000, with utility ribbons of 1,600 / 1,400 / 1,000. The household stays at 40,000 and roommate totals stay 16,000 / 14,000 / 10,000. Labels must never travel from unrelated categories into roommates. Use Replay render separately to compare native initial motion.
