const axios = require('axios').default;
const db = require("./db");

module.exports = {
    getAll() {
        return db.getAllApplications();
    },
    addApp(appName, url, events) {
        return db.registerApp(appName, url, events);
    },
    async notifyAllBy(eventName, event) {
        const apps = await db.getApplicationsByEvents([eventName]);
        apps.forEach(({name, url}) => {
            console.log(`${name}::${url}`)
            axios.post(url, event)
                .then(function (response) {
                    console.log('ok');
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
};