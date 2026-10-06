import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toPng } from 'html-to-image'
import LibraryComparison from './LibraryComparison'
import Chart, { type ChartHandle, type Presentation } from './charts'
import { allocation, amount, buildGraph, expenses, money, nextGrouping, people, previousTotal, selectionDetails, total, type Engine, type Graph, type GroupingMode } from './fixture'
import { nextFrame, useMedia } from './hooks'

const engines: Engine[] = ['echarts', 'nivo', 'plotly', 'recharts', 'visx', 'ant-design']
const info = {
  echarts: { name: 'Apache ECharts', package: 'echarts', native: 'Reveal animation · connected hover · draggable nodes', limitation: 'Native initial reveal; grouping redraws the layout.', link: 'https://echarts.apache.org/examples/en/index.html#chart-type-sankey' },
  nivo: { name: 'Nivo', package: '@nivo/sankey', native: 'Spring motion · connected hover · node & ribbon tooltips', limitation: 'Native hover springs; grouping switches layouts. No built-in node dragging.', link: 'https://nivo.rocks/sankey/' },
  plotly: { name: 'Plotly.js', package: 'plotly.js-dist-min', native: 'Node & ribbon hover · draggable nodes with snapping', limitation: 'No smooth Sankey frames via Plotly.animate; grouping switches layouts. Native snapping remains.', link: 'https://plotly.com/javascript/animations/' },
  recharts: { name: 'Recharts', package: 'recharts', native: 'SVG Sankey · accessibility layer · custom nodes and ribbons', limitation: 'This adapter adds connected hover; Recharts has no built-in Sankey dragging.', link: 'https://recharts.github.io/en-US/api/Sankey/' },
  visx: { name: 'visx Sankey', package: '@visx/sankey', native: 'React SVG primitives · configurable d3-sankey layout', limitation: 'The package exposes layout primitives; this adapter adds hover and selection. No native dragging.', link: 'https://airbnb.io/visx/sankey/' },
  'ant-design': { name: 'Ant Design Charts', package: '@ant-design/plots', native: 'G2 Sankey layout · native node and ribbon tooltips', limitation: 'This adapter supplies app selection; native node dragging is not provided.', link: 'https://ant-design-charts.antgroup.com/en/components/plots/sankey' },
}
const groupingInfo = {
  individual: { label: 'Individual expenses', step: 1 },
  grouped: { label: 'Utilities grouped', step: 2 },
  detailed: { label: 'Utilities with individual bills', step: 3 },
}
const emptySelection: Record<Engine, string | null> = { echarts: null, nivo: null, plotly: null, recharts: null, visx: null, 'ant-design': null }

class ChartBoundary extends Component<{ children: ReactNode; onError: (message: string) => void }, { error: string | null }> {
  state: { error: string | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error: error.message } }
  componentDidCatch(error: Error) { this.props.onError(error.message) }
  render() { return this.state.error ? <div className="chart-host chart-failure">Chart could not render. Try Reset view.</div> : this.props.children }
}

