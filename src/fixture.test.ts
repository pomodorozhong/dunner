import { describe, expect, it } from 'vitest'
import { allocation, buildGraph, expenses, groupingModes, nextGrouping, people, previousTotal, selectionDetails, total } from './fixture'

describe('shared expense fixture', () => {
  it('reconciles both months and every individual share and increase', () => {
    expect(total).toBe(40000)
    expect(previousTotal).toBe(38000)
    expect(people.map(p => allocation(total, p.percent))).toEqual([16000, 14000, 10000])
    expect(people.map(p => allocation(total - previousTotal, p.percent))).toEqual([800, 700, 500])
    expect(expenses.map(e => e.october - e.september)).toEqual([0, 600, 100, 0, 1300])
  })
  for (const mode of groupingModes) {
    it(`conserves every node's flow in ${mode} mode`, () => {
      const graph = buildGraph(mode)
      expect(new Set(graph.nodes.map(n => n.id)).size).toBe(graph.nodes.length)
      expect(new Set(graph.links.map(l => l.id)).size).toBe(graph.links.length)
      for (const node of graph.nodes) {
        const incoming = graph.links.filter(l => l.target === node.id).reduce((sum, l) => sum + l.value, 0)
        const outgoing = graph.links.filter(l => l.source === node.id).reduce((sum, l) => sum + l.value, 0)
        if (node.kind !== 'total') expect(incoming).toBe(node.value)
        if (node.kind !== 'person') expect(outgoing).toBe(node.value)
      }
      for (const link of graph.links) expect(link.color).toBe(graph.nodes.find(n => n.id === (link.source === 'total' || link.source === 'utilities' && mode === 'detailed' ? link.target : link.source))!.color)
    })
  }
  it('groups utilities reversibly without changing the source fixture', () => {
    const before = JSON.stringify(expenses)
    const original = buildGraph('individual')
    expect(selectionDetails(buildGraph('grouped'), 'utilities')).toEqual({ title: 'Utilities', value: 4000, rows: [
      { label: 'Wen', value: 1600 }, { label: 'Jonathan', value: 1400 }, { label: 'Mei', value: 1000 },
    ] })
    expect(buildGraph('individual')).toEqual(original)
    expect(JSON.stringify(expenses)).toBe(before)
  })
  it('shows exact node and ribbon breakdowns and safely ignores stale selections', () => {
    const graph = buildGraph('individual')
    expect(selectionDetails(graph, 'rent:jonathan')?.value).toBe(10500)
    expect(selectionDetails(graph, 'wen')?.rows.reduce((sum, row) => sum + row.value, 0)).toBe(16000)
    expect(selectionDetails(buildGraph('grouped'), 'water')).toBeNull()
    expect(selectionDetails(graph, null)).toBeNull()
  })
  it('only aggregates utility flows, preserving unrelated identities and exact shares', () => {
    const expanded = buildGraph('individual')
    const grouped = buildGraph('grouped')
    const utilityIds = ['electricity', 'water', 'internet']
    for (const node of expanded.nodes.filter(node => !utilityIds.includes(node.id))) {
      expect(grouped.nodes.find(next => next.id === node.id)).toEqual(node)
    }
    for (const link of expanded.links.filter(link => !utilityIds.includes(link.source) && !utilityIds.includes(link.target))) {
      expect(grouped.links.find(next => next.id === link.id)).toEqual(link)
    }
    for (const person of people) {
      const combined = expanded.links.filter(link => utilityIds.includes(link.source) && link.target === person.id)
        .reduce((sum, link) => sum + link.value, 0)
      expect(grouped.links.find(link => link.source === 'utilities' && link.target === person.id)?.value).toBe(combined)
    }
    expect(grouped.links.find(link => link.id === 'total:utilities')?.value).toBe(4000)
  })
  it('keeps the utility parent and bills without counting them twice', () => {
    const detailed = buildGraph('detailed')
    expect(selectionDetails(detailed, 'utilities')).toEqual({ title: 'Utilities', value: 4000, rows: [
      { label: 'Electricity', value: 2400 }, { label: 'Water', value: 600 }, { label: 'Internet', value: 1000 },
    ] })
    expect(detailed.links.filter(link => link.source === 'total').reduce((sum, link) => sum + link.value, 0)).toBe(40000)
    expect(detailed.links.some(link => link.source === 'utilities' && people.some(person => person.id === link.target))).toBe(false)
    for (const bill of expenses.filter(item => item.utility)) {
      expect(detailed.links.find(link => link.id === `utilities:${bill.id}`)?.value).toBe(bill.october)
      expect(detailed.links.some(link => link.id === `total:${bill.id}`)).toBe(false)
      expect(selectionDetails(detailed, bill.id)?.rows.reduce((sum, row) => sum + row.value, 0)).toBe(bill.october)
      for (const person of people) {
        expect(detailed.links.find(link => link.id === `${bill.id}:${person.id}`))
          .toEqual(buildGraph('individual').links.find(link => link.id === `${bill.id}:${person.id}`))
      }
    }
    expect(selectionDetails(detailed, 'electricity:jonathan')?.value).toBe(840)
  })
  it('cycles all three presentations back to the initial fixture', () => {
    const before = JSON.stringify(expenses)
    let mode = groupingModes[0] as typeof groupingModes[number]
    const sequence = [mode]
    for (let i = 0; i < 3; i++) { mode = nextGrouping(mode); buildGraph(mode); sequence.push(mode) }
    expect(sequence).toEqual(['individual', 'grouped', 'detailed', 'individual'])
    expect(JSON.stringify(expenses)).toBe(before)
    expect(buildGraph(mode)).toEqual(buildGraph('individual'))
  })
})
