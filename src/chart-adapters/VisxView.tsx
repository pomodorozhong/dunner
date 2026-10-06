import { useEffect, useMemo, useRef, useState } from 'react'
import { Sankey, sankeyJustify, type SankeyGraph } from '@visx/sankey'
import { relatedIds, type GraphLink, type GraphNode } from '../fixture'
import { useWidth } from '../hooks'
import { waitForChartIdle, type ChartProps } from '../charts'

const chartHeight = 350

export default function VisxView(props: ChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const width = useWidth(container)
  const [hovered, setHovered] = useState<string | null>(null)
  // d3-sankey mutates its root graph during layout, so create a fresh copy when
  // the size or focus changes before asking the visx component to lay it out.
  const root = useMemo(() => ({
    nodes: props.graph.nodes.map(node => ({ ...node })),
    links: props.graph.links.map(link => ({ ...link })),
  }), [props.graph, width, hovered, props.selected])
  const focus = hovered ?? props.selected
  const related = relatedIds(props.graph, focus)
  const utilityChildren = new Set(props.graph.links.filter(link => link.source === 'utilities').map(link => link.target))

  useEffect(() => {
    if (width <= 0) return
    props.onReady()
    props.handle.current = { prepareExport: async () => {
      setHovered(null)
      await waitForChartIdle(container.current!)
    } }
    return () => { props.handle.current = null }
  }, [width, props.graph])

  return <div ref={container} className="chart-host" role="img" aria-label="visx Sankey expense allocation. Use the text controls below for keyboard inspection.">
    {width > 0 && <svg width={width} height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`} aria-hidden="true">
      <Sankey<GraphNode, GraphLink>
        root={root as unknown as SankeyGraph<GraphNode, GraphLink>}
        nodeId={node => node.id}
        nodeAlign={sankeyJustify}
        nodeWidth={13}
        nodePadding={18}
        iterations={16}
        size={[width, chartHeight]}
      >
        {({ graph, createPath }) => <>
          <g className="visx-sankey-links">
            {graph.links.map((link, index) => {
              const datum = link as typeof link & GraphLink
              const color = datum.color ?? '#8a9b8e'
              const active = related.has(datum.id)
              return <path key={`${datum.id}-${index}`} d={createPath(link) ?? ''} fill="none" stroke={color} strokeWidth={Math.max(1, link.width ?? 0)} strokeOpacity={active ? (focus ? 0.85 : 0.42) : 0.08} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(datum.id)} onMouseLeave={() => setHovered(null)} onClick={() => props.onSelect(datum.id)}>
                <title>{linkTitle(props.graph.nodes, datum)}: NT${datum.value.toLocaleString('en-US')}</title>
              </path>
            })}
          </g>
          <g className="visx-sankey-nodes">
            {graph.nodes.map(node => {
              const datum = node as typeof node & GraphNode
              const alignLeft = datum.kind === 'person' || utilityChildren.has(datum.id)
              const active = related.has(datum.id)
              const x = node.x0 ?? 0
              const y = node.y0 ?? 0
              const nodeWidth = (node.x1 ?? x) - x
              const nodeHeight = (node.y1 ?? y) - y
              const select = () => {
                if (datum.id === 'utilities' && props.onExpand) props.onExpand()
                else props.onSelect(datum.id)
              }
              return <g key={datum.id} opacity={active ? 1 : 0.25} style={{ cursor: 'pointer' }} onMouseEnter={() => setHovered(datum.id)} onMouseLeave={() => setHovered(null)} onClick={select}>
                <rect x={x} y={y} width={nodeWidth} height={Math.max(1, nodeHeight)} rx={2} fill={datum.color} />
                <text x={alignLeft ? x - 5 : x + nodeWidth + 5} y={y + nodeHeight / 2} textAnchor={alignLeft ? 'end' : 'start'} dominantBaseline="middle" fill="#29333e" fontSize={10}>{datum.label}</text>
                <title>{datum.label}: NT${datum.value.toLocaleString('en-US')}</title>
              </g>
            })}
          </g>
        </>}
      </Sankey>
    </svg>}
  </div>
}

function linkTitle(nodes: GraphNode[], link: GraphLink) {
  return `${nodes.find(node => node.id === link.source)?.label ?? link.source} → ${nodes.find(node => node.id === link.target)?.label ?? link.target}`
}
