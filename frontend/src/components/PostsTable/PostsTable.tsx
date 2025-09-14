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
} from '@mui/material'
import { formatDate, formatPlatform, formatTag } from '../../utils/format'
import StatusChip from './StatusChip'
import type { Post } from '../../types'

interface Props {
  posts: Post[]
  loading: boolean
  error: string | null
  total: number
  onRetry?: () => void
}

export const PostsTable: React.FC<Props> = ({ posts, loading, error, total, onRetry }) => {
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
                <StatusChip status={post.status} />
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
    </div>
  )
}

export default PostsTable
