import { Button, TableCell, TableRow } from '@mui/material'

function UserRow({ user }) {
  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>

      <TableCell align="center">
        {user.postsCount}
      </TableCell>

      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            px: 2.5,
            fontSize: 12,
            backgroundColor: '#6366f1',
          }}
        >
          See Posts
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default UserRow