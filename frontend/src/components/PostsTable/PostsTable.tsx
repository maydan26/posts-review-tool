import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
  Skeleton,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material'
import { formatDate, formatPlatform, formatTag } from '../../utils/format'
import StatusChip from './StatusChip'
import type { Post } from '../../types'
import type { PostStatus } from '../../types'
import { updateStatus } from '../../api/posts'

interface Props {
  posts: Post[]
  loading: boolean
  error: string | null
  total: number
  onRetry?: () => void
}

export const PostsTable: React.FC<Props> = ({ posts, loading, error, total, onRetry }) => {
  const [statusMenuAnchor, setStatusMenuAnchor] = React.useState<HTMLElement | null>(null)
  const [statusMenuPostId, setStatusMenuPostId] = React.useState<number | null>(null)
  const [statusOverrides, setStatusOverrides] = React.useState<Record<number, PostStatus>>({})
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const openStatusMenu = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setStatusMenuAnchor(event.currentTarget)
    setStatusMenuPostId(postId)
  }

  const closeStatusMenu = () => {
    setStatusMenuAnchor(null)
    setStatusMenuPostId(null)
  }

  const handleSelectStatus = async (newStatus: PostStatus) => {
    if (statusMenuPostId == null) return

    const postId = statusMenuPostId
    const originalPost = posts.find((p) => p.id === postId)
    if (!originalPost) {
      closeStatusMenu()
      return
    }

    const previousStatus: PostStatus = statusOverrides[postId] ?? originalPost.status

    // Optimistic update
    setStatusOverrides((prev) => ({ ...prev, [postId]: newStatus }))
    closeStatusMenu()

    try {
      await updateStatus(postId, newStatus)
    } catch (e) {
      // Rollback
      setStatusOverrides((prev) => ({ ...prev, [postId]: previousStatus }))
      setErrorMessage('Failed to update status. Please try again.')
    }
  }
  // Loading state - show skeleton
  if (loading) {
    return (
      <TableContainer component={Paper} className="mt-4">
        <Table stickyHeader aria-label="posts table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="w-1/3 font-semibold">Text</TableCell>
              <TableCell className="w-1/6 font-semibold">Platform</TableCell>
              <TableCell className="w-1/6 font-semibold">Status</TableCell>
              <TableCell className="w-1/6 font-semibold">Tags</TableCell>
              <TableCell className="w-1/6 font-semibold">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="h-16">
                <TableCell><Skeleton variant="text" width="100%" height={20} /></TableCell>
                <TableCell><Skeleton variant="text" width={80} height={20} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} height={20} /></TableCell>
                <TableCell><Skeleton variant="text" width={100} height={20} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <Paper className="p-6 mt-4 text-center">
        <Typography variant="h6" color="error" className="mb-4">
          {error}
        </Typography>
        {onRetry && (
          <Button variant="contained" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </Paper>
    )
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <Paper className="p-4 mt-4 text-center text-gray-500">
        <Typography variant="h6">No posts found.</Typography>
      </Paper>
    )
  }

  return (
    <div>
      <Typography variant="body2" color="text.secondary" className="mb-2">
        Showing {posts.length} of {total} posts
      </Typography>
      <TableContainer component={Paper} className="mt-4">
        <Table stickyHeader aria-label="posts table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="w-1/3 font-semibold">Text</TableCell>
              <TableCell className="w-1/6 font-semibold">Platform</TableCell>
              <TableCell className="w-1/6 font-semibold">Status</TableCell>
              <TableCell className="w-1/6 font-semibold">Tags</TableCell>
              <TableCell className="w-1/6 font-semibold">Date</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} hover className="h-16">
              <TableCell>
                <Tooltip title={post.text} placement="top">
                  <Typography variant="body2" className="max-w-xs truncate cursor-help">
                    {post.text}
                  </Typography>
                </Tooltip>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {formatPlatform(post.platform)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusChip status={statusOverrides[post.id] ?? post.status} />
                  <IconButton
                    size="small"
                    aria-label="Edit status"
                    onClick={(e) => openStatusMenu(e, post.id)}
                  >
                    {/* Using text glyph to avoid extra icon dependency */}
                    <span className="text-sm">✎</span>
                  </IconButton>
                </div>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {post.tags.length > 0 
                    ? post.tags.map(formatTag).join(', ')
                    : 'No tags'
                  }
                </Typography>
              </TableCell>
              
              <TableCell>
                <Tooltip title={post.created_at} placement="top">
                  <Typography variant="body2">
                    {formatDate(post.created_at)}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Menu
      anchorEl={statusMenuAnchor}
      open={Boolean(statusMenuAnchor)}
      onClose={closeStatusMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {(['FLAGGED', 'UNDER_REVIEW', 'DISMISSED'] as PostStatus[]).map((opt) => (
        <MenuItem key={opt} onClick={() => handleSelectStatus(opt)}>
          {opt === 'FLAGGED' ? 'Flagged' : opt === 'UNDER_REVIEW' ? 'Under Review' : 'Dismissed'}
        </MenuItem>
      ))}
    </Menu>
    <Snackbar
      open={Boolean(errorMessage)}
      autoHideDuration={3000}
      onClose={() => setErrorMessage(null)}
      message={errorMessage ?? ''}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    </div>
  )
}

export default PostsTable
