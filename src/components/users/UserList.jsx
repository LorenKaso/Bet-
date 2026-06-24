import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,} from '@mui/material'
import UserRow from './UserRow'

function UserList({ users }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: 'min(90vw, 760px)',
        borderRadius: 2,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
            <TableCell sx={{ fontWeight: 700, width: '45%' }}>Email</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, width: '25%' }}>
              Posts
            </TableCell>
            <TableCell align="center" sx={{ width: '30%' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <UserRow key={user.email} user={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserList