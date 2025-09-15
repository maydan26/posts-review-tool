import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostsTable from '../../src/components/PostsTable/PostsTable'
import type { Post } from '../../src/types'

// Mock API
const updateStatusMock = vi.fn()
vi.mock('../../src/api/posts', () => ({
  updateStatus: (...args: unknown[]) => updateStatusMock(...args),
}))

const basePosts: Post[] = [
  {
    id: 1,
    text: 'Sample flagged post',
    platform: 'twitter',
    status: 'UNDER_REVIEW',
    tags: ['health'],
    created_at: '2025-09-14T14:30:00Z',
  },
  {
    id: 2,
    text: 'Another post here',
    platform: 'facebook',
    status: 'FLAGGED',
    tags: [],
    created_at: '2025-09-14T15:00:00Z',
  },
]

function renderTable(posts: Post[] = basePosts) {
  return render(
    <PostsTable posts={posts} loading={false} error={null} total={posts.length} />
  )
}

describe('PostsTable - Status inline editing', () => {
  beforeEach(() => {
    updateStatusMock.mockReset()
  })

  it('shows StatusChip and an edit button per row; chip is not clickable', async () => {
    renderTable()
    // Find both rows by text
    const row1 = screen.getByText('Sample flagged post').closest('tr') as HTMLElement
    const row2 = screen.getByText('Another post here').closest('tr') as HTMLElement
    expect(row1).toBeTruthy()
    expect(row2).toBeTruthy()

    // Each row should have an edit icon button (✎)
    const editButtonsRow1 = within(row1).getAllByRole('button', { name: /edit status/i })
    expect(editButtonsRow1.length).toBeGreaterThan(0)

    // Clicking the chip label should NOT open menu
    // Find the chip label in row1 (Under Review)
    within(row1).getByText('Under Review')
    await userEvent.click(within(row1).getByText('Under Review'))
    // No menu should appear yet
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens menu only when clicking the edit button and updates optimistically on select (success)', async () => {
    renderTable()

    const row1 = screen.getByText('Sample flagged post').closest('tr') as HTMLElement
    // Open menu via edit button
    const editButton = within(row1).getByRole('button', { name: /edit status/i })
    await userEvent.click(editButton)

    // Menu options visible
    const optFlagged = await screen.findByRole('menuitem', { name: 'Flagged' })
    const optDismissed = screen.getByRole('menuitem', { name: 'Dismissed' })
    const optUnderReview = screen.getByRole('menuitem', { name: 'Under Review' })
    expect(optFlagged).toBeInTheDocument()
    expect(optDismissed).toBeInTheDocument()
    expect(optUnderReview).toBeInTheDocument()

    // Mock API success
    updateStatusMock.mockResolvedValueOnce({})

    // Select Flagged
    await userEvent.click(optFlagged)

    // Optimistic: label should change immediately to Flagged in row1
    within(row1).getByText('Flagged')

    // API was called with correct args
    expect(updateStatusMock).toHaveBeenCalledWith(1, 'FLAGGED')
  })

  it('rolls back and shows toast on API error', async () => {
    renderTable()

    const row1 = screen.getByText('Sample flagged post').closest('tr') as HTMLElement
    // Open menu
    const editButton = within(row1).getByRole('button', { name: /edit status/i })
    await userEvent.click(editButton)

    // Mock API failure
    updateStatusMock.mockRejectedValueOnce(new Error('network'))

    // Select Dismissed
    const optDismissed = await screen.findByRole('menuitem', { name: 'Dismissed' })
    await userEvent.click(optDismissed)

    // Because the mocked API rejects immediately, the optimistic state may be
    // too brief to observe. We assert rollback and toast instead.
    // Wait for snackbar to appear
    const snackbar = await screen.findByText(/Failed to update status/i)
    expect(snackbar).toBeInTheDocument()

    // Chip label rolled back
    await within(row1).findByText('Under Review')
  })
})


