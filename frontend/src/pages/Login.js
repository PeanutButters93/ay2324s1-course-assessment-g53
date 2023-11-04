import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Link as RouterLink } from "react-router-dom"
import MUILink from '@mui/material/Link'
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import axios from 'axios'
import { authActions } from '../store'
import { useDispatch } from 'react-redux'
import useCookie from '../components/useCookie'

const USER_HOST = process.env.REACT_APP_USER_HOST ? process.env.REACT_APP_USER_HOST : "http://localhost:4000/api/users"
function Copyright (props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Peerprep
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',  // This switches the theme mode to dark
  },
})


function Login (props) {
  const dispatch = useDispatch()
  const setLoggedIn = props.setLoggedIn
  const updateAdminStatus = props.updateAdminStatus
  const navigate = useNavigate()
  const [userIdentifier, setUserIdentifier] = useState('')  // This replaces the email state
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

//   const isValidPassword = (password) => {
//     const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.*[0-9]).{8,}$/
//     return regex.test(password)
//   }

  const isValidEmailOrUsername = (input) => {
    // Simple check to see if it contains '@'. 
    // If you want more complex validation for email, you can expand this function.
    return input.includes('@') || input.length >= 3  // Assuming a minimum username length of 3
  }

  const handleSubmit = (event) => {
    console.log("Hello here is the user host:")
    console.log(USER_HOST)
    event.preventDefault()

    setUsernameError('')
    setPasswordError('')

    // Additional validation here
    if (!isValidEmailOrUsername(userIdentifier)) {
      setUsernameError('Please enter a valid email or username.')
      return
    }

    axios.post(`${USER_HOST}/login`, {
      userIdentifier: userIdentifier,  // Use the userIdentifier state variable
      password: password,              // Use the password state variable
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status === 403) {
        // Handle the forbidden error
        return response.then(err => { throw err })
      }
      return response.data
    })
      .then(data => {
        const token = data.token
        console.log("Actual token:")
        console.log(token)
        const tokenBody = token.split('.')[1]
        // console.log("Parsing token")
        let buffer = JSON.parse(atob(tokenBody))
        // console.log("Parsed token is: ")
        // console.log(buffer)
        if (buffer.user_data.is_admin) {
          dispatch(authActions.setAdmin(true))
        } else {
          dispatch(authActions.setAdmin(false))
        }

        updateCookies(token)
        // Save JWT token to localStorage or context or wherever you store it
        dispatch(authActions.setLogin(true))

        navigate('/questionpage')
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        // Handle different types of errors here
        if (errorMessage === 'User not found') {
            setUsernameError('User not found. Please try again or register.')
            setPasswordError('Please enter a valid username or email.')
        } else if (errorMessage === 'Incorrect password') {
            setPasswordError('Incorrect password. Please try again.')
        } else {
          console.error('Error:', errorMessage)
        }
      })
  }
  const { updateCookies } = useCookie()

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 'bold',
              marginTop: 2,
              marginBottom: 2,
              letterSpacing: '0.1rem',
              textAlign: 'center',
              color: 'primary.main',
              textShadow: '1px 1px 2px gray',
              transition: 'color 0.3s, transform 0.3s',  // smooth transition for color and transform
              cursor: 'pointer',  // make it look interactive
              '&:hover': {
                color: 'secondary.main',  // change color on hover
                transform: 'scale(1.05)'  // slightly increase size on hover
              }
            }}
          >
            ~Welcome Back~
          </Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userIdentifier"
              label="Email Address or Username" // Updated label
              name="userIdentifier"
              autoComplete="email"
              value={userIdentifier}
              onChange={e => setUserIdentifier(e.target.value)}  // Use the new state variable here
              error={!!usernameError}
              helperText={usernameError}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!passwordError}  // If there's an error message, this will be true
              helperText={passwordError}  // Display the error message
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <MUILink to="/signup " component={RouterLink} href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MUILink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}
export default Login
