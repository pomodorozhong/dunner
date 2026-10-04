// Whole days remain useful for repository activity; avoid treating pushes to any
// branch as commits to the default branch. Timestamps come from the saved API snapshot.
export function relativeCommitTime(date: string, now = Date.now()) {
  const seconds = Math.floor((now - Date.parse(date)) / 1000)
  if (!Number.isFinite(seconds)) return 'Unknown'
  if (seconds < 0) return 'Timestamp is ahead of this device'
  if (seconds < 60) return 'Less than a minute ago'
  const [value, unit] = seconds < 3600 ? [Math.floor(seconds / 60), 'minute']
    : seconds < 86400 ? [Math.floor(seconds / 3600), 'hour']
    : [Math.floor(seconds / 86400), 'day']
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`
}
