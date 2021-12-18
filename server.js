const schedule = require('node-schedule');
const syncViaFtp = require('sync-via-ftp');
let { ready } = require('./fetch.js');
const express = require('express');

let debug = process.env.DEBUG || false;
const PORT = process.env.PORT || 5001;
const app = express();

// Sync via FTP to Bunny CDN
let { persist, destroy } = syncViaFtp('analytics.sqlite3', {
    type: 'sqlite',
    localPath: 'public/',
    interval: false,
    debug: true,
    ready: () => {
        schedule.scheduleJob('36 * * * *', () => ready(persist, destroy));
        setTimeout(() => ready(persist, destroy), 7777);
    }
});

// Static directory (everything in `public` is served)
app.use(express.static('public'));

/**
 * Start Server
 */
const server = app.listen(PORT, function () {
    console.log(`App listening on port ${ PORT }!`);
    server.keepAliveTimeout = 0;
});
