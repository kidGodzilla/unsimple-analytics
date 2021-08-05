(function () {
    var lastPathname;

    function documentReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive" || (window.performance && !window.performance.timing.domContentLoadedEventEnd)) setTimeout(fn, 1);
        else document.addEventListener("DOMContentLoaded", fn);
    }

    function pageview() {
        event();
    }

    function event(name, value) {
        if (location.pathname === lastPathname) return;

        var sessionCount = 0, viewCount = 0, sessionTime = 0, isNew = 1;

        try {
            sessionCount = (parseInt(localStorage.getItem('_implausible_sessions')) || 0);
            sessionTime = (parseInt(sessionStorage.getItem('_sessionTime')) || 1);
            viewCount = (parseInt(sessionStorage.getItem('_viewCount')) || 0);
            if (sessionCount) isNew = 0;

            if (!viewCount) localStorage.setItem('_implausible_sessions', ++sessionCount);
            sessionStorage.setItem('_viewCount', ++viewCount);
        } catch(e){}

        var loadTime = ((window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000).toFixed(2);
        var isHeadless = !!(window.phantom || window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress);
        var width = window.innerWidth, referrer = document.referrer, href = location.href, host = location.hostname;
        var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
        var rand = (Math.random() + 1).toString(36).substring(5);
        var lang = navigator.language || navigator.languages[0] || '';
        var img = document.createElement("img");

        var url = `https://unsimple.b-cdn.net/o.png?host=${ encodeURIComponent(host) }&referrer=${ encodeURIComponent(referrer) }&href=${ encodeURIComponent(href) }&width=${ width }&bot=${ isBot ? 1 : 0 }&headless=${ isHeadless ? 1 : 0 }&load=${ loadTime }&views=${ viewCount }&time=${ sessionTime }&lang=${ lang }&new=${ isNew }&session=${ sessionCount }&v=${ rand }`;
        if (value) url += `&value=${ value }`;
        if (name) url += `&event=${ name }`;
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

    window.implausible = event;
})();
