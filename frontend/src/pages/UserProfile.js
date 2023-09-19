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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const isValidPassword = (password) => {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
}

export default function UserProfile() {
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [date_of_birth, setDate_of_birth] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  //const [fullName, setFullName] = useState(firstName + " " + lastName);
  //const [passwordError, setPasswordError] = useState("");
  //const [passwordErrorText, setPasswordErrorText] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault()

    //.then(alert("Personal information updated!"))

  }

  const handleDelete = (event) => {

      //.then(alert("Successfully Deleted"))
    
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
          <h2>Edit Personal Information</h2>
          <TextField
            label="userid"
            onChange={e => setUserid(e.target.value)}
            value={userid}
            type = "number" 
            required
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Username"
            onChange={e => setUsername(e.target.value)}
            value={username}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="email"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            error={password.length != 0 && !isValidPassword(password)}
              helperText={
                (password.length != 0 && !isValidPassword(password)) ? "Password not strong enough" : ""
              }
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New Bio"
            onChange={e => setBio(e.target.value)}
            value={bio}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New Date of Birth"
            onChange={e => setDate_of_birth(e.target.value)}
            value={date_of_birth}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New First Name"
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="New Last Name"
            onChange={e => setLastName(e.target.value)}
            value={lastName}
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
          <Button variant="outlined" color="secondary" type="submit" onClick={handleDelete} disabled={userid == ""}>Delete Account</Button>
        </Box>
      </Box>


      {/* Footer */}
      {/* End footer */}
    </ThemeProvider>
  );
}