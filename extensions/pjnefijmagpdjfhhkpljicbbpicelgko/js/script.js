
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

function O(a) {}

function e() {
    var a = [["af-ZA","Afrikaans (Suid-Afrika)"],["am-ET","አማርኛ (ኢትዮጵያ)"],["hy-AM","Հայ (Հայաստան)"],["az-AZ","Azərbaycan (Azərbaycan)"],["id-ID","Bahasa Indonesia (Indonesia)"],["ms-MY","Bahasa Melayu (Malaysia)"],["bn-BD","বাংলা (বাংলাদেশ)"],["bn-IN","বাংলা (ভারত)"],["ca-ES","Català (Espanya)"],["cs-CZ","Čeština (Česká republika)"],["da-DK","Dansk (Danmark)"],["de-DE","Deutsch (Deutschland)"],["en-AU","English (Australia)"],["en-CA","English (Canada)"],["en-GH","English (Ghana)"],["en-GB","English (Great Britain)"],["en-IN","English (India)"],["en-IE","English (Ireland)"],["en-KE","English (Kenya)"],["en-NZ","English (New Zealand)"],["en-NG","English (Nigeria)"],["en-PH","English (Philippines)"],["en-ZA","English (South Africa)"],["en-TZ","English (Tanzania)"],["en-US","English (United States)"],["es-AR","Español (Argentina)"],["es-BO","Español (Bolivia)"],["es-CL","Español (Chile)"],["es-CO","Español (Colombia)"],["es-CR","Español (Costa Rica)"],["es-EC","Español (Ecuador)"],["es-SV","Español (El Salvador)"],["es-ES","Español (España)"],["es-US","Español (Estados Unidos)"],["es-GT","Español (Guatemala)"],["es-HN","Español (Honduras)"],["es-MX","Español (México)"],["es-NI","Español (Nicaragua)"],["es-PA","Español (Panamá)"],["es-PY","Español (Paraguay)"],["es-PE","Español (Perú)"],["es-PR","Español (Puerto Rico)"],["es-DO","Español (República Dominicana)"],["es-UY","Español (Uruguay)"],["es-VE","Español (Venezuela)"],["eu-ES","Euskara (Espainia)"],["fil-PH","Filipino (Pilipinas)"],["fr-CA","Français (Canada)"],["fr-FR","Français (France)"],["gl-ES","Galego (España)"],["ka-GE","ქართული (საქართველო)"],["gu-IN","ગુજરાતી (ભારત)"],["hr-HR","Hrvatski (Hrvatska)"],["zu-ZA","IsiZulu (Ningizimu Afrika)"],["is-IS","Íslenska (Ísland)"],["it-IT","Italiano (Italia)"],["jv-ID","Jawa (Indonesia)"],["kn-IN","ಕನ್ನಡ (ಭಾರತ)"],["km-KH","ភាសាខ្មែរ (កម្ពុជា)"],["lo-LA","ລາວ (ລາວ)"],["lv-LV","Latviešu (latviešu)"],["lt-LT","Lietuvių (Lietuva)"],["hu-HU","Magyar (Magyarország)"],["ml-IN","മലയാളം (ഇന്ത്യ)"],["mr-IN","मराठी (भारत)"],["nl-NL","Nederlands (Nederland)"],["ne-NP","नेपाली (नेपाल)"],["nb-NO","Norsk bokmål (Norge)"],["pl-PL","Polski (Polska)"],["pt-BR","Português (Brasil)"],["pt-PT","Português (Portugal)"],["ro-RO","Română (România)"],["si-LK","සිංහල (ශ්රී ලංකාව)"],["sk-SK","Slovenčina (Slovensko)"],["sl-SI","Slovenščina (Slovenija)"],["su-ID","Urang (Indonesia)"],["sw-TZ","Swahili (Tanzania)"],["sw-KE","Swahili (Kenya)"],["fi-FI","Suomi (Suomi)"],["sv-SE","Svenska (Sverige)"],["ta-IN","தமிழ் (இந்தியா)"],["ta-SG","தமிழ் (சிங்கப்பூர்)"],["ta-LK","தமிழ் (இலங்கை)"],["ta-MY","தமிழ் (மலேசியா)"],["te-IN","తెలుగు (భారతదేశం)"],["vi-VN","Tiếng Việt (Việt Nam)"],["tr-TR","Türkçe (Türkiye)"],["ur-PK","اردو (پاکستان)"],["ur-IN","اردو (بھارت)"],["el-GR","Ελληνικά (Ελλάδα)"],["bg-BG","Български (България)"],["ru-RU","Русский (Россия)"],["sr-RS","Српски (Србија)"],["uk-UA","Українська (Україна)"],["he-IL","עברית (ישראל)"],["ar-IL","العربية (إسرائيل)"],["ar-JO","العربية (الأردن)"],["ar-AE","العربية (الإمارات)"],["ar-BH","العربية (البحرين)"],["ar-DZ","العربية (الجزائر)"],["ar-SA","العربية (السعودية)"],["ar-IQ","العربية (العراق)"],["ar-KW","العربية (الكويت)"],["ar-MA","العربية (المغرب)"],["ar-TN","العربية (تونس)"],["ar-OM","العربية (عُمان)"],["ar-PS","العربية (فلسطين)"],["ar-QA","العربية (قطر)"],["ar-LB","العربية (لبنان)"],["ar-EG","العربية (مصر)"],["fa-IR","فارسی (ایران)"],["hi-IN","हिन्दी (भारत)"],["th-TH","ไทย (ประเทศไทย)"],["ko-KR","한국어 (대한민국)"],["cmn-Hant-TW","國語 (台灣)"],["yue-Hant-HK","廣東話 (香港)"],["ja-JP","日本語（日本）"],["cmn-Hans-HK","普通話 (香港)"],["cmn-Hans-CN","普通话 (中国大陆)"]];
    for (b = 0; b < a.length; b++) select_language.options[b] = new Option(a[b][1], a[b][0]);
    return a;
}

function P(a) {
    switch (a) {
        default: this.title = "Voice In",
        this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        this.TEXTAREA_PLACE_HOLDER = "Click the microphone to start dictating. Click here to start typing."
    }
    this.listPunctuationMarks = [":-)", ":-)", ":-(", ".", ".", ",", ",", "?", "?", ":", ":", ";", ";", ";", ";", ";", "!", "!", "!", "-", "-", "\n", "\n" + "\n", "\n", "\n", "(", "(", ")", ")"]
}

function Q(a) {
    a = a.split("-")[0];

    var b, c, d, e, f, g = [":-)", ":-)", ":-(", ".", ",", "?", ":", ";", "!", "-", "\n", "(", ")"];
    
    switch (a) {
        case "de":
            b = ["not_implemented"];
            c = [" punkt", " komma", " fragezeichen", " doppelpunkt", " semikolon", " semikolon", " semikolon", " ausrufezeichen", " ausrufezeichen", " neue zeile", " neuer absatz", " klammer öffnen", " klammer schließen", " bindestrich"];
            d = ["smiley", "trauriges gesicht", "Bindestrich "];
            e = [".", ",", "?", ":", ";", ";", ";", "!", "!", "\n", "\n" + "\n", "(", ")", "-"];
            f = [":-)", ":-(", "- "];
            this.period = "Punkt", this.comma = "Komma", this.question = "Fragezeichen", this.colon = "Doppelpunkt", this.semi = "Semikolon", this.exclamation = "Ausrufezeichen", this.dash = "Bindestrich", this.line = "Neue Zeile", this.paragraph = "Neuer Absatz", this.open = "Klammer öffnen", this.close = "Klammer schließen", this.smiley = "Smiley", this.sad = "Trauriges Gesicht";
            break;
        case "es":
            b = ["not_implemented"];
            c = [" coma", " signo de interrogación", " dos puntos", " 2 puntos", " punto y coma", " punto y,", " punto y ,", ". y coma", ". y,", ". y ,", " punto", " signo de exclamación", " exclamación", " nueva línea", " nuevo apartado", " abrir paréntesis", " cerrar paréntesis", " guión"];
            d = ["cara sonriente", "cara triste", "guión "];
            e = [",", "?", ":", ":", ";", ";", ";", ";", ";", ";", ".", "!", "!", "\n", "\n" + "\n", "(", ")", "-"], f = [":-)", ":-(", "- "];
            this.period = "Punto", this.comma = "Coma", this.question = "Signo de interrogación", this.colon = "Dos puntos", this.semi = "Punto y coma", this.exclamation = "Signo de exclamación, Exclamación", this.dash = "Guión", this.line = "Nueva línea", this.paragraph = "Nuevo apartado", this.open = "Abrir paréntesis", this.close = "Cerrar paréntesis", this.smiley = "Cara sonriente", this.sad = "Cara triste";
            break;
        case "fr":
            b = ["not_implemented"];
            c = [" virgule", " point d'interrogation", " deux-points", " deux points", " 2 points", " point-virgule", " point virgule", " point ,", " point,", " point d'exclamation", " point", " nouvelle ligne", " nouveau paragraphe", " ouvrir la parenthèse", " fermer la parenthèse", " tiret"]; 
            d = ["smiley", "visage triste", "tiret "];
            e = [",", "?", ":", ":", ":", ";", ";", ";", ";", "!", ".", "\n", "\n" + "\n", "(", ")", "-"]; 
            f = [":-)", ":-(", "- "]; 
            this.period = "Point", this.comma = "Virgule", this.question = "Point d'interrogation", this.colon = "Deux-points", this.semi = "Point-virgule", this.exclamation = "Point d'exclamation", this.dash = "Tiret", this.line = "Nouvelle ligne", this.paragraph = "Nouveau paragraphe", this.open = "Ouvrir la parenthèse", this.close = "Fermer la parenthèse", this.smiley = "Smiley", this.sad = "Visage triste";
            break;
        case "it":
            b = ["not_implemented"];
            c = [" virgula", " punto interrogativo", " due punti", " 2 punti", " punto e virgola", " punto e,", " punto e ,", " esclamativo", " punto esclamativo", " punto", " nuova riga", " nuovo paragrafo", " apri parentesi", " chiudi parentesi", " trattino"];
            d = ["smiley", "faccina sorridente", "faccina triste", "trattino "]; 
            e = [",", "?", ":", ":", ";", ";", ";", "!", "!", ".", "\n", "\n" + "\n", "(", ")", "-"];
            f = [":-)", ":-)", ":-(", "- "]; 
            this.period = "Punto", this.comma = "Virgola", this.question = "Punto interrogativo", this.colon = "Due punti", this.semi = "Punto e virgula", this.exclamation = "Esclamativo, Punto esclamativo", this.dash = "Trattino", this.line = "Nuova riga", this.paragraph = "Nuovo paragrafo", this.open = "Apri parentesi", this.close = "Chiudi parentesi", this.smiley = "Smiley, Faccina sorridente", this.sad = "Faccina triste";
            break;
        case "ru":
            b = ["not_implemented"];
            c = [" запятая", " вопросительный знак", " двоеточие", " точка с запятой", " точка с,", " точка с ,", " точка", " восклицательный символ", " восклицательный знак", " новая строка", " новый параграф", " открывающаяся скобка", " закрывающаяся скобка", " тире"]; 
            d = ["смайлик", "улыбочка", "грустное лицо", "тире "]; 
            e = [",", "?", ":", ";", ";", ";", ".", "!", "!", "\n", "\n" + "\n", "(", ")", "-"];
            f = [":-)", ":-)", ":-(", "- "];
            this.period = "Точка", this.comma = "Запятая", this.question = "Вопросительный знак", this.colon = "Двоеточие", this.semi = "Точка с запятой", this.exclamation = "Восклицательный символ, Восклицательный знак", this.dash = "Тире", this.line = "Новая строка", this.paragraph = "Новый параграф", this.open = "Открывающаяся скобка", this.close = "Закрывающаяся скобка", this.smiley = "Смайлик, Улыбочка", this.sad = "Грустное лицо";
            break;
        case "ja":
            b = ["not_implemented"];
            c = [" ピリオド ", " コンマ ", " 疑問符 ", " コロン ", " セミコロン ", " 感嘆符 ", "感嘆符記号", " 改行 ", " 新しい段落 ", " 括弧開き ", " 括弧閉じ", " ダッシュ "]; 
            d = [" スマイリー ", " 悲しい顔 ", " ダッシュ "], e = [". ", ", ", "? ", ": ", "; ", "! ", "! ", "\n", "\n" + "\n", " (", ") ", "-"]; 
            f = [" :-) ", " :-( ", "-"]; 
            this.period = "ピリオド", this.comma = "コンマ", this.question = "疑問符", this.colon = "コロン", this.semi = "セミコロン", this.exclamation = "感嘆符, 感嘆符記号", this.dash = "ダッシュ", this.line = "改行", this.paragraph = "新しい段落", this.open = "括弧開き", this.close = "括弧閉じ", this.smiley = "スマイリー", this.sad = "悲しい顔";
            break;
        case "cmn":
            b = ["not_implemented"];
            c = [" 句号 ", " 逗号 ", " 问号 ", " 冒号 ", " 分号 ", " 感叹号 ", " 换行 ", " 新段落 ", " 左圆括号 ", " 右圆括号", " 破折号 "]; 
            d = [" 笑脸 ", " 悲伤的脸 ", " 破折号 "];
            e = [". ", ", ", "? ", ": ", "; ", "! ", "\n", "\n" + "\n", " (", ") ", "——"]; 
            f = [" :-) ", " :-( ", "——"]; 
            this.period = "句号", this.comma = "逗号", this.question = "问号", this.colon = "冒号", this.semi = "分号", this.exclamation = "感叹号", this.dash = "破折号", this.line = "换行", this.paragraph = "新段落", this.open = "左圆括号", this.close = "右圆括号", this.smiley = "笑脸", this.sad = "悲伤的脸";
            break;
        case "ar":
            b = ["not_implemented"];
            c = [" فترة ", " فاصلة مفاصلة", " علامة استفهام", " نقطتان", " نقوطة", " طة التعجب", " علامة تعجب، ", " خط جديد", " فقرة جديدة", " افتح القوسان", " أغلق القوسان", " الشرطة"]; 
            d = ["مبتسم", "وجه حزين", "الشرطة "];
            e = [".", ";", "?", ":", ",", "!", "!", "\n", "\n" + "\n", "(", ")", "-"];
            f = [":-)", ":-(", "- "];
            this.period = "فترة", this.comma = "فاصلة", this.question = "علامة استفهام", this.colon = "نقطتان", this.semi = "فاصلة مفاصلة", this.exclamation = "علامة تعجب، نقطة التعجب", this.dash = "الشرطة", this.line = "خط جديد", this.paragraph = "فقرة جديدة", this.open = "افتح القوسان", this.close = "أغلق القوسان", this.smiley = "مبتسم، وجه مبتسم", this.sad = "وجه حزين";
            break;
        case "pt":
            b = ["not_implemented"];
            c = [" interrogação", " dois pontos", " 2 pontos", " ponto e vírgula", " ponto e,", " ponto e ,", " ponto", " vírgula", " exclamação", " nova linha", " parágrafo", " abre parêntese", " fecha parêntese", " hífen"];
            e = ["?", ":", ":", ";", ";", ";", ".", ",", "!", "\n", "\n" + "\n", "(", ")", "-"];
            d = ["smiley", "rosto triste", "hífen "];
            f = [":-)", ":-(", "- "];
            this.period = "Ponto", this.comma = "Vírgula", this.question = "Interrogação", this.colon = "Dois pontos", this.semi = "Ponto e vírgula", this.exclamation = "Exclamação", this.dash = "Hífen", this.line = "Nova linha", this.paragraph = "Parágrafo", this.open = "Abre parêntese", this.close = "Fecha parêntese", this.smiley = "Smiley", this.sad = "Rosto triste";
            break;
        default:
            b = ["not_implemented"];
            c = [" period", " comma", " question mark", " colon", " semicolon", " semi colon", " semi:", " semi :", " exclamation mark", " exclamation point", " new line", " new paragraph", " open parentheses", " close parentheses", " hyphen", " quotation mark"];
            d = ["smiley", "smiley face", "sad face", "dash "];
            e = [".", ",", "?", ":", ";", ";", ";", ";", "!", "!", "\n", "\n" + "\n", "(", ")", "-", '"'];
            f = [":-)", ":-)", ":-(", "- "];
            this.period = "Period", this.comma = "Comma", this.question = "Question mark", this.colon = "Colon", this.semi = "Semi Colon", this.exclamation = "Exclamation mark, Exclamation point", this.dash = "Dash, Hyphen", this.line = "New line", this.paragraph = "New paragraph", this.open = "Open parentheses", this.close = "Close parentheses", this.smiley = "Smiley, Smiley face", this.sad = "Sad face"
    }

    this.listActionCommands = b;
    this.listBreakCommands = d.concat(c, g, b);

    this.listToReplaceCommands = c.concat(d);
    for (var h = 0; h < c.length; h++) c[h] = X(c[h]);
    this.listToReplaceCommands = this.listToReplaceCommands.concat(c);
    for (var h = 0; h < c.length; h++) c[h] = Y(c[h]);
    for (var h = 0; h < d.length; h++) d[h] = Y(d[h]);
    this.listToReplaceCommands = this.listToReplaceCommands.concat(c, d);

    this.listToReplaceMarks = e.concat(f, e);
}

