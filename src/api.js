export async function fetchPosts(page = 1, perPage = 10) {
  const params = new URLSearchParams({ page, per_page: perPage })
  const res = await fetch(`https://dev.to/api/articles?${params}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  const data = await res.json()
  return data.map((post) => ({
    id: post.id,
    title: post.title,
    userEmail: `${post.user.username}@dev.to`,
    body: post.description,
  }))
}
