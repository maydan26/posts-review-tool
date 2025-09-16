import { useEffect, useState } from 'react'
import type { Post } from './types'
import { Typography } from '@mui/material'
import { getPosts } from './api/posts'
import FilterBar from './components/FilterBar/FilterBar'
import PostsTable from './components/PostsTable/PostsTable'
import PaginationBar from './components/PaginationBar/PaginationBar'
import type { Filters } from './components/FilterBar/types'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Controlled filters for the FilterBar
  const [filters, setFilters] = useState<Filters>({
    status: '',
    platform: '',
    tag: '',
    search: '',
  })


  // Load posts from API
  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * pageSize
      
      // Build query parameters with filters
      const params: any = {
        limit: pageSize,
        offset,
      }
      
      // Add filter parameters if they have values
      if (filters.status) params.status = filters.status
      if (filters.platform) params.platform = filters.platform
      if (filters.tag) params.tag = filters.tag
      if (filters.search) params.search = filters.search
      
      const response = await getPosts(params)
      setPosts(response.data)
      setTotal(response.total)
    } catch (err: any) {
      setError(err?.message || 'Failed to load posts. Please try again.')
      setPosts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  // Filter handler
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when changing page size
  }

  // Handle posts changes from inline editing
  const handlePostsChange = (updatedPosts: Post[]) => {
    setPosts(updatedPosts)
  }

  // Load posts on mount and when pagination or filters change
  useEffect(() => {
    loadPosts()
  }, [page, pageSize, filters])

  return (
    <div className="p-6">
      <Typography
        variant="h4"
        component="h1"
        className="mb-4 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      >
        Flagged Posts Review Tool
      </Typography>
      
      {/* FilterBar wired with controlled state */}
      <div className="mb-4">
        <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      <div className="mt-4">
        <PostsTable 
          posts={posts} 
          loading={loading}
          error={error}
          total={total}
          onRetry={loadPosts}
          onPostsChange={handlePostsChange}
        />
        
        {!loading && !error && total > 0 && (
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  )
}

export default App
