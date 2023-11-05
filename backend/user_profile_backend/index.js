const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config({
  path: ".env.local",
})

const app = express()
const port = process.env.PORT ? process.env.PORT : 4000;

// Middleware for parsing JSON requests
app.use(express.json())
app.use(cors())

// Import and use your user-profile-router
const userRouter = require('./routes/user-profile-router')
app.use('/api/users', userRouter) // Mount the router at '/api'
app.use('/', (req, res) => res.status(200).json({status: "OK"}))
// Start the server
app.listen(port, () => {
  console.log(`User server is running on port ${port}`)
})

module.exports = app