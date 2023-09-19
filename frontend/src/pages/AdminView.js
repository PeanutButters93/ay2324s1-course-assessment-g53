import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminView () {
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch user data from your backend API
        axios.get('http://localhost:4000/api/users/users')
            .then(response => setUsers(response.data))
            .catch((error) => console.error('Error fetching user data:', error))
    }, [])

    return (
        <div>
            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>bio</th>
                        <th>date_of_birth</th>
                        <th>question_history</th>
                        <th>is_admin</th>
                        {/* Add more table headers for other user attributes */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.bio}</td>
                            <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                            <td>{user.question_history}</td>
                            <td>{user.is_admin ? 'Yes' : 'No'}</td>
                            {/* Add more table cells for other user attributes */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}