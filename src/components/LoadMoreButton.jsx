import { Box, Button } from '@mui/material'

function LoadMoreButton({ onClick, disabled }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderRadius: 999,
          textTransform: 'none',
          px: 4,
          backgroundColor: '#6366f1',
        }}
      >
        Load More
      </Button>
    </Box>
  )
}

export default LoadMoreButton
