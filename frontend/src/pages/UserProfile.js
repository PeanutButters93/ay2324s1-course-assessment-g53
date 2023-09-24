import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';
import axios from 'axios';
import useCookie from '../components/useCookie';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const { getAuthCookie } = useCookie();

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    axios
      .get('http://localhost:4000/api/users/userById?user_id=1', {
        headers: {
          Authorization: getAuthCookie(),
        },
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setUser(response.data[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [getAuthCookie]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              User Profile
            </Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              User Information
            </Typography>
            <Typography variant="body1">
              User ID: {user.user_id}
            </Typography>
            <Typography variant="body1">
              Username: {user.username}
            </Typography>
            <Typography variant="body1">
              Email: {user.email}
            </Typography>
            {/* Add more user information fields here */}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
