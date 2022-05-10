const {App, AwsLambdaReceiver} = require('@slack/bolt');
const db = require("./db");
// const db = require('./db');

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({message, say}) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});

// // Listens for an action from a button click
// app.action('button_click', async ({ body, ack, say }) => {
//     await ack();
//
//     await say(`<@${body.user.id}> clicked the button`);
// });

// Listens to incoming messages that contain "goodbye"
app.message('apps', async ({message, say}) => {
    // say() sends a message to the channel where the event was triggered
    const apps = await db.getAllApplications();
    apps.forEach(async function (app) {
        await say(`See ::::${app.name}`)
    });
    // db.getAllApplications().then(r => r.forEach(async function(a) {
    //
    //     console.log(`::::${a.name}`)
    // }));

});

// Listens to incoming messages that contain "goodbye"
app.message('goodbye', async ({message, say}) => {
    // say() sends a message to the channel where the event was triggered
    await say(`See ya later, <@${message.user}> :wave:`);
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}