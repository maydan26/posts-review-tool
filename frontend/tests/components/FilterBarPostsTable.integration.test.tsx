import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

// Mock API layer used by App
const getPostsMock = vi.fn()
vi.mock('../../src/api/posts', async (orig) => {
  const actual = await (orig as any)()
  return {
    ...actual,
    getPosts: (...args: unknown[]) => getPostsMock(...args),
  }
})

const makePost = (id: number, overrides: Partial<any> = {}) => ({
  id,
  text: `Post ${id}`,
  platform: 'twitter',
  status: 'FLAGGED',
  tags: [],
  created_at: '2025-09-14T14:30:00Z',
  ...overrides,
})

describe('FilterBar ↔ PostsTable integration', () => {
  beforeEach(() => {
    getPostsMock.mockReset()
    // Default implementation: return initial empty filters data,
    // and when all filters are present, return the filtered result.
    getPostsMock.mockImplementation((params: any = {}) => {
      const hasFilters = Boolean(
        params && params.status && params.platform && params.tag && params.search
      )
      if (hasFilters) {
        return Promise.resolve({ data: [makePost(2, { text: 'Filtered Result' })], total: 1 })
      }
      return Promise.resolve({ data: [makePost(1)], total: 1 })
    })
  })

  it('calls API with filters and updates table results', async () => {
    renderWithProviders(<App />)

    // Initial render shows first response
    await screen.findByText('Post 1')
    expect(getPostsMock).toHaveBeenCalled()

    // Apply filters
    // Status
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /status/i }))
    fireEvent.click(await screen.findByRole('option', { name: /flagged/i }))
    // Platform
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /platform/i }))
    fireEvent.click(await screen.findByRole('option', { name: /twitter/i }))
    // Tag (single-select Autocomplete): open and choose option
    const tagCombo = screen.getByRole('combobox', { name: /tag/i })
    await userEvent.click(tagCombo)
    const healthOption = await screen.findByRole('option', { name: /health/i })
    await userEvent.click(healthOption)
    // Search
    const search = screen.getByLabelText(/search/i)
    fireEvent.change(search, { target: { value: 'abc' } })

    // Subsequent API call with combined filters should render filtered data
    await screen.findByText('Filtered Result')

    // Inspect last call params
    const lastCallArgs = getPostsMock.mock.calls.at(-1)?.[0] as Record<string, any>
    expect(lastCallArgs).toMatchObject({
      status: 'FLAGGED',
      platform: 'twitter',
      tag: 'health',
      search: 'abc',
    })
  })
})


