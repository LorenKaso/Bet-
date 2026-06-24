import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import UserList from '../components/users/UserList'
import LoadMoreButton from '../components/LoadMoreButton'

function SearchIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path fill="currentColor" d="M9.5 3a6.5 6.5 0 0 1 5.16 10.45l4.45 4.44a1 1 0 0 1-1.42 1.42l-4.44-4.45A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
    </SvgIcon>
  )
}

// TODO: replace with real API call
const ALL_USERS = [
  { email: 'alice@example.com', postsCount: 12 },
  { email: 'bob@example.com', postsCount: 7 },
  { email: 'carol@example.com', postsCount: 23 },
  { email: 'dave@example.com', postsCount: 3 },
  { email: 'eve@example.com', postsCount: 15 },
  { email: 'frank@example.com', postsCount: 9 },
  { email: 'grace@example.com', postsCount: 4 },
  { email: 'heidi@example.com', postsCount: 11 },
]
const PAGE_SIZE = 6

function SearchPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = ALL_USERS.filter(u =>
    u.email.includes(query.trim().toLowerCase())
  )
  const users = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = filtered.length > users.length

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setPage(1)
  }

  return (
    <Box component="main" sx={{ minHeight: 'calc(100svh - 72px)', bgcolor: '#fff', px: { xs: 2, md: 6 }, py: { xs: 3, md: 4 } }}>
      <TextField
        fullWidth
        placeholder="Search by email..."
        variant="outlined"
        value={query}
        onChange={handleSearch}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#3f4858', fontSize: 18 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          width: '100%', maxWidth: 700, mx: 'auto', display: 'block',
          '& .MuiOutlinedInput-root': {
            height: 48, borderRadius: 999, bgcolor: '#fff',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
            '& fieldset': { borderColor: '#cbd5e1', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#aeb9c8' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
          },
          '& .MuiInputBase-input': { py: 0, color: '#334155', fontSize: 16, fontWeight: 600 },
          '& .MuiInputBase-input::placeholder': { color: '#8792a2', opacity: 1, fontWeight: 600 },
        }}
      />
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <UserList users={users} />
        {hasMore && <LoadMoreButton onClick={() => setPage(p => p + 1)} />}
      </Box>
    </Box>
  )
}

export default SearchPage
