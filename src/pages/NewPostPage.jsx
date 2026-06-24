import { Box } from '@mui/material'
import NewPostForm from '../components/posts/NewPostForm'

function NewPostPage() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        px: 2,
        py: 4,
      }}
    >
      <NewPostForm />
    </Box>
  )
}

export default NewPostPage
