import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchItems, type Item } from './searchApi'
import { useAsyncSearch } from './useAsyncSearch'

vi.mock('./searchApi', () => ({
  searchItems: vi.fn(),
}))

const mockedSearchItems = vi.mocked(searchItems)

const deferred = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

describe('useAsyncSearch', () => {
  afterEach(() => {
    mockedSearchItems.mockReset()
  })

  it('does not search an empty keyword', () => {
    const { result } = renderHook(() => useAsyncSearch('   '))

    expect(mockedSearchItems).not.toHaveBeenCalled()
    expect(result.current).toEqual({ results: [], loading: false })
  })

  it('trims the keyword and exposes the results when the search completes', async () => {
    const matches: Item[] = [{ id: 1, name: 'React' }]
    mockedSearchItems.mockResolvedValue(matches)

    const { result } = renderHook(() => useAsyncSearch('  React  '))

    expect(result.current.loading).toBe(true)
    expect(mockedSearchItems).toHaveBeenCalledWith('React')

    await waitFor(() => {
      expect(result.current).toEqual({ results: matches, loading: false })
    })
  })

  it('clears results when the keyword becomes empty', async () => {
    mockedSearchItems.mockResolvedValue([{ id: 1, name: 'React' }])

    const { result, rerender } = renderHook(
      ({ keyword }) => useAsyncSearch(keyword),
      { initialProps: { keyword: 'React' } },
    )

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 1, name: 'React' }])
    })

    rerender({ keyword: '  ' })

    expect(result.current).toEqual({ results: [], loading: false })
    expect(mockedSearchItems).toHaveBeenCalledTimes(1)
  })

  it('ignores a previous search that completes after a newer search', async () => {
    const firstSearch = deferred<Item[]>()
    const secondSearch = deferred<Item[]>()
    mockedSearchItems
      .mockReturnValueOnce(firstSearch.promise)
      .mockReturnValueOnce(secondSearch.promise)

    const { result, rerender } = renderHook(
      ({ keyword }) => useAsyncSearch(keyword),
      { initialProps: { keyword: 'Re' } },
    )

    rerender({ keyword: 'React' })
    secondSearch.resolve([{ id: 1, name: 'React' }])

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 1, name: 'React' }])
    })

    await act(async () => {
      firstSearch.resolve([{ id: 2, name: 'Redux' }])
      await firstSearch.promise
    })

    expect(result.current.results).toEqual([{ id: 1, name: 'React' }])
  })
})
