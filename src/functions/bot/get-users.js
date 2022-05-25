const {botApp, awsLambdaReceiver} = require("../../helpers/aws-slack-bot");

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();

    try {
        const result = await botApp.client.users.list();
        const users = filterOutBotsAndDeletedUsers(result.members)
            .map(m => toUser(m));

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(users)
        })
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: "Could not get users list. Reason is:\n " + error
        })
    }

    return handler(event, context, callback);
}

function filterOutBotsAndDeletedUsers(members) {
    const defaultSlackbotId = 'USLACKBOT';
    return members.filter(m =>
        !m.is_bot &&
        //default Slackbot added by Slack has set is_bot as false, so it has to be filtered out by id
        m.id !== defaultSlackbotId &&
        !m.deleted
    );
}

function toUser(member) {
    return {
        id: member.id,
        teamId: member.team_id,
        name: member.name
    };
}