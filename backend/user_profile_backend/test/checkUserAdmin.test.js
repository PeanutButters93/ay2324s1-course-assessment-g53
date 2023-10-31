const chai = require('chai')
const sinon = require('sinon')
const pool = require('../database/db')
const { checkUSerAdmin } = require('../controller/checkUserAdmin')

const expect = chai.expect

describe('Check User Admin', () => {
    let queryStub
    let statusStub
    let jsonStub

    beforeEach(() => {
        queryStub = sinon.stub(pool, 'query')
        statusStub = sinon.stub()
        jsonStub = sinon.stub()
    })

    afterEach(() => {
        queryStub.restore()
    })

    it('should check if a user is an admin', (done) => {
        const request = {
            body: {
                user_data: {
                    username: 'adminuser',
                },
            }
        }

        const response = {
            status: statusStub,
            json: jsonStub,
        }

        // Mock the query to find the user and return a result indicating that the user is an admin
        queryStub.withArgs('SELECT * FROM users WHERE username = $1', ['adminuser'])
            .callsArgWith(2, null, { rows: [{ is_admin: true }] })

        statusStub.callsFake((statusCode) => {
            expect(statusCode).to.equal(200)
            return {
                json: (result) => {
                    expect(result).to.have.property('is_admin', true)
                    done()
                }
            }
        })

        checkUSerAdmin(request, response)
    })

    it('should check if a user is not an admin', (done) => {
        const request = {
            body: {
                user_data: {
                    username: 'notadminuser',
                },
            }
        }

        const response = {
            status: statusStub,
            json: jsonStub,
        }

        // Mock the query to find the user and return a result indicating that the user is an admin
        queryStub.withArgs('SELECT * FROM users WHERE username = $1', ['notadminuser'])
            .callsArgWith(2, null, { rows: [{ is_admin: false }] })

        statusStub.callsFake((statusCode) => {
            expect(statusCode).to.equal(200)
            return {
                json: (result) => {
                    expect(result).to.have.property('is_admin', false)
                    done()
                }
            }
        })

        checkUSerAdmin(request, response)
    })


    it('should handle user not found', (done) => {
        const request = {
            body: {
                user_data: {
                    username: 'nonexistentuser',
                },
            },
        }

        const response = {
            status: statusStub,
            json: jsonStub,
        }

        // Mock the query to find the user, but return an empty result
        queryStub.withArgs('SELECT * FROM users WHERE username = $1', ['nonexistentuser'])
            .callsArgWith(2, null, { rows: [] })

        statusStub.callsFake((statusCode) => {
            expect(statusCode).to.equal(404)
            return {
                json: (result) => {
                    expect(result).to.have.property('error', 'User not found')
                    done()
                },
            }
        })

        checkUSerAdmin(request, response)
    })


})
