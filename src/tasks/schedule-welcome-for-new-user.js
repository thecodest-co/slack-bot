const { botApp } = require('../helpers/aws-slack-bot');
const { getWelcomeMessageForNewUser } = require('../config/messages');

async function scheduleWelcomeForNewUser(user) {
    const message = getWelcomeMessageForNewUser(user.id);
    // scheduleMessage requires integer of unix epoch in seconds
    const roundedScheduleDateInUnixEpoch = Math.round(getScheduleDate().getTime() / 1000);
    await botApp.client.chat.scheduleMessage({
        channel: user.id,
        text: message,
        post_at: roundedScheduleDateInUnixEpoch,
    });
}

function getScheduleDate() {
    const date = new Date();
    const delayDays = process.env.WELCOME_MESSAGE_DELAY_DAYS || 0;
    const delayHours = process.env.WELCOME_MESSAGE_DELAY_HOURS || 0;
    const delayMinutes = process.env.WELCOME_MESSAGE_DELAY_MINUTES || 1;
    const delayInMillis = (((delayDays * 24) + delayHours) * 60 + delayMinutes) * 60 * 1000;
    return new Date(date.getTime() + delayInMillis);
}

module.exports = {
    scheduleWelcomeForNewUser,
};
