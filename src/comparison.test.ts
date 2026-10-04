import { describe, expect, it } from 'vitest'
import { relativeCommitTime } from './comparison'

describe('repository commit ages', () => {
  const date = '2026-10-04T10:00:00Z'
  const timestamp = Date.parse(date)
  it('shows elapsed minutes, hours and days without rounding a future day up', () => {
    expect(relativeCommitTime(date, timestamp + 59000)).toBe('Less than a minute ago')
    expect(relativeCommitTime(date, timestamp + 60000)).toBe('1 minute ago')
    expect(relativeCommitTime(date, timestamp + 4 * 86400000 + 30000)).toBe('4 days ago')
    expect(relativeCommitTime(date, timestamp + 23 * 3600000)).toBe('23 hours ago')
  })
  it('does not show negative ages if the device clock is behind', () => {
    expect(relativeCommitTime(date, timestamp - 1000)).toBe('Timestamp is ahead of this device')
    expect(relativeCommitTime('invalid', timestamp)).toBe('Unknown')
  })
})
