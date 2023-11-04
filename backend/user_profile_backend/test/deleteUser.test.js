const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe, it, beforeEach } = require('mocha')
const { deleteUserByUserID } = require('../controller/deleteUser')
const { expect } = chai
const sinon = require('sinon')
const pool = require('../database/db')

chai.use(chaiHttp)

describe('Delete User', () => {
    beforeEach(() => {
        sinon.stub(pool, 'query').callsFake((query, params, callback) => {
            if (query.startsWith('DELETE FROM users')) {
                if (params[0] === 2) {
                    // Simulate a deletion failure for user_id = 2
                    callback(null, { rowCount: 0 })
                } else {
                    // Simulate a successful deletion for other user_ids
                    callback(null, { rowCount: 1 })
                }
            } else {
                // Handle other queries (if any)
                callback(null, { rowCount: 0 })
            }
        })
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should return success message when user is deleted', (done) => {
        const request = {
            body: {
                user_data : {user_id: 100},
            },
        }

        const response = {
            status: function (code) {
                expect(code).to.equal(200)
                return {
                    send: function (message) {
                        expect(message).to.equal('User deleted with ID: 100')
                        done()
                    },
                }
            },
        }

        deleteUserByUserID(request, response)
    })

    it('should return a 404 error message if the user does not exist', (done) => {
        const request = {
            body: {
                user_data: {user_id: 2},
            },
        }

        const response = {
            status: function (code) {
                expect(code).to.equal(404)
                return {
                    send: function (message) {
                        expect(message).to.equal('No user found with ID: 2')
                        done()
                    },
                }
            },
        }

        deleteUserByUserID(request, response)
    })
})
