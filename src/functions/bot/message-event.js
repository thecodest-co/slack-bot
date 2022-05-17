const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");
const appsRegistry = require('../../helpers/apps-registry')

botApp.event('message', async ({event, say,message}) => {
    await appsRegistry.notifyAllBy("MESSAGE", event);
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}