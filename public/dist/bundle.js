/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/sql.js-httpvfs/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/sql.js-httpvfs/dist/index.js ***!
  \***************************************************/
/***/ (function(module) {

eval("!function(e,t){if(true)module.exports=t();else { var r, n; }}(this,(function(){return(()=>{\"use strict\";var e={870:(e,t,n)=>{n.r(t),n.d(t,{createEndpoint:()=>o,expose:()=>l,proxy:()=>g,proxyMarker:()=>r,releaseProxy:()=>a,transfer:()=>y,transferHandlers:()=>c,windowEndpoint:()=>v,wrap:()=>f});const r=Symbol(\"Comlink.proxy\"),o=Symbol(\"Comlink.endpoint\"),a=Symbol(\"Comlink.releaseProxy\"),s=Symbol(\"Comlink.thrown\"),i=e=>\"object\"==typeof e&&null!==e||\"function\"==typeof e,c=new Map([[\"proxy\",{canHandle:e=>i(e)&&e[r],serialize(e){const{port1:t,port2:n}=new MessageChannel;return l(e,t),[n,[n]]},deserialize:e=>(e.start(),f(e))}],[\"throw\",{canHandle:e=>i(e)&&s in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function l(e,t=self){t.addEventListener(\"message\",(function n(r){if(!r||!r.data)return;const{id:o,type:a,path:i}=Object.assign({path:[]},r.data),c=(r.data.argumentList||[]).map(w);let f;try{const t=i.slice(0,-1).reduce(((e,t)=>e[t]),e),n=i.reduce(((e,t)=>e[t]),e);switch(a){case 0:f=n;break;case 1:t[i.slice(-1)[0]]=w(r.data.value),f=!0;break;case 2:f=n.apply(t,c);break;case 3:f=g(new n(...c));break;case 4:{const{port1:t,port2:n}=new MessageChannel;l(e,n),f=y(t,[t])}break;case 5:f=void 0}}catch(e){f={value:e,[s]:0}}Promise.resolve(f).catch((e=>({value:e,[s]:0}))).then((e=>{const[r,s]=b(e);t.postMessage(Object.assign(Object.assign({},r),{id:o}),s),5===a&&(t.removeEventListener(\"message\",n),u(t))}))})),t.start&&t.start()}function u(e){(function(e){return\"MessagePort\"===e.constructor.name})(e)&&e.close()}function f(e,t){return d(e,[],t)}function p(e){if(e)throw new Error(\"Proxy has been released and is not useable\")}function d(e,t=[],n=function(){}){let r=!1;const s=new Proxy(n,{get(n,o){if(p(r),o===a)return()=>E(e,{type:5,path:t.map((e=>e.toString()))}).then((()=>{u(e),r=!0}));if(\"then\"===o){if(0===t.length)return{then:()=>s};const n=E(e,{type:0,path:t.map((e=>e.toString()))}).then(w);return n.then.bind(n)}return d(e,[...t,o])},set(n,o,a){p(r);const[s,i]=b(a);return E(e,{type:1,path:[...t,o].map((e=>e.toString())),value:s},i).then(w)},apply(n,a,s){p(r);const i=t[t.length-1];if(i===o)return E(e,{type:4}).then(w);if(\"bind\"===i)return d(e,t.slice(0,-1));const[c,l]=m(s);return E(e,{type:2,path:t.map((e=>e.toString())),argumentList:c},l).then(w)},construct(n,o){p(r);const[a,s]=m(o);return E(e,{type:3,path:t.map((e=>e.toString())),argumentList:a},s).then(w)}});return s}function m(e){const t=e.map(b);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const h=new WeakMap;function y(e,t){return h.set(e,t),e}function g(e){return Object.assign(e,{[r]:!0})}function v(e,t=self,n=\"*\"){return{postMessage:(t,r)=>e.postMessage(t,n,r),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function b(e){for(const[t,n]of c)if(n.canHandle(e)){const[r,o]=n.serialize(e);return[{type:3,name:t,value:r},o]}return[{type:0,value:e},h.get(e)||[]]}function w(e){switch(e.type){case 3:return c.get(e.name).deserialize(e.value);case 0:return e.value}}function E(e,t,n){return new Promise((r=>{const o=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join(\"-\");e.addEventListener(\"message\",(function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener(\"message\",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)}))}},162:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,\"default\",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)\"default\"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,\"__esModule\",{value:!0}),t.createDbWorker=void 0;const s=a(n(870));async function i(e){if(e.data&&\"eval\"===e.data.action){const t=new Int32Array(e.data.notify,0,2),n=new Uint8Array(e.data.notify,8);let r;try{r={ok:await u(e.data.request)}}catch(t){console.error(\"worker request error\",e.data.request,t),r={err:String(t)}}const o=(new TextEncoder).encode(JSON.stringify(r));n.set(o,0),t[1]=o.length,Atomics.notify(t,0)}}function c(e){if(\"BODY\"===e.tagName)return\"body\";const t=[];for(;e.parentElement&&\"BODY\"!==e.tagName;){if(e.id){t.unshift(\"#\"+e.id);break}{let n=1,r=e;for(;r.previousElementSibling;)r=r.previousElementSibling,n++;t.unshift(e.tagName.toLowerCase()+\":nth-child(\"+n+\")\")}e=e.parentElement}return t.join(\" > \")}function l(e){return Object.keys(e)}async function u(e){if(console.log(\"dom vtable request\",e),\"select\"===e.type)return[...document.querySelectorAll(e.selector)].map((t=>{const n={};for(const r of e.columns)\"selector\"===r?n.selector=c(t):\"parent\"===r?t.parentElement&&(n.parent=t.parentElement?c(t.parentElement):null):\"idx\"===r||(n[r]=t[r]);return n}));if(\"insert\"===e.type){if(!e.value.parent)throw Error('\"parent\" column must be set when inserting');const t=document.querySelectorAll(e.value.parent);if(0===t.length)throw Error(`Parent element ${e.value.parent} could not be found`);if(t.length>1)throw Error(`Parent element ${e.value.parent} ambiguous (${t.length} results)`);const n=t[0];if(!e.value.tagName)throw Error(\"tagName must be set for inserting\");const r=document.createElement(e.value.tagName);for(const t of l(e.value))if(null!==e.value[t]){if(\"tagName\"===t||\"parent\"===t)continue;if(\"idx\"===t||\"selector\"===t)throw Error(`${t} can't be set`);r[t]=e.value[t]}return n.appendChild(r),null}if(\"update\"===e.type){const t=document.querySelector(e.value.selector);if(!t)throw Error(`Element ${e.value.selector} not found!`);const n=[];for(const r of l(e.value)){const o=e.value[r];if(\"parent\"!==r){if(\"idx\"!==r&&\"selector\"!==r&&o!==t[r]){if(console.log(\"SETTING \",r,t[r],\"->\",o),\"tagName\"===r)throw Error(\"can't change tagName\");n.push(r)}}else if(o!==c(t.parentElement)){const e=document.querySelectorAll(o);if(1!==e.length)throw Error(`Invalid target parent: found ${e.length} matches`);e[0].appendChild(t)}}for(const r of n)t[r]=e.value[r];return null}throw Error(`unknown request ${e.type}`)}s.transferHandlers.set(\"WORKERSQLPROXIES\",{canHandle:e=>!1,serialize(e){throw Error(\"no\")},deserialize:e=>(e.start(),s.wrap(e))}),t.createDbWorker=async function(e,t,n){const r=new Worker(t),o=s.wrap(r),a=await o.SplitFileHttpDatabase(n,e);return r.addEventListener(\"message\",i),{db:a,worker:o,configs:e}}},432:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__exportStar||function(e,t){for(var n in e)\"default\"===n||Object.prototype.hasOwnProperty.call(t,n)||r(t,e,n)};Object.defineProperty(t,\"__esModule\",{value:!0}),o(n(162),t)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}return n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(e,\"__esModule\",{value:!0})},n(432)})()}));\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack:///./node_modules/sql.js-httpvfs/dist/index.js?");

/***/ }),

