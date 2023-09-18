import * as React from 'react';
import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from "@mui/material";

const DEFAULT_USERNAME = "USERNAME"
const DEFAULT_PASSWORD = "PASSWORDa1!"
const DEFAULT_FIRSTNAME = "BOB"
const DEFAULT_LASTNAME = "TAN"
const DEFAULT_EMAIL = "eg@example.com"

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function UserProfile() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [firstName, setFirstName] = useState(DEFAULT_FIRSTNAME);
  const [lastName, setLastName] = useState(DEFAULT_LASTNAME);
  const [email, setEmail] = useState(DEFAULT_EMAIL);


  const [fullName, setFullName] = useState(firstName + " " + lastName);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault()

    setPasswordError(false)

    setFullName(firstName + " " + lastName)
    alert("Personal information updated (wip)")
    
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box>
      <AppBar position="relative">
        <Toolbar>
          <PersonIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            User Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        justifyContent="center"
        >

        <form autoComplete="off" onSubmit={handleSubmit} >
          <h2>Personal Information</h2>
          <TextField
            disabled
            label="Username"
            value={username}
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            error={passwordError}
            type="password"
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="First Name"
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Last Name"
            onChange={e => setLastName(e.target.value)}
            value={lastName}
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
            />
            <Box textAlign='center'>
              <Button variant="outlined" color="secondary" type="submit" sx={{ mb: 3 }}>Update</Button>
            </Box>
        </form>
      </Box>
        <Box textAlign='center'>
          <Button variant="outlined" color="secondary" type="submit">delete account (wip)</Button>
        </Box>
      </Box>


      {/* Footer */}
      {/* End footer */}
    </ThemeProvider>
  );
}