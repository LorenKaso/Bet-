import { Button } from '@mui/material'

function ReadMoreButton({ expanded, onClick }) {
  return (
    <Button
      variant="contained"
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: 999,
        textTransform: 'none',
        px: 2.5,
        fontSize: 13,
        backgroundColor: '#6366f1',
        '&:hover': { backgroundColor: '#4f46e5' },
      }}
    >
      {expanded ? 'Show Less' : 'Read More'}
    </Button>
  )
}

export default ReadMoreButton
