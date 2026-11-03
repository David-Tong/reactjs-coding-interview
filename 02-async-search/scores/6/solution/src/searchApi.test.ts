import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchItems } from './searchApi'

describe('searchItems', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('trims the keyword and matches names without case sensitivity', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const results = searchItems('  rEaCt  ')
    await vi.advanceTimersByTimeAsync(300)

    await expect(results).resolves.toEqual([
      { id: 1, name: 'React' },
      { id: 2, name: 'React Router' },
    ])
  })

  it('returns an empty array when nothing matches', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const results = searchItems('not-a-framework')
    await vi.advanceTimersByTimeAsync(300)

    await expect(results).resolves.toEqual([])
  })
})
