import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material'
import { cardSx, formSx, primaryButtonSx, secondaryButtonSx } from './authStyles'

function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    console.log({ name, email, password, confirmPassword })
  }

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Sign up to get started
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={formSx}>
        <TextField
          label="Name"
          type="text"
          size="small"
          fullWidth
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          size="small"
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          size="small"
          fullWidth
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          size="small"
          fullWidth
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth sx={primaryButtonSx}>
          Sign Up
        </Button>
      </Box>

      <Divider sx={{ my: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Already have an account?
        </Typography>
      </Divider>

      <Button variant="outlined" fullWidth sx={secondaryButtonSx}>
        Login
      </Button>
    </Paper>
  )
}

export default SignupForm
