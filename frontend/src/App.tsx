import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import type { Post } from './types'
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
    tag: [],
    search: '',
  })


  // Load posts from API
  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * pageSize
      const response = await getPosts({ limit: pageSize, offset })
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

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when changing page size
  }

  // Load posts on mount and when pagination changes
  useEffect(() => {
    loadPosts()
  }, [page, pageSize])

  return (
    <div className="p-6">
            <div className="bg-red-500 h-10 w-10 mb-4" />

      <h1 className="text-2xl font-semibold mb-4">Flagged Posts Review Tool</h1>

      {/* Tailwind test square: should be visible red square */}

      {/* FilterBar wired with controlled state */}
      <div className="mb-4">
        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      <Button variant="contained" color="primary" className="m-4" aria-label="scaffold-test-button">
        MUI Button with Tailwind margin
      </Button>

      <div className="mt-4">
        <PostsTable 
          posts={posts} 
          loading={loading}
          error={error}
          total={total}
          onRetry={loadPosts}
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
