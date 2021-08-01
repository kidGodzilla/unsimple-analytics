# Implausible Analytics

A simple analytics implementation that collects and serves data from a static CDN, using web workers, WASM, range requests, and some other fun tricks.

![Screenshot](screenshot.jpg)

## Inspiration

[Hosting SQLite databases on Github Pages](https://phiresky.netlify.app/blog/2021/hosting-sqlite-databases-on-github-pages/) | [Discussion](https://news.ycombinator.com/item?id=28015980)

[Plausible Analytics](https://plausible.io/plausible.io)


## How It Works

1. A ["Snowplow-style Collector"](https://docs.snowplowanalytics.com/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-the-snowplow-collector/) is set up on a CDN (Bunny CDN in our case), to capture traffic data via requests to a transparent image (`o.png`), in our CDN's own log file format.
2. A job runs every 2 hours to download these log files, process them, and output the results in a SQLite database, which is stored statically & accessible to the public via range requests.
3. Our simple frontend uses `sql.js` and [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) to query `analytics.sqlite3` (which is a static file hosted on a CDN).

Our entire Analytics implementation (collection - storage) is handled by static CDNs.

## Demo

You can view a public demo here:

https://analytics.serv.rs/

## Install on your Own Site

You can install on your own site, and then view your public analytics data on https://analytics.serv.rs/

```html
<script src="https://analytics.serv.rs/a.js"></script>
```

Note: this is a toy project. It might be fun and handle a lot of data, but it isn't well reviewed and probably isn't very accurate or useful.

## Todo

- [ ] Setup a GitHub Action to run the batch processing job (instead of doing it on a server) for a "more static, more serverless" experience.
