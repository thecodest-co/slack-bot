const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");
const appsRegistry = require('../../helpers/apps-registry')

botApp.event('message', async ({event, say,message}) => {
    if (event.text === '!hello') {
        await say(`Hey there <@${message.user}>!`);
    } else if (event.text === '!goodbye') {
        await say(`See ya later, <@${message.user}> :wave:`);
    }
    await appsRegistry.notifyAllBy("MESSAGE", event);
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    context.callbackWaitsForEmptyEventLoop = false;
    return handler(event, context, callback);
}