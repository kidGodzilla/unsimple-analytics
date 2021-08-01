require('dotenv').config();

const MobileDetect = require('mobile-detect');
const Database = require('better-sqlite3');
const uaparser = require('ua-parser');
const request = require('superagent');
const Url = require('url-parse');
const fs = require('fs');
let debug = 0;

// Use SQLite3 Database
const db = new Database('public/analytics.sqlite3'); // , { verbose: console.log }

// Drop previous `visits` table
// let stmt = db.prepare(`DROP TABLE visits`);
// stmt.run();

// Optional Recommended Improvements
let stmt = db.prepare(`pragma journal_mode = delete;`);
stmt.run();

stmt = db.prepare(`pragma page_size = 1024;`);
stmt.run();

stmt = db.prepare(`vacuum;`);
stmt.run();

// Create `visits` Table
stmt = db.prepare(`CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    date TEXT,
    ts INTEGER,
    ip TEXT,
    protocol TEXT,
    pathname TEXT,
    host TEXT,
    device_type TEXT,
    device_family TEXT,
    browser TEXT,
    browser_major_version TEXT,
    os TEXT,
    os_major_version TEXT,
    os_minor_version TEXT,
    country_code TEXT,
    referer_host TEXT
)`);

stmt.run();

// Vacuum again
stmt = db.prepare(`vacuum;`);
stmt.run();

// Insert via prepared statement
const insert = db.prepare(`INSERT OR IGNORE INTO visits (
    id, 
    date, 
    ts, 
    ip, 
    protocol, 
    pathname, 
    host, 
    device_type, 
    device_family, 
    browser, 
    browser_major_version, 
    os, 
    os_major_version, 
    os_minor_version, 
    country_code,
    referer_host
) VALUES (
    @unique_request_id, 
    @iso_date,
    @timestamp,
    @remote_ip,
    @protocol, 
    @pathname, 
    @host, 
    @device_type, 
    @device_family, 
    @browser, 
    @browser_major_version, 
    @os, 
    @os_major_version, 
    @os_minor_version, 
    @country_code,
    @referer_host
)`);

// Insert one or many function
const insertMany = db.transaction(rows => {
    if (Array.isArray(rows)) {
        for (const row of rows) insert.run(row);
    } else {
        insert.run(rows);
    }
});

// Data format descriptor
let format = 'cache_status|status_code|timestamp|bytes_sent|pull_zone_id|remote_ip|referer_url|url|edge_location|user_agent|unique_request_id|country_code'.split('|');

// Determine device type
function determineDeviceType(ua, type) {
    let deviceType = 'mobile,tablet,desktop,laptop'.split(',');
    let md = new MobileDetect(ua);

    // md.maxPhoneWidth 992 - 1440 = laptop
    // console.log(md.maxPhoneWidth)

    if (!(md.mobile() || md.tablet())) type = 2;
    else if (!!md.mobile()) type = 0;
    else if (!!md.tablet()) type = 1;

    // Attempted but Not very accurate
    // if (type === 2 && md.maxPhoneWidth <= 1440) type = 3;

    // console.log('\n', deviceType[type], '\n');
    return deviceType[type];
}

// Parse Bunny CDN logs
function parseLogs (logs) {
    if (!logs || typeof logs !== 'string') return false;

    let a = logs.split(/\n/).reverse();

    a.map(line => {
        if (!line || typeof line !== 'string' || line.length < 4) return;

        let parts = line.split('|');
        // console.log(line, parts);
        let out = {};

        if (!parts[7].includes('/o.png')) return;

        parts.forEach((part, i) => {
            out[format[i]] = part === '-' ? null : part;

            if (format[i] === 'timestamp') {
                let ts = parseInt(part / 1000);
                out[format[i]] = ts;

                let d = new Date(parseInt(part));
                let iso_date = d.toISOString().slice(0,10);
                out.iso_date = iso_date;
                // console.log(iso_date);


            } else if (format[i] === 'user_agent') {
                const uaParts = uaparser.parse(part);
                // console.log(uaParts, '\n', determineDeviceType(part), uaParts.device.family, uaParts.family, uaParts.major, uaParts.os.family, uaParts.os.major+'.'+uaParts.os.minor);

                out.device_type = determineDeviceType(part);
                out.device_family = uaParts.device.family;
                out.browser = uaParts.family;
                out.browser_major_version = uaParts.major;
                out.os = uaParts.os.family;
                out.os_major_version = uaParts.os.major;
                out.os_minor_version = uaParts.os.minor;


            } else if (format[i] === 'referer_url') {
                if (!part || part === '-') return;

                let parsed = new Url(part, true);
                // console.log(part, '->', parsed.protocol, parsed.host, parsed.pathname);

                out.referer_protocol = parsed.protocol;
                out.referer_pathname = parsed.pathname;
                out.referer_host = parsed.host;


            } else if (format[i] === 'url') {
                if (!part || part === '-') return;

                let parsed = new Url(part, true);
                // console.log(part, '->', parsed.protocol, parsed.host, parsed.pathname);

                // console.log(parsed);
                // parsed.query.url

                out.protocol = parsed.protocol;
                out.pathname = parsed.pathname;
                out.host = parsed.host;

                if (parsed.query.url) {
                    parsed = new Url(parsed.query.url, true);

                    out.protocol = parsed.protocol;
                    out.pathname = parsed.pathname;
                    out.host = parsed.host;
                }
            }
        });

        if (!out.referer_host) out.referer_host = '';
        out.status_code = parseInt(out.status_code);
        // delete out.unique_request_id;
        delete out.cache_status;
        delete out.pull_zone_id;
        delete out.user_agent;
        delete out.bytes_sent;

        if (debug) console.log(out);

        insertMany(out);
    });

    // Vacuum (again)
    let stmt = db.prepare(`vacuum;`);
    stmt.run();
}

// Read Test data from local log file
// const logs = fs.readFileSync('./478037.log', { flags: 'r', encoding: 'utf-8', autoClose: true });
// Parse the example logs
// parseLogs(logs);

// Fetch today's logs from Bunny CDN
const D = new Date();
// const yesterday = new Date(D);
// yesterday.setDate(yesterday.getDate() - 1);
let iso_date = `${ D.toISOString().slice(5, 10) }-${ D.toISOString().slice(2, 4) }`;

if (process.env.PULL_ZONE_ID && process.env.ACCESS_KEY && iso_date) {
    console.log('Downloading latest log data from Bunny CDN');

    request.get(`https://logging.bunnycdn.com/${ iso_date }/${ process.env.PULL_ZONE_ID }.log`)
        .set('AccessKey', process.env.ACCESS_KEY)
        .set('accept', 'json')
        .end((err, res) => {
            console.log('Parsing today\'s logs & Updating Database');
            parseLogs(res.text);
        });
}
