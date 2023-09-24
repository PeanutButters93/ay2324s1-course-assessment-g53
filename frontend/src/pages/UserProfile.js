import * as React from 'react'
import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, Paper } from '@mui/material'
import axios from 'axios'
import useCookie from '../components/useCookie'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function UserProfile () {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const { getAuthCookie } = useCookie()

  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState('')

  useEffect(() => {
    const token = getAuthCookie()
    const tokenBody = token.split('.')[1]
    let buffer = JSON.parse(atob(tokenBody))
    const user_id = buffer.user_data.user_id

    // Fetch user data from the backend when the component mounts
    axios
      .get(`http://localhost:4000/api/users/userById?user_id=${user_id}`, {
        headers: {
          Authorization: getAuthCookie(),
        },
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setUser(response.data[0])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [getAuthCookie])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditFinish = () => {
    // Perform the update to the backend here with editedUsername
    // You can use axios to send a PUT request to update the username
    // After successful update, set isEditing to false
    setIsEditing(false)
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  label="Username"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditFinish() // Finish editing on Enter key press
                    }
                  }}
                />
              ) : (
                <Typography variant="body1">
                  Username: {user.username}
                </Typography>
              )}
              <div style={{ marginLeft: '10px' }}>
                {isEditing ? (
                  <Button onClick={handleEditFinish}>Finish Editing</Button>
                ) : (
                  <Button onClick={handleEditClick}>Edit</Button>
                )}
              </div>
            </div>
            {isEditing || (
              <>
                <Typography variant="body1">
                  Username: {user.username}
                </Typography>
                <Typography variant="body1">
                  Email: {user.email}
                </Typography>
              </>
            )}
            {/* Add more user information fields here */}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
