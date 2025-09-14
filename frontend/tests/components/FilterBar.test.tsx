import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from '../../src/components/FilterBar/FilterBar'
import type { Filters } from '../../src/components/FilterBar/types'

const renderFB = (overrides: Partial<Filters> = {}, onChange = vi.fn()) => {
  const filters: Filters = {
    status: '',
    platform: '',
    tag: [],
    search: '',
    ...overrides,
  }
  render(<FilterBar filters={filters} onFiltersChange={onChange} />)
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

  it('updates status and platform', () => {
    const { onChange } = renderFB()

    // Open and choose status
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /status/i }))
    const flagged = screen.getByRole('option', { name: /flagged/i })
    fireEvent.click(flagged)

    expect(onChange).toHaveBeenCalled()

    // Open and choose platform
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /platform/i }))
    const twitter = screen.getByRole('option', { name: /twitter/i })
    fireEvent.click(twitter)

    expect(onChange).toHaveBeenCalled()
  })

  it('updates search immediately', () => {
    const { onChange } = renderFB()
    const search = screen.getByLabelText(/search/i) as HTMLInputElement
    fireEvent.change(search, { target: { value: 'foo' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('clears all filters', () => {
    const { onChange } = renderFB({ status: 'FLAGGED', platform: 'twitter', tag: ['health'], search: 'x' })
    fireEvent.click(screen.getByText(/clear/i))
    expect(onChange).toHaveBeenCalledWith({ status: '', platform: '', tag: [], search: '' })
  })
})
