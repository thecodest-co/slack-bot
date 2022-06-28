const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const sendMessageLambda = require('../../../src/functions/slack-api/send-message');
const { botApp } = require('../../../src/helpers/aws-slack-bot');

describe('Send message', () => {
    let mockData = null;

    before(() => {
        mockData = {
            body: JSON.stringify({
                channel: 'general',
                text: 'Test message',
            }),
        };
    });

    it('should successfully send message', (done) => {
        botApp.client.chat.postMessage = () => Promise.resolve({ called: true });

        lambdaTester(sendMessageLambda.handler)
            .event(mockData) // Passing input data
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(200);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Message send');

                done();
            })
            .catch(done); // Catch assertion errors
    });

    it('should throw an error on slack error', (done) => {
        botApp.client.chat.postMessage = () => Promise.reject(new Error('Error message'));

        lambdaTester(sendMessageLambda.handler)
            .event(mockData)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not send message');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;
                expect(bodyObject.error).to.equal('Error message');

                done();
            })
            .catch(done); // Catch assertion errors
    });

    it('should throw an error on empty bodyObject event', (done) => {
        lambdaTester(sendMessageLambda.handler)
            .event({ body: JSON.stringify({}) })
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not send message');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;

                done();
            })
            .catch(done); // Catch assertion errors
    });
});
