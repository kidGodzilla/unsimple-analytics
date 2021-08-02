import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL("sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  let url = (location.hostname === 'localhost' ? `${ location.protocol }//${ location.host }/` : 'https://analytics.serv.rs/') + `analytics.sqlite3`;
  // console.log('url', url);

  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: url,
          requestChunkSize: 1024
        }
      }
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  function $(selector) {
    return document.querySelector(selector) || {}
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function tableFragment(o, keyFormatter = s => s, valueFormatter = s => s) {
    let fragment = '', max = 0, lines = [];

    for (let k in o) {
      let v = o[k];
      if (max < v) max = v;

      // @ts-ignore
      lines.push({ k, v });
    }

    // @ts-ignore
    lines.sort((b, a) => a.v > b.v && 1 || -1)

    lines.forEach(line => {
      // @ts-ignore
      let { v, k } = line;

      fragment += `
<div class="mb-1">
    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: ${ (v / max) * 85 }%">&nbsp;${ keyFormatter(k) }</div>
    <span class="float-right text-right pt-1">${ valueFormatter(v) }</span>
</div>`;
    });

    return fragment;
  }

  function daysAgo(n) {
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
  }

  function isoDate(d) {
    if (!d) d = new Date();
    if (typeof d !== 'object' || !d.toISOString) d = new Date(d);
    return d.toISOString().slice(0,10);
  }

  async function render(start, end) {
    let host = new URLSearchParams(window.location.search).get('host') || 'analytics.serv.rs' || 'unsimple.b-cdn.net';
    if (host.indexOf('www.') === 0) host = host.replace('www.', '');
    $('h5.name').textContent = capitalize(host);

    let statement = `SELECT * FROM visits WHERE host = '${ host }' AND date BETWEEN '${ isoDate(start) }' AND '${ isoDate(end) }'`;
    let hourly = Math.floor(start / 10000) === Math.floor(end / 10000);
    // console.log(statement, hourly, start, end);

    const result = await worker.db.query(statement);

    // Cleanup Loading Spinners / previous output
    $('.browsers').innerHTML = '';
    $('.devices').innerHTML = '';
    $('#svgMap').innerHTML = '';
    $('#visits').innerHTML = '';
    $('.pages').innerHTML = '';
    $('.os').innerHTML = '';

    // Debug / Demo output
    $('div pre').textContent = JSON.stringify(result, null, 2);

    // Aggregate results
    let maxSessionLength = {};
    let pageVisits = {};
    let referrers = {};
    let countries = {};
    let pathnames = {};
    let pageviews = 0;
    let visitors = [];
    let browsers = {};
    let types = {};
    let map = {};
    let os = {};

    // console.log(result);

    function incr(o, k) {
      if (!o[k]) o[k] = 0;
      o[k]++;
    }

    result.forEach(item => {
      let d = new Date(item.ts * 1000);
      let h = d.getHours();

      // Aggregate
      incr(map, hourly ? h : isoDate(d));

      // referrers
      incr(referrers, item.referer_host);

      // Device type
      incr(types, item.device_type);

      // OS
      incr(os, item.os);

      // Browser
      incr(browsers, item.browser);

      // Pathnames
      incr(pathnames, item.pathname);

      // Session length
      if (item.session_length && (!maxSessionLength[item.ip] || maxSessionLength[item.ip] < item.session_length))
        maxSessionLength[item.ip] = item.session_length;

      // Page visits pageVisits
      if (!pageVisits[item.ip]) pageVisits[item.ip] = 0
      pageVisits[item.ip]++;

      // Countries
      if (!countries[item.country_code]) countries[item.country_code] = { visitors: 0 };
      countries[item.country_code].visitors++;

      // Pageviews & Visitors
      // @ts-ignore
      if (!visitors.includes(item.ip)) visitors.push(item.ip);
      pageviews++;
    });

    // Calculate average session duration
    let avgSessionLength = 0, counter = 0;
    for (let k in maxSessionLength) {
      avgSessionLength += maxSessionLength[k];
      counter++;
    }
    if (counter) avgSessionLength = avgSessionLength / counter;
    // console.log(maxSessionLength, avgSessionLength, counter);

    // Calculate Bounce Rate
    let onePageVisits = 0, visitorCount = visitors.length;
    for (let k in pageVisits) {
      if (pageVisits[k] === 1)
        onePageVisits++;
    }
    let bounceRate = onePageVisits / visitorCount;
    // console.log(pageVisits, bounceRate, onePageVisits, visitorCount)

    let data = [];

    if (hourly) {
      for (let i = 0; i < 23; i++) {
        // @ts-ignore
        data.push({ hour: `${ isoDate(start) } ${ i }:00`, value: (map[i] || 0) });
      }
    } else {
      for (let k in map) {
        // @ts-ignore
        data.push({ hour: `${ k }`, value: (map[k] || 0) });
      }
    }

    // console.log(map, data, referrers, browsers, pathnames, os, types, pageviews, visitors.length);

    $('.referrers').innerHTML = tableFragment(referrers, s => s ? `<img src="https://logo.clearbit.com/${ s }" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a href="http://${ s }" target="_blank">${ s }</a>` : 'Direct / None');
    $('.pages').innerHTML = tableFragment(pathnames, s => `<a href="http://${ 'unsimple.b-cdn.net' }${ s }" target="_blank">${ s }</a>`);
    $('.devices').innerHTML = tableFragment(types, s => s.charAt(0).toUpperCase() + s.slice(1));
    $('.browsers').innerHTML = tableFragment(browsers);
    $('.os').innerHTML = tableFragment(os);

    function renderCharts() {
      $('#svgMap').innerHTML = '';
      $('#visits').innerHTML = '';

      // @ts-ignore
      new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'visits',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: data || [
          { year: '2008', value: 20 },
          { year: '2009', value: 10 },
          { year: '2010', value: 5 },
          { year: '2011', value: 5 },
          { year: '2012', value: 20 }
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'hour',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Visits']
      });

      // SVG Map
      // @ts-ignore
      new svgMap({
        targetElementID: 'svgMap',
        data: {
          data: {
            visitors: {
              name: 'visitors',
              format: '{0}',
              thousandSeparator: ',',
              // thresholdMax: 50000,
              // thresholdMin: 1000
            }
          },
          applyData: 'visitors',
          values: countries || {
            AF: { visitors: 587 },
            AL: { visitors: 4583 },
            DZ: { visitors: 4293 }
          }
        }
      });
    }

    window.addEventListener('resize', () => {
      setTimeout(renderCharts, 555)
    });
    renderCharts();

    function fmtMSS(s) { return(s-(s%=60))/60+(9<s?':':':0')+s }

    // Pageviews, Visitors, Bounce Rate, Duration
    $('.visitors').textContent = visitors.length;
    $('.pageviews').textContent = pageviews;
    $('.duration').textContent = avgSessionLength ? fmtMSS(avgSessionLength) + 's' : '-';
    $('.bounced').textContent = (bounceRate * 100).toFixed(2) + '%';
  }

  // Start by rendering yesterday's data
  render(daysAgo(0), daysAgo(0));

  // @ts-ignore
  window.daysAgo = daysAgo;
  // @ts-ignore
  window.render = render;
}

load();
