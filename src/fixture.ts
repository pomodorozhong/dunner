export type Engine = 'echarts' | 'nivo' | 'plotly'
export const groupingModes = ['individual', 'grouped', 'detailed'] as const
export type GroupingMode = typeof groupingModes[number]
export function nextGrouping(mode: GroupingMode): GroupingMode {
  return groupingModes[(groupingModes.indexOf(mode) + 1) % groupingModes.length]
}
export type GraphNode = { id: string; label: string; color: string; value: number; kind: 'total' | 'expense' | 'person' }
export type GraphLink = { id: string; source: string; target: string; value: number; color: string }
export type Graph = { nodes: GraphNode[]; links: GraphLink[] }

export const people = Object.freeze([
  Object.freeze({ id: 'wen', label: 'Wen', percent: 40, color: '#38b985' }),
  Object.freeze({ id: 'jonathan', label: 'Jonathan', percent: 35, color: '#9c79dd' }),
  Object.freeze({ id: 'mei', label: 'Mei', percent: 25, color: '#e589ae' }),
])
export const expenses = Object.freeze([
  Object.freeze({ id: 'rent', label: 'Rent', october: 30000, september: 30000, color: '#19aaa8', utility: false }),
  Object.freeze({ id: 'electricity', label: 'Electricity', october: 2400, september: 1800, color: '#eaba38', utility: true }),
  Object.freeze({ id: 'water', label: 'Water', october: 600, september: 500, color: '#5baff0', utility: true }),
  Object.freeze({ id: 'internet', label: 'Internet', october: 1000, september: 1000, color: '#a080e4', utility: true }),
  Object.freeze({ id: 'groceries', label: 'Groceries', october: 6000, september: 4700, color: '#f08571', utility: false }),
])
export const total = expenses.reduce((sum, item) => sum + item.october, 0)
export const previousTotal = expenses.reduce((sum, item) => sum + item.september, 0)
export const money = (value: number) => `NT$${value.toLocaleString('en-US')}`
export const amount = (value: number) => value.toLocaleString('en-US')
export const allocation = (value: number, percent: number) => value * percent / 100

export function buildGraph(mode: GroupingMode): Graph {
  const utilityBills = expenses.filter(item => item.utility)
  const utilities = { id: 'utilities', label: 'Utilities', october: utilityBills.reduce((sum, item) => sum + item.october, 0), color: '#839fbf' }
  const categories = mode !== 'individual' ? [
    expenses[0],
    utilities,
    expenses[4],
  ] : expenses
  const visibleExpenses = mode === 'detailed' ? [...categories, ...utilityBills] : categories
  const nodes: GraphNode[] = [
    { id: 'total', label: 'Total', color: '#343f4d', value: total, kind: 'total' },
    ...visibleExpenses.map(item => ({ id: item.id, label: item.label, color: item.color, value: item.october, kind: 'expense' as const })),
    ...people.map(person => ({ id: person.id, label: person.label, color: person.color, value: allocation(total, person.percent), kind: 'person' as const })),
  ]
  const links: GraphLink[] = categories.flatMap(item => [
    { id: `total:${item.id}`, source: 'total', target: item.id, value: item.october, color: item.color },
    ...(mode === 'detailed' && item.id === 'utilities'
      ? utilityBills.flatMap(bill => [
        { id: `utilities:${bill.id}`, source: 'utilities', target: bill.id, value: bill.october, color: bill.color },
        ...people.map(person => ({ id: `${bill.id}:${person.id}`, source: bill.id, target: person.id, value: allocation(bill.october, person.percent), color: bill.color })),
      ])
      : people.map(person => ({ id: `${item.id}:${person.id}`, source: item.id, target: person.id, value: allocation(item.october, person.percent), color: item.color }))),
  ])
  return { nodes, links }
}

export function selectionDetails(graph: Graph, selected: string | null) {
  const node = graph.nodes.find(item => item.id === selected)
  const link = graph.links.find(item => item.id === selected)
  if (link) {
    return {
      title: `${graph.nodes.find(item => item.id === link.source)!.label} → ${graph.nodes.find(item => item.id === link.target)!.label}`,
      value: link.value,
      rows: [{ label: 'Allocated amount', value: link.value }],
    }
  }
  if (!node) return null
  const connected = node.kind === 'person'
    ? graph.links.filter(item => item.target === node.id)
    : graph.links.filter(item => item.source === node.id)
  return {
    title: node.label,
    value: node.value,
    rows: connected.map(item => ({
      label: graph.nodes.find(n => n.id === (node.kind === 'person' ? item.source : item.target))!.label,
      value: item.value,
    })),
  }
}

export function relatedIds(graph: Graph, selected: string | null): Set<string> {
  if (!selected) return new Set([...graph.nodes, ...graph.links].map(item => item.id))
  const related = new Set([selected])
  for (const link of graph.links) {
    if (link.id === selected || link.source === selected || link.target === selected) {
      related.add(link.id); related.add(link.source); related.add(link.target)
    }
  }
  return related
}
