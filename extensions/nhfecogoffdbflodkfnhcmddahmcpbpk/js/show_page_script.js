/**
 * Created by Ali H. on 10/13/2016.
 */

if ($('#expyredIframe').length) {
}
else {
    var iFrame = document.createElement("iframe");
    iFrame.style.cssText = "height: 100% !important; min-width: 370px !important; position: fixed !important; z-index: 9999999999999999 !important; right: 0px !important; top: 0px !important;left: initial !important; width: initial !important; display: block !important;border: 2px solid whitesmoke !importnat;background-color: white !important;";
    iFrame.setAttribute("id", "expyredIframe");
    iFrame.src = chrome.extension.getURL("content/popup.html");

    $('body').append(iFrame);
}
// Send the information back to the extension
chrome.extension.sendMessage("done");
