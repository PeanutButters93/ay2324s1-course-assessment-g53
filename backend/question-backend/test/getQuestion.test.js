import { expect } from 'chai'
import sinon from 'sinon'
import { getQuestions } from '../controller/getQuestions.js'
import Question from '../model/Question.js'

describe('getQuestions Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should retrieve and send questions successfully', async () => {
        const req = {}
        const res = {
            send: sinon.stub(),
        }

        // Stub Question model's find method to simulate successful retrieval
        const findStub = sinon.stub(Question, 'find').resolves([{ title: 'Question 1' }, { title: 'Question 2' }])

        await getQuestions(req, res)

        // Assertions
        expect(findStub.calledOnce).to.be.true
        expect(res.send.calledWith([{ title: 'Question 1' }, { title: 'Question 2' }])).to.be.true
    })

    it('should handle errors during retrieval', async () => {
        const req = {}
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
        }

        // Stub Question model's find method to simulate an error during retrieval
        const findStub = sinon.stub(Question, 'find').rejects(new Error('Retrieval error'))

        await getQuestions(req, res)

        // Assertions
        expect(findStub.calledOnce).to.be.true
        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.getCall(0).args[0]).to.equal('ERROR')
    })
})
