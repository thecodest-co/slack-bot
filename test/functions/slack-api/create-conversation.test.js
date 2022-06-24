const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const createConversationLambda = require('../../../src/functions/slack-api/create-conversation');
const { botApp } = require('../../../src/helpers/aws-slack-bot');

describe('Create conversation', () => {
    let mockData = null;

    before(() => {
        mockData = {
            body: JSON.stringify({
                users: [
                    'U0001',
                    'U0002',
                ],
            }),
        };
    });

    it('should successfully create conversation', (done) => {
        botApp.client.conversations.open = () => Promise.resolve({
            channel: {
                id: '123456',
                name: 'test-channel-name',
            },
        });

        lambdaTester(createConversationLambda.handler)
            .event(mockData)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(200);

                // eslint-disable-next-line no-unused-expressions
                expect(body.id).to.exist;
                expect(body.id).to.equal('123456');

                // eslint-disable-next-line no-unused-expressions
                expect(body.name).to.exist;
                expect(body.name).to.equal('test-channel-name');

                done();
            })
            .catch(done);
    });

    it('should throw an error on slack error', (done) => {
        botApp.client.conversations.open = () => Promise.reject(new Error('Error message'));

        lambdaTester(createConversationLambda.handler)
            .event(mockData)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not create conversation');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;
                expect(bodyObject.error).to.equal('Error message');

                done();
            })
            .catch(done); // Catch assertion errors
    });

    it('should throw an error on empty bodyObject event', (done) => {
        lambdaTester(createConversationLambda.handler)
            .event({ body: JSON.stringify({}) })
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not create conversation');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;

                done();
            })
            .catch(done); // Catch assertion errors
    });
});
