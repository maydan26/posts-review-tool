import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { TagOptionsProvider } from '../src/contexts/TagOptionsContext'

// Mock the API module for component tests
vi.mock('../src/api/posts', () => ({
  getPosts: vi.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        platform: 'twitter',
        text: 'Test post',
        status: 'FLAGGED',
        tags: ['test', 'sample'],
        created_at: '2023-01-01T00:00:00Z'
      }
    ],
    total: 1,
    limit: 10,
    offset: 0
  }),
  updateStatus: vi.fn().mockResolvedValue({
    id: 1,
    platform: 'twitter',
    text: 'Test post',
    status: 'DISMISSED',
    tags: ['test', 'sample'],
    created_at: '2023-01-01T00:00:00Z'
  }),
  addTag: vi.fn().mockResolvedValue({
    id: 1,
    platform: 'twitter',
    text: 'Test post',
    status: 'FLAGGED',
    tags: ['test', 'sample', 'new'],
    created_at: '2023-01-01T00:00:00Z'
  }),
  removeTag: vi.fn().mockResolvedValue({
    id: 1,
    platform: 'twitter',
    text: 'Test post',
    status: 'FLAGGED',
    tags: ['test'],
    created_at: '2023-01-01T00:00:00Z'
  })
}))

export function renderWithProviders(ui: React.ReactElement) {
  return render(<TagOptionsProvider>{ui}</TagOptionsProvider>)
}

export * from '@testing-library/react'

