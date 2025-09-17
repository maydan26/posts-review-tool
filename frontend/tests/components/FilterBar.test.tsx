import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test-utils'
import FilterBar from '../../src/components/FilterBar/FilterBar'
import type { Filters } from '../../src/components/FilterBar/types'

const renderFB = (overrides: Partial<Filters> = {}, onChange = vi.fn()) => {
  const filters: Filters = {
    status: '',
    platform: '',
    tag: '',
    search: '',
    ...overrides,
  }
  renderWithProviders(<FilterBar filters={filters} onFiltersChange={onChange} />)
  return { onChange }
}

describe('FilterBar', () => {
  it('renders controls', () => {
    renderFB()
    // Search by label
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
    // MUI Selects by role=combobox with accessible name
    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /platform/i })).toBeInTheDocument()
    expect(screen.getByText(/clear/i)).toBeInTheDocument()
  })

  it('updates status and platform', async () => {
    const { onChange } = renderFB()
    const user = userEvent.setup()
  
    // Open and choose status
    await user.click(screen.getByRole('combobox', { name: /status/i }))
    const flagged = await screen.findByRole('option', { name: /flagged/i })
    await user.click(flagged)
  
    expect(onChange).toHaveBeenCalled()
  
    // Open and choose platform
    await user.click(screen.getByRole('combobox', { name: /platform/i }))
    const twitter = await screen.findByRole('option', { name: /twitter/i })
    await user.click(twitter)
  
    expect(onChange).toHaveBeenCalled()
  })

  it('updates search immediately', () => {
    const { onChange } = renderFB()
    const search = screen.getByLabelText(/search/i) as HTMLInputElement
    fireEvent.change(search, { target: { value: 'foo' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('clears all filters', () => {
    const { onChange } = renderFB({ status: 'FLAGGED', platform: 'twitter', tag: 'health', search: 'x' })
    fireEvent.click(screen.getByText(/clear/i))
    expect(onChange).toHaveBeenCalledWith({ status: '', platform: '', tag: '', search: '' })
  })
})
