const appsRegistry = require('../../helpers/apps-registry');
const { mapToErrorDTO } = require('../../model/rest-dto-mapper');

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const applications = await appsRegistry.getAll();
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ applications }),
        });
    } catch (error) {
        callback(null, {
            statusCode: error.statusCode || 500,
            body: mapToErrorDTO('Error: Could not find applications', error),
        });
    }
};
