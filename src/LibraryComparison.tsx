import { useEffect, useState, type ReactNode } from 'react'
import stats from './data/library-stats.json'
import { relativeCommitTime } from './comparison'
import type { Engine } from './fixture'

const engines: Engine[] = ['echarts', 'nivo', 'plotly', 'recharts', 'visx', 'ant-design']
const names: Record<Engine, string> = {
  echarts: 'Apache ECharts', nivo: 'Nivo', plotly: 'Plotly.js',
  recharts: 'Recharts', visx: 'visx Sankey', 'ant-design': 'Ant Design Charts',
}
type Row = { label: string; cells: Record<Engine, ReactNode> }
const rows: Row[] = [
  { label: 'Extensibility', cells: {
    echarts: <>Rich option, event and action APIs; modular components and custom series.</>,
    nivo: <>React props, themes, hooks and custom SVG layers; Sankey layout uses d3-sankey.</>,
    plotly: <>Declarative traces, events, restyle/react and custom hover templates.</>,
    recharts: <>React props and custom SVG node/link renderers; links reference numeric node indexes.</>,
    visx: <>React primitives and custom SVG rendering over the d3-sankey layout engine.</>,
    'ant-design': <>Option-driven G2 encodings, styles, labels and Sankey layout controls.</>,
  } },
  { label: 'Performance tradeoffs', cells: {
    echarts: <>Selective imports; SVG here, with Canvas available for larger datasets. Measure with the intended graph.</>,
    nivo: <>React SVG and spring updates; larger graphs increase DOM and spring work. No Canvas mode for this component.</>,
    plotly: <>SVG Sankey and a large general-purpose distribution; native dragging runs a snapping layout.</>,
    recharts: <>React-managed SVG; node and ribbon count affects DOM size and rendering work.</>,
    visx: <>Direct SVG plus d3-sankey layout; the app owns rendering and interaction details.</>,
    'ant-design': <>G2 renderer and Sankey layout add a broader chart runtime; compare with real data.</>,
  } },
  { label: 'Load cost in this prototype', cells: {
    echarts: <>Shares the initial app chunk with Nivo, React and PNG export. Modular ECharts imports.</>,
    nivo: <>Shares the initial app chunk with ECharts, React and PNG export. Imports the Sankey component.</>,
    plotly: <>Full distribution lazy-loaded separately; about 1.38 MiB gzip in the production build.</>,
    recharts: <>70 KiB gzip renderer chunk; requested with the comparison view.</>,
    visx: <>3 KiB gzip renderer chunk; requested with the comparison view.</>,
    'ant-design': <>414 KiB gzip renderer chunk with the G2-based plots runtime.</>,
  } },
  { label: 'Native motion', cells: {
    echarts: <>Initial reveal and hover-emphasis transitions. Replay restarts the reveal.</>,
    nivo: <>Spring transitions for labels and hover opacity; fresh mounting is mostly immediate.</>,
    plotly: <>Native redraw fades/repositioning and drag snapping. <a href="https://plotly.com/javascript/animations/" target="_blank" rel="noreferrer">General animation API</a> does not smoothly transition Sankey frames.</>,
    recharts: <>No built-in Sankey reveal or node-motion API; the adapter adds connected hover emphasis.</>,
    visx: <>No built-in chart animation; layout and interaction are composed from React primitives.</>,
    'ant-design': <>G2 supports animation options; this comparison disables chart animation for consistent regrouping.</>,
  } },
  { label: 'Grouping in this app', cells: {
    echarts: <>Fresh layout, no geometry tween. Native hover motion remains.</>,
    nivo: <>Fresh layout resets indexed label springs; no cross-category morph.</>,
    plotly: <>Fresh plot resets indexed nodes and links; no cross-category morph.</>,
    recharts: <>Fresh indexed SVG layout; no cross-category geometry tween.</>,
    visx: <>Fresh d3-sankey layout from the grouped graph; no cross-category morph.</>,
    'ant-design': <>Fresh G2 layout from the grouped graph; no cross-category morph.</>,
  } },
  { label: 'Native dragging', cells: {
    echarts: 'Yes · draggable nodes',
    nivo: 'No built-in dragging',
    plotly: 'Yes · snap; also fixed, freeform and perpendicular arrangements',
    recharts: 'No built-in Sankey dragging',
    visx: 'No · layout and event primitives only',
    'ant-design': 'No built-in Sankey node dragging',
  } },
  { label: 'Selection integration', cells: {
    echarts: 'App click toggle + native highlight/downplay actions',
    nivo: 'App click toggle + custom-layer focus hooks',
    plotly: 'App click toggle + public restyle; stationary node pointer bridge',
    recharts: 'App click toggle + Recharts node/link events; adapter hover emphasis',
    visx: 'App click toggle + custom SVG pointer events and hover emphasis',
    'ant-design': 'App click toggle + G2 element events; app text controls stay keyboard-accessible',
  } },
  { label: 'Framework fit', cells: {
    echarts: 'Framework independent; app manages chart lifecycle',
    nivo: 'React component; props and React lifecycle',
    plotly: 'Framework independent; app manages async plot lifecycle',
    recharts: 'React chart component and SVG-specific customization',
    visx: 'React visualization primitives; app manages the complete chart composition',
    'ant-design': 'React plot wrapper with declarative G2 configuration',
  } },
  { label: 'Keyboard & accessibility', cells: {
    echarts: 'Optional ARIA component; this app supplies keyboard inspection',
    nivo: 'SVG/ARIA props; this app supplies keyboard inspection',
    plotly: 'Pointer-driven Sankey; this app supplies keyboard inspection',
    recharts: 'Native accessibility layer plus the app keyboard inspector',
    visx: 'SVG primitives; this app supplies keyboard inspection',
    'ant-design': 'Chart tooltips; this app supplies keyboard inspection',
  } },
  { label: 'PNG export', cells: {
    echarts: 'Native chart export API; complete card uses shared capture',
    nivo: 'SVG chart; complete card uses shared capture',
    plotly: 'Native toImage API; complete card uses shared capture',
    recharts: 'SVG chart; complete card uses shared capture',
    visx: 'SVG chart; complete card uses shared capture',
    'ant-design': 'Chart canvas is included in the shared card capture',
  } },
]

