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
    async notifyAllBy(eventName, event) {
        const apps = await db.getApplicationsByEvents([eventName]);
        for(const app in apps) {
            console.log(`${app.name}::${app.url}`)
            try {
                await axios.post(app.url, event);
                console.log(`Send ${eventName} to ${app.name}`);
            } catch (error) {
                console.log(error);
            }
        }
    }
};