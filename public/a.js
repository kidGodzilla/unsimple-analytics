(function () {
    var lastPathname;

    function documentReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive" || (window.performance && !window.performance.timing.domContentLoadedEventEnd)) setTimeout(fn, 1);
        else document.addEventListener("DOMContentLoaded", fn);
    }

    function pageview() {
        if (location.pathname === lastPathname) return;

        var viewCount = 1, sessionTime = 0;

        try {
            sessionTime = (parseInt(sessionStorage.getItem('_sessionTime')) || 1);
            viewCount = (parseInt(sessionStorage.getItem('_viewCount')) || 0);
            sessionStorage.setItem('_viewCount', ++viewCount);
        } catch(e){}

        var loadTime = ((window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000).toFixed(2);
        var isHeadless = !!(window.phantom || window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress);
        var width = window.innerWidth, referrer = document.referrer, href = location.href, host = location.hostname;
        var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
        var rand = (Math.random() + 1).toString(36).substring(5);
        var img = document.createElement("img");
        var lang = navigator.language || '';

        var url = `https://unsimple.b-cdn.net/o.png?host=${ encodeURIComponent(host) }&referrer=${ encodeURIComponent(referrer) }&href=${ encodeURIComponent(href) }&width=${ width }&bot=${ isBot ? 1 : 0 }&headless=${ isHeadless ? 1 : 0 }&load=${ loadTime }&views=${ viewCount }&time=${ sessionTime }&lang=${ lang }&v=${ rand }`;
        lastPathname = location.pathname;
        img.src = url;

        document.body.appendChild(img);
    }

    setInterval(function () {
        try { sessionStorage.setItem('_sessionTime', ((parseInt(sessionStorage.getItem('_sessionTime')) || 1) + 1)) } catch(e){}
    }, 1000);

    documentReady(function() {
        window.addEventListener('visibilitychange', pageview);
        window.addEventListener('popstate', pageview);
        pageview();
    });
})();
