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
    // for (const app of Object.keys(apps)) {
    //     try {
    //         await axios.post(app.url, data);
    //         console.log(`Send ${eventName} to ${app.name}`);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const notifyingPromises = apps.map((app) => axios.post(app.url, data));

    return Promise.allSettled(notifyingPromises);
}

module.exports = {
    getAll,
    addApp,
    notifyAllBy,
};
