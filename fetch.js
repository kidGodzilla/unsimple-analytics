require('dotenv').config();

const MobileDetect = require('mobile-detect');
const syncViaFtp = require('sync-via-ftp');
const Database = require('better-sqlite3');
const uaparser = require('ua-parser');
const request = require('superagent');
const Url = require('url-parse');
const fs = require('fs');
let _persistTimer = 0;
let debug = 0;
let drop = 0;
let db;

// Make a backup of the SQLite database
fs.copyFileSync('public/analytics.sqlite3', 'analytics.sqlite3');
console.log('Making db backup');

function ready(persist, destroy) {
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

            if (!(parts[7] || '').includes('/o.png')) return;

            // referrer host href width bot headless
            let parsed = new Url(parts[7], true);
            if (parsed.query.href) {
                if (parsed.query.headless) out.headless = parseInt(parsed.query.headless);
                if (parsed.query.width) out.width = parseInt(parsed.query.width);
                if (parsed.query.bot) out.bot = parseInt(parsed.query.bot);
                if (parsed.query.event) out.event = parsed.query.event;
                if (parsed.query.value) out.value = parsed.query.value;
                if (parsed.query.lang) out.lang = parsed.query.lang;
                if (parsed.query.href) parts[7] = parsed.query.href;

                out.session = parseInt(parsed.query.session);
                out.is_new = parseInt(parsed.query.new);

                if (parsed.query.time) out.session_length = parseFloat(parsed.query.time);
                if (parsed.query.views) out.pageviews = parseInt(parsed.query.views);
                if (parsed.query.load) out.load_time = parseFloat(parsed.query.load);

                parts[6] = parsed.query.referrer || '';
            }

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
                    out.browser_minor_version = uaParts.minor;
                    out.os = uaParts.os.family;
                    out.os_major_version = uaParts.os.major;
                    out.os_minor_version = uaParts.os.minor;


                } else if (format[i] === 'referer_url') {
                    if (!part || part === '-') return;

                    parsed = new Url(part, true);
                    // console.log(part, '->', parsed.protocol, parsed.host, parsed.pathname);

                    out.referer_protocol = parsed.protocol;
                    out.referer_pathname = parsed.pathname;
                    out.referer_host = parsed.host;


                } else if (format[i] === 'url') {
                    if (!part || part === '-') return;

                    parsed = new Url(part, true);
                    // console.log(part, '->', parsed.protocol, parsed.host, parsed.pathname);

                    // console.log(parsed);
                    // parsed.query.url

                    out.protocol = parsed.protocol;
                    out.pathname = parsed.pathname;
                    out.host = parsed.host;

                    if (parsed.query.href) {
                        parsed = new Url(parsed.query.href, true);

                        out.protocol = parsed.protocol;
                        out.pathname = parsed.pathname;
                        out.host = parsed.host;
                    }

                    if (out.host.indexOf('www.') === 0) out.host = out.host.replace('www.', '');
                }
            });

            if (!out.session_length) out.session_length = 0;
            if (!out.referer_host) out.referer_host = '';
            out.status_code = parseInt(out.status_code);
            if (!out.event) out.event = 'pageview';
            if (!out.pageviews) out.pageviews = 0;
            if (!out.load_time) out.load_time = 0;
            if (!out.headless) out.headless = 0;
            if (!out.session) out.session = 0;
            if (!out.is_new) out.is_new = 0;
            if (!out.value) out.value = '';
            if (!out.width) out.width = 0;
            if (!out.lang) out.lang = '';
            if (!out.bot) out.bot = 0;


            delete out.pull_zone_id;
            delete out.cache_status;
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

    // Get logs based on a date object
    function getLogs(D, callback) {
        if (!D) return;

        if (typeof D === 'string' || typeof D === 'number') D = new Date(D);

        let iso_date = `${ D.toISOString().slice(5, 10) }-${ D.toISOString().slice(2, 4) }`;

        if (process.env.PULL_ZONE_ID && process.env.ACCESS_KEY && iso_date) {
            console.log(`Downloading (${ iso_date }) log data from Bunny CDN`);
            let rand = (Math.random() + 1).toString(36).substring(5);

            request.get(`https://logging.bunnycdn.com/${ iso_date }/${ process.env.PULL_ZONE_ID }.log?v=${ rand }`)
                .set('AccessKey', process.env.ACCESS_KEY)
                .set('accept', 'json')
                .end((err, res) => {
                    console.log(`Parsing ${ iso_date } logs & Updating Database`);
                    parseLogs(res.text);

                    if (callback && typeof callback === 'function') callback();
                });
        }
    }

    function constructDb() {
        // setTimeout(() => {}, 1234);

        // Use SQLite3 Database
        db = new Database('public/analytics.sqlite3'); // , { verbose: console.log }

        // Drop previous `visits` table
        let stmt = db.prepare(`DROP TABLE visits`);
        if (drop) {
            console.log('Dropping previous visits table');
            stmt.run();
        }
    }

    try {
        constructDb();
    } catch(e) {
        // Restore backup
        console.log('error:', e, '\n');
        console.log('Restoring backup');
        fs.copyFileSync('analytics.sqlite3', 'public/analytics.sqlite3');
        constructDb();
    }

    // Optional Recommended Improvements
    stmt = db.prepare(`pragma journal_mode = delete;`);
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
        url TEXT,
        event TEXT,
        value TEXT,
        protocol TEXT,
        pathname TEXT,
        host TEXT,
        device_type TEXT,
        device_family TEXT,
        browser TEXT,
        browser_major_version TEXT,
        browser_minor_version TEXT,
        os TEXT,
        os_major_version TEXT,
        os_minor_version TEXT,
        country_code TEXT,
        referer_host TEXT,
        headless INTEGER,
        bot INTEGER,
        width INTEGER,
        session_length REAL,
        pageviews INTEGER,
        load_time REAL,
        lang TEXT,
        edge_location TEXT,
        session REAL,
        is_new REAL
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
        url,
        event,
        value,
        protocol, 
        pathname, 
        host, 
        device_type, 
        device_family, 
        browser, 
        browser_major_version, 
        browser_minor_version, 
        os, 
        os_major_version, 
        os_minor_version, 
        country_code,
        referer_host,
        headless,
        bot,
        width,
        session_length,
        pageviews,
        load_time,
        lang,
        edge_location,
        session,
        is_new
    ) VALUES (
        @unique_request_id, 
        @iso_date,
        @timestamp,
        @remote_ip,
        @url,
        @event,
        @value,
        @protocol, 
        @pathname, 
        @host, 
        @device_type, 
        @device_family, 
        @browser, 
        @browser_major_version, 
        @browser_minor_version, 
        @os, 
        @os_major_version, 
        @os_minor_version, 
        @country_code,
        @referer_host,
        @headless,
        @bot,
        @width,
        @session_length,
        @pageviews,
        @load_time,
        @lang,
        @edge_location,
        @session,
        @is_new
    )`);

    // Insert one or many function
    const insertMany = db.transaction(rows => {
        if (Array.isArray(rows)) {
            for (const row of rows) insert.run(row);
        } else {
            insert.run(rows);
        }
    });

    // Fetch a whole 30 days of logs because apparently I'm too stupid to figure out why it fails
    for (var i = 0; i < 31; i++) {
        let thisD = new Date();
        if (i) thisD = thisD.setDate(thisD.getDate() - i);

        getLogs(thisD, () => {

            clearTimeout(_persistTimer);

            _persistTimer = setTimeout(() => {

                persist(() => {
                    try { destroy() } catch(e){ console.log(e) } // process.exit()
                });

            }, 2345 + (i * 50));

        });
    }
}

module.exports = { ready };