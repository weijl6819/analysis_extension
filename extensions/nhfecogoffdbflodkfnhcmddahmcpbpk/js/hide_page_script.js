/**
 * Created by Ali H. on 10/13/2016.
 */

if ($('#expyredIframe').length) {
    $('#expyredIframe').remove();
}
// Send the information back to the extension
chrome.extension.sendMessage("done");
