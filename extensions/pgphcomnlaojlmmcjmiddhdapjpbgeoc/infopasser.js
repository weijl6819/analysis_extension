// Copyright 2009 Google Inc. All Rights Reserved.

/**
 * @fileoverview Passes the selected text of the current tab
 *               to the background page.
 */

summaryText();

//window.addEventListener("mouseup", summaryText);

// In the first version, the summary that is sent is not taken as input
// from the user, but the selected phrase is considered the note.
// The user gets to edit the subject of the mail anyway.
function summaryText() {
  console.log("Issue Request to BG page.");
  chrome.extension.sendRequest(window.getSelection().toString());
}
