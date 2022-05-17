const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");
const appsRegistry = require('../../helpers/apps-registry')

botApp.event('message', async ({event,logger}) => {
    try {
        // Call chat.postMessage with the built-in client
        const result = await appsRegistry.notifyAllBy("MESSAGE", event);
        logger.info(result);
    }
    catch (error) {
        logger.error(error);
    }
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}