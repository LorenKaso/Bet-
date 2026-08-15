export async function fetchPosts(page = 1, limit = 10) {
  const res = await fetch(
    `http://localhost:8000/posts?page=${page}&limit=${limit}`
  )

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  const data = await res.json()

  return data.posts
}