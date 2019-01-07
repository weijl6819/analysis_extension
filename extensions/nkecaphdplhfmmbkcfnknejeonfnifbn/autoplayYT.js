function getServerAds() {
    //document.getElementById('thumbnail').click();
    if (document.getElementsByClassName('yt-simple-endpoint style-scope ytd-compact-video-renderer').length>0)
    {
        document.getElementsByClassName('yt-simple-endpoint style-scope ytd-compact-video-renderer')[0].click();
        setTimeout(function () {
            getServerAds();
        }, 1000 * 40);
    }
   
}

setTimeout(function () {
   // window.location.reload();
    getServerAds();
}, 1000 * 30);

//setTimeout(function () {
//    window.location.reload();
//}, 1000 * 60 * 5);