function X(a) {
  if (0 == a.length) return "";
  for (;" " == a[0] || a[0] == String.fromCharCode(160);)
      if (a = a.slice(1), 0 == a.length) return "";
  for (;" " == a[a.length - 1] || a[a.length - 1] == String.fromCharCode(160);)
      if (a = a.slice(0, -1), 0 == a.length) return "";
  return a;
}

function Y(a) {
  return a.replace(/\S/, function(a) {
    return a.toUpperCase();
  });
}

function Z(a, b) {
  for (var c = "", d = 0; d < b.length; d++)
    if (c = b[d], a.slice(a.length - c.length) === c) return !0;
  return !1;
}

function _(a, b) {
  aa(a, b, b);
}

function aa(a, b, c) {
  if (a.setSelectionRange) a.focus(), a.setSelectionRange(b, c);
  else if (a.createTextRange) {
    var d = a.createTextRange();
    d.collapse(!0), d.moveEnd("character", c), d.moveStart("character", b), d.select()
  }
}

var da = !1,
    ea = /\S/,
    fa = "en";
const ga = "voicein_context";
const ha = "\n";
const ia = [".", ":", "?", "!", ":-)", ":-(", "\n", "\n"];
var ja = new P("en"),
    ka, la = "",
    ma = 25,
    na = ["he", "iw", "ar"],
    oa = new Q("en-US"),
    pa = oa.listActionCommands,
    qa = oa.listBreakCommands,
    ra = oa.listToReplaceCommands,
    sa = oa.listToReplaceMarks,
    ta, ua = {},
    va, wa = 0,
    xa = !1,
    ya = "",
    za = "";