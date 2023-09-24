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

  const [isEditingUserName, setIsEditingUserName] = useState(false)
  const [editedUsername, setEditedUsername] = useState('')

  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editedEmail, setEditedEmail] = useState('')

  const token = getAuthCookie()
  const tokenBody = token.split('.')[1]
  let buffer = JSON.parse(atob(tokenBody))
  const user_id = buffer.user_data.user_id

  useEffect(() => {
    // const token = getAuthCookie()
    // const tokenBody = token.split('.')[1]
    // let buffer = JSON.parse(atob(tokenBody))
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

  const handleEditClickUserName = () => {
    setIsEditingUserName(true)
  }

  const handleChangeUserName = (event) => {
    setEditedUsername(event.target.value)
  }

  const handleBlurUserName = () => {
    setIsEditingUserName(false)
    // Perform the update to the backend here with editedUsername
    // You can use axios to send a PUT request to update the username
    // After successful update, set isEditing to false
    const new_user = {
      user_id: user_id,
      new_username: editedUsername,
    }

    axios.put('http://localhost:4000/api/users/updateUser', new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          username: editedUsername,
        }))
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error updating user information.')
      })
  }

  const handleEditClickEmail = () => {
    setIsEditingEmail(true)
  }

  const handleChangeEmail = (event) => {
    setEditedEmail(event.target.value)
  }

  const handleBlurEmail = () => {
    setIsEditingEmail(false)
    // Perform the update to the backend here with editedEmail
    // You can use axios to send a PUT request to update the email
    // After successful update, set isEditing to false
    const new_user = {
      user_id: user_id,
      new_email: editedEmail,
    }
    axios.put('http://localhost:4000/api/users/updateUser', new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          email: editedEmail,
        }))
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error updating user information.')
      })
  }


  if (loading) {
    return <div>Loading...</div>
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
              {isEditingUserName ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <Typography variant="body1" style={{ marginRight: '10px' }}>
                      Username:
                    </Typography> */}
                    <TextField
                      TextField id="filled-basic" label="New Username" variant="filled"
                      fullWidth
                      defaultValue={user.username}
                      value={editedUsername}
                      onChange={handleChangeUserName}
                      onBlur={handleBlurUserName}
                    />
                  </div>
                  <div>
                    <Typography variant="body1">
                      Email: {user.email}
                    </Typography>
                  </div>
                </div>
              ) : (
                <>
                  <Typography variant="body1">
                    Username: {user.username}
                  </Typography>
                </>
              )}
              <div style={{ marginLeft: '10px' }}>
                {isEditingUserName ? (
                  <Button onClick={handleBlurUserName}>Finish Editing</Button>
                ) : (
                  <Button onClick={handleEditClickUserName}>Edit</Button>
                )}
              </div>
            </div>
            {!isEditingUserName && (
              <>
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




