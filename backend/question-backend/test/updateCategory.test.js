import { expect } from 'chai'
import sinon from 'sinon'
import { updateCategory } from '../controller/updateCategory.js'
import Category from '../model/Category.js'
import Question from '../model/Question.js'

describe('updateCategory Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should update a category successfully', async () => {
        const req = {
            params: {
                oldName: 'CategoryToUpdate',
            },
            body: {
                name: 'UpdatedCategory',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's findOne method to simulate an existing category and a non-duplicate category
        const findOneCategoryStub = sinon.stub(Category, 'findOne')
        findOneCategoryStub.onFirstCall().resolves({ name: 'CategoryToUpdate' })
        findOneCategoryStub.onSecondCall().resolves(null)

        // Stub Question model's updateMany method to simulate successful update
        const updateManyStub = sinon.stub(Question, 'updateMany').resolves()

        // Stub save method to simulate successful save
        const saveStub = sinon.stub(Category.prototype, 'save').resolves()

        await updateCategory(req, res)

        // Assertions
        expect(findOneCategoryStub.callCount).to.equal(2)
        expect(findOneCategoryStub.getCall(0).calledWithExactly({ name: 'CategoryToUpdate' })).to.be.true
        expect(findOneCategoryStub.getCall(1).calledWithExactly({ name: 'UpdatedCategory' })).to.be.true
        expect(updateManyStub.calledOnceWithExactly({ categories: 'CategoryToUpdate' }, { $set: { 'categories.$': 'UpdatedCategory' } })).to.be.true
    })

    it('should handle category name already exists', async () => {
        const req = {
            params: {
                oldName: 'CategoryToUpdate',
            },
            body: {
                name: 'DuplicateCategory',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's findOne method to simulate an existing category and a duplicate category
        const findOneCategoryStub = sinon.stub(Category, 'findOne')
        findOneCategoryStub.onFirstCall().resolves({ name: 'CategoryToUpdate' })
        findOneCategoryStub.onSecondCall().resolves({ name: 'DuplicateCategory' })

        await updateCategory(req, res)

        // Assertions
        expect(findOneCategoryStub.callCount).to.equal(2)
        expect(findOneCategoryStub.getCall(0).calledWithExactly({ name: 'CategoryToUpdate' })).to.be.true
        expect(findOneCategoryStub.getCall(1).calledWithExactly({ name: 'DuplicateCategory' })).to.be.true
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('Category name already exists')).to.be.true
    })

    it('should handle errors during category update', async () => {
        const req = {
            params: {
                oldName: 'CategoryToUpdate',
            },
            body: {
                name: 'UpdatedCategory',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's findOne method to simulate an existing category and a non-duplicate category
        const findOneCategoryStub = sinon.stub(Category, 'findOne')
        findOneCategoryStub.onFirstCall().resolves({ name: 'CategoryToUpdate' })
        findOneCategoryStub.onSecondCall().resolves(null)

        // Stub Question model's updateMany method to simulate an error during update
        const updateManyStub = sinon.stub(Question, 'updateMany').rejects(new Error('Update error'))

        await updateCategory(req, res)

        // Assertions
        expect(findOneCategoryStub.callCount).to.equal(2)
        expect(findOneCategoryStub.getCall(0).calledWithExactly({ name: 'CategoryToUpdate' })).to.be.true
        expect(findOneCategoryStub.getCall(1).calledWithExactly({ name: 'UpdatedCategory' })).to.be.true
        expect(updateManyStub.calledOnceWithExactly({ categories: 'CategoryToUpdate' }, { $set: { 'categories.$': 'UpdatedCategory' } })).to.be.true
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('ERROR')).to.be.true
    })
})
