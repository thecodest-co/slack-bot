const { botApp, awsLambdaReceiver } = require('../../helpers/aws-slack-bot');
const { mapToErrorDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);
    try {
        const result = await botApp.client.conversations.open({
            users: data.users.join(),
        });
        callback(null, {
            statusCode: 200,
            body: mapToConversationDTO(result),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Could not create conversation', error),
        });
    }

    return handler(event, context, callback);
};

function mapToConversationDTO(result) {
    return JSON.stringify({
        id: result.channel.id,
        name: result.channel.name,
    });
}
