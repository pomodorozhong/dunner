import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Sankey, type CustomSankeyLayerProps } from '@nivo/sankey'
import * as echarts from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import type * as PlotlyTypes from 'plotly.js'
import { money, relatedIds, type Engine, type Graph, type GraphLink, type GraphNode } from './fixture'
import { useWidth } from './hooks'

echarts.use([SankeyChart, TooltipComponent, SVGRenderer])

export type ChartHandle = { prepareExport: () => Promise<void> }
export type Presentation = { positions: Map<string, { x: number; y: number }> }
type Props = {
  engine: Engine
  graph: Graph
  selected: string | null
  onSelect: (id: string) => void
  onExpand?: () => void
  reducedMotion: boolean
  initialAnimation: boolean
  onReady: () => void
  onError: (message: string) => void
  handle: RefObject<ChartHandle | null>
  presentation: Presentation
}
const chartHeight = 350
const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

// Observe actual SVG changes rather than assuming every package has the same animation duration.
export async function waitForChartIdle(element: HTMLElement) {
  await document.fonts.ready
  let previous = ''
  let stable = 0
  const deadline = performance.now() + 8000
  while (performance.now() < deadline) {
    await pause(50)
    const current = [...element.querySelectorAll('svg')].map(svg => svg.outerHTML).join('')
    stable = current && current === previous ? stable + 1 : 0
    previous = current
    if (stable >= 6) return
  }
  throw new Error('The chart is still moving. Reset the view and try downloading again.')
}

function EChartsView(props: Props) {
  const container = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.EChartsType | null>(null)
  const width = useWidth(container)
  const latest = useRef(props)
  latest.current = props

  useEffect(() => {
    if (!container.current) return
    const instance = echarts.init(container.current, undefined, { renderer: 'svg' })
    chart.current = instance
    instance.on('click', event => {
      const id = (event.data as { id?: string } | null)?.id
      if (!id) return
      if (id === 'utilities' && latest.current.onExpand) latest.current.onExpand()
      else latest.current.onSelect(id)
    })
    instance.on('dragnode', payload => {
      const event = payload as { dataIndex: number; localX: number; localY: number }
      const node = latest.current.graph.nodes[event.dataIndex]
      if (node) latest.current.presentation.positions.set(node.id, { x: event.localX, y: event.localY })
    })
    props.handle.current = {
      prepareExport: async () => {
        instance.dispatchAction({ type: 'hideTip' })
        applySelection(instance, latest.current)
        await waitForChartIdle(container.current!)
      },
    }
    return () => { props.handle.current = null; instance.dispose(); chart.current = null }
  }, [])

  useEffect(() => {
    const instance = chart.current
    if (!instance || !width) return
    try {
      instance.resize()
      const utilityChildren = new Set(props.graph.links.filter(link => link.source === 'utilities').map(link => link.target))
      instance.setOption({
        animation: !props.reducedMotion && props.initialAnimation,
        tooltip: {
          trigger: 'item', className: 'export-tooltip',
          formatter: (params: { data: { id: string; value: number } }) => {
            const node = props.graph.nodes.find(n => n.id === params.data.id)
            const link = props.graph.links.find(l => l.id === params.data.id)
            const title = node?.label ?? (link ? `${props.graph.nodes.find(n => n.id === link.source)!.label} → ${props.graph.nodes.find(n => n.id === link.target)!.label}` : '')
            return `${title}<br/><strong>${money(params.data.value)}</strong>`
          },
        },
        series: [{
          type: 'sankey', id: 'expenses', left: 4, right: 4, top: 8, bottom: 8,
          nodeAlign: 'justify', nodeWidth: 13, nodeGap: 18,
          draggable: true,
          data: props.graph.nodes.map(n => ({ id: n.id, name: n.id, value: n.value, localX: props.presentation.positions.get(n.id)?.x, localY: props.presentation.positions.get(n.id)?.y, itemStyle: { color: n.color, borderWidth: 0 }, label: { formatter: n.label, position: n.kind === 'person' || utilityChildren.has(n.id) ? 'left' : 'right' } })),
          links: props.graph.links.map(l => ({ ...l, lineStyle: { color: l.color } })),
          label: { color: '#29333e', fontFamily: 'Arial, sans-serif', fontSize: 10, position: 'inside' },
          lineStyle: { opacity: 0.42, curveness: 0.5 },
          emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.85 } },
          blur: { lineStyle: { opacity: 0.08 }, itemStyle: { opacity: 0.25 } },
          stateAnimation: { duration: props.reducedMotion ? 0 : 300 },
        }],
      }, { notMerge: true })
      applySelection(instance, latest.current)
      props.onReady()
    } catch (error) { props.onError(String(error)) }
  }, [props.graph, width, props.reducedMotion])

  useEffect(() => { if (chart.current) applySelection(chart.current, props) }, [props.selected])
  return <div ref={container} className="chart-host" role="img" aria-label="ECharts expense allocation Sankey. Use the text controls below for keyboard inspection." />
}

