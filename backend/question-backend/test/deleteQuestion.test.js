import { expect } from 'chai'
import sinon from 'sinon'
import { deleteQuestion } from '../controller/deleteQuestion.js'
import Question from '../model/Question.js'

describe('deleteQuestion Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should delete a question successfully', async () => {
        const req = {
            params: {
                id: 1, // Valid question ID
            },
        }
        const res = {
            send: sinon.stub(),
        }

        // Stub Question model's deleteOne method to simulate a successful deletion
        const deleteOneStub = sinon.stub(Question, 'deleteOne').resolves({ n: 1 })

        await deleteQuestion(req, res)

        // Assertions
        expect(deleteOneStub.calledOnceWithExactly({ id: 1 })).to.be.true
        expect(res.send.calledWith('Success')).to.be.true
    })

    it('should handle errors in deleting a question', async () => {
        const req = {
            params: {
                id: 1,
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Question model's deleteOne method to simulate an error in deletion
        const deleteOneStub = sinon.stub(Question, 'deleteOne').rejects(new Error('Deletion error'))

        try {
            await deleteQuestion(req, res)
        } catch (error) {
            // Assertions
            expect(error.message).to.equal('Deletion error')
        }
    })
})
