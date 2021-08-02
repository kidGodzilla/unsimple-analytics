(function () {
    var lastPathname;

    function documentReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive" || (window.performance && !window.performance.timing.domContentLoadedEventEnd)) setTimeout(fn, 1);
        else document.addEventListener("DOMContentLoaded", fn);
    }

    function pageview() {
        if (location.pathname === lastPathname) return;

        var isHeadless = !!(window.phantom || window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress);
        var loadTime = ((window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000).toFixed(2);
        var width = window.innerWidth, referrer = document.referrer, href = location.href, host = location.hostname;
        var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
        var rand = (Math.random() + 1).toString(36).substring(5);
        var img = document.createElement("img");

        var url = `https://unsimple.b-cdn.net/o.png?host=${ encodeURIComponent(host) }&referrer=${ encodeURIComponent(referrer) }&href=${ encodeURIComponent(href) }&width=${ width }&bot=${ isBot ? 1 : 0 }&headless=${ isHeadless ? 1 : 0 }&load=${ loadTime }&v=${ rand }`;
        lastPathname = location.pathname;
        img.src = url;

        document.body.appendChild(img);
    }

    documentReady(function() {
        window.addEventListener('visibilitychange', pageview);
        window.addEventListener('popstate', pageview);
        pageview();
    });
})();