function applySelection(instance: echarts.EChartsType, props: Props) {
  instance.dispatchAction({ type: 'downplay', seriesIndex: 0 })
  const node = props.graph.nodes.findIndex(n => n.id === props.selected)
  const link = props.graph.links.findIndex(l => l.id === props.selected)
  if (node >= 0) instance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: node, dataType: 'node' })
  if (link >= 0) instance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: link, dataType: 'edge' })
}

type NivoLink = GraphLink & { startColor: string; endColor: string }

function NivoView(props: Props) {
  const container = useRef<HTMLDivElement>(null)
  const width = useWidth(container)
  const data = useMemo(() => ({
    nodes: props.graph.nodes.map(node => ({ ...node })),
    // Nivo otherwise derives link color from the source node. Equal gradient endpoints preserve category colors.
    links: props.graph.links.map(link => ({ ...link, startColor: link.color, endColor: link.color })),
  }), [props.graph])
  const selection = useRef(props.selected)
  selection.current = props.selected
  const focusApi = useRef<CustomSankeyLayerProps<GraphNode, NivoLink> | null>(null)
  const FocusLayer = useMemo(() => function FocusLayer(layer: CustomSankeyLayerProps<GraphNode, NivoLink>) {
    focusApi.current = layer
    return null
  }, [])

  function applyFocus() {
    const api = focusApi.current
    if (!api) return
    api.setCurrentNode(api.nodes.find(n => n.id === selection.current) ?? null)
    api.setCurrentLink(api.links.find(l => l.id === selection.current) ?? null)
  }
  useEffect(() => { applyFocus() }, [props.selected, data, width])
  useEffect(() => {
    if (width > 0) props.onReady()
    props.handle.current = { prepareExport: async () => {
      applyFocus()
      await waitForChartIdle(container.current!)
    } }
    return () => { props.handle.current = null }
  }, [width])

  return <div ref={container} className="chart-host">
    {width > 0 && <Sankey<GraphNode, NivoLink>
      width={width} height={chartHeight} data={data}
      margin={{ top: 8, right: 4, bottom: 8, left: 4 }}
      align="justify" sort="input" nodeThickness={13} nodeSpacing={18}
      colors={node => props.graph.nodes.find(n => n.id === node.id)!.color} label={node => props.graph.nodes.find(n => n.id === node.id)!.label}
      labelTextColor="#29333e" labelPosition="inside" labelPadding={4}
      nodeBorderWidth={0} nodeOpacity={1} nodeHoverOthersOpacity={0.25}
      linkOpacity={0.42} linkHoverOpacity={0.85} linkHoverOthersOpacity={0.08}
      linkBlendMode="normal" enableLinkGradient
      animate={!props.reducedMotion}
      theme={{ text: { fontFamily: 'Arial, sans-serif', fontSize: 10 } }}
      layers={['links', 'nodes', 'labels', FocusLayer]}
      valueFormat={value => money(value)}
      nodeTooltip={({ node }) => <div className="native-tooltip" data-export-ignore="true">{node.label}<strong>{money(node.value)}</strong></div>}
      linkTooltip={({ link }) => <div className="native-tooltip" data-export-ignore="true">{link.source.label} → {link.target.label}<strong>{money(link.value)}</strong></div>}
      onClick={datum => { if (datum.id === 'utilities' && props.onExpand) props.onExpand(); else props.onSelect(datum.id) }}
      ariaLabel="Nivo expense allocation Sankey. Use the text controls below for keyboard inspection."
    />}
  </div>
}

