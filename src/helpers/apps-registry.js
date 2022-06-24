const axios = require('axios').default;
const db = require('./db');

async function getAll() {
    return db.getAllApplications();
}

async function addApp(appName, url, events) {
    return db.registerApp(appName, url, events);
}

async function notifyAllBy(eventName, data) {
    const apps = await db.getApplicationsByEvents([eventName]);
    const notifyingPromises = apps.map((app) => axios.post(app.url, data));
    return Promise.allSettled(notifyingPromises);
}

module.exports = {
    getAll,
    addApp,
    notifyAllBy,
};
