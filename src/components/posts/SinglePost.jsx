import { useState } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import DOMPurify from 'dompurify'

function formatTimeAgo(createdAt) {
  const createdDate = new Date(createdAt)
  const now = new Date()

  const diffInSeconds = Math.floor((now - createdDate) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)

  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)

  return `${diffInWeeks}w ago`
}


function SinglePost({ post }) {
  const [expanded, setExpanded] = useState(false)
  const safeContent = DOMPurify.sanitize(post.content || '', {
    ALLOWED_TAGS: ['p', 'strong', 'b', 'em', 'i', 'a', 'br'],
    ALLOWED_ATTR: ['href'],
  })

  const plainContent = safeContent
  ? new DOMParser().parseFromString(
      safeContent,
      'text/html'
    ).body.textContent || ''
  : ''

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        minHeight: 220,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
     <CardContent>
        <Box
          sx={{
            textAlign: 'left',
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#6366f1',
              fontWeight: 700,
            }}
          >
            {post.username}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.25,
            }}
          >
            {formatTimeAgo(post.created_at)}
          </Typography>
        </Box>
        {post.title && (
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ 
                mb: 1 ,
                textAlign: 'left',
            }}
          >
            {post.title}
          </Typography>
        )}

        {post.content && (() => {
          const PREVIEW_LENGTH = 180
          const isLongText = plainContent.length > PREVIEW_LENGTH

          const previewText = isLongText
            ? plainContent.slice(0, PREVIEW_LENGTH).trim()
            : plainContent

          return (
            <Box
              sx={{
                textAlign: 'left',
                mb: 2,
              }}
            >
              {expanded || !isLongText ? (
                <Box
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    whiteSpace: 'pre-wrap',

                    '& p': {
                      margin: 0,
                      textAlign: 'left',
                    },

                    '& strong, & b': {
                      fontWeight: 700,
                    },

                    '& em, & i': {
                      fontStyle: 'italic',
                    },

                    '& a': {
                      color: '#6366f1',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: safeContent,
                  }}
                />
              ) : (
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  {previewText}
                </Typography>
              )}

              {isLongText && (
                <Typography
                  component="button"
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  sx={{
                    display: 'inline',
                    p: 0,
                    ml: 0.5,
                    border: 0,
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',

                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {expanded ? ' Show less' : '... Show more'}
                </Typography>
              )}
            </Box>
          )
        })()}

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          />
        )}

      </CardContent>
    </Card>

  )
}

export default SinglePost