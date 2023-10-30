const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index') // Assuming your index.js is in the root directory
const expect = chai.expect
const jwt = require('jsonwebtoken')
const { signJsonWebToken } = require('../middleware/tokenUtils')

chai.use(chaiHttp)

describe('User Server API', () => {
    let server
    const payload = {
        user_data: {
            user_id: 50,
            username: "adam",
        }
    }

    const token = jwt.sign(payload, "yourSecretKey")

    // Before starting the tests, start the server
    before((done) => {
        server = app.listen(0, () => {
            done()
        })
    })

    // Test GET /api/users
    // it('should get a list of users', (done) => {
    //     const payload = {
    //         user_data: {
    //             user_id: 50,
    //             username: "adam",
    //         }
    //     }
    //     const token = jwt.sign(payload, "yourSecretKey")

    //     chai.request(app)
    //         .get('/api/users/users')
    //         .set('Authorization', `${token}`)
    //         .end((err, res) => {
    //             expect(res).to.have.status(200)
    //             expect(res.body).to.be.an('array')
    //             expect(res.body.length).to.be.above(30)
    //             done()
    //         })
    // }, 5000)

    // Test Get /api/users/userById
    it('should get a user by id', (done) => {
        const payload = {
            user_data: {
                user_id: 50,
                username: "adam",
            }
        }
        const token = jwt.sign(payload, "yourSecretKey")
        chai.request(app)
            .get('/api/users/userById?user_id=50')
            .set('Authorization', `${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                expect(res.body.length).to.equal(1)
                expect(res.body[0].user_id).to.equal(50)
                expect(res.body[0].username).to.equal('adam')
                done()
            })
    }, 5000)

    // Test Get /api/users/userByName
    // it('should get a user by name', (done) => {
    //     const payload = {
    //         user_data: {
    //             user_id: 50,
    //             username: "adam",
    //         }
    //     }
    //     const token = jwt.sign(payload, "yourSecretKey")
    //     chai.request(app)
    //         .get('/api/users/userByName?username=adam')
    //         .set('Authorization', `${token}`)
    //         .end((err, res) => {
    //             expect(res).to.have.status(200)
    //             expect(res.body).to.be.an('array')
    //             expect(res.body.length).to.equal(3)
    //             expect(res.body[0].user_id).to.equal(50)
    //             expect(res.body[0].username).to.equal('adam')
    //             done()
    //         })
    // }, 5000)

    // Test Get /api/users/login
    // log in a user by username and password
    it('should login a user with the correct username and password', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send({ userIdentifier: 'adam', password: '283401!Adam' })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('token')
                var temptoken = res.body.token
                var decoded = jwt.verify(temptoken, "yourSecretKey")
                expect(decoded.user_data.user_id).to.equal(50)
                expect(decoded.user_data.is_admin).to.equal(true)
                done()
            })
    })

    // Test Get /api/users/login
    // log in a user by email and password
    it('should login a user with the correct email and password', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send({
                userIdentifier: 'qqqq@qq.com', password: '283401!Adam'
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('token')
                var temptoken = res.body.token
                var decoded = jwt.verify(temptoken, "yourSecretKey")
                expect(decoded.user_data.user_id).to.equal(124)
                expect(decoded.user_data.is_admin).to.equal(false)
                done()
            })
    })


    // ------------------------------ //
    // Here is all the error handling tests

    // Test Get /api/users/userByName
    // Error: username not in database
    // it('cannot get a user by the name', (done) => {
    //     const payload = {
    //         user_data: {
    //             user_id: 50,
    //             username: "adam",
    //         }
    //     }
    //     const token = jwt.sign(payload, "yourSecretKey")
    //     chai.request(app)
    //         .get('/api/users/userByName?username=abcdefghijklmn1234567890')
    //         .set('Authorization', `${token}`)
    //         .end((err, res) => {
    //             expect(res).to.have.status(404)
    //             expect(res.body).to.be.an('object')
    //             expect(res.body.error).to.equal('User not found')
    //             done()
    //         })
    // }, 5000)

    // Test Get /api/users/userById
    // Error: Not authenticated
    it('cannot get a user by the id', (done) => {
        chai.request(app)
            .get('/api/users/userById?user_id=47')
            .end((err, res) => {
                expect(res).to.have.status(401)
                expect(res.body).to.be.an('object')
                expect(res.body.error).to.equal('Unauthorised')
                done()
            })
    }, 5000)

    // Test Get /api/users/login
    // Error: wrong password
    it('should not login a user with the wrong password', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send({
                userIdentifier: 'adam', password: 'qwdqd'
            })
            .end((err, res) => {
                expect(res).to.have.status(403)
                expect(res.body).to.be.an('object')
                expect(res.body.error).to.equal('Incorrect password')
                done()
            })
    })

    // Test Get /api/users/login
    // Error: wrong username
    it('should not login a user with the wrong username', (done) => {
        chai.request(app)
            .post('/api/users/login')
            .send({
                userIdentifier: 'gugugu', password: 'qwdqd'
            })
            .end((err, res) => {
                expect(res).to.have.status(404)
                expect(res.body).to.be.an('object')
                expect(res.body.error).to.equal('User not found')
                done()
            })
    })


    // After finishing the tests, close the server
    after((done) => {
        server.close(() => {
            done()
        })
    })
})