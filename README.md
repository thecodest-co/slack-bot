# slack-bot-pov

## Example "third-party" app

https://github.com/codesthq/say-hello-app

## Bot prerequisites

First thing’s first: before you start app, you’ll want to [create a Slack app](https://api.slack.com/apps/new).
Also, in Event Subscriptions config you should provide url to your running bot app - for local development see 
**Tunneling**.

To run app you need [node.js](https://nodejs.org/en/) (at least v15).

You also need to set up environment variables: SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN, APP_PORT(optional).

## Bot startup

### Installation

Open a command line (or terminal) and navigate to the folder where you have the project files then run:

```
npm install
```

### Running bot

One can run the application in **dev** mode by issuing the following command:

```
npm run dev
```

One can run the application in **prod** mode by issuing the following command:

```
npm run start
```

## Tunneling

To config your app in Event Subscriptions you need public url. However, there is workaround for local development - you 
can use tunneling with [localtunnel](https://github.com/localtunnel/localtunnel) (recommended) 
or [ngrok](https://ngrok.com/).

For localtunnel you can use the following command (assuming your bot runs on port 3000):

```
lt --port 3000
```

## Application

Application on default runs on **http://localhost:3000/**.

### Registering a new app

You can register a new app using REST API:

* **/api/apps**
    * method: **POST**
    * params:
        * __id__ - the id of a new app.
        * __url__ - the app endpoint on which it listens to events send by bot.
    * example request:
        * **http://slack-bot-app.example.com:3000/api/apps?id=say-hello-app&url=http://say-hello-app.com:3001**


