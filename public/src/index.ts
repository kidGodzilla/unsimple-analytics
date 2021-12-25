import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL("sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);
let renderTime = 0;

async function load() {
  // let url = (location.hostname === 'localhost' ? `${ location.protocol }//${ location.host }/` : 'https://analytics.serv.rs/') + `analytics.sqlite3`;
  let url = `${ location.protocol }//${ location.host }/analytics.sqlite3`;

  // if (location.hostname !== 'localhost') url = 'https://implausible.b-cdn.net/analytics.sqlite3'; // Does not seem to support range requests (`Accept-Ranges: bytes` header missing)
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
    lines.sort((b, a) => a.v > b.v && 1 || -1);

    lines.forEach((line, i) => {
      if (i > 9) return;

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
    let host = new URLSearchParams(window.location.search).get('host') || 'analytics.serv.rs';
    if (host.indexOf('www.') === 0) host = host.replace('www.', '').toLowerCase();
    $('h5.name').textContent = capitalize(host);

    let statement = `SELECT * FROM visits WHERE host = '${ host }' AND date BETWEEN '${ isoDate(start) }' AND '${ isoDate(end) }'`;
    // let statement = `SELECT * FROM visits WHERE host = '${ host }'`;
    let hourly = Math.floor(start / 10000) === Math.floor(end / 10000);
    // console.log(statement, hourly, start, end);

    let result = await worker.db.query(statement);
    result = result.sort((a, b) => a.ts > b.ts && 1 || -1);
    console.log('query result', result);

    // Cleanup Loading Spinners / previous output
    $('.loadtimes').innerHTML = '';
    $('.languages').innerHTML = '';
    $('.browsers').innerHTML = '';
    $('.devices').innerHTML = '';
    $('#svgMap').innerHTML = '';
    $('#visits').innerHTML = '';
    $('.pages').innerHTML = '';
    $('.bots').innerHTML = '';
    $('.new').innerHTML = '';
    $('.os').innerHTML = '';

    // Debug / Demo output
    $('div pre').textContent = JSON.stringify(result, null, 2);

    // Aggregate results
    let utm = { source: { None: 0 }, medium: { None: 0 }, content: { None: 0 }, campaign: { None: 0 }, term: { None: 0 } };
    let maxSessionLength = {};
    let pageVisits = {};
    let referrers = {};
    let languages = {};
    let countries = {};
    let pathnames = {};
    let loadTimes = {};
    let pageviews = 0;
    let visitors = [];
    let browsers = {};
    let botUsers = {};
    let isNew = {};
    let edges = {};
    let types = {};
    let map = {};
    let os = {};

    // console.log(result);

    function incr(o, k, v = 1) {
      if (!o[k]) o[k] = 0;
      o[k] += v;
    }

    function determineType(w, reported, type = '') {
      if (w <= 600) type = 'mobile';
      else if (w <= 992) type = 'tablet';
      else if (w <= 1440) type = 'laptop';
      else type = 'desktop';
      // console.log('reported:', reported, 'determined:', type, w);
      return type;
    }

    function lang(s) {
      let langLookup = {"aa":"Afar","ab":"Abkhazian","ae":"Avestan","af":"Afrikaans","ak":"Akan","am":"Amharic","an":"Aragonese","ar":"Arabic","as":"Assamese","av":"Avaric","ay":"Aymara","az":"Azerbaijani","ba":"Bashkir","be":"Belarusian","bg":"Bulgarian","bh":"Bihari languages","bi":"Bislama","bm":"Bambara","bn":"Bengali","bo":"Tibetan","br":"Breton","bs":"Bosnian","ca":"Catalan; Valencian","ce":"Chechen","ch":"Chamorro","co":"Corsican","cr":"Cree","cs":"Czech","cu":"Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","cv":"Chuvash","cy":"Welsh","da":"Danish","de":"German","dv":"Divehi; Dhivehi; Maldivian","dz":"Dzongkha","ee":"Ewe","el":"Greek, Modern (1453-)","en":"English","eo":"Esperanto","es":"Spanish; Castilian","et":"Estonian","eu":"Basque","fa":"Persian","ff":"Fulah","fi":"Finnish","fj":"Fijian","fo":"Faroese","fr":"French","fy":"Western Frisian","ga":"Irish","gd":"Gaelic; Scomttish Gaelic","gl":"Galician","gn":"Guarani","gu":"Gujarati","gv":"Manx","ha":"Hausa","he":"Hebrew","hi":"Hindi","ho":"Hiri Motu","hr":"Croatian","ht":"Haitian; Haitian Creole","hu":"Hungarian","hy":"Armenian","hz":"Herero","ia":"Interlingua (International Auxiliary Language Association)","id":"Indonesian","ie":"Interlingue; Occidental","ig":"Igbo","ii":"Sichuan Yi; Nuosu","ik":"Inupiaq","io":"Ido","is":"Icelandic","it":"Italian","iu":"Inuktitut","ja":"Japanese","jv":"Javanese","ka":"Georgian","kg":"Kongo","ki":"Kikuyu; Gikuyu","kj":"Kuanyama; Kwanyama","kk":"Kazakh","kl":"Kalaallisut; Greenlandic","km":"Central Khmer","kn":"Kannada","ko":"Korean","kr":"Kanuri","ks":"Kashmiri","ku":"Kurdish","kv":"Komi","kw":"Cornish","ky":"Kirghiz; Kyrgyz","la":"Latin","lb":"Luxembourgish; Letzeburgesch","lg":"Ganda","li":"Limburgan; Limburger; Limburgish","ln":"Lingala","lo":"Lao","lt":"Lithuanian","lu":"Luba-Katanga","lv":"Latvian","mg":"Malagasy","mh":"Marshallese","mi":"Maori","mk":"Macedonian","ml":"Malayalam","mn":"Mongolian","mr":"Marathi","ms":"Malay","mt":"Maltese","my":"Burmese","na":"Nauru","nb":"Bokmål, Norwegian; Norwegian Bokmål","nd":"Ndebele, North; North Ndebele","ne":"Nepali","ng":"Ndonga","nl":"Dutch; Flemish","nn":"Norwegian Nynorsk; Nynorsk, Norwegian","no":"Norwegian","nr":"Ndebele, South; South Ndebele","nv":"Navajo; Navaho","ny":"Chichewa; Chewa; Nyanja","oc":"Occitan (post 1500)","oj":"Ojibwa","om":"Oromo","or":"Oriya","os":"Ossetian; Ossetic","pa":"Panjabi; Punjabi","pi":"Pali","pl":"Polish","ps":"Pushto; Pashto","pt":"Portuguese","qu":"Quechua","rm":"Romansh","rn":"Rundi","ro":"Romanian; Moldavian; Moldovan","ru":"Russian","rw":"Kinyarwanda","sa":"Sanskrit","sc":"Sardinian","sd":"Sindhi","se":"Northern Sami","sg":"Sango","si":"Sinhala; Sinhalese","sk":"Slovak","sl":"Slovenian","sm":"Samoan","sn":"Shona","so":"Somali","sq":"Albanian","sr":"Serbian","ss":"Swati","st":"Sotho, Southern","su":"Sundanese","sv":"Swedish","sw":"Swahili","ta":"Tamil","te":"Telugu","tg":"Tajik","th":"Thai","ti":"Tigrinya","tk":"Turkmen","tl":"Tagalog","tn":"Tswana","to":"Tonga (Tonga Islands)","tr":"Turkish","ts":"Tsonga","tt":"Tatar","tw":"Twi","ty":"Tahitian","ug":"Uighur; Uyghur","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","ve":"Venda","vi":"Vietnamese","vo":"Volapük","wa":"Walloon","wo":"Wolof","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","za":"Zhuang; Chuang","zh":"Chinese","zu":"Zulu"};
      try { s = s.toLowerCase().split('-')[0] } catch(e){}
      try { s = langLookup[s] } catch(e){}
      if (!s || s == 'undefined') s = 'Unknown';
      return s;
    }

    // Construct directed graph
    let nodes = [], usedNodes = [] as any, sessions = {}, links = {}, idLookup = {} as any, linkArray = [] as any, linkRows = [] as any;

    result.forEach(item => {
      let d = new Date(item.ts * 1000);
      let h = d.getUTCHours();

      // Aggregate
      incr(map, hourly ? h : isoDate(d));

      // referrers
      incr(referrers, item.referer_host);

      // Device type
      // incr(types, item.device_type);
      incr(types, determineType(item.width, item.device_type));

      // OS
      incr(os, item.os);

      // Edge Locations
      incr(edges, item.edge_location);

      // Browser
      incr(browsers, item.browser);

      // Language
      incr(languages, lang(item.lang));

      // Pathnames
      incr(pathnames, item.pathname);

      // Load times
      incr(loadTimes, item.pathname, Math.max(item.load_time, 0));

      // New vs. returning
      incr(isNew, item.is_new);

      // Bot users, headless users
      incr(botUsers, item.headless ? 'Headless Browsers' : (item.bot ? 'Bots' : 'Normal Users'));

      // UTM codes
      function getUTM(namespace = 'source', url = '') {
        let value = (new URLSearchParams(new URL(url.toLowerCase()).search)).get('utm_'+namespace);

        if (value) {
          // @ts-ignore
          if (!utm[namespace][value]) utm[namespace][value] = 0;
          utm[namespace][value]++;
        } else {
          utm[namespace]['None']++;
        }
      }
      getUTM('source', item.url);
      getUTM('medium', item.url);
      getUTM('content', item.url);
      getUTM('campaign', item.url);
      getUTM('term', item.url);

      // Nodes, sessions, and Links
      // @ts-ignore
      if (!nodes.includes(item.pathname)) nodes.push(item.pathname);
      if (!sessions[item.ip]) sessions[item.ip] = [];
      sessions[item.ip].push(item.pathname);

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

    // console.log('botUsers', botUsers);
    // console.log('utm', utm);

    // Todo: compute load times
    let computedLoadTimes = {};
    for (let k in loadTimes) {
      let total = loadTimes[k];
      computedLoadTimes[k] = total / pathnames[k];
    }
    // console.log('loadTimes', loadTimes, pathnames, computedLoadTimes);

    // Format sankey nodes
    let nodes2 = [] as any;
    nodes.forEach((node, i) => {
      nodes2.push({ id: i, name: node, color: "green" });
      idLookup[node] = i;
    });
    nodes = nodes2;

    // Remove repeating duplicates
    for (let ip in sessions) {
      let session = sessions[ip], reduced = [] as any, last;

      session.forEach(item => {
        if (last !== item) reduced.push(item);
        last = item;
      });

      sessions[ip] = reduced;
    }

    let sessions2 = JSON.parse(JSON.stringify(sessions));
    // console.log('sessions', sessions2);

    // Accumulate connections
    for (let ip in sessions) {
      let session = sessions[ip], current, previous;

      while(session.length) {
        current = session.shift();

        if (previous && current && !usedNodes.includes(previous) && !usedNodes.includes(current)) {
          // console.log('link', previous, current);

          if (!links[previous]) links[previous] = {};
          if (!links[previous][current]) links[previous][current] = 0;
          links[previous][current]++;
          usedNodes.push(current);
        }

        previous = current;
      }
    }

    // Accumulate connections (method 2)
    let graph = [[] as any, [] as any, [] as any, [] as any, [] as any];
    for (let ip in sessions2) {
      let session = sessions2[ip], previous;

      session.forEach((item, i) => {
        if (previous && i <= 5) {
          let link = `${ previous } ${ item }`;
          graph[i-1].push(link);
        }

        previous = item;
      });
    }
    // console.log('graph', graph);

    // Create an alternate directed graph (method 2)
    let graphLinks = [] as any, graph2 = {};

    graph.forEach((graphItem, i) => {
      graphItem.forEach((graphItem, j) => {
        let p = graphItem.split(' ');
        let ps = `Step ${ i+1 }: ${ p[0] }=Step ${ i+2 }: ${ p[1] }`;
        if (!graph2[ps]) graph2[ps] = 0;
        graph2[ps]++;
      });
    });

    for (let k in graph2) {
      let v = graph2[k];
      let p = k.split('=');
      graphLinks.push([ p[0], p[1], v ]);
    }

    // console.log('graphLinks', graph2, graphLinks);

    // Create directed graph
    for (let j in links) {
      let o = links[j];

      for (let k in o) {
        if (j != k) {
          linkArray.push({ source: idLookup[j], target: idLookup[k], value: o[k] });
          linkRows.push([ j, k, o[k] ]);
        }
      }
    }

    // console.log('dg', nodes, linkArray, linkRows);

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
        data.push({ hour: `${ isoDate(start) }T${ i }:00Z`, value: (map[i] || 0) });
      }
    } else {
      for (let k in map) {
        // @ts-ignore
        data.push({ hour: `${ k }`, value: (map[k] || 0) });
      }
    }

    function humanSeconds(n) {
      if (n < 1) return Math.round(n * 1000)+'ms';
      else return n.toFixed(2)+'s';
    }

    // console.log(map, data, edges, referrers, browsers, pathnames, os, types, languages, pageviews, visitors.length);
    let typeTooltips = { mobile: 'below 600px', tablet: '600px to 992px', laptop: '992px to 1440px', desktop: 'above 1440px' };

    $('.referrers').innerHTML = tableFragment(referrers, s => s ? `<img src="https://logo.clearbit.com/${ s }" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://${ s }" target="_blank">${ s }</a>` : 'Direct / None');
    $('.devices').innerHTML = tableFragment(types, s => `<span class="cursor-help" data-bs-toggle="tooltip" data-bs-placement="top" title="${ typeTooltips[s] }">${ s.charAt(0).toUpperCase() + s.slice(1) }</span>`);
    $('.loadtimes').innerHTML = tableFragment(computedLoadTimes, s => `<a class="d-inline-block text-truncate" href="http://${ host }${ s }" target="_blank">${ s }</a>`, s => humanSeconds(s));
    $('.pages').innerHTML = tableFragment(pathnames, s => `<a class="d-inline-block text-truncate" href="http://${ host }${ s }" target="_blank">${ s }</a>`);
    $('.languages').innerHTML = tableFragment(languages, s => s ? s : 'Unknown');
    $('.new').innerHTML = tableFragment(isNew, s => parseInt(s) ? 'New' : 'Returning');
    $('.campaign').innerHTML = tableFragment(utm.campaign);
    $('.browsers').innerHTML = tableFragment(browsers);
    $('.medium').innerHTML = tableFragment(utm.medium);
    $('.source').innerHTML = tableFragment(utm.source);
    $('.bots').innerHTML = tableFragment(botUsers);
    $('.os').innerHTML = tableFragment(os);


    // Attach tooltips
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      // @ts-ignore
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    function renderCharts() {
      $('#sankey_multiple').innerHTML = '';
      $('#svgMap').innerHTML = '';
      $('#visits').innerHTML = '';

      // @ts-ignore
      new Morris.Area({
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
        xLabels: hourly ? 'hour' : 'day',
        dateFormat: function (x) { return hourly ? new Date(x).toString() : new Date(x).toLocaleString().split(',')[0] },
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Visits'],
        lineWidth: 4,
        pointSize: 5,
        fillOpacity: 0.16,
        lineColors: ['#2847b7', '#3459E6', '#1a2c72']
        // smooth: false
      });

      // SVG Map
      // @ts-ignore
      new svgMap({
        targetElementID: 'svgMap',
        colorMax: '#3459E6',
        colorMin: '#c7d2fc',
        colorNoData: '#E2E2E2',
        data: {
          data: {
            visitors: {
              name: 'visitors',
              format: '{0}',
              thousandSeparator: ','
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

      if (linkArray.length > 1) {
        // console.log('sankey-ing', nodes, linkArray, linkRows);

        // @ts-ignore
        google.charts.load("current", {packages:["sankey"]});
        // @ts-ignore
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          // @ts-ignore
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'From');
          data.addColumn('string', 'To');
          data.addColumn('number', 'Sessions');
          data.addRows(graphLinks);

          // Instantiate and draw our chart, passing in some options.
          // @ts-ignore
          var chart = new google.visualization.Sankey(document.getElementById('sankey_multiple'));
          chart.draw(data);
        }

        // @ts-ignore
        // var d3 = window.d3, objSankey = window.objSankey = sk.createSankey('#sankeyChart', {
        //   margin: { top: 10, left: 0, right: 0, bottom: 0 },
        //   nodes: {
        //     dynamicSizeFontNode: {
        //       enabled: true,
        //       minSize: 14,
        //       maxSize: 30
        //     },
        //     fontSize: 14, // if dynamicSizeFontNode not enabled
        //     draggableX: false, // default [ false ]
        //     draggableY: true, // default [ true ]
        //     colors: d3.scaleOrdinal(d3.schemeCategory10)
        //   },
        //   links: {
        //     formatValue: function(val) {
        //       return d3.format(",.0f")(val) + ' user(s)';
        //     },
        //     unit: 'user(s)' // if not set formatValue function
        //   },
        //   tooltip: {
        //     infoDiv: true,  // if false display default tooltip
        //     labelSource: 'Input:',
        //     labelTarget: 'Output:'
        //   }
        // }, {
        //   nodes: nodes || [
        //     {id: 0, name: "Alice", color: "green"},
        //     {id: 1, name: "Bob", color: "yellow"},
        //     {id: 2, name: "Carol", color: "blue"}
        //   ],
        //   links: linkArray || [
        //     {source: 0, target: 1, value: 1},
        //     {source: 1, target: 2, value: 1}
        //   ]
        // });

        $('.userflow').classList.remove('d-none');
      } else {
        $('.userflow').classList.add('d-none');
      }
    }

    window.addEventListener('resize', () => {
      setTimeout(renderCharts, 555)
    });

    renderCharts();

    function fmtMSS(s) { return(s-(s%=60))/60+('m ')+parseInt(s) }
    avgSessionLength = parseFloat(avgSessionLength.toFixed(2));

    // Pageviews, Visitors, Bounce Rate, Duration
    $('.visitors').textContent = visitors.length;
    $('.pageviews').textContent = pageviews;
    $('.duration').textContent = avgSessionLength ? (avgSessionLength < 60 ? avgSessionLength : fmtMSS(avgSessionLength)) + 's' : '-';
    $('.bounced').textContent = (bounceRate ? (bounceRate * 100).toFixed(2) : 0) + '%';

    // Render complete
    renderTime = renderTime || window.performance.now() / 1000;
    console.log('page rendered in', renderTime+'s');
    // Todo: send this somewhere I can analyze
  }

  // Render data for the currently-selected time range
  function renderCurrentRange() {
    let range = new URLSearchParams(window.location.search).get('range') || 1;
    // @ts-ignore
    let currentRange = ranges[range];
    render(daysAgo(currentRange[1]), daysAgo(currentRange[2]));
    $('.dropdown-toggle.right').textContent = currentRange[0];
  }

  setInterval(renderCurrentRange, 15 * 60 * 1000); // 15 minute refresh interval
  renderCurrentRange();

  // Get alternate domains to build dropdown menu
  let res = await worker.db.query(`SELECT DISTINCT host FROM visits`), domains = [], fragment = '';

  // @ts-ignore
  res.forEach(item => domains.push(item.host));
  domains.sort();

  // Build dropdown menu HTML fragment
  domains.forEach((domain, i) => {
    // @ts-ignore
    if (!domain.includes('meetingroom365') && !domain.includes('localhost') && i < 14) fragment += `<a class="dropdown-item cp" href="?host=${ domain }">${ capitalize(domain) }</a>`;
  });

  // Render fragments
  fragment += `<a class="dropdown-item cp" onclick="changeDomain()">Custom Domain</a>`;
  $('.websites').innerHTML = fragment;

  // @ts-ignore
  window.daysAgo = daysAgo;
  // @ts-ignore
  window.render = render;
}

load();
