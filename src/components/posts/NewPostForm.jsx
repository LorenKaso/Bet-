import { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, IconButton, Popover, } from '@mui/material'
import { primaryButtonSx } from '../auth/authStyles'
import { validatePost, validateImageUrl, validateLinkUrl, } from './postValidation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'

function NewPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [postError, setPostError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageError, setImageError] = useState('')
  const [linkAnchor, setLinkAnchor] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkError, setLinkError] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit,
     Link.configure({
        openOnClick: false,
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          if (!ctx.defaultValidate(url)) {
            return false
          }

          return validateLinkUrl(url) === ''
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setBody(editor.getHTML())

      if (postError) {
        setPostError('')
      }
    },
  })

  async function handleSubmit(e) {
    e.preventDefault()

    const postValidationError = validatePost(
      title,
      body,
      imageUrl,
    )

    const imageValidationError = validateImageUrl(imageUrl)
    
    setPostError(postValidationError)
    setImageError(imageValidationError)
    
    if (postValidationError || imageValidationError) {
      return
    }

    const normalizedTitle = title.trim()
    const normalizedBody = body.trim()
    const normalizedImageUrl = imageUrl.trim()

    setPostError('')

    try {
      const response = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: normalizedTitle || null,
          content: normalizedBody || null,
          image_url: normalizedImageUrl || null,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        setPostError('You must be logged in to publish a post.')
        return
      }

      if (!response.ok) {
        setPostError('Could not publish the post. Please try again.')
        return
      }

      console.log(data)
      setTitle('')
      setBody('')
      setImageUrl('')
      editor?.commands.clearContent()
      setPostError('')
      setImageError('')
    } catch (error) {
      console.error('Post creation failed:', error)
      setPostError('Something went wrong. Please try again.')
    }
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
          onChange={(e) => {
          const value = e.target.value
            setTitle(value)

            if (postError) {
              setPostError('')
            }
          }}        
        />
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 0.5,
            py: 0.25,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 999,
          }}
        >
          <IconButton
            size="small"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <FormatBoldOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <FormatItalicOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(event) => {
              setLinkAnchor(event.currentTarget)
              setLinkUrl('')
              setLinkError('')
            }}
          >
            <LinkOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Popover
          open={Boolean(linkAnchor)}
          anchorEl={linkAnchor}
          onClose={() => {
            setLinkAnchor(null)
            setLinkUrl('')
            setLinkError('')
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box
            sx={{
              width: 320,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography fontWeight={700}>
              Add Link
            </Typography>

            <TextField
              size="small"
              fullWidth
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(event) => {
                setLinkUrl(event.target.value)

                if (linkError) {
                  setLinkError('')
                }
              }}
              error={Boolean(linkError)}
              helperText={linkError}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  setLinkAnchor(null)
                  setLinkUrl('')
                  setLinkError('')
                }}
              >
                Cancel
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  const validationError = validateLinkUrl(linkUrl)

                  if (validationError) {
                    setLinkError(validationError)
                    return
                  }

                  editor
                    ?.chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: linkUrl.trim() })
                    .run()

                  setLinkAnchor(null)
                  setLinkUrl('')
                  setLinkError('')
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>

        <Box
          sx={{
            minHeight: 180,
            px: 2,
            py: 1.5,

            '& .tiptap': {
              minHeight: 150,
              outline: 'none',
            },

            '& .tiptap p': {
              margin: 0,
            },

            '& .tiptap a': {
              textDecoration: 'underline',
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
        <TextField
          label="Image URL"
          type="text"
          size="small"
          fullWidth
          value={imageUrl}
          onChange={(e) => {
            const value = e.target.value
            setImageUrl(value)

            if (postError) {
              setPostError('')
            }

            if (imageError) {
              setImageError(validateImageUrl(value))
            }
          }}
          error={Boolean(imageError)}
          helperText={imageError}
        />
        {postError && (
          <Typography color="error" variant="body2">
            {postError}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth sx={primaryButtonSx}>
          Publish
        </Button>
      </Box>
    </Paper>
  )
}

export default NewPostForm
