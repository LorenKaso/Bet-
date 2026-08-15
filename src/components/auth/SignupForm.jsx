import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material'
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from './authValidation'
import { cardSx, formSx, primaryButtonSx } from './authStyles'

function SignupForm() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    console.info('[Signup submission ready]', {
      action: 'The validated signup data can now be sent to the server.',
    })
    //when i add server sent a request
    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/login')
        return
      }

      console.log(data)
    } catch (error) {
      console.error('Signup request failed:', error)
    }
  }

  function validateForm() {
    const newErrors = {
      name: validateName(name),
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    }

    setErrors(newErrors)

    const invalidFields = Object.entries(newErrors)
      .filter(([, message]) => Boolean(message))
      .map(([field]) => field)

    if (invalidFields.length > 0) {
      console.warn('[Signup validation failed]', {
        invalidFields,
        action: 'Correct the marked signup fields before submitting.',
      })

      return false
    }

    console.info('[Signup validation passed]', {
      validatedFields: ['name', 'username', 'email', 'password'],
    })

    return true
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
          onChange={(event) => {
            const value = event.target.value
            setName(value)

            if (errors.name) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                name: validateName(value),
              }))
            }
          }}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />

        <TextField
          label="Username"
          type="text"
          size="small"
          fullWidth
          value={username}
          onChange={(event) => {
            const value = event.target.value
            setUsername(value)

            if (errors.username) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                username: validateUsername(value),
              }))
            }
          }}
          error={Boolean(errors.username)}
          helperText={errors.username}
        />

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
                password: validatePassword(value),
              }))
            }
          }}
          error={Boolean(errors.password)}
          helperText={
            errors.password ||
            '8–64 characters, including an English letter and a number'
          }
        />

        <TextField
          label="Confirm Password"
          type="password"
          size="small"
          fullWidth
          value={confirmPassword}
          onChange={(event) => {
            const value = event.target.value
            setConfirmPassword(value)

            if (errors.confirmPassword) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                confirmPassword: validateConfirmPassword(
                  password,
                  value,
                ),
              }))
            }
          }}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
        />

        <Button type="submit" variant="contained" fullWidth sx={primaryButtonSx}>
          Sign Up
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
        Already have an account?{' '}
        <Link
          component={NavLink}
          to="/login"
          sx={{ color: '#6366f1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Login
        </Link>
      </Typography>
    </Paper>
  )
}

export default SignupForm
