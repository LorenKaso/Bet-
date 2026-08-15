import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material'
import {
  validateEmail,
  validateLoginPassword,
} from './authValidation'
import { cardSx, formSx, primaryButtonSx, secondaryButtonSx } from './authStyles'

function LoginForm({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })
  const [credentialsError, setCredentialsError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setCredentialsError('')

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCredentialsError('Incorrect email or password. Please try again.')
        return
      }

      onLogin({
        email: data.email,
        username: data.username,
      })
      navigate('/')
    } catch (error) {
      console.error('Login request failed:', error)
      setCredentialsError('Something went wrong. Please try again.')
    } 
  }

  function validateForm() {
    const newErrors = {
      email: validateEmail(email),
      password: validateLoginPassword(password),
    }

    setErrors(newErrors)

    const invalidFields = Object.entries(newErrors)
      .filter(([, message]) => Boolean(message))
      .map(([field]) => field)

    if (invalidFields.length > 0) {
      console.warn('[Login validation failed]', {
        invalidFields,
        action: 'Correct the marked login fields before submitting.',
      })

      return false
    }

    console.info('[Login validation passed]', {
      validatedFields: ['email', 'password'],
    })

    return true
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
        {credentialsError && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              backgroundColor: '#fee',
              border: '1px solid #f99',
              borderRadius: 1,
              color: '#c33',
            }}
          >
            <Typography variant="body2">{credentialsError}</Typography>
          </Box>
        )}
        <TextField
          label="Email"
          type="email"
          size="small"
          fullWidth
          value={email}
          onChange={(event) => {
            const value = event.target.value
            setEmail(value)

            if (errors.email) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                email: validateEmail(value),
              }))
            }
          }}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />

        <TextField
          label="Password"
          type="password"
          size="small"
          fullWidth
          value={password}
          onChange={(event) => {
            const value = event.target.value
            setPassword(value)

            if (errors.password) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                password: validateLoginPassword(value),
              }))
            }
          }}
          error={Boolean(errors.password)}
          helperText={errors.password}
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

      <Button variant="outlined" fullWidth sx={secondaryButtonSx} onClick={() => navigate('/signup')}>
        Sign Up
      </Button>
    </Paper>
  )
}

export default LoginForm