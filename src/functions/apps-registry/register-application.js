const appsRegistry = require('../../helpers/apps-registry');
const { mapToErrorDTO, mapToBaseDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const appData = JSON.parse(event.body);
    try {
        const appId = await appsRegistry.addApp(appData.name, appData.url, appData.events);
        callback(null, {
            statusCode: 200,
            body: mapToBaseDTO(`App registered successfully with id ${appId}`),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Could not register application', error),
        });
    }
};
