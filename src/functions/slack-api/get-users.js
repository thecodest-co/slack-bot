const { awsLambdaReceiver } = require('../../helpers/aws-slack-bot');
const userService = require('../../helpers/user-service');
const { mapToErrorDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    try {
        const users = await userService.getAllValidUsers();
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ users }),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Could not get users list', error),
        });
    }
    return handler(event, context, callback);
};
