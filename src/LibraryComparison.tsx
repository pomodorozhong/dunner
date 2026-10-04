import { useEffect, useState, type ReactNode } from 'react'
import stats from './data/library-stats.json'
import { relativeCommitTime } from './comparison'
import type { Engine } from './fixture'

const engines: Engine[] = ['echarts', 'nivo', 'plotly']
const names = { echarts: 'Apache ECharts', nivo: 'Nivo', plotly: 'Plotly.js' }
type Row = { label: string; cells: Record<Engine, ReactNode> }
const rows: Row[] = [
  { label: 'Extensibility', cells: {
    echarts: <>Rich option/event/action APIs; modular components and custom series. Sankey styling and emphasis fit this card.</>,
    nivo: <>React props, themes, hooks and custom SVG layers; easiest fit for app-owned React overlays. Layout uses d3-sankey.</>,
    plotly: <>Declarative traces, events, restyle/react and custom hover templates. Deeper Sankey layout changes require working with its renderer.</>,
  } },
  { label: 'Performance tradeoffs', cells: {
    echarts: <>Selective imports; SVG here, Canvas also supported. Canvas may help larger graphs; measure with the intended dataset.</>,
    nivo: <>SVG plus React and spring updates; more nodes/links mean more DOM and spring work. This Sankey component has no Canvas mode.</>,
    plotly: <>SVG Sankey; the full distribution adds substantial load/parse cost. Native dragging runs a snapping layout. Other Plotly WebGL traces do not accelerate Sankey.</>,
  } },
  { label: 'Load cost in this prototype', cells: {
    echarts: <>Shares the initial app chunk with Nivo, React and PNG export. Modular ECharts imports.</>,
    nivo: <>Shares the initial app chunk with ECharts, React and PNG export. Imports the Sankey component.</>,
    plotly: <>Full distribution lazy-loaded separately: about 1.35 MiB gzip in the production build.</>,
  } },
  { label: 'Native motion', cells: {
    echarts: <>Initial reveal and hover emphasis transitions. Replay restarts the reveal.</>,
    nivo: <>Spring transitions for labels and hover opacity; fresh mounting is mostly immediate.</>,
    plotly: <>Native redraw fades/repositioning and drag snapping. <a href="https://plotly.com/javascript/animations/" target="_blank" rel="noreferrer">General animation API</a> does not smoothly transition Sankey frames.</>,
  } },
  { label: 'Grouping in this app', cells: {
    echarts: <>Fresh layout, no geometry tween. Native hover motion remains.</>,
    nivo: <>Fresh layout resets indexed label springs; no cross-category morph.</>,
    plotly: <>Fresh plot resets indexed nodes/links; no cross-category morph.</>,
  } },
  { label: 'Native dragging', cells: { echarts: 'Yes · draggable nodes', nivo: 'No built-in dragging', plotly: 'Yes · snap; also fixed, freeform and perpendicular arrangements' } },
  { label: 'Selection integration', cells: { echarts: 'App click toggle + native highlight/downplay actions', nivo: 'App click toggle + custom-layer focus hooks', plotly: 'App click toggle + public restyle; stationary node pointer bridge' } },
  { label: 'Framework fit', cells: { echarts: 'Framework independent; app manages chart lifecycle', nivo: 'React component; props and React lifecycle', plotly: 'Framework independent; app manages async plot lifecycle' } },
  { label: 'Keyboard & accessibility', cells: { echarts: 'Optional ARIA component; this app supplies keyboard inspection', nivo: 'SVG/ARIA props; this app supplies keyboard inspection', plotly: 'Pointer-driven Sankey; this app supplies keyboard inspection' } },
  { label: 'PNG export', cells: { echarts: 'Native chart export API; complete card uses shared capture', nivo: 'SVG chart; complete card uses shared capture', plotly: 'Native toImage API; complete card uses shared capture' } },
]

export default function LibraryComparison() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer) }, [])
  const checked = new Date(stats.fetchedAt).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' })
  return <section className="library-comparison" aria-labelledby="library-comparison-title">
    <p className="eyebrow">LIBRARY COMPARISON DETAILS</p>
    <h2 id="library-comparison-title">Compare the libraries.</h2>
    <p className="matrix-intro">Repository stats checked {checked} UTC. Stars are for the whole repository; activity is the latest default-branch commit, not the Sankey module’s last change. Relative times use your device clock.</p>
    <p className="matrix-scroll-hint">On small screens, scroll sideways to compare. Keyboard: focus the table and use the arrow keys.</p>
    <div className="matrix-scroll" role="region" aria-label="Scrollable library comparison table" tabIndex={0}>
      <table className="library-matrix">
        <caption>Maintenance, integration, native capabilities and performance tradeoffs</caption>
        <thead><tr><th scope="col">Compare</th>{engines.map(engine => <th scope="col" key={engine}><a href={stats.libraries[engine].url} target="_blank" rel="noreferrer">{names[engine]} ↗</a><small>Installed v{__PACKAGE_VERSIONS__[engine]}</small></th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">GitHub stars</th>{engines.map(engine => <td key={engine}><a href={`${stats.libraries[engine].url}/stargazers`} target="_blank" rel="noreferrer">{stats.libraries[engine].stars.toLocaleString('en-US')}</a></td>)}</tr>
          <tr><th scope="row">Latest commit</th>{engines.map(engine => { const repo = stats.libraries[engine]; return <td key={engine}><a href={repo.commitUrl} target="_blank" rel="noreferrer"><time dateTime={repo.commitDate} title={repo.commitDate}>{relativeCommitTime(repo.commitDate, now)}</time></a><small>{repo.defaultBranch} · {new Date(repo.commitDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</small></td> })}</tr>
          <tr><th scope="row">License</th>{engines.map(engine => <td key={engine}><a href={stats.libraries[engine].licenseUrl} target="_blank" rel="noreferrer">{stats.libraries[engine].license}</a></td>)}</tr>
          {rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{engines.map(engine => <td key={engine}>{row.cells[engine]}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
    <div className="matrix-footnotes"><p>Performance notes describe architecture, not a speed ranking. We have not benchmarked frame rate, memory or large graphs. ECharts and Nivo share a roughly 299 KiB gzip app chunk, so it cannot be attributed to either package. Sizes depend on this build and import scope.</p><p>Sources: <a href="https://echarts.apache.org/en/feature.html" target="_blank" rel="noreferrer">ECharts features</a>, <a href="https://github.com/plouc/nivo/tree/master/packages/sankey" target="_blank" rel="noreferrer">Nivo Sankey source</a>, <a href="https://plotly.com/javascript/sankey-diagram/" target="_blank" rel="noreferrer">Plotly Sankey docs</a>. GitHub snapshots are saved locally; run <code>npm run refresh:stats</code> to update them.</p></div>
  </section>
}
