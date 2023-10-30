const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe, it, beforeEach } = require('mocha')
const { updateUserInfo } = require('../controller/updateUser')
const { expect } = chai
const sinon = require('sinon')
const pool = require('../database/db')

chai.use(chaiHttp)

describe('Update User Information', () => {
    beforeEach(() => {
        sinon.stub(pool, 'query')
    })

    afterEach(() => {
        pool.query.restore()
    })

    it('should update user information successfully', (done) => {
        const request = {
            body: {
                user_id: 1,
                new_username: 'newusername',
                new_email: 'newemail@example.com',
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(200)
                return {
                    json: (result) => {
                        expect(result).to.have.property('message', 'User information updated successfully.')
                        done()
                    },
                }
            },
        }

        // Mock the database query to return a successful result
        pool.query.callsArgWith(2, null, { rowCount: 1 })

        updateUserInfo(request, response)
    })

    it('should handle user not found', (done) => {
        const request = {
            body: {
                user_id: 2,
                new_username: 'newusername',
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(404)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'User not found.')
                        done()
                    },
                }
            },
        }

        // Mock the database query to simulate no rows affected
        pool.query.callsArgWith(2, null, { rowCount: 0 })

        updateUserInfo(request, response)
    })

    it('should handle unique username constraint violation', (done) => {
        const request = {
            body: {
                user_id: 1,
                new_username: 'existingusername',
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(400)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Username is already taken')
                        done()
                    },
                }
            },
        }

        // Mock the database query to simulate a unique constraint violation
        const uniqueConstraintError = new Error('Unique constraint violation')
        uniqueConstraintError.code = '23505'
        uniqueConstraintError.constraint = 'unique_username'
        pool.query.callsArgWith(2, uniqueConstraintError)

        updateUserInfo(request, response)
    })

    it('should handle password complexity constraint violation', (done) => {
        const request = {
            body: {
                user_id: 1,
                new_password: 'weak',
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(400)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Password does not meet complexity requirements')
                        done()
                    },
                }
            },
        }

        // Mock the database query to simulate a password complexity constraint violation
        const passwordComplexityError = new Error('Password complexity constraint violation')
        passwordComplexityError.constraint = 'check_password_complexity'

        // Suppress the error log
        const errorLog = sinon.stub(console, 'error')
        errorLog.returns(null)

        pool.query.callsArgWith(2, passwordComplexityError)

        updateUserInfo(request, response)
    })

    it('should handle internal server error', (done) => {
        const request = {
            body: {
                user_id: 1,
                new_username: 'newusername',
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(500)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Internal server error')
                        done()
                    },
                }
            },
        }

        // Mock the database query to simulate an internal server error
        const internalServerError = new Error('Internal server error')
        pool.query.callsArgWith(2, internalServerError)

        updateUserInfo(request, response)
    })
})
