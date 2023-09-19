const cors = require('cors')
const express = require('express')
const app = express()
const port = 4000

// Middleware for parsing JSON requests
app.use(express.json())
app.use(cors())

// Import and use your user-profile-router
const userRouter = require('./routes/user-profile-router')
app.use('/api/users', userRouter) // Mount the router at '/api'

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})