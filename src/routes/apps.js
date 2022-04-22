const express = require('express');
const appObservable = require("../services/appObservable");

const router = express.Router();

router.route('/apps')
    .post((req, res) => {
        const appId = req.query.id;
        const appUrl = req.query.url;
        appObservable.addApp(appId, appUrl);
        res.send('App registered');
    })
    .delete( (req, res) => {
        const appId = req.query.id;
        appObservable.removeApp(appId);
        res.send('App removed');
    })
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(Object.fromEntries(appObservable.getAll()));
    });

module.exports = router;