export default function LibraryComparison() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer) }, [])
  const checked = new Date(stats.fetchedAt).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' })
  return <section className="page-section library-comparison" aria-labelledby="library-comparison-title">
    <header className="page-section-heading">
      <p className="eyebrow">03 · LIBRARIES</p>
      <h2 id="library-comparison-title">Library comparison</h2>
    </header>
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
    <div className="matrix-footnotes"><p>Performance notes describe architecture, not a speed ranking. We have not benchmarked frame rate, memory or large graphs. ECharts and Nivo share the initial app chunk; the three new renderers load through separate dynamic imports, and the full Plotly distribution remains lazy-loaded. Sizes depend on this build and import scope.</p><p>Sources: <a href="https://echarts.apache.org/en/feature.html" target="_blank" rel="noreferrer">ECharts features</a>, <a href="https://github.com/plouc/nivo/tree/master/packages/sankey" target="_blank" rel="noreferrer">Nivo Sankey source</a>, <a href="https://plotly.com/javascript/sankey-diagram/" target="_blank" rel="noreferrer">Plotly Sankey docs</a>, <a href="https://recharts.github.io/en-US/api/Sankey/" target="_blank" rel="noreferrer">Recharts Sankey</a>, <a href="https://github.com/airbnb/visx/tree/master/packages/visx-sankey" target="_blank" rel="noreferrer">visx Sankey source</a>, <a href="https://ant-design-charts.antgroup.com/en/components/plots/sankey" target="_blank" rel="noreferrer">Ant Design Charts Sankey</a>. GitHub snapshots are saved locally; run <code>npm run refresh:stats</code> to update them.</p></div>
  </section>
}
