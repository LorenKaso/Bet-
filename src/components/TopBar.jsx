import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { NavLink } from 'react-router-dom'

function TopBar({ currentUser, onLogout }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(90deg, #5c6cf6 0%, #8b5cf6 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 800 }}>
            Bet!
          </Typography>

          {currentUser && (    
          <Button
            component={NavLink}
            to="/new-post"
            variant="contained"
            sx={{
              bgcolor: '#ffc83d',
              color: '#111827',
              borderRadius: 999,
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            + New Post
          </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 1, md: 3 } }}>
          <Button
            component={NavLink}
            to="/"
            color="inherit"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Home
          </Button>

          <Button
            component={NavLink}
            to="/search"
            color="inherit"
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Search
          </Button>

          {currentUser ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Button
                component={NavLink}
                to={`/profile/${encodeURIComponent(currentUser.username)}`}
                color="inherit"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  py: 0,
                  minHeight: 0,
                }}
              >
                {currentUser.username}
              </Button>
              <Button
                component={NavLink}
                to="/login"
                color="inherit"
                onClick={onLogout}
                sx={{ fontWeight: 700, textTransform: 'none', py: 0, minHeight: 0 }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              color="inherit"
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
