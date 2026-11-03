import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { useAsyncSearch } from './useAsyncSearch'

vi.mock('./useAsyncSearch', () => ({
  useAsyncSearch: vi.fn(),
}))

const mockUseAsyncSearch = vi.mocked(useAsyncSearch)

describe('App', () => {
  beforeEach(() => {
    mockUseAsyncSearch.mockReset()
    mockUseAsyncSearch.mockReturnValue({ results: [], loading: false })
  })

  it('does not show results before a keyword is entered', () => {
    render(<App />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByText(/search result for keyword/i)).not.toBeInTheDocument()
  })

  it('shows a loading message while searching', () => {
    mockUseAsyncSearch.mockReturnValue({ results: [], loading: true })
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'React' },
    })

    expect(screen.getByText('Searching ...')).toBeInTheDocument()
  })

  it('renders matching results', () => {
    mockUseAsyncSearch.mockReturnValue({
      results: [
        { id: 1, name: 'React' },
        { id: 2, name: 'React Router' },
      ],
      loading: false,
    })
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'React' },
    })

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('React Router')).toBeInTheDocument()
  })

  it('shows a message when there are no matches', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'unknown' },
    })

    expect(
      screen.getByText("We don't have search result for keyword unknown"),
    ).toBeInTheDocument()
  })
})