/***/ "./node_modules/sql.js-httpvfs/dist/sql-wasm.wasm":
/*!********************************************************!*\
  !*** ./node_modules/sql.js-httpvfs/dist/sql-wasm.wasm ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"fd38fda4d9036372d1aa.wasm\";\n\n//# sourceURL=webpack:///./node_modules/sql.js-httpvfs/dist/sql-wasm.wasm?");

/***/ }),

/***/ "./node_modules/sql.js-httpvfs/dist/sqlite.worker.js":
/*!***********************************************************!*\
  !*** ./node_modules/sql.js-httpvfs/dist/sqlite.worker.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("module.exports = __webpack_require__.p + \"c356a8c1ca29f8b1b394.js\";\n\n//# sourceURL=webpack:///./node_modules/sql.js-httpvfs/dist/sqlite.worker.js?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sql_js_httpvfs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sql.js-httpvfs */ \"./node_modules/sql.js-httpvfs/dist/index.js\");\n/* harmony import */ var sql_js_httpvfs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sql_js_httpvfs__WEBPACK_IMPORTED_MODULE_0__);\n\nconst workerUrl = new URL(/* asset import */ __webpack_require__(/*! sql.js-httpvfs/dist/sqlite.worker.js */ \"./node_modules/sql.js-httpvfs/dist/sqlite.worker.js\"), __webpack_require__.b);\nconst wasmUrl = new URL(/* asset import */ __webpack_require__(/*! sql.js-httpvfs/dist/sql-wasm.wasm */ \"./node_modules/sql.js-httpvfs/dist/sql-wasm.wasm\"), __webpack_require__.b);\nasync function load() {\n    const worker = await (0,sql_js_httpvfs__WEBPACK_IMPORTED_MODULE_0__.createDbWorker)([\n        {\n            from: \"inline\",\n            config: {\n                serverMode: \"full\",\n                url: \"http://localhost:5001/analytics.sqlite3\",\n                requestChunkSize: 4096,\n            },\n        },\n    ], workerUrl.toString(), wasmUrl.toString());\n    function $(selector) {\n        return document.querySelector(selector) || {};\n    }\n    function tableFragment(o, keyFormatter = s => s, valueFormatter = s => s) {\n        let fragment = '', max = 0, lines = [];\n        for (let k in o) {\n            let v = o[k];\n            if (max < v)\n                max = v;\n            // @ts-ignore\n            lines.push({ k, v });\n        }\n        // @ts-ignore\n        lines.sort((b, a) => a.v > b.v && 1 || -1);\n        lines.forEach(line => {\n            // @ts-ignore\n            let { v, k } = line;\n            fragment += `\n<div class=\"mb-1\">\n    <div class=\"shaded d-inline-block bg-grey text-nowrap pt-1 pb-1\" style=\"width: ${(v / max) * 85}%\">&nbsp;${keyFormatter(k)}</div>\n    <span class=\"float-right text-right pt-1\">${valueFormatter(v)}</span>\n</div>`;\n        });\n        return fragment;\n    }\n    function daysAgo(n) {\n        const ago = new Date();\n        return ago.setDate(ago.getDate() - n);\n    }\n    function isoDate(d) {\n        if (!d)\n            d = new Date();\n        if (typeof d !== 'object' || !d.toISOString)\n            d = new Date(d);\n        return d.toISOString().slice(0, 10);\n    }\n    async function render(start, end) {\n        let statement = `SELECT * FROM visits WHERE date BETWEEN '${isoDate(start)}' AND '${isoDate(end)}'`;\n        let hourly = start === end;\n        console.log(statement, hourly);\n        const result = await worker.db.query(statement);\n        // Cleanup\n        $('#svgMap').innerHTML = '';\n        $('#visits').innerHTML = '';\n        $('div pre').textContent = JSON.stringify(result, null, 2);\n        // Aggregate results\n        let referrers = {};\n        let countries = {};\n        let pathnames = {};\n        let pageviews = 0;\n        let visitors = [];\n        let browsers = {};\n        let types = {};\n        let map = {};\n        let os = {};\n        // console.log(result);\n        function incr(o, k) {\n            if (!o[k])\n                o[k] = 0;\n            o[k]++;\n        }\n        result.forEach(item => {\n            let d = new Date(item.ts * 1000);\n            let h = d.getHours();\n            // Aggregate\n            incr(map, hourly ? h : isoDate(d));\n            // referrers\n            incr(referrers, item.referer_host);\n            // Device type\n            incr(types, item.device_type);\n            // OS\n            incr(os, item.os);\n            // Browser\n            incr(browsers, item.browser);\n            // Pathnames\n            incr(pathnames, item.pathname);\n            // Countries\n            if (!countries[item.country_code])\n                countries[item.country_code] = { visitors: 0 };\n            countries[item.country_code].visitors++;\n            // Pageviews & Visitors\n            // @ts-ignore\n            if (!visitors.includes(item.ip))\n                visitors.push(item.ip);\n            pageviews++;\n        });\n        let data = [];\n        if (hourly) {\n            for (let i = 0; i < 23; i++) {\n                // @ts-ignore\n                data.push({ hour: `${isoDate(start)} ${i}:00`, value: (map[i] || 0) });\n            }\n        }\n        else {\n            for (let k in map) {\n                // @ts-ignore\n                data.push({ hour: `${k}`, value: (map[k] || 0) });\n            }\n        }\n        console.log(map, data, referrers, browsers, pathnames, os, types, pageviews, visitors.length);\n        $('.referrers').innerHTML = tableFragment(referrers, s => `<img src=\"https://logo.clearbit.com/${s}\" onerror=\"this.onerror=null; this.src='default.png';\">&nbsp;<a href=\"http://${s}\" target=\"_blank\">${s}</a>`);\n        $('.pages').innerHTML = tableFragment(pathnames, s => `<a href=\"http://${'unsimple.b-cdn.net'}${s}\" target=\"_blank\">${s}</a>`);\n        $('.devices').innerHTML = tableFragment(types, s => s.charAt(0).toUpperCase() + s.slice(1));\n        $('.browsers').innerHTML = tableFragment(browsers);\n        $('.os').innerHTML = tableFragment(os);\n        // @ts-ignore\n        new Morris.Line({\n            // ID of the element in which to draw the chart.\n            element: 'visits',\n            // Chart data records -- each entry in this array corresponds to a point on\n            // the chart.\n            data: data || [\n                { year: '2008', value: 20 },\n                { year: '2009', value: 10 },\n                { year: '2010', value: 5 },\n                { year: '2011', value: 5 },\n                { year: '2012', value: 20 }\n            ],\n            // The name of the data record attribute that contains x-values.\n            xkey: 'hour',\n            // A list of names of data record attributes that contain y-values.\n            ykeys: ['value'],\n            // Labels for the ykeys -- will be displayed when you hover over the\n            // chart.\n            labels: ['Visits']\n        });\n        // SVG Map\n        // @ts-ignore\n        new svgMap({\n            targetElementID: 'svgMap',\n            data: {\n                data: {\n                    visitors: {\n                        name: 'visitors',\n                        format: '{0}',\n                        thousandSeparator: ',',\n                        // thresholdMax: 50000,\n                        // thresholdMin: 1000\n                    }\n                },\n                applyData: 'visitors',\n                values: countries || {\n                    AF: { visitors: 587 },\n                    AL: { visitors: 4583 },\n                    DZ: { visitors: 4293 }\n                }\n            }\n        });\n        // Pageviews & Visitors\n        $('.visitors').textContent = visitors.length;\n        $('.pageviews').textContent = pageviews;\n    }\n    // Start by rendering yesterday's data\n    render(daysAgo(1), daysAgo(1));\n    // render(daysAgo(1), daysAgo(0));\n    // @ts-ignore\n    window.daysAgo = daysAgo;\n    // @ts-ignore\n    window.render = render;\n}\nload();\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;