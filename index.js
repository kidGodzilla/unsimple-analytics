const syncViaFtp = require('sync-via-ftp');
let { ready } = require('./fetch.js');

// Sync via FTP to Bunny CDN
let { persist, destroy } = syncViaFtp('analytics.sqlite3', {
    type: 'sqlite',
    localPath: 'public/',
    interval: false,
    debug: true,
    ready: () => {
        setTimeout(() => ready(persist, destroy), 1234);
    }
});
