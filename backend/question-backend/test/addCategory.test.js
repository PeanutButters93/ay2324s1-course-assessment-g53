import { expect } from 'chai'
import sinon from 'sinon'
import { addCategory } from '../controller/addCategory.js'
import Category from '../model/Category.js'

describe('addCategory Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should add a new category successfully', async () => {
        const req = {
            body: {
                name: 'New Category',
            },
        }
        const res = {
            send: sinon.stub(),
        }

        // Stub Category model's findOne and save methods to simulate a successful category addition
        const findOneStub = sinon.stub(Category, 'findOne').resolves(null)
        const saveStub = sinon.stub(Category.prototype, 'save').resolves()

        await addCategory(req, res)

        expect(saveStub.calledOnce).to.be.true
        expect(res.send.calledWith('Success')).to.be.true
    })

    it('should handle duplicate category names', async () => {
        const req = {
            body: {
                name: 'Duplicate Category',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's findOne to simulate an existing category
        const findOneStub = sinon.stub(Category, 'findOne').resolves({ name: 'Duplicate Category' })

        await addCategory(req, res)

        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('Category already exists')).to.be.true
    })

    it('should handle errors during category addition', async () => {
        const req = {
            body: {
                name: 'New Category',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's findOne for a non-existing category and stub save to simulate an error
        const findOneStub = sinon.stub(Category, 'findOne').resolves(null)
        const saveStub = sinon.stub(Category.prototype, 'save').rejects(new Error('Save error'))

        await addCategory(req, res)

        // Assertions
        expect(saveStub.calledOnce).to.be.true
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('ERROR')).to.be.true
    })
})
