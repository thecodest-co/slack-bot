const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");
const userService = require("../../helpers/user-service");

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    const data = JSON.parse(event.body);

    try {
        const users = await userService.getAllValidUsers();
        for (const userId of users.map(user => user.id)) {
            await botApp.client.chat.postMessage({
                channel: userId,
                text: data.text
            });
        }
        callback(null, {
            statusCode: 200,
            body: "Messages broadcast."
        })
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: `Could not broadcast messages. Reason is:\n\t${error}`
        })
    }

    return handler(event, context, callback);
}
