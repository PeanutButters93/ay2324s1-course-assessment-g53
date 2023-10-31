import { expect } from 'chai'
import sinon from 'sinon'
import Question from "../model/Question.js"

import { addQuestion } from '../controller/addQuestion.js'

describe('addQuestion Controller', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('should add a new question', async () => {
        const req = {
            body: {
                id: 1,
                title: 'Test Question',
                description: 'Test Description',
                categories: ['Category1', 'Category2'],
                complexity: 'Medium',
            },
        }
        const res = {
            send: sinon.stub(),
        }

        // Stub Question model's findOne method to simulate no existing title
        const findOneStub = sinon.stub(Question, 'findOne').resolves(null)

        // Stub Question model's save method
        const saveStub = sinon.stub(Question.prototype, 'save').resolves()

        await addQuestion(req, res)

        // Assertions
        expect(findOneStub.calledOnceWithExactly({ title: 'Test Question' })).to.be.true
        expect(res.send.calledWith('Success')).to.be.true
    })

    it('should handle duplicate question titles', async () => {
        const req = {
            body: {
                title: 'Test Question',
                // Add other fields as needed
            },
        }
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        }

        sinon.stub(Question, 'findOne').resolves({ title: 'Test Question' })

        await addQuestion(req, res)

        expect(res.status.calledWith(400)).to.be.true
        expect(res.send.getCall(0).args[0]).to.equal('A Question with given title already exists')

        Question.findOne.restore()
    })


    it('should handle errors', async () => {
        const req = {
            body: {
                id: 1,
                title: 'Test Question',
                description: 'Test Description',
                categories: ['Category1', 'Category2'],
                complexity: 'Medium',
            }
        }
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        }

        // Stub Question model's findOne method to simulate an error
        const findOneStub = sinon.stub(Question, 'findOne').rejects(new Error('Some error'))

        try {
            await addQuestion(req, res)
        } catch (error) {
            // Assertions for the error
            expect(error.message).to.equal('Some error')
        }

        findOneStub.restore()
    })


})
