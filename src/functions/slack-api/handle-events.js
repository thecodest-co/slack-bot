const { botApp, awsLambdaReceiver } = require('../../helpers/aws-slack-bot');
const appsRegistry = require('../../helpers/apps-registry');
const welcomeService = require('../../tasks/schedule-welcome-for-new-user');
const { events, dbEvents } = require('../../config/constants');

botApp.event(events.MESSAGE_EVENT, async ({ event, logger }) => {
    try {
        await appsRegistry.notifyAllBy(dbEvents.MESSAGE_EVENT, event);
    } catch (error) {
        logger.error(error);
    }
});

botApp.event(events.TEAM_JOIN_EVENT, async ({ event, logger }) => {
    try {
        await Promise.all([
            appsRegistry.notifyAllBy(dbEvents.TEAM_JOIN_EVENT, event),
            welcomeService.scheduleWelcomeForNewUser(event.user),
        ]);
    } catch (error) {
        logger.error(error);
    }
});

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
};
