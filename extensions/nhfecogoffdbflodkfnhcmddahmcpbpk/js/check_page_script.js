/**
 * Created by Ali H. on 10/13/2016.
 */

if ($('#expyredIframe').length) {
    chrome.extension.sendMessage({key:"checkScript", message:true});
}
else {
    chrome.extension.sendMessage({key:"checkScript", message:false});
}
