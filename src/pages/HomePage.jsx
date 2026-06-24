import Box from '@mui/material/Box'
import Feed from '../components/posts/Feed'

function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: 'calc(100svh - 72px)',
        bgcolor: '#fff',
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Feed />
    </Box>
  )
}

export default HomePage
