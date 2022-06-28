const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const broadcastMessageLambda = require('../../../src/functions/slack-api/broadcast-message');
const { botApp } = require('../../../src/helpers/aws-slack-bot');
const userService = require('../../../src/helpers/user-service');

describe('Broadcast message', () => {
    let mockData = null;

    before(() => {
        mockData = {
            body: JSON.stringify({
                text: 'test-message',
            }),
        };
    });

    it('should successfully create conversation', (done) => {
        botApp.client.chat.postMessage = () => Promise.resolve({ called: true });

        userService.getAllValidUsers = () => Promise.resolve([{
            id: 'U123', teamId: 'T123', name: 'USER-TEST',
        }]);

        lambdaTester(broadcastMessageLambda.handler)
            .event(mockData)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(200);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Messages broadcast');

                done();
            })
            .catch(done);
    });

    it('should throw an error on slack error', (done) => {
        botApp.client.chat.postMessage = () => Promise.reject(new Error('Error message'));

        lambdaTester(broadcastMessageLambda.handler)
            .event(mockData)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not broadcast messages');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;
                expect(bodyObject.error).to
                    .equal('Some messages were not send: [{"status":"rejected","reason":{}}]');

                done();
            })
            .catch(done); // Catch assertion errors
    });

    it('should throw an error on empty bodyObject event', (done) => {
        lambdaTester(broadcastMessageLambda.handler)
            .event({ body: JSON.stringify({}) })
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not broadcast messages');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;

                done();
            })
            .catch(done); // Catch assertion errors
    });
});
