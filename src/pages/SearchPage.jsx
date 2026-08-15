import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import UserList from '../components/users/UserList'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

function SearchIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path fill="currentColor" d="M9.5 3a6.5 6.5 0 0 1 5.16 10.45l4.45 4.44a1 1 0 0 1-1.42 1.42l-4.44-4.45A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
    </SvgIcon>
  )
}


function SearchPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  
  const handleSearch = (e) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const searchValue = query.trim()

    if (!searchValue) {
      setUsers([])
      setError('')
      return
    }

    async function searchUsers() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `http://localhost:8000/users/search?q=${encodeURIComponent(searchValue)}`
        )

        if (!response.ok) {
          throw new Error('Failed to search users')
        }

        const data = await response.json()

        setUsers(data.users)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    searchUsers()
  }, [query])

  return (
    <Box component="main" sx={{ minHeight: 'calc(100svh - 72px)', bgcolor: '#fff', px: { xs: 2, md: 6 }, py: { xs: 3, md: 4 } }}>
      <TextField
        fullWidth
        placeholder="Search by username..."
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
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {loading && <CircularProgress />}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <UserList users={users} />
      </Box>
    </Box>
  )
}

export default SearchPage
