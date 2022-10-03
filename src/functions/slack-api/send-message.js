const { botApp, awsLambdaReceiver } = require('../../helpers/aws-slack-bot');
const { mapToBaseDTO, mapToErrorDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);

    try {
        await botApp.client.chat.postMessage({
            channel: data.channel,
            text: data.text,
            thread_ts: data.thread_ts,
        });
        callback(null, {
            statusCode: 200,
            body: mapToBaseDTO('Message send'),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Could not send message', error),
        });
    }

    return handler(event, context, callback);
};
