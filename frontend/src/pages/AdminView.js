import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import PersonIcon from '@mui/icons-material/Person'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { TextField } from "@mui/material"
import './AdminView.css'
import useCookie from '../components/useCookie'


export default function AdminView () {
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const { getAuthCookie } = useCookie();

    useEffect(() => {
        // Fetch user data from your backend API
        axios.get('http://localhost:4000/api/users/users', {headers: {'Authorization': getAuthCookie()}})
            .then(response => setUsers(response.data))
            .catch((error) => console.error('Error fetching user data:', error))
    }, [])

    const handleSearchQueryChange = (e) => {
        const newQuery = e.target.value
        setSearchQuery(newQuery)
        fetchUsers(newQuery)
    }

    const fetchUsers = (query) => {
        let apiUrl = 'http://localhost:4000/api/users/users'

        if (query) {
            // If there's a query, add it to the API URL
            apiUrl = `http://localhost:4000/api/users/userByName?username=${query}`
        }

        axios.get(apiUrl, {headers: {'Authorization': getAuthCookie()}})
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching user data:', error))
    }

    const setUserAsAdmin = (username) => {
        // Make a PUT request to set the user as admin
        axios.put(`http://localhost:4000/api/users/setUserAdmin?username=${username}`, {
            headers: {
                'Authorization': getAuthCookie()
            }
        })
            .then(response => {
                // Handle success, e.g., show a success message or update the user list
                console.log(`User ${username} is now an admin`)
                // Refresh the user list here if needed
                fetchUsers(searchQuery)
            })
            .catch(error => {
                console.error(`Error setting user ${username} as admin:`, error)
                // Handle error, e.g., show an error message
            })
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <PersonIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        User List
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: '16px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Date of Birth</th>
                            <th>Admin</th>
                            {/* Add more table headers for other user attributes */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                                <td>{user.is_admin ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => setUserAsAdmin(user.username)}>
                                        Set as Admin
                                    </button>
                                </td>
                                {/* Add more table cells for other user attributes */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </ThemeProvider>
    )
}