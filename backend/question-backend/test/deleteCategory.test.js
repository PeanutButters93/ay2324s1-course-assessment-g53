import { expect } from 'chai'
import sinon from 'sinon'
import { deleteCategory } from '../controller/deleteCategory.js'
import Category from '../model/Category.js'
import Question from '../model/Question.js'

describe('deleteCategory Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should delete a category successfully', async () => {
        const req = {
            params: {
                name: 'CategoryToDelete',
            },
        }
        const res = {
            send: sinon.stub(),
        }

        // Stub Category model's deleteOne method to simulate successful deletion
        const deleteOneCategoryStub = sinon.stub(Category, 'deleteOne').resolves()

        // Stub Question model's find method to simulate no related questions
        const findQuestionsStub = sinon.stub(Question, 'find').resolves([])

        await deleteCategory(req, res)

        // Assertions
        expect(findQuestionsStub.calledOnceWithExactly({ categories: { $elemMatch: { name: 'CategoryToDelete' } } })).to.be.true
        expect(deleteOneCategoryStub.calledOnceWithExactly({ name: 'CategoryToDelete' })).to.be.true
        expect(res.send.calledWith('Success')).to.be.true
    })

    it('should handle category in use', async () => {
        const req = {
            params: {
                name: 'CategoryInUse',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's deleteOne method to simulate successful deletion
        const deleteOneCategoryStub = sinon.stub(Category, 'deleteOne').resolves()

        // Stub Question model's find method to simulate related questions
        const findQuestionsStub = sinon.stub(Question, 'find').resolves([{ title: 'Related Question' }])

        await deleteCategory(req, res)

        // Assertions
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.calledWith('Category is in use')).to.be.true
    })

    it('should handle errors during category deletion', async () => {
        const req = {
            params: {
                name: 'CategoryToDelete',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Category model's deleteOne method to simulate an error during deletion
        const deleteOneCategoryStub = sinon.stub(Category, 'deleteOne').rejects(new Error('Deletion error'))

        // Stub Question model's find method to simulate no related questions
        const findQuestionsStub = sinon.stub(Question, 'find').resolves([])

        try {
            await deleteCategory(req, res)
        } catch (error) {
            // Assertions
            expect(res.status.calledWith(400)).to.be.true
            expect(error.message).to.equal('Deletion error')
        }
    })
})
