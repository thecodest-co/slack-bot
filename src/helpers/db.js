const { Pool } = require('pg');

const pool = new Pool({
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function getAllApplications() {
    try {
        const sql = 'select * from slack_bot.applications';
        const results = await pool.query(sql);
        return results.rows;
    } catch (err) {
        return err.stack;
    }
}

async function registerApp(name, url, events) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const insertApplicationSQL = 'INSERT INTO slack_bot.applications(name, url) VALUES($1,$2) RETURNING *';
        const results = await client.query(insertApplicationSQL, [name, url]);
        const applicationId = results.rows[0].id;

        const insertApplicationEventsSQL = 'INSERT INTO slack_bot.applications_events '
            + 'SELECT $1, id from slack_bot.events e WHERE e.type = ANY($2) RETURNING *';
        await client.query(insertApplicationEventsSQL, [applicationId, events]);

        await client.query('COMMIT');

        return applicationId;
    } catch (err) {
        await client.query('ROLLBACK');
        return err.stack;
    } finally {
        client.release();
    }
}

async function getApplicationsByEvents(events) {
    try {
        const selectApplicationsByEventSQL = 'SELECT DISTINCT a.name, a.url from slack_bot.applications a '
            + 'INNER JOIN slack_bot.applications_events ae ON a.id = ae.application_id '
            + 'INNER JOIN slack_bot.events e ON ae.event_id = e.id '
            + 'WHERE e.type = ANY ($1)';
        const results = await pool.query(selectApplicationsByEventSQL, [events]);
        return results.rows;
    } catch (err) {
        return err.stack;
    }
}

module.exports = {
    getAllApplications,
    getApplicationsByEvents,
    registerApp,
};
