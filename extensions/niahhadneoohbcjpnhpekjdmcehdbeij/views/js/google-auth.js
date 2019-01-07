function signInWithGoogle(onSuccess) {
    chrome.extension.getBackgroundPage().signInWithGoogle(onSuccess);
}

function logoutViaGoogle(logOutAction) {
    chrome.extension.getBackgroundPage().logoutViaGoogle(logOutAction);
}
