import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from '../src/App'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

it('keeps the latest keyword results when the real API resolves out of order', async () => {
  vi.spyOn(Math, 'random').mockReturnValueOnce(0.9).mockReturnValueOnce(0)
  render(<App />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  fireEvent.change(input, { target: { value: 'Vue' } })
  await act(async () => { await vi.advanceTimersByTimeAsync(300) })
  expect(screen.getByText('Vue')).toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(900) })
  expect(screen.getByText('Vue')).toBeInTheDocument()
  expect(screen.queryByText('React')).not.toBeInTheDocument()
})

it('clears loading and stays empty after an outstanding request completes', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  render(<App />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  expect(screen.getByText('Searching ...')).toBeInTheDocument()
  fireEvent.change(input, { target: { value: '' } })
  expect(screen.queryByText('Searching ...')).not.toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(1200) })
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  expect(screen.queryByText(/don't have search result/)).not.toBeInTheDocument()
})

it('does not let an older completion end loading for the current keyword', async () => {
  vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9)
  render(<App />)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: 'React' } })
  fireEvent.change(input, { target: { value: 'Vue' } })
  await act(async () => { await vi.advanceTimersByTimeAsync(300) })
  expect(screen.getByText('Searching ...')).toBeInTheDocument()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  await act(async () => { await vi.advanceTimersByTimeAsync(900) })
  expect(screen.getByText('Vue')).toBeInTheDocument()
})
