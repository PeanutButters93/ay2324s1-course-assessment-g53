import { expect } from 'chai'
import sinon from 'sinon'
import { updateQuestion } from '../controller/updateQuestion.js'
import Question from '../model/Question.js'

describe('updateQuestion Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should update a question successfully', async () => {
        const req = {
            body: {
                id: 1,
                title: 'Updated Question',
                description: 'Updated Description',
                categories: ['Updated Category'],
                complexity: 'Updated Complexity',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Question model's findOne, find, and save methods for successful update
        const findOneStub = sinon.stub(Question, 'findOne').resolves({
            id: 1,
            title: 'Original Question',
            description: 'Original Description',
            categories: ['Original Category'],
            complexity: 'Original Complexity',
            save: sinon.stub().resolves(),
        })

        const findStub = sinon.stub(Question, 'find').resolves([])

        await updateQuestion(req, res)

        // Assertions
        expect(findOneStub.calledOnceWithExactly({ id: 1 })).to.be.true
        expect(findStub.callCount).to.equal(2)
        expect(res.send.calledOnce).to.be.true
    })

    it('should handle duplicate entries', async () => {
        const req = {
            body: {
                id: 1,
                title: 'Updated Question',
                description: 'Updated Description',
                categories: ['Updated Category'],
                complexity: 'Updated Complexity',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Question model's findOne and find methods to simulate duplicate entries
        const findOneStub = sinon.stub(Question, 'findOne').resolves({
            id: 1,
            title: 'Original Question',
            description: 'Original Description',
            categories: ['Original Category'],
            complexity: 'Original Complexity',
        })

        const findStub = sinon.stub(Question, 'find').resolves([
            {
                id: 2,
                title: 'Updated Question',
                description: 'Updated Description',
                categories: ['Updated Category'],
                complexity: 'Updated Complexity',
            },
        ])

        await updateQuestion(req, res)

        // Assertions
        expect(findOneStub.calledOnceWithExactly({ id: 1 })).to.be.true
        expect(findStub.callCount).to.equal(2)
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.getCall(0).args[0]).to.equal(
            'Duplicate entries were found, please change name and/or description'
        )
    })

    it('should handle errors during update', async () => {
        const req = {
            body: {
                id: 1,
                title: 'Updated Question',
                description: 'Updated Description',
                categories: ['Updated Category'],
                complexity: 'Updated Complexity',
            },
        }
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Question model's findOne and find methods for error handling
        const findOneStub = sinon.stub(Question, 'findOne').rejects(new Error('Find error'))
        const findStub = sinon.stub(Question, 'find').rejects(new Error('Find error'))

        await updateQuestion(req, res)

        // Assertions
        expect(findOneStub.calledOnceWithExactly({ id: 1 })).to.be.true
        expect(findStub.callCount).to.equal(0)
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.getCall(0).args[0]).to.equal('ERROR')
    })
})
