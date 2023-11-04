import { expect } from 'chai'
import sinon from 'sinon'
import { getCategories } from '../controller/getCategories.js'
import Category from '../model/Category.js'

describe('getCategories Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should retrieve categories successfully', async () => {
        const req = {}
        const res = {
            send: sinon.stub(),
        }

        // Stub Category model's find method to simulate successful category retrieval
        const findCategoriesStub = sinon.stub(Category, 'find').resolves([{ name: 'Category1' }, { name: 'Category2' }])

        await getCategories(req, res)

        // Assertions
        expect(res.send.calledWith([{ name: 'Category1' }, { name: 'Category2' }])).to.be.true
    })

    it('should handle errors during category retrieval', async () => {
        const req = {}
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's find method to simulate an error during category retrieval
        const findCategoriesStub = sinon.stub(Category, 'find').rejects(new Error('Category retrieval error'))

        await getCategories(req, res)

        // Assertions
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('Error getting categories')).to.be.true
    })
})