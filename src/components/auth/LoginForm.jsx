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

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    console.log({ email, password })
  }

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Sign in to your account
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={formSx}>
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

        <Button type="submit" variant="contained" fullWidth sx={primaryButtonSx}>
          Login
        </Button>
      </Box>

      <Divider sx={{ my: 1 }}>
        <Typography variant="caption" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Button variant="outlined" fullWidth sx={secondaryButtonSx}>
        Sign Up
      </Button>
    </Paper>
  )
}

export default LoginForm