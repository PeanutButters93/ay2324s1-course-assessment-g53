const express = require('express')
const app = express()
const port = 3000

// Middleware for parsing JSON requests
app.use(express.json())

// Import and use your user-profile-router
const userRouter = require('./routes/user-profile-router')
app.use('/api', userRouter) // Mount the router at '/api'

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})