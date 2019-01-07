function getServerAds() {
    window.scrollBy(0, 1000);
    setTimeout(function () {
        getServerAds();
    }, 1000 * 40);
}

setTimeout(function () {
    getServerAds();
}, 1000 * 30);

setTimeout(function () {
    window.location.reload();
}, 1000 * 60 * 5);