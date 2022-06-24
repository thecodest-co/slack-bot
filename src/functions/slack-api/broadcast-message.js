const { botApp, awsLambdaReceiver } = require('../../helpers/aws-slack-bot');
const userService = require('../../helpers/user-service');
const { mapToBaseDTO, mapToErrorDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);

    try {
        const users = await userService.getAllValidUsers();
        const postMessagePromises = users.map((user) => user.id)
            .map((userId) => botApp.client.chat.postMessage({
                channel: userId,
                text: data.text,
            }));
        const settledPostMessage = await Promise.allSettled(postMessagePromises);
        const rejected = settledPostMessage.filter((p) => p.status === 'rejected');

        if (rejected.length !== 0) {
            throw new Error(`Some messages were not send: ${JSON.stringify(rejected)}`);
        }

        callback(null, {
            statusCode: 200,
            body: mapToBaseDTO('Messages broadcast'),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Could not broadcast messages', error),
        });
    }

    return handler(event, context, callback);
};
