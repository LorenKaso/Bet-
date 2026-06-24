import { useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import ReadMoreButton from './ReadMoreButton'

function SinglePost({ post }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: expanded ? 'auto' : 260,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Typography>

        <Typography variant="body2" sx={{ color: '#6366f1', mb: 1 }}>
          {post.userEmail}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            ...(!expanded && {
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }),
          }}
        >
          {post.body}
        </Typography>

        <ReadMoreButton
          expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </CardContent>
    </Card>
  )
}

export default SinglePost