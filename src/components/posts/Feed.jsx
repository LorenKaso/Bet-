import { useState, useEffect, useRef } from 'react'
import { Box, CircularProgress, Alert, Stack, Tabs, Tab, } from '@mui/material'
import SinglePost from './SinglePost'
import { fetchPosts } from '../../api'

const PER_PAGE = 10

function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedType, setFeedType] = useState('global')
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef(null)
  
  async function fetchCurrentFeed(page, limit) {
    if (feedType === 'following') {
      const response = await fetch(
        `http://localhost:8000/posts/following?page=${page}&limit=${limit}`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch following posts')
      }

      const data = await response.json()

      return data.posts
    }

    return fetchPosts(page, limit)
  }
  
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        setPage(1)

        const data = await fetchCurrentFeed(1, PER_PAGE)
        
        setPosts(data)
        setHasMore(data.length === PER_PAGE)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [feedType])

 async function handleLoadMore() {
    if (loadingMore || !hasMore) {
      return
    }

    const next = page + 1

    try {
      setLoadingMore(true)
     
      const data = await fetchCurrentFeed(next, PER_PAGE)

      setPosts((prev) => [...prev, ...data])
      setPage(next)
      setHasMore(data.length === PER_PAGE)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }



  useEffect(() => {
    const element = loadMoreRef.current

    if (!element || !hasMore) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]

      if (entry.isIntersecting && !loadingMore) {
        handleLoadMore()
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [posts.length, hasMore, loadingMore, page])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  )

  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
    <Box
      sx={{
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
        mb: 2,
      }}
    >
      <Tabs
        value={feedType}
        onChange={(_, newValue) => setFeedType(newValue)}
        variant="fullWidth"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          minHeight: 52,

          '& .MuiTab-root': {
            minHeight: 52,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 15,
          },
        }}
      >
        <Tab
          value="global"
          label="Global"
        />

        <Tab
          value="following"
          label="Following"
        />
      </Tabs>
    </Box>
    <Box>
      <Stack
          spacing={2}
          sx={{
            width: '100%',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          {posts.map((post, index) => (
            <Box key={post.id}>
              <SinglePost post={post} />

              {index === posts.length - 5 && hasMore && (
                <Box
                  ref={loadMoreRef}
                  sx={{ height: 1 }}
                />
              )}
            </Box>
          ))}
        </Stack>
        {loadingMore && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              my: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
    </Box>
  </Box>
  )
}

export default Feed
