const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe, it, beforeEach } = require('mocha')
const { createUser } = require('../controller/createUser') // Adjust the path to your user module
const { expect } = chai
const sinon = require('sinon')
const pool = require('../database/db') // Adjust the path to your database module
const jwt = require('jsonwebtoken')

chai.use(chaiHttp)

describe('User Registration', () => {
    beforeEach(() => {
        sinon.stub(pool, 'query')
        errorLogStub = sinon.stub(console, 'error')
    })

    afterEach(() => {
        errorLogStub.restore()
        pool.query.restore()
    })

    it('should register a new user', (done) => {
        const request = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(201)
                return {
                    json: (result) => {
                        expect(result).to.have.property('message')
                        expect(result).to.have.property('token')
                        done()
                    }
                }
            }
        }

        // Mock the database query to return a successful result
        pool.query.callsArgWith(2, null, { rows: [{ user_id: 1 }] })

        createUser(request, response)
    })

    it('should handle username already taken', (done) => {
        const request = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(400)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Username is already taken')
                        done()
                    }
                }
            }
        }

        // Mock the database query to simulate a unique constraint violation
        const uniqueConstraintError = new Error('Unique constraint violation')
        uniqueConstraintError.code = '23505'
        uniqueConstraintError.constraint = 'unique_username'
        pool.query.callsArgWith(2, uniqueConstraintError)

        createUser(request, response)
    })

    it('should handle password complexity constraint', (done) => {
        const request = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'weak',
                firstName: 'John',
                lastName: 'Doe'
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(400)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Password does not meet complexity requirements')
                        done()
                    }
                }
            }
        }

        // Mock the database query to simulate a password complexity constraint violation
        const passwordComplexityError = new Error('Password complexity constraint violation')

        passwordComplexityError.constraint = 'check_password_complexity'

        pool.query.callsArgWith(2, passwordComplexityError)
        createUser(request, response)
    })

    it('should handle internal server error', (done) => {
        const request = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                firstName: 'John',
                lastName: 'Doe'
            }
        }

        const response = {
            status: (statusCode) => {
                expect(statusCode).to.equal(500)
                return {
                    json: (result) => {
                        expect(result).to.have.property('error', 'Internal server error')
                        done()
                    }
                }
            }
        }
        // Mock the database query to simulate an internal server error
        const internalServerError = new Error('Internal server error')


        pool.query.callsArgWith(2, internalServerError)

        createUser(request, response)
    })
});