export default function App() {
  const [grouping, setGrouping] = useState<GroupingMode>('individual')
  const [expanded, setExpanded] = useState(true)
  const [activeVariant, setActiveVariant] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [initialAnimation, setInitialAnimation] = useState(true)
  const [selections, setSelections] = useState(emptySelection)
  const [exporting, setExporting] = useState<Engine | null>(null)
  const presentations = useRef<Record<Engine, Presentation>>({
    echarts: { positions: new Map() }, nivo: { positions: new Map() }, plotly: { positions: new Map() },
    recharts: { positions: new Map() }, visx: { positions: new Map() }, 'ant-design': { positions: new Map() },
  })
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const narrow = useMedia('(max-width: 1199px)')
  const comparisonRef = useRef<HTMLElement>(null)
  const graph = useMemo(() => buildGraph(grouping), [grouping])

  const updateActiveVariant = useCallback(() => {
    if (!narrow || !comparisonRef.current) return
    const viewport = comparisonRef.current
    const viewportLeft = viewport.getBoundingClientRect().left
    const variants = [...viewport.querySelectorAll<HTMLElement>('.variant')]
    const nearest = variants.reduce((result, variant, index) => {
      const distance = Math.abs(variant.getBoundingClientRect().left - viewportLeft)
      return distance < result.distance ? { index, distance } : result
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index
    setActiveVariant(current => current === nearest ? current : nearest)
  }, [narrow])

  const scrollToVariant = useCallback((index: number) => {
    const viewport = comparisonRef.current
    const variant = viewport?.querySelectorAll<HTMLElement>('.variant')[index]
    if (!viewport || !variant) return
    const left = variant.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft
    viewport.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [reducedMotion])

  useEffect(() => {
    if (!narrow) return
    comparisonRef.current?.scrollTo({ left: 0, behavior: 'auto' })
    setActiveVariant(0)
  }, [narrow])

  const changeGrouping = useCallback((next: GroupingMode) => {
    const nextGraph = buildGraph(next)
    // Regrouping changes node heights; positions from the previous topology can be invalid.
    engines.forEach(engine => presentations.current[engine].positions.clear())
    setInitialAnimation(false)
    setGrouping(next)
    setSelections(current => Object.fromEntries(engines.map(engine => [engine,
      [...nextGraph.nodes, ...nextGraph.links].some(item => item.id === current[engine]) ? current[engine] : null,
    ])) as Record<Engine, string | null>)
  }, [])
  const replay = () => { setInitialAnimation(true); engines.forEach(engine => presentations.current[engine].positions.clear()); setEpoch(e => e + 1) }
  const reset = () => { setGrouping('individual'); setExpanded(true); setSelections(emptySelection); replay() }

  return <div className="app-shell">
    <header className="site-header flex items-center justify-between">
      <a href="#main" className="brand flex items-center gap-2" aria-label="Dunner Sankey comparison"><span className="brand-mark" aria-hidden="true">d.</span> dunner<span className="brand-divider" />Sankey comparison</a>
      <span className="fixture-pill"><span className="status-dot" />Local prototype · fixture data</span>
    </header>
    <main id="main">
      <section className="page-section comparison-notes" aria-labelledby="review-tasks-title">
        <header className="page-section-heading">
          <p className="eyebrow">01 · REVIEW</p>
          <h2 id="review-tasks-title">Review tasks</h2>
        </header>
        <ol><li><span>01</span><div><strong>Read the first render</strong><p>Follow one expense to each roommate. Replay and compare the arrival of labels and ribbons.</p></div></li><li><span>02</span><div><strong>Explore, then simplify</strong><p>Hover, click a share, try dragging, and group utilities. Watch what each package preserves.</p></div></li><li><span>03</span><div><strong>Share the result</strong><p>Download each card. Can someone identify their share from the image alone?</p></div></li></ol>
      </section>

      <section className="page-section sankey-comparison" aria-labelledby="sankey-comparison-title">
        <header className="page-section-heading">
          <p className="eyebrow">02 · RENDERERS</p>
          <h2 id="sankey-comparison-title">Sankey comparison</h2>
        </header>
        <section className="studio-toolbar sticky top-0 z-50 shadow-sm" aria-label="Comparison controls">
          <div className="toolbar-actions flex flex-wrap items-center gap-2">
            <button className="control-button whitespace-nowrap" aria-describedby="grouping-status" disabled={!!exporting} onClick={() => changeGrouping(nextGrouping(grouping))}>switching grouping <span className="font-mono tabular-nums">({groupingInfo[grouping].step}/3)</span></button>
            <button className="text-button" disabled={!!exporting} onClick={replay}>↻ Replay render</button>
            <button className="text-button" disabled={!!exporting} onClick={reset}>Reset view</button>
          </div>
        </section>
        <p id="grouping-status" className="grouping-explanation" role="status"><strong>{groupingInfo[grouping].label} · {groupingInfo[grouping].step} / 3.</strong> {grouping === 'detailed' ? 'Utilities stays visible and branches into Electricity, Water, and Internet before reaching the roommates.' : 'Cycle through individual expenses, grouped utilities, and utilities with individual bills.'} Utilities = 2,400 + 600 + 1,000 = NT$4,000. Total and shares stay unchanged. Layouts switch directly; Replay tries native initial motion.</p>
        <div className="interaction-hint flex items-center justify-between gap-3"><p><span aria-hidden="true">↗</span> Click a node or ribbon to inspect it. Hover for renderer-specific highlights or tooltips. Drag nodes where supported.</p><span>{reducedMotion ? 'Reduced motion on' : 'Native motion on'}</span></div>

        {narrow && <nav className="renderer-navigation" aria-label="Sankey renderer navigation">
          <button type="button" aria-controls="sankey-renderers" aria-label="Previous Sankey renderer" disabled={!!exporting || activeVariant === 0} onClick={() => scrollToVariant(activeVariant - 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m6 6-6-6 6-6" /></svg></button>
          <span aria-live="polite" aria-atomic="true"><strong>{String(activeVariant + 1).padStart(2, '0')} / 06</strong>{info[engines[activeVariant]].name}</span>
          <button type="button" aria-controls="sankey-renderers" aria-label="Next Sankey renderer" disabled={!!exporting || activeVariant === engines.length - 1} onClick={() => scrollToVariant(activeVariant + 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button>
        </nav>}
        {narrow && <p className="renderer-scroll-hint">Swipe or scroll horizontally to compare all six Sankeys.</p>}

        <section ref={comparisonRef} id="sankey-renderers" className={`comparison-grid ${exporting ? 'exporting' : ''}`} aria-label="Sankey package comparison" tabIndex={narrow ? 0 : undefined} onScroll={updateActiveVariant}>
          {engines.map(engine => <Variant key={engine} engine={engine} graph={graph} grouping={grouping} expanded={expanded} epoch={epoch} initialAnimation={initialAnimation} presentation={presentations.current[engine]}
            selected={selections[engine]} reducedMotion={reducedMotion} locked={!!exporting}
            onExpand={grouping === 'grouped' ? () => changeGrouping('detailed') : undefined} onToggleDetails={() => setExpanded(value => !value)}
            onSelect={id => setSelections(current => ({ ...current, [engine]: current[engine] === id ? null : id }))}
            onExportState={busy => setExporting(busy ? engine : null)} />)}
        </section>
      </section>

      <LibraryComparison />
    </main>
    <footer className="site-footer"><span>Dunner / interaction study 001</span><span>Fictional household · no data entry or saved records</span></footer>
  </div>
}

type VariantProps = {
  engine: Engine; graph: Graph; grouping: GroupingMode; expanded: boolean; epoch: number; initialAnimation: boolean
  presentation: Presentation
  selected: string | null; reducedMotion: boolean; locked: boolean
  onExpand?: () => void; onToggleDetails: () => void
  onSelect: (id: string) => void; onExportState: (busy: boolean) => void
}

function Variant(props: VariantProps) {
  const { engine, graph, selected } = props
  const metadata = info[engine]
  const card = useRef<HTMLDivElement>(null)
  const chartHandle = useRef<ChartHandle | null>(null)
  // Nivo label springs and Plotly nodes can match by array index. A topology
  // change must mount a fresh renderer, never tween unrelated expense/person IDs.
  const renderKey = `${props.epoch}-${props.grouping}`
  const [readyKey, setReadyKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [png, setPng] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const details = selectionDetails(graph, selected)
  useEffect(() => { setError(null) }, [renderKey])

  async function download() {
    setBusy(true); props.onExportState(true); setError(null)
    try {
      await nextFrame()
      if (!chartHandle.current) throw new Error('The chart is not ready yet.')
      await chartHandle.current.prepareExport()
      const url = await toPng(card.current!, {
        pixelRatio: 2, backgroundColor: '#ffffff', skipFonts: true, cacheBust: false,
        filter: node => !(node instanceof Element && (node.hasAttribute('data-export-ignore') || node.matches('.export-tooltip, .hoverlayer, .modebar, .g2-tooltip, .antv-tooltip, .recharts-tooltip-wrapper, [role="tooltip"]'))),
      })
      setPng(url)
      const anchor = document.createElement('a')
      anchor.href = url; anchor.download = `dunner-october-2026-${engine}${props.grouping === "individual" ? "" : `-${props.grouping}`}.png`
      anchor.click()
    } catch (error) { setError(error instanceof Error ? error.message : String(error)) }
    finally { setBusy(false); props.onExportState(false) }
  }

  return <article className="variant" data-grouping={props.grouping} data-testid={`variant-${engine}`} aria-label={`${metadata.name} variant`}>
    <div className="variant-heading"><div className="flex items-center gap-2"><span className="variant-index">0{engines.indexOf(engine) + 1}</span><h2>{metadata.name}</h2></div><span className="version">v{__PACKAGE_VERSIONS__[engine]}</span></div>
    <p className="native-features">{metadata.native}</p>
    <div ref={card} className="share-card" data-testid={`card-${engine}`}>
      <header className="card-header"><div className="flex items-center justify-between"><span className="eyebrow">MONTHLY HOUSEHOLD EXPENSES</span><span className="card-monogram" aria-hidden="true">d.</span></div><h3>October 2026</h3><div className="total-row"><strong>{money(total)}</strong><button className="delta-pill" aria-label={`Toggle month comparison for ${metadata.name}`} aria-expanded={props.expanded} disabled={props.locked} onClick={props.onToggleDetails}>+5.3%</button></div><p className="total-caption">Household total <span>+{money(total - previousTotal)} vs September</span></p></header>
      <div className="chart-section"><div className="chart-columns" aria-hidden="true"><span>TOTAL</span><span>EXPENSES</span>{props.grouping === "detailed" && <span>UTILITY DETAILS</span>}<span>SHARES</span></div>
        <ChartBoundary key={renderKey} onError={setError}><Chart key={renderKey} initialAnimation={props.initialAnimation} engine={engine} graph={graph} selected={selected} onSelect={props.onSelect} onExpand={props.onExpand} reducedMotion={props.reducedMotion} handle={chartHandle} presentation={props.presentation} onReady={() => setReadyKey(renderKey)} onError={setError} /></ChartBoundary>
      </div>
      <section className="shares-section" aria-label="Exact roommate shares"><div className="section-heading"><h4>Everyone’s share</h4><span>NT$ · 40 / 35 / 25 split</span></div><div className="share-rows">{people.map(person => <div className={`share-row ${selected === person.id ? 'selected-row' : ''}`} key={person.id}><span className="person-label"><i style={{ backgroundColor: person.color }} />{person.label}<small>{person.percent}%</small></span><strong>{amount(allocation(total, person.percent))}</strong><span className="share-delta">+{amount(allocation(total - previousTotal, person.percent))}</span></div>)}</div><p className="share-caption">Change versus September · same split across all expenses</p></section>
      <section className="change-panel"><div className="section-heading"><h4>The increase comes from</h4><button data-export-ignore="true" className="collapse-button" aria-label={`${props.expanded ? 'Collapse' : 'Expand'} change details for ${metadata.name}`} aria-expanded={props.expanded} disabled={props.locked} onClick={props.onToggleDetails}>{props.expanded ? '−' : '+'}</button></div><p>A breakdown of the {money(total - previousTotal)} increase</p>
        {props.expanded && <><div className="change-items">{[expenses[4], expenses[1], expenses[2]].map(item => <div key={item.id}><span><i style={{ backgroundColor: item.color }} />{item.label}</span><strong>+{money(item.october - item.september)}</strong><small>{(item.october - item.september) / (total - previousTotal) * 100}% of increase</small><div className="change-bar"><i style={{ width: `${(item.october - item.september) / (total - previousTotal) * 100}%`, backgroundColor: item.color }} /></div></div>)}</div><p className="unchanged-note">Rent and internet stayed the same.</p></>}
      </section>
      {details && <section className="selection-readout" aria-label={`Selected breakdown for ${metadata.name}`}><div className="section-heading"><h4>{details.title}</h4><strong>{money(details.value)}</strong></div><dl>{details.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{money(row.value)}</dd></div>)}</dl></section>}
      <footer className="snapshot-footer"><span>Snapshot · Oct 4, 2026</span><strong>Dunner</strong></footer>
    </div>
    <div className="variant-actions"><button className="download-button" disabled={readyKey !== renderKey || !!error || props.locked} onClick={download}>{busy ? 'Preparing PNG…' : 'Download PNG'}<span aria-hidden="true">↓</span></button>{png && <button className="text-button" onClick={() => setPreview(true)}>Preview PNG</button>}</div>
    {error && <p role="alert" className="error-message">{error} <button onClick={() => setError(null)}>Dismiss</button></p>}
    <div className="capability-note"><span className="small-tag">NATIVE</span><p>{metadata.limitation} <a href={metadata.link} target="_blank" rel="noreferrer">Docs ↗</a></p><span className="small-tag">SHARED APP</span><p>Click selection, exact breakdown, grouping, and PNG export work the same across all six renderers.</p></div>
    <details className="text-inspector"><summary>Text breakdown & keyboard controls</summary><div className="inspector-body"><p>These buttons select the same nodes as the chart. Tab to a button, then press Enter or Space. Select again to clear.</p><div className="inspector-nodes">{graph.nodes.map(node => <button key={node.id} aria-pressed={selected === node.id} disabled={props.locked} onClick={() => props.onSelect(node.id)}><i style={{ backgroundColor: node.color }} />{node.label}<span>{money(node.value)}</span></button>)}</div><label htmlFor={`ribbon-${engine}`}>Inspect an exact ribbon</label><select id={`ribbon-${engine}`} value={graph.links.some(link => link.id === selected) ? selected! : ''} disabled={props.locked} onChange={event => { if (event.target.value) props.onSelect(event.target.value); else if (selected) props.onSelect(selected) }}><option value="">Choose a ribbon</option>{graph.links.map(link => <option value={link.id} key={link.id}>{graph.nodes.find(n => n.id === link.source)!.label} → {graph.nodes.find(n => n.id === link.target)!.label}: {money(link.value)}</option>)}</select><table><caption>October category allocations · NT$</caption><thead><tr><th>Expense</th>{people.map(person => <th key={person.id}>{person.label}</th>)}</tr></thead><tbody>{expenses.map(item => <tr key={item.id}><th>{item.label}</th>{people.map(person => <td key={person.id}>{amount(allocation(item.october, person.percent))}</td>)}</tr>)}</tbody></table></div></details>
    <p className="sr-only" role="status">{details ? `${metadata.name}: ${details.title}, ${money(details.value)}` : `${metadata.name}: no selection`}</p>
    {preview && png && <PngPreview engine={engine} name={metadata.name} png={png} onClose={() => setPreview(false)} />}
  </article>
}

function PngPreview({ engine, name, png, onClose }: { engine: Engine; name: string; png: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => element.close()
  }, [])
  return <dialog ref={dialog} className="png-dialog" aria-label={`${name} exported PNG preview`} onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="preview-heading"><strong>{name} · exported PNG</strong><div className="flex items-center gap-2"><a className="control-button" href={png} download={`dunner-october-2026-${engine}.png`}>Save PNG</a><button autoFocus className="control-button" onClick={onClose}>Close preview</button></div></div>
    <img src={png} alt={`${name} exported October expense card`} />
  </dialog>
}