function PlotlyView(props: Props) {
  const container = useRef<HTMLDivElement>(null)
  const plotly = useRef<typeof PlotlyTypes | null>(null)
  const plot = useRef<PlotlyTypes.PlotlyHTMLElement | null>(null)
  const width = useWidth(container)
  const latest = useRef(props)
  latest.current = props
  const work = useRef<Promise<unknown>>(Promise.resolve())
  const render = useRef(() => {})
  const disposed = useRef(false)
  const pointerGesture = useRef<{ x: number; y: number; id: string; nodes: GraphNode[] } | null>(null)
  const nativeDrag = useRef<GraphNode[] | null>(null)

  useEffect(() => {
    let cancelled = false
    disposed.current = false
    // Plotly's draggable nodes consume their native click during drag setup.
    // Bridge stationary pointer gestures to shared selection without changing native drag behavior.
    const finishPointer = (event: PointerEvent) => {
      const gesture = pointerGesture.current
      pointerGesture.current = null
      if (!gesture) return
      if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 4) { nativeDrag.current = gesture.nodes; return }
      if (gesture.id === 'utilities' && latest.current.onExpand) {
        // A stationary click still starts Plotly's snap force. Let it settle before changing topology.
        waitForChartIdle(container.current!).then(() => {
          if (!cancelled && latest.current.graph.nodes.some(n => n.id === 'utilities')) latest.current.onExpand?.()
        }).catch(error => { if (!disposed.current) latest.current.onError(String(error)) })
      }
      else latest.current.onSelect(gesture.id)
    }
    const cancelPointer = () => { pointerGesture.current = null }
    window.addEventListener('pointerup', finishPointer, true)
    window.addEventListener('pointercancel', cancelPointer, true)
    import('plotly.js-dist-min').then(module => {
      if (cancelled) return
      plotly.current = module.default
      render.current()
    }).catch(error => { if (!disposed.current) latest.current.onError(String(error)) })
    props.handle.current = { prepareExport: async () => {
      await work.current
      if (plot.current) (plotly.current as typeof PlotlyTypes & { Fx: { unhover: (element: HTMLElement) => void } }).Fx.unhover(plot.current)
      await waitForChartIdle(container.current!)
    } }
    return () => {
      cancelled = true
      disposed.current = true
      window.removeEventListener('pointerup', finishPointer, true)
      window.removeEventListener('pointercancel', cancelPointer, true)
      // Wait for a pending render before purging an unmounted plot.
      work.current.finally(() => { if (plot.current && plotly.current) plotly.current.purge(plot.current) })
      props.handle.current = null
    }
  }, [])

  render.current = () => {
    const library = plotly.current
    const element = container.current
    if (!library || !element || !width) return
    const graph = props.graph
    const indices = new Map(graph.nodes.map((node, i) => [node.id, i]))
    work.current = work.current.then(async () => {
      if (disposed.current) return
      const current = latest.current
      const related = relatedIds(graph, current.selected)
      const fresh = !plot.current || current.reducedMotion
      if (current.reducedMotion && plot.current) library.purge(plot.current)
      const draw = fresh ? library.newPlot : library.react
      const result = await draw(element, [{
        type: 'sankey', arrangement: current.reducedMotion ? 'perpendicular' : 'snap', valueformat: ',.0f', valuesuffix: ' NT$',
        node: {
          label: graph.nodes.map(node => node.label),
          customdata: graph.nodes.map(node => node.id),
          x: graph.nodes.map(node => current.presentation.positions.get(node.id)?.x ?? 0),
          y: graph.nodes.map(node => current.presentation.positions.get(node.id)?.y ?? 0),
          color: graph.nodes.map(node => rgba(node.color, related.has(node.id) ? 1 : 0.25)), pad: 18, thickness: 13,
          line: { width: 0 },
          hovertemplate: '%{label}<br>NT$%{value:,.0f}<extra></extra>',
        },
        link: {
          source: graph.links.map(link => indices.get(link.source)!),
          target: graph.links.map(link => indices.get(link.target)!),
          value: graph.links.map(link => link.value),
          customdata: graph.links.map(link => link.id),
          color: graph.links.map(link => rgba(link.color, related.has(link.id) ? current.selected ? 0.85 : 0.42 : 0.08)),
          hovertemplate: '%{source.label} → %{target.label}<br>NT$%{value:,.0f}<extra></extra>',
        },
      }], {
        width, height: chartHeight, margin: { l: 4, r: 4, t: 8, b: 8 },
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Arial, sans-serif', size: 10, color: '#29333e' },
        uirevision: graph.nodes.map(n => n.id).join(','),
      }, { displayModeBar: false, responsive: false, displaylogo: false })
      plot.current = result
      if (disposed.current) return
      if (fresh) {
        result.on('plotly_click', (event: PlotlyTypes.PlotMouseEvent) => {
          const datum = event.points[0] as unknown as { customdata?: string; pointNumber?: number; source?: unknown }
          // Node selection is handled by the pointer bridge; ribbons use Plotly's native click event.
          if (datum?.source === undefined) return
          const items = latest.current.graph.links
          const id = datum?.customdata ?? (datum?.pointNumber === undefined ? undefined : items[datum.pointNumber]?.id)
          if (id === 'utilities' && latest.current.onExpand) latest.current.onExpand()
          else if (id) latest.current.onSelect(id)
        })
        result.on('plotly_restyle', ([update]: PlotlyTypes.PlotRestyleEvent) => {
          const x = update['node.x']?.[0] as number[] | undefined
          const y = update['node.y']?.[0] as number[] | undefined
          const dragged = nativeDrag.current
          if (!x || !y || !dragged) return
          nativeDrag.current = null
          if (dragged.map(n => n.id).join(',') !== latest.current.graph.nodes.map(n => n.id).join(',')) return
          dragged.forEach((node, i) => {
            latest.current.presentation.positions.set(node.id, { x: x[i], y: y[i] })
          })
        })
      }
      latest.current.onReady()
    }).catch(error => { if (!disposed.current) latest.current.onError(String(error)) })
  }

  useEffect(() => { render.current() }, [props.graph, width, props.reducedMotion])
  useEffect(() => {
    if (!plot.current || !plotly.current) return
    if (props.reducedMotion) { render.current(); return }
    work.current = work.current.then(() => { if (!disposed.current) return applyPlotlySelection(plotly.current!, plot.current!, latest.current) })
      .catch(error => { if (!disposed.current) latest.current.onError(String(error)) })
  }, [props.selected])
  return <div ref={container} className="chart-host" role="img" aria-label="Plotly expense allocation Sankey. Use the text controls below for keyboard inspection."
    onPointerDownCapture={event => {
      const group = (event.target as Element).closest('.sankey-node')
      const node = latest.current.graph.nodes.find(n => n.label === group?.textContent)
      pointerGesture.current = node ? { x: event.clientX, y: event.clientY, id: node.id, nodes: latest.current.graph.nodes } : null
    }} />
}

function rgba(hex: string, opacity: number) {
  const [r, g, b] = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16))
  return `rgba(${r},${g},${b},${opacity})`
}

async function applyPlotlySelection(library: typeof PlotlyTypes, plot: PlotlyTypes.PlotlyHTMLElement, props: Props) {
  const related = relatedIds(props.graph, props.selected)
  await library.restyle(plot, {
    'node.color': [props.graph.nodes.map(node => rgba(node.color, related.has(node.id) ? 1 : 0.25))],
    'link.color': [props.graph.links.map(link => rgba(link.color, related.has(link.id) ? props.selected ? 0.85 : 0.42 : 0.08))],
  } as unknown as PlotlyTypes.Data)
}

export default function Chart(props: Props) {
  if (props.engine === 'echarts') return <EChartsView {...props} />
  if (props.engine === 'nivo') return <NivoView {...props} />
  return <PlotlyView {...props} />
}
