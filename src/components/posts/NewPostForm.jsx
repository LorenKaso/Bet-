import { useState } from 'react'
import { Box, Paper, Typography, TextField, Button } from '@mui/material'
import { primaryButtonSx } from '../auth/authStyles'

function NewPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log({ title, body })
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: 'min(90vw, 720px)',
        px: 4,
        py: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Create New Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          size="small"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Body"
          multiline
          rows={8}
          fullWidth
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth sx={primaryButtonSx}>
          Publish
        </Button>
      </Box>
    </Paper>
  )
}

export default NewPostForm
