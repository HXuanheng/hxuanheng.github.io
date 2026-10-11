// Google Analytics 4 loader. Set your Measurement ID here (one place for all pages).
(function () {
    var GA_ID = 'G-X1EX9ZPHX0';

    // Opt-out: visit any page with ?notrack=1 to stop tracking this browser, ?notrack=0 to resume.
    try {
        var flag = new URLSearchParams(location.search).get('notrack');
        if (flag === '1') localStorage.setItem('ga-notrack', '1');
        if (flag === '0') localStorage.removeItem('ga-notrack');
        if (localStorage.getItem('ga-notrack') === '1') return;
    } catch (e) { /* localStorage unavailable: keep tracking */ }

    // Skip local previews.
    var host = location.hostname;
    if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '') return;

    if (GA_ID.indexOf('XXXX') !== -1) return; // placeholder not replaced yet

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
})();
