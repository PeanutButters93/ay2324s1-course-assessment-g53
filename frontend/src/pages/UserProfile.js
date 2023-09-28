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
import './UserProfile.css'

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})
const USER_HOST = process.env.REACT_APP_USER_HOST ? process.env.REACT_APP_USER_HOST : "http://localhost:4000/api/users"
export default function UserProfile () {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const { getAuthCookie } = useCookie()

  const [isEditingUserName, setIsEditingUserName] = useState(false)
  const [editedUsername, setEditedUsername] = useState(user.username)

  const [isEditingEmail, setIsEditingEmail] = useState(false)

  const [isEditingBio, setIsEditingBio] = useState(false)

  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false)
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(user.date_of_birth)


  const token = getAuthCookie()
  const tokenBody = token.split('.')[1]
  let buffer = JSON.parse(atob(tokenBody))
  const user_id = buffer.user_data.user_id

  useEffect(() => {
    const user_id = buffer.user_data.user_id

    // Fetch user data from the backend when the component mounts
    axios
      .get(`${USER_HOST}/userById?user_id=${user_id}`, {
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

  const handleEnterPressUserName = (event) => {
    if (event.key === 'Enter') {
      handleBlurUserName(event) // Trigger the same logic as onBlur on Enter key press
    }
  }

  const handleBlurUserName = (event) => {
    setIsEditingUserName(false)

    const updatedUsername = event.target.value

    const new_user = {
      user_id: user_id,
      new_username: updatedUsername,
    }

    axios.put(`${USER_HOST}/updateUser`, new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          username: updatedUsername,
        }))
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert(error.response.data.error)
      })
  }

  const handleEditClickEmail = () => {
    setIsEditingEmail(true)
  }

  const handleEnterPressEmail = (event) => {
    if (event.key === 'Enter') {
      handleBlurEmail(event) // Trigger the same logic as onBlur on Enter key press
    }
  }

  const handleBlurEmail = (event) => {
    setIsEditingEmail(false)
    const updatedEmail = event.target.value

    const new_user = {
      user_id: user_id,
      new_email: updatedEmail,
    }
    axios.put(`${USER_HOST}/updateUser`, new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          email: updatedEmail,
        }))
        alert('User information updated successfully.')
        console.log(response.data)

      })
      .catch((error) => {
        console.error('Error:', error)
        alert(error.response.data.error)
      })
  }

  const handleEditClickBio = () => {
    setIsEditingBio(true)
  }

  const handleEnterPressBio = (event) => {
    if (event.key === 'Enter') {
      handleBlurBio(event) // Trigger the same logic as onBlur on Enter key press
    }
  }


  const handleBlurBio = (event) => {
    setIsEditingBio(false)
    const updatedBio = event.target.value
    const new_user = {
      user_id: user_id,
      new_bio: updatedBio,
    }
    axios.put(`${USER_HOST}/updateUser`, new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          bio: updatedBio,
        }))
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error updating user information.')
      })
  }

  const handleEditClickDateOfBirth = () => {
    setIsEditingDateOfBirth(true)
  }

  const handleBlurDateOfBirth = (event) => {
    setIsEditingDateOfBirth(false)
    const new_user = {
      user_id: user_id,
      new_date_of_birth: editedDateOfBirth,
    }

    axios.put(`${USER_HOST}/updateUser`, new_user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          date_of_birth: editedDateOfBirth,
        }))
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error updating user information.')
      })
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h4" color="inherit" noWrap>
              User Profile
            </Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              User Information
            </Typography>
            {isEditingUserName ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Username:
                </Typography>
                <TextField
                  TextField id="filled-basic" label="New Username" variant="filled"
                  defaultValue={user.username}
                  onBlur={handleBlurUserName}
                  onKeyDown={handleEnterPressUserName}
                />
              </div>
            ) : (
              <div>
                <Typography variant="body1">
                  Username: {user.username} <Button className="button" onClick={handleEditClickUserName}>Edit</Button>
                </Typography>
              </div>
            )}

            {isEditingEmail ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Email:
                </Typography>
                <TextField
                  TextField id="filled-basic" label="New Email" variant="filled"
                  fullWidth
                  defaultValue={user.email}
                  onBlur={handleBlurEmail}
                  onKeyDown={handleEnterPressEmail}
                />
              </div>
            ) : (
              <div>
                <Typography variant="body1">
                  Email: {user.email} <Button className="button" onClick={handleEditClickEmail}>Edit</Button>
                </Typography>
              </div>
            )}

            {isEditingBio ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Bio:
                </Typography>
                <TextField
                  TextField id="filled-basic" label="New Bio" variant="filled"
                  fullWidth
                  defaultValue={user.bio}
                  onKeyDown={handleEnterPressBio}
                  onBlur={handleBlurBio}
                />
              </div>
            ) : (
              <div>
                <Typography variant="body1">
                  Bio: {user.bio} <Button className="button" onClick={handleEditClickBio}>Edit</Button>
                </Typography>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                Admin: {user.is_admin ? 'Yes' : 'No'}
              </Typography>
            </div>

          </Paper>
        </Container>
      </Box>
    </ThemeProvider >
  )
}




