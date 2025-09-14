import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { getPosts } from './api/posts'
import type { Post, PaginatedResponse } from './types'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ count: number; total: number } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const json = await getPosts({ limit: 5, offset: 0 })
        setResult({ count: json.data.length, total: json.total })
      } catch (e: any) {
        setError(e?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Flagged Posts Review Tool</h1>

      <Button variant="contained" color="primary" className="m-4" aria-label="scaffold-test-button">
        MUI Button with Tailwind margin
      </Button>

      <div className="mt-4">
        {loading && <span className="text-gray-600">Loading posts…</span>}
        {!loading && error && <span className="text-red-600">Error: {error}</span>}
        {!loading && !error && result && (
          <span className="text-green-700">
            Fetched {result.count} of total {result.total} posts (limit=5)
          </span>
        )}
      </div>
    </div>
  )
}

export default App
