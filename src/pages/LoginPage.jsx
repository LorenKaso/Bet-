import { Box } from '@mui/material'
import LoginForm from '../components/auth/LoginForm'

function LoginPage({ onLogin }) {
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
      <LoginForm onLogin={onLogin} />
    </Box>
  )
}

export default LoginPage
