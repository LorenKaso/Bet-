import { useState, useEffect } from 'react'
import { Box, Grid, CircularProgress, Alert } from '@mui/material'
import SinglePost from './SinglePost'
import LoadMoreButton from '../LoadMoreButton'
import { fetchPosts } from '../../api'

const PER_PAGE = 10

function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPosts(1, PER_PAGE)
        setPosts(data)
        setHasMore(data.length === PER_PAGE)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleLoadMore() {
    const next = page + 1
    try {
      const data = await fetchPosts(next, PER_PAGE)
      setPosts((prev) => [...prev, ...data])
      setPage(next)
      setHasMore(data.length === PER_PAGE)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  )

  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid key={post.id} size={{ xs: 12, md: 6 }}>
            <SinglePost post={post} />
          </Grid>
        ))}
      </Grid>
      {hasMore && <LoadMoreButton onClick={handleLoadMore} />}
    </Box>
  )
}

export default Feed
