const axios = require('axios').default;
const db = require("./db");
const {botApp} = require("./aws-slack-bot");

module.exports = {
    getAll() {
        return db.getAllApplications();
    },
    addApp(appName, url, events) {
        return db.registerApp(appName, url, events);
    },
    async notifyAllBy(eventName, data) {
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
};