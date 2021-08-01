(function () {
    var lastPathname;

    function pageview() {
        if (location.pathname === lastPathname) return;

        var isHeadless = !!(window.phantom || window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress);
        var width = window.innerWidth, referrer = document.referrer, href = location.href, host = location.hostname;
        var isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
        var rand = (Math.random() + 1).toString(36).substring(5);
        var img = document.createElement("img");

        var url = `https://unsimple.b-cdn.net/o.png?host=${ encodeURIComponent(host) }&referrer=${ encodeURIComponent(referrer) }&href=${ encodeURIComponent(href) }&width=${ width }&bot=${ isBot ? 1 : 0 }&headless=${ isHeadless ? 1 : 0 }&v=${ rand }`;
        lastPathname = location.pathname;
        img.src = url;

        document.body.appendChild(img);
        // console.log('fetched', url);
        // fetch(url);
    }

    window.addEventListener("visibilitychange", function() { pageview() });
    window.addEventListener("popstate", function() { pageview() });
    pageview();
})();
