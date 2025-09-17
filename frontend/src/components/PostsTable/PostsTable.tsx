import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Typography, Snackbar } from '@mui/material'
import { formatDate, formatPlatform } from '../../utils/format'
import StatusCell from './StatusCell'
import TagsCell from './TagsCell'
import TableSkeleton from './TableSkeleton'
// Note: Inline empty state here per UX requirement
import TableError from './TableError'
import type { Post } from '../../types'
import type { PostStatus } from '../../types'
import { updateStatus } from '../../api/posts'

interface Props {
  posts: Post[]
  loading: boolean
  error: string | null
  total: number
  onRetry?: () => void
  onPostsChange?: (posts: Post[]) => void
}

export const PostsTable: React.FC<Props> = ({ posts, loading, error, total, onRetry, onPostsChange }) => {
  
  const [statusOverrides, setStatusOverrides] = React.useState<Record<number, PostStatus>>({})
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [loadingFlags, setLoadingFlags] = React.useState<Record<number, boolean>>({})

  const getStatus = (post: Post): PostStatus => statusOverrides[post.id] ?? post.status

  const handleStatusChange = async (postId: number, next: PostStatus) => {
    try {
      setLoadingFlags(prev => ({ ...prev, [postId]: true }))
      await updateStatus(postId, next)
      setStatusOverrides((prev) => ({ ...prev, [postId]: next }))
    } catch (e) {
      setErrorMessage('Failed to update status. Please try again.')
    } finally {
      setLoadingFlags(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleTagsChange = (postId: number, newTags: string[]) => {
    if (onPostsChange) {
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, tags: newTags } : post
      )
      onPostsChange(updatedPosts)
    }
  }
  if (loading) return <TableSkeleton />

  if (error) return <TableError error={error} onRetry={onRetry} />

  if (posts.length === 0) return (
    <Paper className="p-8 text-center flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-gray-600">
        <span className="text-4xl" aria-hidden>📭</span>
        <Typography variant="h6" className="font-semibold text-gray-800">No posts found</Typography>
        <Typography variant="body2" className="text-gray-500">Try adjusting filters or search terms.</Typography>
      </div>
    </Paper>
  )

  return (
    <div>
      <Typography variant="body2" color="text.secondary" className="mb-2">
        Showing {posts.length} of {total} posts
      </Typography>
      <TableContainer component={Paper} className="mt-4">
        <Table stickyHeader aria-label="posts table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell scope="col" className="w-1/3 font-semibold text-gray-800">Text</TableCell>
              <TableCell scope="col" className="w-1/6 font-semibold text-gray-800">Platform</TableCell>
              <TableCell scope="col" className="w-1/6 font-semibold text-gray-800">Status</TableCell>
              <TableCell scope="col" className="w-1/6 font-semibold text-gray-800">Tags</TableCell>
              <TableCell scope="col" className="w-1/6 font-semibold text-gray-800">Date</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} hover className="h-16">
              <TableCell>
                <Tooltip title={post.text} placement="top">
                  <Typography variant="body2" className="max-w-xs truncate cursor-help text-gray-600">
                    {post.text}
                  </Typography>
                </Tooltip>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" className="text-gray-600">
                  {formatPlatform(post.platform)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <StatusCell
                  postId={post.id}
                  status={getStatus(post)}
                  busy={Boolean(loadingFlags[post.id])}
                  onChange={handleStatusChange}
                />
              </TableCell>
              
              <TableCell>
                <TagsCell
                  postId={post.id.toString()}
                  tags={post.tags}
                  onTagsChange={(newTags) => handleTagsChange(post.id, newTags)}
                />
              </TableCell>
              
              <TableCell>
                <Tooltip title={post.created_at} placement="top">
                  <Typography variant="body2" className="text-gray-600">
                    {formatDate(post.created_at)}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
