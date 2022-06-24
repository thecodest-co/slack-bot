const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const getUsersLambda = require('../../../src/functions/slack-api/get-users');
const userService = require('../../../src/helpers/user-service');

describe('Get users', () => {
    it('should successfully get all users', (done) => {
        userService.getAllValidUsers = () => Promise.resolve([{
            id: 'U123',
            teamId: 'T123',
            name: 'USER-TEST',
        }]);

        lambdaTester(getUsersLambda.handler)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(200);

                const bodyObject = JSON.parse(body);
                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.users).to.exist;
                expect(bodyObject.users.length).to.equal(1);

                done();
            })
            .catch(done);
    });

    it('should throw an error on faulty db service', (done) => {
        userService.getAllValidUsers = () => Promise.reject(new Error('Error message'));

        lambdaTester(getUsersLambda.handler)
            .expectResult((result) => {
                const { statusCode, body } = result;

                // eslint-disable-next-line no-unused-expressions
                expect(statusCode).to.exist;
                expect(statusCode).to.equal(500);

                const bodyObject = JSON.parse(body);

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.message).to.exist;
                expect(bodyObject.message).to.equal('Could not get users list');

                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;
                // eslint-disable-next-line no-unused-expressions
                expect(bodyObject.error).to.exist;
                expect(bodyObject.error).to.equal('Error message');

                done();
            })
            .catch(done);
    });
});
