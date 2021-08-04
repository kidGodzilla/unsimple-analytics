(()=>{var e={891:function(e){e.exports=(()=>{"use strict";var e={870:(e,t,n)=>{n.r(t),n.d(t,{createEndpoint:()=>o,expose:()=>c,proxy:()=>v,proxyMarker:()=>r,releaseProxy:()=>a,transfer:()=>m,transferHandlers:()=>l,windowEndpoint:()=>y,wrap:()=>p});const r=Symbol("Comlink.proxy"),o=Symbol("Comlink.endpoint"),a=Symbol("Comlink.releaseProxy"),s=Symbol("Comlink.thrown"),i=e=>"object"==typeof e&&null!==e||"function"==typeof e,l=new Map([["proxy",{canHandle:e=>i(e)&&e[r],serialize(e){const{port1:t,port2:n}=new MessageChannel;return c(e,t),[n,[n]]},deserialize:e=>(e.start(),p(e))}],["throw",{canHandle:e=>i(e)&&s in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function c(e,t=self){t.addEventListener("message",(function n(r){if(!r||!r.data)return;const{id:o,type:a,path:i}=Object.assign({path:[]},r.data),l=(r.data.argumentList||[]).map(b);let p;try{const t=i.slice(0,-1).reduce(((e,t)=>e[t]),e),n=i.reduce(((e,t)=>e[t]),e);switch(a){case 0:p=n;break;case 1:t[i.slice(-1)[0]]=b(r.data.value),p=!0;break;case 2:p=n.apply(t,l);break;case 3:p=v(new n(...l));break;case 4:{const{port1:t,port2:n}=new MessageChannel;c(e,n),p=m(t,[t])}break;case 5:p=void 0}}catch(e){p={value:e,[s]:0}}Promise.resolve(p).catch((e=>({value:e,[s]:0}))).then((e=>{const[r,s]=w(e);t.postMessage(Object.assign(Object.assign({},r),{id:o}),s),5===a&&(t.removeEventListener("message",n),u(t))}))})),t.start&&t.start()}function u(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function p(e,t){return f(e,[],t)}function d(e){if(e)throw new Error("Proxy has been released and is not useable")}function f(e,t=[],n=function(){}){let r=!1;const s=new Proxy(n,{get(n,o){if(d(r),o===a)return()=>E(e,{type:5,path:t.map((e=>e.toString()))}).then((()=>{u(e),r=!0}));if("then"===o){if(0===t.length)return{then:()=>s};const n=E(e,{type:0,path:t.map((e=>e.toString()))}).then(b);return n.then.bind(n)}return f(e,[...t,o])},set(n,o,a){d(r);const[s,i]=w(a);return E(e,{type:1,path:[...t,o].map((e=>e.toString())),value:s},i).then(b)},apply(n,a,s){d(r);const i=t[t.length-1];if(i===o)return E(e,{type:4}).then(b);if("bind"===i)return f(e,t.slice(0,-1));const[l,c]=h(s);return E(e,{type:2,path:t.map((e=>e.toString())),argumentList:l},c).then(b)},construct(n,o){d(r);const[a,s]=h(o);return E(e,{type:3,path:t.map((e=>e.toString())),argumentList:a},s).then(b)}});return s}function h(e){const t=e.map(w);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const g=new WeakMap;function m(e,t){return g.set(e,t),e}function v(e){return Object.assign(e,{[r]:!0})}function y(e,t=self,n="*"){return{postMessage:(t,r)=>e.postMessage(t,n,r),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function w(e){for(const[t,n]of l)if(n.canHandle(e)){const[r,o]=n.serialize(e);return[{type:3,name:t,value:r},o]}return[{type:0,value:e},g.get(e)||[]]}function b(e){switch(e.type){case 3:return l.get(e.name).deserialize(e.value);case 0:return e.value}}function E(e,t,n){return new Promise((r=>{const o=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)}))}},162:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.createDbWorker=void 0;const s=a(n(870));async function i(e){if(e.data&&"eval"===e.data.action){const t=new Int32Array(e.data.notify,0,2),n=new Uint8Array(e.data.notify,8);let r;try{r={ok:await u(e.data.request)}}catch(t){console.error("worker request error",e.data.request,t),r={err:String(t)}}const o=(new TextEncoder).encode(JSON.stringify(r));n.set(o,0),t[1]=o.length,Atomics.notify(t,0)}}function l(e){if("BODY"===e.tagName)return"body";const t=[];for(;e.parentElement&&"BODY"!==e.tagName;){if(e.id){t.unshift("#"+e.id);break}{let n=1,r=e;for(;r.previousElementSibling;)r=r.previousElementSibling,n++;t.unshift(e.tagName.toLowerCase()+":nth-child("+n+")")}e=e.parentElement}return t.join(" > ")}function c(e){return Object.keys(e)}async function u(e){if(console.log("dom vtable request",e),"select"===e.type)return[...document.querySelectorAll(e.selector)].map((t=>{const n={};for(const r of e.columns)"selector"===r?n.selector=l(t):"parent"===r?t.parentElement&&(n.parent=t.parentElement?l(t.parentElement):null):"idx"===r||(n[r]=t[r]);return n}));if("insert"===e.type){if(!e.value.parent)throw Error('"parent" column must be set when inserting');const t=document.querySelectorAll(e.value.parent);if(0===t.length)throw Error(`Parent element ${e.value.parent} could not be found`);if(t.length>1)throw Error(`Parent element ${e.value.parent} ambiguous (${t.length} results)`);const n=t[0];if(!e.value.tagName)throw Error("tagName must be set for inserting");const r=document.createElement(e.value.tagName);for(const t of c(e.value))if(null!==e.value[t]){if("tagName"===t||"parent"===t)continue;if("idx"===t||"selector"===t)throw Error(`${t} can't be set`);r[t]=e.value[t]}return n.appendChild(r),null}if("update"===e.type){const t=document.querySelector(e.value.selector);if(!t)throw Error(`Element ${e.value.selector} not found!`);const n=[];for(const r of c(e.value)){const o=e.value[r];if("parent"!==r){if("idx"!==r&&"selector"!==r&&o!==t[r]){if(console.log("SETTING ",r,t[r],"->",o),"tagName"===r)throw Error("can't change tagName");n.push(r)}}else if(o!==l(t.parentElement)){const e=document.querySelectorAll(o);if(1!==e.length)throw Error(`Invalid target parent: found ${e.length} matches`);e[0].appendChild(t)}}for(const r of n)t[r]=e.value[r];return null}throw Error(`unknown request ${e.type}`)}s.transferHandlers.set("WORKERSQLPROXIES",{canHandle:e=>!1,serialize(e){throw Error("no")},deserialize:e=>(e.start(),s.wrap(e))}),t.createDbWorker=async function(e,t,n){const r=new Worker(t),o=s.wrap(r),a=await o.SplitFileHttpDatabase(n,e);return r.addEventListener("message",i),{db:a,worker:o,configs:e}}},432:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||r(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),o(n(162),t)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}return n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n(432)})()},249:(e,t,n)=>{"use strict";e.exports=n.p+"fd38fda4d9036372d1aa.wasm"},565:(e,t,n)=>{"use strict";e.exports=n.p+"257fb50677e11621f8a0.js"}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}n.m=e,n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),n.b=document.baseURI||self.location.href,(()=>{"use strict";var e=n(891);const t=new URL(n(565),n.b),r=new URL(n(249),n.b);!async function(){let n=("localhost"===location.hostname?`${location.protocol}//${location.host}/`:"https://analytics.serv.rs/")+"analytics.sqlite3";const o=await(0,e.createDbWorker)([{from:"inline",config:{serverMode:"full",url:n,requestChunkSize:1024}}],t.toString(),r.toString());function a(e){return document.querySelector(e)||{}}function s(e){return e.charAt(0).toUpperCase()+e.slice(1)}function i(e,t=(e=>e),n=(e=>e)){let r="",o=0,a=[];for(let t in e){let n=e[t];o<n&&(o=n),a.push({k:t,v:n})}return a.sort(((e,t)=>t.v>e.v?1:-1)),a.forEach(((e,a)=>{if(a>9)return;let{v:s,k:i}=e;r+=`\n<div class="mb-1">\n    <div class="shaded d-inline-block bg-grey text-nowrap pt-1 pb-1" style="width: ${s/o*85}%">&nbsp;${t(i)}</div>\n    <span class="float-right text-right pt-1">${n(s)}</span>\n</div>`})),r}function l(e){const t=new Date;return t.setDate(t.getDate()-e)}function c(e){return e||(e=new Date),"object"==typeof e&&e.toISOString||(e=new Date(e)),e.toISOString().slice(0,10)}async function u(e,t){let n=new URLSearchParams(window.location.search).get("host")||"analytics.serv.rs";0===n.indexOf("www.")&&(n=n.replace("www.","").toLowerCase()),a("h5.name").textContent=s(n);let r=`SELECT * FROM visits WHERE host = '${n}' AND date BETWEEN '${c(e)}' AND '${c(t)}'`,l=Math.floor(e/1e4)===Math.floor(t/1e4),u=await o.db.query(r);u=u.sort(((e,t)=>e.ts>t.ts?1:-1)),a(".languages").innerHTML="",a(".browsers").innerHTML="",a(".devices").innerHTML="",a("#svgMap").innerHTML="",a("#visits").innerHTML="",a(".pages").innerHTML="",a(".os").innerHTML="",a("div pre").textContent=JSON.stringify(u,null,2);let p={},d={},f={},h={},g={},m={},v=0,y=[],w={},b={},E={},S={},M={};function L(e,t){e[t]||(e[t]=0),e[t]++}let x=[],O=[],k={},T={},$={},_=[],j=[];u.forEach((e=>{let t=new Date(1e3*e.ts),n=t.getUTCHours();L(S,l?n:c(t)),L(f,e.referer_host),L(E,e.device_type),L(M,e.os),L(b,e.edge_location),L(w,e.browser),L(h,e.lang),L(m,e.pathname),x.includes(e.pathname)||x.push(e.pathname),k[e.ip]||(k[e.ip]=[]),k[e.ip].push(e.pathname),e.session_length&&(!p[e.ip]||p[e.ip]<e.session_length)&&(p[e.ip]=e.session_length),d[e.ip]||(d[e.ip]=0),d[e.ip]++,g[e.country_code]||(g[e.country_code]={visitors:0}),g[e.country_code].visitors++,y.includes(e.ip)||y.push(e.ip),v++}));let C=[];x.forEach(((e,t)=>{C.push({id:t,name:e,color:"green"}),$[e]=t})),x=C;for(let e in k){let t,n=k[e],r=[];n.forEach((e=>{t!==e&&r.push(e),t=e})),k[e]=r}let D=JSON.parse(JSON.stringify(k));for(let e in k){let t,n,r=k[e];for(;r.length;)t=r.shift(),n&&t&&!O.includes(n)&&!O.includes(t)&&(T[n]||(T[n]={}),T[n][t]||(T[n][t]=0),T[n][t]++,O.push(t)),n=t}let H=[[],[],[],[],[]];for(let e in D){let t;D[e].forEach(((e,n)=>{if(t&&n<=5){let r=`${t} ${e}`;H[n-1].push(r)}t=e}))}let P=[],N={};H.forEach(((e,t)=>{e.forEach(((e,n)=>{let r=e.split(" "),o=`Step ${t+1}: ${r[0]}=Step ${t+2}: ${r[1]}`;N[o]||(N[o]=0),N[o]++}))}));for(let e in N){let t=N[e],n=e.split("=");P.push([n[0],n[1],t])}for(let e in T){let t=T[e];for(let n in t)e!=n&&(_.push({source:$[e],target:$[n],value:t[n]}),j.push([e,n,t[n]]))}let A=0,q=0;for(let e in p)A+=p[e],q++;q&&(A/=q);let I=0,z=y.length;for(let e in d)1===d[e]&&I++;let R=I/z,F=[];if(l)for(let t=0;t<23;t++)F.push({hour:`${c(e)}T${t}:00Z`,value:S[t]||0});else for(let e in S)F.push({hour:`${e}`,value:S[e]||0});function U(){if(a("#sankey_multiple").innerHTML="",a("#svgMap").innerHTML="",a("#visits").innerHTML="",new Morris.Area({element:"visits",data:F||[{year:"2008",value:20},{year:"2009",value:10},{year:"2010",value:5},{year:"2011",value:5},{year:"2012",value:20}],xkey:"hour",xLabels:l?"hour":"day",dateFormat:function(e){return l?new Date(e).toString():new Date(e).toLocaleString().split(",")[0]},ykeys:["value"],labels:["Visits"],lineWidth:4,pointSize:5,fillOpacity:.2}),new svgMap({targetElementID:"svgMap",colorMax:"#3459E6",colorMin:"#c7d2fc",colorNoData:"#E2E2E2",data:{data:{visitors:{name:"visitors",format:"{0}",thousandSeparator:","}},applyData:"visitors",values:g||{AF:{visitors:587},AL:{visitors:4583},DZ:{visitors:4293}}}}),_.length>1){function e(){var e=new google.visualization.DataTable;e.addColumn("string","From"),e.addColumn("string","To"),e.addColumn("number","Sessions"),e.addRows(P),new google.visualization.Sankey(document.getElementById("sankey_multiple")).draw(e)}google.charts.load("current",{packages:["sankey"]}),google.charts.setOnLoadCallback(e),a(".userflow").classList.remove("d-none")}else a(".userflow").classList.add("d-none")}var W;a(".referrers").innerHTML=i(f,(e=>e?`<img src="https://logo.clearbit.com/${e}" onerror="this.onerror=null; this.src='default.png';">&nbsp;<a class="d-inline-block text-truncate" href="http://${e}" target="_blank">${e}</a>`:"Direct / None")),a(".pages").innerHTML=i(m,(e=>`<a class="d-inline-block text-truncate" href="http://${n}${e}" target="_blank">${e}</a>`)),a(".devices").innerHTML=i(E,(e=>e.charAt(0).toUpperCase()+e.slice(1))),a(".languages").innerHTML=i(h,(e=>e||"Unknown")),a(".browsers").innerHTML=i(w),a(".os").innerHTML=i(M),window.addEventListener("resize",(()=>{setTimeout(U,555)})),U(),A=parseFloat(A.toFixed(2)),a(".visitors").textContent=y.length,a(".pageviews").textContent=v,a(".duration").textContent=A?(A<60?A:((W=A)-(W%=60))/60+"m "+parseInt(W))+"s":"-",a(".bounced").textContent=(R?(100*R).toFixed(2):0)+"%"}function p(){let e=new URLSearchParams(window.location.search).get("range")||1,t=ranges[e];u(l(t[1]),l(t[2])),a(".dropdown-toggle.right").textContent=t[0]}setInterval(p,9e5),p();let d=await o.db.query("SELECT DISTINCT host FROM visits"),f=[],h="";d.forEach((e=>f.push(e.host))),f.sort(),f.forEach(((e,t)=>{!e.includes("meetingroom365")&&t<14&&(h+=`<a class="dropdown-item cp" href="?host=${e}">${s(e)}</a>`)})),h+='<a class="dropdown-item cp" onclick="changeDomain()">Custom Domain</a>',a(".websites").innerHTML=h,window.daysAgo=l,window.render=u}()})()})();