define(['facebook-sdk'], function(FB){
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '211759759199879',
            version    : 'v2.4',
            xfbml      : false
        });
        FB.Event.subscribe('xfbml.ready', function(msg) {
            if (msg.type === 'video') {
                //msg.instance.play();
            }
        });
    };
  return FB;
});