
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
/*

    This extension adds functions such as Send Later and Reminders to Gmail. In order to put extra buttons and dialogs into the existing Gmail browser interface, we make use of InboxSDK (https://www.inboxsdk.com/) which is a popular and legitimate library that provides convenience for such tasks. InboxSDK is also known to load and execute remotely loaded code. From what we understand, this can cause our extension to be flagged. We ask you to review discussion on https://groups.google.com/forum/#!topic/inboxsdk/FzOeNLWwn_0 to see how remote execution is mandatory for InboxSDK. Thank you.

 */

// message.saveTracked({}, function () {});
// message.saveScheduled({}, function () {});

const TOP_INBOX = 'The Top Inbox for Gmail';
const SEND_LATER = 'Send Later by The Top Inbox';
const manifest = chrome.runtime.getManifest();
const currentExtension = manifest.name === TOP_INBOX ? TOP_INBOX : SEND_LATER;

var onInstalledMessageHandler;

InboxSDK.load('1.0', inboxsdk_app_id).then(function(sdk) {
    sdk.Compose.registerComposeViewHandler(makeComposeViewHandler(sdk));
    sdk.Lists.registerThreadRowViewHandler(listViewHandler);
    sdk.Conversations.registerThreadViewHandler(makeThreadViewHandler(sdk));
    sdk.Conversations.registerMessageViewHandler(makeMessageViewHandler(sdk));
    setupNavigation(sdk);
    loadAsset('assets/bump_form.html', function(text) {
        var tbBump = new toolbarBump({
            sdk: sdk,
            html: text,
        });
    });

    onInstalledMessageHandler = function(message, sender, sendResponse) {
        if (message.code === 'onInstalled') {
            chrome.runtime.onMessage.removeListener(onInstalledMessageHandler);

            // Show user the onboarding flow
            showOnboardingTutorial(sdk, () => {
                // Authenticate the user
                sdk.Compose.openNewComposeView();
            });
        }
    };
});

chrome.runtime.onMessage.addListener(attemptOnInstallMessageHandler);

// Sometimes, the onMessage event fires before InboxSDK has loaded
// which prevents it's listener from being set. Instead, register the
// listener immediately and then poll for InboxSDK loading before
// executing it'a handler.
function attemptOnInstallMessageHandler(message, sender, sendResponse) {
    if (onInstalledMessageHandler)
        onInstalledMessageHandler(message, sender, sendResponse);
    else
        setTimeout(() => {
            attemptOnInstallMessageHandler(message, sender, sendResponse);
        }, 50);
}

// chrome.storage.sync.getBytesInUse(null, function (bytes) {
//     console.log('NET sync storage', bytes, 'used (102,400 max)');
// });

poll.rearmSchedule();
poll.rearmFollowUps();

// Onboarding UI
const onboardingTemplate = (imageURL, content, pageNumber) => `
  <div class="top-inbox-onboarding">
    <style>
      .top-inbox-onboarding {
        display: flex;
        flex: 1;
        flex-direction: row;
      }
      .top-inbox-onboarding h1 {
        font-family: Roboto, "Helvetica Neue", Helvetica, sans-serif;
        font-weight: 300;
      }
      .top-inbox-onboarding > img {
        max-width: 350px;
        max-height: 350px;
      }
      .top-inbox-onboarding > .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 350px;
        height: 350px;
        box-sizing: border-box;
      }
      .top-inbox-onboarding > .content > .top {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
      }
      .top-inbox-onboarding > .content > .bottom {
        display: flex;
        flex: 0.2;
        justify-content: center;
        align-items: center;
        border-top: 1px solid rgb(212,212,212);
      }
      .top-inbox-onboarding > .controls {
        position: absolute;
        bottom: -55px;
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      .top-inbox-onboarding button {
        background-color: transparent;
        border: 1px solid black;
        color: black;
        font-weight: bold;
        border-radius: 4px;
        padding: 12px 24px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .top-inbox-onboarding > .controls > .next {
        margin-left: 10px;
      }
      .top-inbox-onboarding .next, .top-inbox-onboarding .done {
        background-color: rgb(73,126,222);
        color: white;
        border: none;
        transition: background-color 0.3s linear;
      }
      .top-inbox-onboarding .next:hover,
      .top-inbox-onboarding .done:hover {
        background-color: rgb(89,144,238);
      }
      .inboxsdk__modal_fullscreen .inboxsdk__modal_container {
        overflow: visible !important;
      }
      .top-inbox-onboarding img.env {
        width: 24px;
        margin-right: 5px;
      }
    </style>
    <img src="${imageURL}" width="${
    pageNumber === 3 ? 239 : 350
}" height="350" />
    <div class="content">
      <div class="top">${content}</div>
      ${
          pageNumber !== 3
              ? `<div class="bottom">
        <img class="env" src="https://thetopinbox.com/favicon-96x96.png" />
        The Top Inbox
      </div>`
              : ''
      }
    </div>
    ${
        pageNumber !== 3
            ? `
      <div class="controls">
        <button class="skip">Skip</button>
        <button class="next">Next</button>
      </div>
    `
            : ''
    }
  </div>
`;

