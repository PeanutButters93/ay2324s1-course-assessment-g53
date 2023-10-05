import * as React from 'react'
import { useState } from "react"
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { TextField } from "@mui/material"
import axios from 'axios'
import useCookie from '../components/useCookie'

// TODO remove, this demo shouldn't need to reset the theme.
const USER_HOST = process.env.REACT_APP_USER_HOST ? process.env.REACT_APP_USER_HOST : "http://localhost:4000/api/users"
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const isValidPassword = (password) => {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return re.test(password)
}

export default function UpdateUserProfilePage () {

  const [formData, setFormData] = useState({
    user_id: '',
    new_username: '',
    new_email: '',
    new_password: '',
    new_bio: '',
    new_date_of_birth: '',
  })

  const { getAuthCookie } = useCookie()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'user_id' ? value : (value || null),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Create a filtered object with non-empty values
    const filteredFormData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value !== '') {
          acc[key] = value
        }
        return acc
      },
      {}
    )

    axios.put(`${USER_HOST}/updateUser`, filteredFormData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthCookie()
      },
    })
      .then((response) => {
        alert('User information updated successfully.')
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error updating user information.')
      })

  }

  const handleDelete = () => {
    if (formData.user_id === '') {
      alert('Please provide a user ID to delete.')
      return
    }

    const deleteUserUrl = `${USER_HOST}/deleteUser/${formData.user_id}`

    axios.delete(deleteUserUrl, {
      headers: {
        'Authorization': getAuthCookie()
      }
    })
      .then((response) => {
        if (response.ok) {
          alert('User deleted successfully.')
          // You can reset the form or perform any other necessary actions here.
          setFormData({
            user_id: '',
            new_username: '',
            new_email: '',
            new_password: '',
            new_bio: '',
            new_date_of_birth: '',
          })
        } else {
          alert('Error deleting user. Please check the user ID.')
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error deleting user.')
      })
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box>
        <Box
          display="flex"
          justifyContent="center"
        >
          <form autoComplete="off" onSubmit={handleSubmit} >
            <h2>Edit Personal Information</h2>
            <TextField
              label="userid"
              name="user_id"
              onChange={handleChange}
              value={formData.userid}
              type="number"
              required
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="Username"
              name="new_username"
              onChange={handleChange}
              value={formData.new_username}
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="New Email"
              onChange={handleChange}
              name="new_email"
              value={formData.new_email}
              type="email"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="New Password"
              onChange={handleChange}
              name="new_password"
              value={formData.new_password}
              type="password"
              error={formData.new_password.length !== 0 && !isValidPassword(formData.new_password)}
              helperText={
                (formData.new_password.length !== 0 && !isValidPassword(formData.new_password)) ? "Password not strong enough" : ""
              }
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="New Bio"
              name="new_bio"
              onChange={handleChange}
              value={formData.new_bio}
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="New Date of Birth"
              name="new_date_of_birth"
              onChange={handleChange}
              value={formData.new_date_of_birth}
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 3 }}
            />
            {/*<TextField*/}
            {/*    label="New First Name"*/}
            {/*    name="new_first_name"*/}
            {/*    onChange={handleChange}*/}
            {/*  value={formData.new_first_name}*/}
            {/*  variant="outlined"*/}
            {/*  color="secondary"*/}
            {/*  fullWidth*/}
            {/*  sx={{ mb: 3 }}*/}
            {/*/>*/}
            {/*<TextField*/}
            {/*    label="New Last Name"*/}
            {/*    name="new_last_name"*/}
            {/*    onChange={handleChange}*/}
            {/*  value={formData.new_last_name}*/}
            {/*  variant="outlined"*/}
            {/*  color="secondary"*/}
            {/*  fullWidth*/}
            {/*  sx={{ mb: 3 }}*/}
            {/*/>*/}
            <Box textAlign='center'>
              <Button variant="outlined" color="secondary" type="submit" sx={{ mb: 3 }}>Update</Button>
            </Box>
          </form>
        </Box>
        <Box textAlign='center'>
          <Button variant="outlined" color="secondary" type="submit" onClick={handleDelete} disabled={formData.user_id === ""}>Delete Account</Button>
        </Box>
      </Box>


      {/* Footer */}
      {/* End footer */}
    </ThemeProvider>
  )
}