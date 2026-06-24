import { Box } from '@mui/material'
import SignupForm from '../components/auth/SignupForm'

function SignupPage() {
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
      <SignupForm />
    </Box>
  )
}

export default SignupPage
