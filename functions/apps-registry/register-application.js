const appsRegistry = require('../../helpers/apps-registry')

module.exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const appData = JSON.parse(event.body);
    appsRegistry.addApp(appData.name, appData.url, appData.events)
        .then(() => {
            callback(null, {
                statusCode: 200,
                body: "App registered successfully!"
            })
        })
        .catch(e => {
            callback(null, {
                statusCode: e.statusCode || 500,
                body: "Could not register application. Reason: \n" + e
            })
        })
};