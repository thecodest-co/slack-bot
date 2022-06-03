const axios = require('axios').default;
const db = require("./db");

async function getAll() {
    return await db.getAllApplications();
}

async function addApp(appName, url, events) {
    return await db.registerApp(appName, url, events);
}

async function notifyAllBy(eventName, data) {
    const apps = await db.getApplicationsByEvents([eventName]);
    for (const i in apps) {
        const app = apps[i];
        try {
            await axios.post(app.url, data);
            console.log(`Send ${eventName} to ${app.name}`);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    getAll,
    addApp,
    notifyAllBy
};
