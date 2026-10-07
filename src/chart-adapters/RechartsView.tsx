import { useEffect, useMemo, useRef, useState } from 'react'
import { Sankey, Tooltip, type SankeyElementType, type SankeyLinkProps, type SankeyNodeProps } from 'recharts'
import { relatedIds, type GraphLink, type GraphNode } from '../fixture'
import { useChartSize } from '../hooks'
import { waitForChartIdle, type ChartProps } from '../charts'

export default function RechartsView(props: ChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const { width, height } = useChartSize(container)
  const [hovered, setHovered] = useState<string | null>(null)
  const data = useMemo(() => {
    const indices = new Map(props.graph.nodes.map((node, index) => [node.id, index]))
    return {
      nodes: props.graph.nodes.map(node => ({ ...node, name: node.label })),
      links: props.graph.links.map(link => ({ ...link, source: indices.get(link.source)!, target: indices.get(link.target)! })),
    }
  }, [props.graph])
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

  function activate(item: SankeyNodeProps | SankeyLinkProps, type: SankeyElementType) {
    const id = type === 'node'
      ? (item as SankeyNodeProps).payload as unknown as GraphNode
      : props.graph.links[(item as SankeyLinkProps).index]
    const selection = typeof id === 'string' ? id : id?.id
    if (!selection) return
    if (selection === 'utilities' && props.onExpand) props.onExpand()
    else props.onSelect(selection)
  }

  function hoveredId(item: SankeyNodeProps | SankeyLinkProps, type: SankeyElementType) {
    return type === 'node'
      ? ((item as SankeyNodeProps).payload as unknown as GraphNode).id
      : props.graph.links[(item as SankeyLinkProps).index]?.id ?? null
  }

  const renderNode = (item: SankeyNodeProps) => {
    const node = item.payload as unknown as GraphNode
    const alignLeft = node.kind === 'person' || utilityChildren.has(node.id)
    const nodeRelated = related.has(node.id)
    return <g opacity={nodeRelated ? 1 : 0.25}>
      <rect x={item.x} y={item.y} width={item.width} height={Math.max(1, item.height)} rx={2} fill={node.color} />
      <text x={alignLeft ? item.x - 5 : item.x + item.width + 5} y={item.y + item.height / 2} textAnchor={alignLeft ? 'end' : 'start'} dominantBaseline="middle" fill="#29333e" fontSize={10}>{node.label}</text>
      <title>{node.label}: NT${node.value.toLocaleString('en-US')}</title>
    </g>
  }

  const renderLink = (item: SankeyLinkProps) => {
    const link = props.graph.links[item.index] as GraphLink | undefined
    if (!link) return <path d="" />
    return <path d={`M${item.sourceX},${item.sourceY} C${item.sourceControlX},${item.sourceY} ${item.targetControlX},${item.targetY} ${item.targetX},${item.targetY}`}
      fill="none" stroke={link.color} strokeWidth={Math.max(1, item.linkWidth)} strokeOpacity={related.has(link.id) ? (focus ? 0.85 : 0.42) : 0.08}>
      <title>{linkTitle(props.graph.nodes, link)}: NT${link.value.toLocaleString('en-US')}</title>
    </path>
  }

  return <div ref={container} className="chart-host" role="img" aria-label="Recharts expense allocation Sankey. Use the text controls below for keyboard inspection.">
    {width > 0 && <Sankey
      width={width} height={height} data={data}
      nodeWidth={13} nodePadding={18} iterations={16} linkCurvature={0.5}
      sort={false} align="justify" accessibilityLayer
      node={renderNode} link={renderLink}
      onClick={activate}
      onMouseEnter={(item, type) => setHovered(hoveredId(item, type))}
      onMouseLeave={() => setHovered(null)}
    ><Tooltip /></Sankey>}
  </div>
}

function linkTitle(nodes: GraphNode[], link: GraphLink) {
  return `${nodes.find(node => node.id === link.source)?.label ?? link.source} → ${nodes.find(node => node.id === link.target)?.label ?? link.target}`
}
