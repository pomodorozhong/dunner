# Dunner Sankey comparison

A local comparison of Apache ECharts, Nivo, and Plotly.js for an interactive, shareable expense card. All three use the same fictional October 2026 household, category colors, and NT$40,000 allocation. No household setup, data entry, backend, or saved records are required.

## Run

Requires Node.js 22.12+ (or a newer supported Node release) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. If the default port is occupied, Vite chooses the next available port.

```sh
npm test
npm run check
npm run build
npm run preview
```

## Compare

Use **Compare all** on a wide screen, or select a single renderer for a larger chart or phone review. Click categories, roommates, and ribbons to pin exact breakdowns; click again to clear. Native hover behavior remains local to each renderer. ECharts and Plotly support native node dragging; Nivo does not.

Cycle grouping from the toolbar or card: **individual expenses → grouped utilities → Utilities with Electricity, Water and Internet → individual expenses**. In the third mode, total → Rent / Utilities / Groceries; Utilities → its three bills; each bill → roommates. Rent and groceries flow directly to roommates. Click the aggregate in the grouped mode to show its bills; in the detailed mode, click Utilities to inspect its exact bill breakdown. Grouping and the month-over-month detail panel are synchronized across variants. Native dragged positions and selections remain separate and survive renderer-view switching. Regrouping switches directly to a fresh, reconciled layout. Native renderers can match changed nodes by array index, which would misleadingly morph one expense into another or into a person; topology changes therefore remount the charts, without geometry interpolation. Native hover and dragging remain available. Utilities combine 2,400 + 600 + 1,000; household and roommate totals remain unchanged. **Replay render** clears positions and restarts initial rendering with the current grouping and selections; **Reset view** restores all defaults.

Use **Text breakdown & keyboard controls** for equivalent node/ribbon inspection. PNG download captures the complete settled card with its exact shares and selected breakdown; controls and tooltips are excluded. **Preview PNG** displays the actual downloaded image.

The prototype respects OS reduced-motion preferences. **Reduce motion** also lets you try this mode in the comparison toolbar. ECharts and Nivo motion is disabled; Plotly redraws from an initial render and uses perpendicular dragging to avoid animated fades, layout morphs, and snapping. An OS reduced-motion preference always takes precedence.

The card is interactive in the browser; its downloaded PNG is static. Fixtures and presentation changes are not saved. Review the [checkpoint plan](docs/rent-sharing-prototype-checkpoint-plan.md) and [comparison guide](docs/rent-sharing-prototype-review-guide.md).

## Native behavior and implementation

- **ECharts:** SVG renderer, native initial reveal, connected hover emphasis, tooltips, and node dragging. The app uses highlight/downplay actions for selection.
- **Nivo:** SVG Sankey with native spring motion, tooltips, and connected hover opacity. The app uses the exposed custom-layer focus state for selection. Equal link-gradient endpoint colors keep the expense color constant along the entire ribbon.
- **Plotly:** Native SVG Sankey, connected hover, tooltips, and snap dragging. Selection uses public restyle calls; stationary node pointer gestures bridge to shared selection because native drag setup consumes node clicks. Actual dragging is left to Plotly. Its general animation API does not smoothly interpolate Sankey frames; native Sankey redraws can still fade and reposition elements. See [animation documentation](https://plotly.com/javascript/animations/) and [renderer source](https://github.com/plotly/plotly.js/blob/master/src/traces/sankey/render.js).

Fixtures and pure graph/breakdown calculations live in `src/fixture.ts`; each package adapter is in `src/charts.tsx`; the shared card and comparison controls are in `src/App.tsx`. The application supplies click-selection readouts, graph grouping, and image export. It supplies no substitute chart animation or dragging.

The installed package versions are displayed directly from the exact npm dependency versions. The full Plotly distribution is lazy-loaded into a separate, large build chunk; this prototype prioritizes library comparison over production bundle optimization. No library has been chosen for the broader MVP.

## Library comparison table

Below the cards, compare repository-wide GitHub stars, the latest default-branch commit (relative time with an exact timestamp), license, extensibility, performance tradeoffs, load cost, motion, dragging, selection APIs, framework fit, accessibility and export. Repository activity is not a measure of Sankey-specific maintenance. Runtime performance notes are architectural tradeoffs, not a benchmark ranking. Load sizes describe this build; ECharts and Nivo share a chunk, while the full Plotly distribution is lazy-loaded.

The dated GitHub snapshot is checked into `src/data/library-stats.json` so the app works offline and does not contact GitHub during browsing. Refresh explicitly with:

```sh
npm run refresh:stats
```

This queries public repository metadata and the latest default-branch commit’s committer timestamp. A failed request preserves the previous complete snapshot. Source links are available in the table.
