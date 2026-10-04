import { writeFile, rename } from 'node:fs/promises'

const repositories = { echarts: 'apache/echarts', nivo: 'plouc/nivo', plotly: 'plotly/plotly.js' }
async function github(path) {
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'dunner-local-comparison' },
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${path}. Existing snapshot has been preserved.`)
  return response.json()
}
const entries = await Promise.all(Object.entries(repositories).map(async ([engine, repository]) => {
  const repo = await github(repository)
  const [commit, license] = await Promise.all([
    github(`${repository}/commits/${encodeURIComponent(repo.default_branch)}`),
    github(`${repository}/license`),
  ])
  return [engine, {
    repository, url: repo.html_url, stars: repo.stargazers_count,
    license: repo.license?.spdx_id ?? 'Unknown', defaultBranch: repo.default_branch,
    archived: repo.archived, commitDate: commit.commit.committer.date, commitUrl: commit.html_url,
    licenseUrl: license.html_url,
  }]
}))
const snapshot = { fetchedAt: new Date().toISOString(), libraries: Object.fromEntries(entries) }
const destination = new URL('../src/data/library-stats.json', import.meta.url)
const temporary = new URL('../src/data/library-stats.json.tmp', import.meta.url)
await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`)
await rename(temporary, destination)
console.log(`Updated GitHub snapshot: ${snapshot.fetchedAt}`)
