import { useEffect, useMemo, useRef } from 'react'
import { Sankey } from '@ant-design/plots'
import type { SankeyConfig } from '@ant-design/plots'
import { money, relatedIds, type Graph, type GraphLink, type GraphNode } from '../fixture'
import { useWidth } from '../hooks'
import { waitForChartIdle, type ChartProps } from '../charts'

const chartHeight = 350
type Datum = Record<string, unknown>
type PlotEvent = { type?: string; data?: unknown; nativeEvent?: boolean }

export default function AntDesignView(props: ChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const width = useWidth(container)
  const latest = useRef(props)
  latest.current = props
  const related = relatedIds(props.graph, props.selected)
  const nodeById = useMemo(() => new Map(props.graph.nodes.map(node => [node.id, node])), [props.graph])
  const config = useMemo<SankeyConfig>(() => {
    const graph: Graph = {
      nodes: props.graph.nodes.map(node => ({ ...node, key: node.id } as GraphNode)),
      links: props.graph.links.map(link => ({ ...link })),
    }
    const linkFor = (datum: Datum) => props.graph.links.find(link => link.id === String(datum.id))
      ?? props.graph.links.find(link => link.source === idOf(datum.source) && link.target === idOf(datum.target))
    const nodeColor = (datum: Datum) => nodeById.get(String(datum.id))?.color ?? '#87998d'
    const linkColor = (datum: Datum) => linkFor(datum)?.color ?? '#87998d'
    const nodeOpacity = (datum: Datum) => related.has(String(datum.id)) ? 1 : 0.25
    const linkOpacity = (datum: Datum) => related.has(linkFor(datum)?.id ?? '') ? (props.selected ? 0.85 : 0.42) : 0.08

    return {
      data: graph,
      width,
      height: chartHeight,
      autoFit: false,
      animate: false,
      layout: { nodeId: (node: Datum) => String(node.id), nodeAlign: 'justify', nodeWidth: 0.024, nodePadding: 0.035, iterations: 16 },
      encode: { nodeKey: 'id' },
      style: {
        nodeFill: nodeColor, nodeFillOpacity: nodeOpacity, nodeStroke: 'none',
        linkFill: linkColor, linkFillOpacity: linkOpacity, linkStroke: 'none',
        labelText: (datum: Datum) => String(datum.label ?? datum.id),
        labelFill: '#29333e', labelFontSize: 10,
      },
      tooltip: {
        nodeTitle: (datum: Datum) => String(datum.label ?? datum.id),
        nodeItems: [{ field: 'value', name: 'Amount', valueFormatter: (value: unknown) => money(Number(value)) }],
        linkTitle: '',
        linkItems: [(datum: Datum) => ({ name: `${idOf(datum.source)} → ${idOf(datum.target)}`, value: money(Number(datum.value)) })],
      },
      onReady: () => latest.current.onReady(),
      onEvent: (_chart, event) => handlePlotEvent(event, latest.current.graph, latest.current.onSelect, latest.current.onExpand),
    }
  }, [props.graph, props.selected, width, nodeById, related])

  useEffect(() => {
    if (width <= 0) return
    props.handle.current = { prepareExport: async () => {
      await waitForChartIdle(container.current!)
    } }
    return () => { props.handle.current = null }
  }, [width, props.graph])

  return <div ref={container} className="chart-host ant-design-chart" role="img" aria-label="Ant Design Charts expense allocation Sankey. Use the text controls below for keyboard inspection.">
    {width > 0 && <Sankey {...config} />}
  </div>
}

function idOf(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (!value || typeof value !== 'object') return ''
  const datum = value as Datum
  return String(datum.id ?? datum.key ?? datum.name ?? '')
}

function handlePlotEvent(event: PlotEvent, graph: Graph, onSelect: (id: string) => void, onExpand?: () => void) {
  // Ant Design's wrapper forwards the native click payload's type (`click`)
  // while retaining this marker that G2 adds for a Sankey element event.
  if ((event.type !== 'click' && event.type !== 'element:click') || !event.nativeEvent) return
  const data = collectDatums(event.data)
  for (const datum of data) {
    const id = idOf(datum)
    if (graph.nodes.some(node => node.id === id) || graph.links.some(link => link.id === id)) {
      if (id === 'utilities' && onExpand) onExpand()
      else onSelect(id)
      return
    }
    const source = idOf(datum.source)
    const target = idOf(datum.target)
    const link = graph.links.find(item => item.source === source && item.target === target)
    if (link) { onSelect(link.id); return }
  }
}

function collectDatums(value: unknown) {
  const result: Datum[] = []
  const pending = [value]
  const seen = new Set<object>()
  while (pending.length && result.length < 20) {
    const current = pending.shift()
    if (!current || typeof current !== 'object' || seen.has(current)) continue
    seen.add(current)
    const datum = current as Datum
    result.push(datum)
    for (const key of ['data', 'datum', 'item', 'record', 'originalData']) {
      if (datum[key] && typeof datum[key] === 'object') pending.push(datum[key])
    }
  }
  return result
}
