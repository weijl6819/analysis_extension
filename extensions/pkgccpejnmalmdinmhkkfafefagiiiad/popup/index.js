let TRoptionssettings=function(e){let _=function(e){return"object"==typeof e&&(e.exports={CODE_STANDARDS:"code_standards",FCP_HELPER_INIT:"fcp_helper_init",FCP_HELPER_DETECT:"fcp_helper_detect",GET_CSS:"get-css",GET_JS:"get-js",GET_HTML:"get-html",GET_COOKIE:"get-cookie",REMOVE_COOKIE:"remove-cookie",SET_COOKIE:"set-cookie",CSS_READY:"css-ready",JS_READY:"js-ready",HTML_READY:"html-ready",ALL_READY:"all-ready",GET_OPTIONS:"get_options",SET_OPTIONS:"set_options",MENU_SAVED:"menu_saved",START_OPTION:"start-option",OPT_START_FCP:"opt-item-fcp",CALC_PAGE_LOAD_TIME:"calc-page-load-time",GET_PAGE_WPO_INFO:"get_page_wpo_info",SHOW_PAGE_LOAD_TIME:"show-page-load-time",TAB_CREATED_OR_UPDATED:"tab_created_or_updated",REGEXP_TOOL:"regexp",EN_DECODE:"en-decode",JSON_FORMAT:"json-format",QR_CODE:"qr-code",CODE_BEAUTIFY:"code-beautify",JS_CSS_PAGE_BEAUTIFY:"JS_CSS_PAGE_BEAUTIFY",JS_CSS_PAGE_BEAUTIFY_REQUEST:"JS_CSS_PAGE_BEAUTIFY_REQUEST",CODE_COMPRESS:"code-compress",TIME_STAMP:"timestamp",IMAGE_BASE64:"image-base64",RANDOM_PASSWORD:"password",QR_DECODE:"qr-decode",JSON_COMPARE:"json-diff",JSON_PAGE_FORMAT:"JSON_PAGE_FORMAT",JSON_PAGE_FORMAT_REQUEST:"JSON_PAGE_FORMAT_REQUEST",COLOR_PICKER:"color-picker:newImage",SHOW_COLOR_PICKER:"show_color_picker",AJAX_DEBUGGER:"ajax-debugger",AJAX_DEBUGGER_CONSOLE:"ajax-debugger-console",AJAX_DEBUGGER_SWITCH:"ajax-debugger-switch",HTML_TO_MARKDOWN:"html2markdown",PAGE_CAPTURE:"page-capture",PAGE_CAPTURE_SCROLL:"page_capture_scroll",PAGE_CAPTURE_CAPTURE:"page_capture_capture",STICKY_NOTES:"sticky-notes",DEV_TOOLS:"dev-tools",OPEN_OPTIONS_PAGE:"open-options-page"}),e.exports}({exports:{}});return e.exports=(()=>{let e=_,E=["opt_item_contextMenus","JSON_PAGE_FORMAT","EN_DECODE","CODE_BEAUTIFY","CODE_COMPRESS","JSON_FORMAT","JSON_COMPARE","QR_CODE","COLOR_PICKER","REGEXP_TOOL","TIME_STAMP","IMAGE_BASE64","FCP_HELPER_DETECT","SHOW_PAGE_LOAD_TIME","AJAX_DEBUGGER","JS_CSS_PAGE_BEAUTIFY","HTML_TO_MARKDOWN","PAGE_CAPTURE","RANDOM_PASSWORD","FORBID_OPEN_IN_NEW_TAB","MAX_JSON_KEYS_NUMBER","AUTO_TEXT_DECODE","STICKY_NOTES"],t={MENU_PAGE_ENCODING:{icon:"↺",text:"网页编码设置"},MENU_QRCODE_CREATE:{icon:"▣",text:"二维码生成器",contexts:["page","selection","editable","link","image"]},MENU_QRCODE_DECODE:{icon:"◈",text:"二维码解码器",contexts:["image"]},MENU_PAGE_CAPTURE:{icon:"✂",text:"页面滚动截屏"},MENU_COLOR_PICKER:{icon:"☀",text:"页面取色工具",contexts:["page","selection","editable"]},MENU_IMAGE_BASE64:{icon:"⇄",text:"图片与base64",contexts:["image"]},MENU_STR_ENDECODE:{icon:"♨",text:"字符串编解码",contexts:["page","selection","editable"]},MENU_JSON_FORMAT:{icon:"★",text:"JSON格式化",contexts:["page","selection","editable"]},MENU_JSON_COMPARE:{icon:"☃",text:"JSON比对器"},MENU_CODE_FORMAT:{icon:"☂",text:"代码美化工具",contexts:["page","selection","editable"]},MENU_CODE_COMPRESS:{icon:"〓",text:"代码压缩工具"},MENU_AJAX_DEBUGGER:{icon:"▶",text:"Ajax调试功能"},MENU_PAGE_OPTIMI:{icon:"√",text:"页面性能检测"},MENU_TIME_STAMP:{icon:"♖",text:"时间(戳)转换"},MENU_RANDOM_PASS:{icon:"☽",text:"随机密码生成"},MENU_JS_REGEXP:{icon:"✙",text:"JS正则表达式"},MENU_MARKDOWN_TL:{icon:"ⓜ",text:"markown工具"},MENU_CODE_STANDARD:{icon:"☊",text:"编码规范检测"},MENU_STICKY_NOTE:{icon:"▤",text:"我的便签笔记"}},o=()=>E.concat(Object.keys(t));return{getAllOpts:o,setOptsFromBgPage:function(e){o().forEach(_=>{e.some(e=>"string"==typeof e&&e===_?(localStorage.setItem(_,"true"),!0):!("object"!=typeof e||!e.hasOwnProperty(_)||(localStorage.setItem(_,e[_]),0)))||localStorage.setItem(_,"false")})},getOptsFromBgPage:function(e){if(e&&"function"==typeof e){let _={};o().forEach(e=>{let E=localStorage.getItem(e);"MAX_JSON_KEYS_NUMBER"===e?_[e]=E||1e4:"number"==typeof E?_[e]=E:"false"!==E&&(_[e]="true")}),e.call(null,_)}},getOptions:function(_){chrome.runtime.sendMessage({type:e.GET_OPTIONS},_)},setOptions:function(_){chrome.runtime.sendMessage({type:e.SET_OPTIONS,items:_})},getMenuOpts:function(){return t},didMenuSettingSaved:function(e){let _=!!localStorage.getItem("MENU_PAGE_ENCODING");if(!e||"function"!=typeof e)return _;e(_)},getDefaultContextMenus:function(){return["MENU_PAGE_ENCODING","MENU_QRCODE_CREATE","MENU_QRCODE_DECODE","MENU_PAGE_CAPTURE","MENU_COLOR_PICKER","MENU_IMAGE_BASE64","MENU_STR_ENDECODE","MENU_JSON_FORMAT","MENU_CODE_FORMAT"]},askMenuSavedOrNot:function(_){chrome.runtime.sendMessage({type:e.MENU_SAVED},_)}}})(),e.exports}({exports:{}}),TRstaticjsmsg_type=function(e){return"object"==typeof e&&(e.exports={CODE_STANDARDS:"code_standards",FCP_HELPER_INIT:"fcp_helper_init",FCP_HELPER_DETECT:"fcp_helper_detect",GET_CSS:"get-css",GET_JS:"get-js",GET_HTML:"get-html",GET_COOKIE:"get-cookie",REMOVE_COOKIE:"remove-cookie",SET_COOKIE:"set-cookie",CSS_READY:"css-ready",JS_READY:"js-ready",HTML_READY:"html-ready",ALL_READY:"all-ready",GET_OPTIONS:"get_options",SET_OPTIONS:"set_options",MENU_SAVED:"menu_saved",START_OPTION:"start-option",OPT_START_FCP:"opt-item-fcp",CALC_PAGE_LOAD_TIME:"calc-page-load-time",GET_PAGE_WPO_INFO:"get_page_wpo_info",SHOW_PAGE_LOAD_TIME:"show-page-load-time",TAB_CREATED_OR_UPDATED:"tab_created_or_updated",REGEXP_TOOL:"regexp",EN_DECODE:"en-decode",JSON_FORMAT:"json-format",QR_CODE:"qr-code",CODE_BEAUTIFY:"code-beautify",JS_CSS_PAGE_BEAUTIFY:"JS_CSS_PAGE_BEAUTIFY",JS_CSS_PAGE_BEAUTIFY_REQUEST:"JS_CSS_PAGE_BEAUTIFY_REQUEST",CODE_COMPRESS:"code-compress",TIME_STAMP:"timestamp",IMAGE_BASE64:"image-base64",RANDOM_PASSWORD:"password",QR_DECODE:"qr-decode",JSON_COMPARE:"json-diff",JSON_PAGE_FORMAT:"JSON_PAGE_FORMAT",JSON_PAGE_FORMAT_REQUEST:"JSON_PAGE_FORMAT_REQUEST",COLOR_PICKER:"color-picker:newImage",SHOW_COLOR_PICKER:"show_color_picker",AJAX_DEBUGGER:"ajax-debugger",AJAX_DEBUGGER_CONSOLE:"ajax-debugger-console",AJAX_DEBUGGER_SWITCH:"ajax-debugger-switch",HTML_TO_MARKDOWN:"html2markdown",PAGE_CAPTURE:"page-capture",PAGE_CAPTURE_SCROLL:"page_capture_scroll",PAGE_CAPTURE_CAPTURE:"page_capture_capture",STICKY_NOTES:"sticky-notes",DEV_TOOLS:"dev-tools",OPEN_OPTIONS_PAGE:"open-options-page"}),e.exports}({exports:{}});new Vue({el:"#pageContainer",data:{ajaxDebugger:"已开",canMeShow:{},manifest:{}},created:function(){this.manifest=chrome.runtime.getManifest(),TRoptionssettings.getOptions(e=>this.canMeShow=e),chrome.extension.getBackgroundPage().BgPageInstance.tellMeAjaxDbgSwitch(e=>{this.ajaxDebugger=e?"已开":"已关"})},methods:{runHelper:function(e,_){let E=chrome.extension.getBackgroundPage();if("COLOR_PICKER"===e)E.BgPageInstance.showColorPicker();else{let t=TRstaticjsmsg_type;E.BgPageInstance.runHelper({msgType:t[e],useFile:_},()=>{"AJAX_DEBUGGER"===e&&E.BgPageInstance.tellMeAjaxDbgSwitch(e=>{this.ajaxDebugger=e?"已开":"已关"},!0)})}window.close()},openOptionsPage:()=>chrome.runtime.openOptionsPage()}});