const {App, ExpressReceiver} = require('@slack/bolt');
const appsRouter = require('./routes/apps');
const appObservable = require('./services/appObservable');
require('dotenv').config();

const APP_PORT = process.env.PORT || 3000;

// Initializes your app with your bot token and signing secret
const receiver = new ExpressReceiver({signingSecret: process.env.SLACK_SIGNING_SECRET});
const botApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver
});

// Routes config

const API_PREFIX = '/api';
receiver.router.use(API_PREFIX, appsRouter);

// Events

botApp.event('message', async ({event, client, logger}) => {
    console.log(`got message`)
    appObservable.notifyAll(event);
});

// Endpoints for third-party-app --> bot communication

const SLACK_PREFIX = '/slack';

receiver.router.post(SLACK_PREFIX + '/messages', (req, res) => {
    const appId = req.query.id;
    const channel = req.query.channel;
    const message = req.query.message;
    sendMessage('#' + channel, `${appId} says: ${message}`);
    res.send('ok');
});

async function sendMessage(channel, message) {
    try {
        // Call chat.scheduleMessage with the built-in client
        const result = await botApp.client.chat.postMessage({
            channel: channel,
            text: message
        });
    } catch (error) {
        console.log(error);
    }
}


(async () => {
    await botApp.start(APP_PORT);
    console.log(`Bot is running! on ${APP_PORT}`);
})();
