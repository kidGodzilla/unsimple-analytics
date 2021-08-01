import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);

const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "http://localhost:5001/analytics.sqlite3",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  function $(selector) {
    return document.querySelector(selector) || {}
  }

  function tableFragment(o) {
    let fragment = '', min = 0, max = 0, lines = [];

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
    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: ${ (v / max) * 85 }%">&nbsp;${ k }</div>
    <span class="float-right text-right pt-1">${ v }</span>
</div>`;
    });


    return fragment;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // let statement = `SELECT * FROM visits WHERE date BETWEEN '${ yesterday.toISOString().slice(0,10) }' AND '${ today.toISOString().slice(0,10) }'`;
  let statement = `SELECT * FROM visits WHERE date = '${ yesterday.toISOString().slice(0,10) }'`;
  console.log(statement);

  const result = await worker.db.query(statement);

  $('div pre').textContent = JSON.stringify(result, null, 2);

  // Aggregate results
  let map = {};
  let referrers = {};
  let countries = {};
  let pathnames = {};
  let pageviews = 0;
  let visitors = [];
  let browsers = {};
  let types = {};
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
    incr(map, h);

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

    // Countries
    if (!countries[item.country_code]) countries[item.country_code] = { visitors: 0 };
    countries[item.country_code].visitors++;

    // Pageviews & Visitors
    // @ts-ignore
    if (!visitors.includes(item.ip)) visitors.push(item.ip);
    pageviews++;
  });

  let data = [];

  for (let i = 0; i < 23; i++) {
    // @ts-ignore
    data.push({ hour: `${ yesterday.toISOString().slice(0,10) } ${ i }:00`, value: (map[i] || 0) });
  }

  // console.log(map, data, referrers, browsers, pathnames, os, types, pageviews, visitors.length);

  $('.referrers').innerHTML = tableFragment(referrers);
  $('.browsers').innerHTML = tableFragment(browsers);
  $('.pages').innerHTML = tableFragment(pathnames);
  $('.devices').innerHTML = tableFragment(types);
  $('.os').innerHTML = tableFragment(os);


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

  // Pageviews & Visitors
  $('.visitors').textContent = visitors.length;
  $('.pageviews').textContent = pageviews;

}

load();
