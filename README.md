# slack-bot

This is a slack bot app named Cody. It works as an event hub and web api proxy for slack workspace. It provides 
possibility to integrate with third-party applications via REST API.

Such an approach allows connecting only one app to slack - Cody, who allows invoking and delivers output from third-party
applications.

## Infrastructure

Application is deployed on AWS Lambda as a couple of different functions.

