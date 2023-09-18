const express = require('express')

const bodyParser = require('body-parser')

const getUserById = require('../controller/getUser').getUserById
const getUserByName = require('../controller/getUser').getUserByName
const getUsers = require('../controller/getUser').getUsers

const createUser = require('../controller/createUser').createUser

const deleteUserByUserID = require('../controller/deleteUser').deleteUserByUserID

const updateUserInfo = require('../controller/updateUser').updateUserInfo

const loginUser = require('../controller/getUser').loginUser; 



const app = express()
const router = express.Router()

router.use(express.json())

// Define your routes
router.post('/login', loginUser);
router.post('/createUser', createUser)
router.get('/users', getUsers)
router.get('/user/:id', getUserById)
router.get('/userByName/:name', getUserByName)
router.put('/updateUser/:id', updateUserInfo)
router.delete('/deleteUser/:id', deleteUserByUserID)


module.exports = router