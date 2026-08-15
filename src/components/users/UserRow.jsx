import { Button, TableCell, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function UserRow({ user }) {
  const navigate = useNavigate()

  return (
    <TableRow>
      <TableCell>
        {user.username}
      </TableCell>

      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/profile/${user.username}`)}
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            px: 2.5,
            fontSize: 12,
            backgroundColor: '#6366f1',
          }}
        >
          Go to Profile
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default UserRow