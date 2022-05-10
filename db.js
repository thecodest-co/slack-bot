const mysql = require('mysql2') // built-in promise functionality
const config = require('./config.json');
const DB = {
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbname
};
const conn = mysql.createPool(DB);

async function getAllApplications() {
    const sql = "SELECT * from applications"
    let results = await conn.promise().query(sql);
    return results[0];
}

async function insertApp(app_id, name, url) {
    const sql = "INSERT INTO applications VALUES(?,?,?)";
    const params = [app_id, name, url];
    let results = await conn.promise().query(sql, params);
    return results[0];
}

exports.getAllApplications = getAllApplications;
exports.insertApp = insertApp;