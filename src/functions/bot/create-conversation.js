const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);

    try {

        const result = await botApp.client.conversations.open({
            users: data.users.join()
        });

        const responseBody = toResponseBody(result);

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(responseBody)
        })
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: "Could not create conversation. Reason is:\n " + error
        })
    }

    return handler(event, context, callback);
}

function toResponseBody(result) {
    return {
        id: result.channel.id,
        name: result.channel.name,
    };
}