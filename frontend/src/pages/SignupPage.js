import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { Link as RouterLink } from "react-router-dom"
import MUILink from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import axios from 'axios'
import useCookie from '../components/useCookie'


const USER_HOST = process.env.REACT_APP_USER_HOST ? process.env.REACT_APP_USER_HOST : "http://localhost:4000/api/users"

function Copyright (props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <MUILink color="inherit" href="https://mui.com/">
                PeerPrep
            </MUILink>{' '}
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


const isValidPassword = (password) => {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return re.test(password)
}

const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return re.test(email)
}
function SignupPage () {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [emptyFirstName, setEmptyFirstName] = useState('')
    const [emptyLastName, setEmptyLastName] = useState('')
    const [emailError, setEmailError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()

        setEmptyFirstName('')
        setEmptyLastName('')
        setEmailError('')
        setUsernameError('')
        setPasswordError('')

        const invalidPassword = !isValidPassword(password)
        const invalidEmail = !isValidEmail(email)

        if (!firstName || !lastName || invalidEmail || !username || invalidPassword) {
            if (!firstName) {
                setEmptyFirstName("First name is required")
            }
            if (!lastName) {
                setEmptyLastName("Last name is required")
            }
            if (invalidEmail) {
                setEmailError("Please enter a valid email")
            }
            if (!username) {
                setUsernameError("Please enter a username")
            }
            if (password.length === 0) {
                setPasswordError("Please enter a password")
            } else if (invalidPassword) {
                setPasswordError("A minimum 8-character password containing a combination of uppercase and lowercase letter, number and symbol is required")
            }
            return // Don't proceed further
        }

        // Construct the user data
        const userData = {
            username: username,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        }

        // Send the user data to the backend
        axios.post(`${USER_HOST}/createUser`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(data => {
                // Handle the response from the backend. Maybe show a success message or store some data.
                updateCookies(data.data.token)
                navigate('/questionpage')
            })
            .catch(error => {
                const errorMessage = error.response.data.error
                if (errorMessage == "Username is already taken") {
                    setUsernameError(errorMessage);
                } else {
                    console.error('Error:', error)
                }
                // Maybe show an error message to the user
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
                        Welcome to PeerPrep
                    </Typography>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    onChange={e => setFirstName(e.target.value)}
                                    error={!!emptyFirstName}
                                    helperText={emptyFirstName}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={e => setLastName(e.target.value)}
                                    error={!!emptyLastName}
                                    helperText={emptyLastName}
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={e => setEmail(e.target.value)}
                                    error={!!emailError}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    onChange={e => setUsername(e.target.value)}
                                    error={!!usernameError}
                                    helperText={usernameError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={e => setPassword(e.target.value)}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <MUILink to="/" component={RouterLink} variant="body2">
                                    Already have an account? Sign in
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

export default SignupPage;

