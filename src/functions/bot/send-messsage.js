const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);

    try {
        await botApp.client.chat.postMessage({
            channel: data.channel,
            text: data.text
        });

        callback(null, {
            statusCode: 200,
            body: "Message send."
        })
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: "Could not send message. Reason is:\n " + error
        })
    }

    return handler(event, context, callback);
}