let onboardingPages = [
    onboardingTemplate(
        'https://thetopinbox.com/assets/images/extension/sendlater.gif',
        `
<img height="64" src="https://thetopinbox.com/assets/images/color-icons/send-later.svg" />
<h1>Send later</h1>
<p>As simple as it sounds. Schedule emails to be sent at a later time. Write it now. Send it Monday at 6am.</p>
`,
        0
    ),
    onboardingTemplate(
        'https://thetopinbox.com/assets/images/extension/followup.gif',
        `
<img height="64" src="https://thetopinbox.com/assets/images/color-icons/follow-up.svg" />
<h1>Auto Follow-up</h1>
<p>Set up as many template auto-follow-up sequences as you want your recipient replies without extra work on your end.</p>
`,
        1
    ),
    onboardingTemplate(
        'https://thetopinbox.com/assets/images/extension/setreminders.gif',
        `
<img height="64" src="https://thetopinbox.com/assets/images/color-icons/set-reminders.svg" />
<h1>Set Reminders</h1>
<p>Make sure you don't forget anything by setting up reminders. We'll put the email at the top of your inbox on the day and time you ask to be reminded.</p>
`,
        2
    ),
    onboardingTemplate(
        'https://thetopinbox.com/assets/images/extension/welcomecard.png',
        `
<img src="https://thetopinbox.com/assets/images/extension/envelope.png" height="45" width="45" />
<h1>The Top Inbox</h1>
<p>Schedule emails to be sent later. Set remainders in your inbox. Track opens. Followup with email sequences. Easy as 1-2-3.</p>
<p>We'll need to ask for a few Gmail permissions to get started</p>
<button class="done">Get Started</button>
`,
        3
    ),
];

if (currentExtension === SEND_LATER) {
    // only show the send later onboarding popup and the last "Get Started" popup
    // in the SndLatr extension
    onboardingPages.splice(1, 2);
}

function showOnboardingTutorial(sdk, onCompleteCallback, pageNumber = 0) {
    const modal = sdk.Widgets.showModalView({
        el: onboardingPages[pageNumber],
        chrome: false,
    });

    const onTutorialComplete = () => {
        modal.close();
        onCompleteCallback();
    };

    const selector = '.top-inbox-onboarding';

    if (pageNumber === onboardingPages.length - 1) {
        document
            .querySelector(selector + ' .done')
            .addEventListener('click', onTutorialComplete);
        return;
    }

    const onNext = () => {
        modal.close();
        const nextPage = pageNumber + 1;
        if (nextPage < onboardingPages.length) {
            showOnboardingTutorial(sdk, onCompleteCallback, nextPage);
        } else {
            onCompleteCallback();
        }
    };
    document
        .querySelector(selector + ' > .controls > .skip')
        .addEventListener('click', onTutorialComplete);
    document
        .querySelector(selector + ' > .controls > .next')
        .addEventListener('click', onNext);
}
