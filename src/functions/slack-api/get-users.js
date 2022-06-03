const {awsLambdaReceiver} = require("../../helpers/aws-slack-bot");
const {userService} = require("../../helpers/users");

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    try {
        const users = userService.getAllValidUsers();
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(users)
        })
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: `Could not get users list. Reason is:\n\t${error}`
        })
    }
    return handler(event, context, callback);
}


