import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock the API module
vi.mock('./src/api/posts', () => ({
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
  })
}))
