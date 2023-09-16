import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link as RouterLink } from "react-router-dom";
import MUILink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MUILink color="inherit" href="https://mui.com/">
        PeerPrep
      </MUILink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const darkTheme = createTheme({
    palette: {
      mode: 'dark',  // This switches the theme mode to dark
    },
  });


const isValidPassword = (password) => {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}
  function SignupPage() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();





    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isValidPassword(password) || !isValidEmail(email) || !firstName || !lastName || !username) {
            setIsValid(false);
            return; // Don't proceed further
        }
        
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
      navigate('/questionpage')

    };
  
//   const history = useHistory();
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);

//     const userDetails = {
//       firstname: data.get('firstName'),
//       lastname: data.get('lastName'),
//       username: data.get('username'),
//       email: data.get('email'),
//       password: data.get('password'),
//     };

//     // Send a POST request to the backend
//     fetch('/createUser', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userDetails),
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       // Handle the response from the backend. Maybe redirect or show a success message.
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//};

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
          <Typography component="h1" variant="h4">
                        PeerPrep
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
            autoFocus
          />
          {!firstName && <p>First name is required.</p>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={e => setLastName(e.target.value)}
            autoComplete="family-name"
          />
          {!lastName && <p>Last name is required.</p>}
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
          />
          {!isValidEmail(email) && <p>Email is not valid.</p>}
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
          />
          {!username && <p>Username is required.</p>}
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
          />
          {!isValidPassword(password) && <p>Password does not meet the requirements.</p>}
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
              <MUILink to="/login" component={RouterLink} variant="body2">
                Already have an account? Sign in
                </MUILink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignupPage;

