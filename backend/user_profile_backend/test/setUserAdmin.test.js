const chai = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { setUserAdmin } = require('../controller/setUserAdmin')
const { expect } = chai
const sinon = require('sinon')
const pool = require('../database/db')

chai.use(require('chai-http'))

describe('Set User Admin', () => {
    let queryStub
    let statusStub
    let jsonStub

    beforeEach(() => {
        queryStub = sinon.stub(pool, 'query')
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        statusStub.returns({ json: jsonStub })
    })

    afterEach(() => {
        queryStub.restore()
    })

    it('should set a user as an admin', (done) => {
        const request = {
            query: {
                username: 'testuser',
            },
        }

        const response = {
            status: statusStub,
        }

        // Mock the first query to find the user
        queryStub.withArgs('SELECT * FROM users WHERE username = $1', ['testuser'])
            .callsArgWith(2, null, { rows: [{ username: 'testuser' }] })

        // Mock the second query to update the user's admin status
        queryStub.withArgs('UPDATE users SET is_admin = true WHERE username = $1', ['testuser'])
            .callsArgWith(2, null)

        jsonStub.callsFake((result) => {
            expect(result).to.have.property('message', 'User is now an admin')
            done()
        })

        setUserAdmin(request, response)
    })

    it('should handle user not found', (done) => {
        const request = {
            query: {
                username: 'nonexistentuser',
            },
        }

        const response = {
            status: statusStub,
        }

        // Mock the query to find the user, but return an empty result
        queryStub.withArgs('SELECT * FROM users WHERE username = $1', ['nonexistentuser'])
            .callsArgWith(2, null, { rows: [] })

        jsonStub.callsFake((result) => {
            expect(result).to.have.property('error', 'User not found')
            done()
        })

        setUserAdmin(request, response)
    })
})
