# Share-image prototype: your comparison guide

Use this with the [interactive share-image comparison plan](rent-sharing-prototype-checkpoint-plan.md). Compare Apache ECharts, Nivo, and Plotly.js before choosing a package. These checkpoints steer a local prototype; they are not a launch approval process.

## Start immediately

The implementer provides a runnable app with fictional data already loaded. You do not need to prepare a household example, fill in amounts, record payments, or import a file.

The October 2026 household total is NT$40,000: rent 30,000, electricity 2,400, water 600, internet 1,000, and groceries 6,000. Wen pays 40% (16,000), Jonathan 35% (14,000), and Mei 25% (10,000). The same split applies to every expense. September totaled 38,000, so the increase is 2,000: groceries +1,300, electricity +600, and water +100.

The chart explains allocated expenses, not payments received. Wide screens show three cards together. Use a package selector to inspect one card more closely or compare on a phone. Package names, installed versions, capabilities, and limitations appear outside the shareable card.

## Checkpoint 1 — First render, about 10 minutes

**You receive:** Three working charts, the loaded fixture, native capability labels, and reset/replay controls.

Follow rent to all three roommates and find their full monthly shares. Replay the charts and compare how the ribbons and labels appear. Hover over nodes and ribbons to compare highlights and tooltips. Try dragging ECharts and Plotly nodes; Nivo has no built-in dragging.

Notice which layout is easiest to read and whether any feature claim is misleading. Plotly's general animation API does not smoothly animate Sankey frames, although its own redraws and dragging can still fade or move elements. Different native behavior is part of the comparison.

Incorrect amounts, unreadable labels, and missing promised capabilities are fixed before finalizing the click interactions. Export experiments can continue.

## Checkpoint 2 — Click and compare, about 10–15 minutes

**You receive:** Matching click-selection tasks, utilities grouping, increase-detail controls, exact text allocations, and phone-sized views.

Repeat the same sequence in each package:

1. Click Jonathan and inspect the expense breakdown totaling NT$14,000.
2. Click Rent → Jonathan and check NT$10,500. Click it again to clear, then select a different category.
3. Cycle through individual expenses → Utilities · NT$4,000 → Utilities with Electricity, Water and Internet → individual expenses. The third mode keeps the group and its bill nodes visible together. Click Utilities in grouped mode to show its bills; click it in detailed mode to inspect the 2,400 / 600 / 1,000 breakdown. Everyone's share should stay the same.
4. Click the +5.3% comparison summary to hide/show the increase details.
5. Open “Text breakdown & keyboard controls.” Use Tab and Enter/Space to select a person or category, and choose an exact ribbon with the selector.
6. Repeat on a phone, then Reset view.

Grouping and increase details change across all variants. Hover, selection, and dragged positions belong to each renderer. Switching views preserves dragged positions; regrouping switches directly to a fresh, reconciled layout. Indexed native transitions must not morph unrelated categories or roommates; grouping uses no geometry tween. Hover, dragging, and replay retain native motion. Replay clears positions and restarts the charts while retaining grouping and selection. Reset returns everything to the starting presentation.

Notice discoverability, responsiveness, motion, and whether the native interactions help explain the amounts. The shared app adds selection readouts and grouping, but does not add chart animations or dragging to fill native feature gaps. Try Reduce motion from the toolbar. OS reduced-motion preferences are also respected.

Broken or confusing interactions are fixed before final export review; PNG capture work can continue.

## Checkpoint 3 — Shared images, about 10 minutes

**You receive:** A working PNG download/preview for every variant, three sample exports, and a short meeting demo.

Customize and download each card. Compare the PNGs at phone size. Ask someone unfamiliar with the prototype to identify their share and explain the increase. Check that the image retains every person's exact amount, October 2026, and the October 4 snapshot date, including when utilities are grouped or one allocation is selected.

The browser card is interactive. The PNG is a static snapshot and contains no grouping controls or tooltips. You do not need to test data input, saved records, or backup/restore.

Inaccurate or unreadable output is fixed and tried again. Then record which package you prefer and why; package selection follows this hands-on review.

For every finding, use **task → expected result → actual result → impact**. Example: “Clicked Jonathan → expected his NT$14,000 breakdown → found an unlabeled highlighted ribbon → could not explain his share.”

## Package comparison evidence

Use the comparison table below the cards to review GitHub stars, latest default-branch commit age, license, extensibility, performance tradeoffs, load cost, native motion/dragging, framework fit, accessibility, and PNG integration. Stats show a dated, refreshable snapshot with source links; repository-wide activity does not prove Sankey-specific maintenance. Performance notes distinguish architectural tradeoffs and measured build sizes from runtime benchmarks, which have not been collected.

During checkpoint 2, cycle all three grouping modes in all three variants. Expect a direct layout switch: electricity 2,400 + water 600 + internet 1,000 becomes Utilities 4,000, with utility ribbons of 1,600 / 1,400 / 1,000. The household stays at 40,000 and roommate totals stay 16,000 / 14,000 / 10,000. Labels must never travel from unrelated categories into roommates. Use Replay render separately to compare native initial motion.
