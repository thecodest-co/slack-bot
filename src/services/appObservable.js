const axios = require('axios').default;

const apps = new Map();

module.exports = {
    getAll() {
        return apps;
    },
    addApp(appId, url) {
        apps.set(appId, url);
    },
    removeApp(appId) {
        apps.delete(appId);
    },
    notifyAll(event) {
        console.log(`notifying all:`)
        apps.forEach((url, appId) => {
            console.log(`->${appId}`)
            axios.post( url, event)
                .then(function (response) {
                    console.log('ok');
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
};