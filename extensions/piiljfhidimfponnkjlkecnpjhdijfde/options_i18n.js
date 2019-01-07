
/*------------------------------------------------
G-calize : for Chrome Extension
Colorize Day of the Week in Google Calendar(TM)
Copyright Yo Wauke. All rights reserved.
--------------------------------------------------
this file is Internationalization texts.
If some words are wrong,
please contact me with your language code.
piayo: [ pianomanyo@gmail.com ]
https://plus.google.com/104819699346433230202/about
--------------------------------------------------
memo:
http://code.google.com/intl/ja/chrome/webstore/docs/i18n.html#localeTable
https://developers.google.com/chrome/web-store/docs/i18n#localeTable
------------------------------------------------*/

var _ROOT = this;

function _i18n(){
	var extDes = chrome.i18n.getMessage('extDes');//why!?(maybe chrome stop translating...)
	$("#extDes").attr("content", extDes);
	chrome.i18n.getAcceptLanguages(function(langs){
		for(var i=0;i<langs.length;i++){
			var g = langs[i].replace(/[-_]/g, '');
			if(Gcalize_i18n[g]){ _i18n_SET(Gcalize_i18n[g]); return; }
		}
		_i18n_SET(Gcalize_i18n['en']); return;
	});
	
	/*
	var g = navigator.browserLanguage || navigator.language || navigator.userLanguage;
	if(Gcalize_i18n[g]){
		_i18n_SET(Gcalize_i18n[g]); return;
	}else{
		_i18n_SET(Gcalize_i18n['en']); return;
	}
	*/
}
function _i18n_SET(langU){
	//trace(langU);
	//1st
	for(i in langU){
		var ele = $("[i18n="+i+"]");
		if(ele.length > 0){ ele.text(langU[i]); }
	}
	//week
	var arr_weeks = langU['week_ALL'].split(",");
	for(var i=0;i<arr_weeks.length;i++){
		$("[i18n='week_"+i+"']").text(arr_weeks[i]);
	}
	//alert
	var arr_alert = ["act_save","act_cfrm","act_reset","act_plsID","act_iptOK","act_nonHDY"];
	for(var i=0;i<arr_alert.length;i++){
		if(_ROOT[arr_alert[i]] && langU[arr_alert[i]]){
			_ROOT[arr_alert[i]] = langU[arr_alert[i]];
		}
		//trace(_ROOT[arr_alert[i]])
	}
}



//texts
var act_save   = "Settings Saved.";
var act_cfrm   = "Restore to Default. Are you sure?";
var act_reset  = "Settings was restored to default.";

var act_plsID  = "Please Input the Calendar ID.";
var act_iptOK  = "Import Completed.";
var act_nonHDY = "Holiday could not be found.";

var Gcalize_i18n = {
	
	//日本語
	"ja" : {
		"txt_color"	: "文字色",
		"bg_color"	: "背景色",
		"week_TODAY": "今日",
		"week_ALL"  : "日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日",

"tab_week"	: "曜日の設定",
"tab_hldy"	: "祝日の設定",
"enable_c"	: "色を有効",
"slc_HDCAL" : "祝日のカレンダーを選択",
"frm_CALID" : "カレンダーIDから",
"btn_CIDIN"	: "選択",
"frm_GOOGLE": "Googleから",
"slc_GLIST" : "▼カレンダーを選択",
"E_LOADED"  : "選択してインポートされたカレンダー",
"E_cal_NAME": "カレンダー名",
"E_cal_ID"  : "カレンダーID",
"E_cal_DATA": "データの内容",
"hld_color" : "祝日の色",
"act_plsID"	: "カレンダーIDを入力してください",
"act_iptOK"	: "インポートに成功しました",
"act_nonHDY": "祝日が見つかりませんでした",

		"btn_save"	: "保存",
		"btn_reset"	: "デフォルトに戻す",
		"act_save"	: "設定を保存しました",
		"act_cfrm"	: "設定をデフォルトに戻します。よろしいですか？",
		"act_reset"	: "設定をデフォルトに戻しました"
	},
	
	//英語
	"en" : {
		"txt_color"	: "font color",
		"bg_color"	: "background color",
		"week_TODAY": "Today Cell",
		"week_ALL"	: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
		
"tab_week"	: "Day of the week",
"tab_hldy"	: "Holiday",
"enable_c"	: "Enable color",
"slc_HDCAL" : "Select the Holidays Calendar",
"frm_CALID" : "by Calendar ID",
"btn_CIDIN"	: "Select",
"frm_GOOGLE": "by Google",
"slc_GLIST" : "Select a Calendar",
"E_LOADED"  : "Selected and Imported Calendar",
"E_cal_NAME": "Calendar Name",
"E_cal_ID"  : "Calendar ID",
"E_cal_DATA": "Imported Data",
"hld_color" : "Holiday Color",
"act_plsID"	: "Please Input the Calendar ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Holiday could not be found.",
		
		"btn_save"	: "Save",
		"btn_reset"	: "Reset to Default",
		"act_save"	: "Settings Saved.",
		"act_cfrm"	: "Restore to Default. Are you sure?",
		"act_reset"	: "Settings was restored to default."
	},
	
	//英語
	"enGB" : {
		"txt_color"	: "font color",
		"bg_color"	: "background color",
		"week_TODAY": "Today Cell",
		"week_ALL"	: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
		
"tab_week"	: "Day of the week",
"tab_hldy"	: "Holiday",
"enable_c"	: "Enable color",
"slc_HDCAL" : "Select the Holidays Calendar",
"frm_CALID" : "by Calendar ID",
"btn_CIDIN"	: "Select",
"frm_GOOGLE": "by Google",
"slc_GLIST" : "Select a Calendar",
"E_LOADED"  : "Selected and Imported Calendar",
"E_cal_NAME": "Calendar Name",
"E_cal_ID"  : "Calendar ID",
"E_cal_DATA": "Imported Data",
"hld_color" : "Holiday Color",
"act_plsID"	: "Please Input the Calendar ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Holiday could not be found.",
		
		"btn_save"	: "Save",
		"btn_reset"	: "Reset to Default",
		"act_save"	: "Settings Saved.",
		"act_cfrm"	: "Restore to Default. Are you sure?",
		"act_reset"	: "Settings was restored to default."
	},
	
	//英語
	"enUS" : {
		"txt_color"	: "font color",
		"bg_color"	: "background color",
		"week_TODAY": "Today Cell",
		"week_ALL"	: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
		
"tab_week"	: "Day of the week",
"tab_hldy"	: "Holiday",
"enable_c"	: "Enable color",
"slc_HDCAL" : "Select the Holidays Calendar",
"frm_CALID" : "by Calendar ID",
"btn_CIDIN"	: "Select",
"frm_GOOGLE": "by Google",
"slc_GLIST" : "Select a Calendar",
"E_LOADED"  : "Selected and Imported Calendar",
"E_cal_NAME": "Calendar Name",
"E_cal_ID"  : "Calendar ID",
"E_cal_DATA": "Imported Data",
"hld_color" : "Holiday Color",
"act_plsID"	: "Please Input the Calendar ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Holiday could not be found.",
		
		"btn_save"	: "Save",
		"btn_reset"	: "Reset to Default",
		"act_save"	: "Settings Saved.",
		"act_cfrm"	: "Restore to Default. Are you sure?",
		"act_reset"	: "Settings was restored to default."
	},
	
	//ブルガリア語
	"bg" : {
		"txt_color"	: "Писмо цвят",
		"bg_color"	: "цвят на фона",
		"week_TODAY": "днес",
		"week_ALL"  : "неделя,понеделник,вторник,сряда,четвъртък,петък,събота",

"tab_week"	: "Денят от седмицата",
"tab_hldy"	: "празник",
"enable_c"	: "Активирайте цвят",
"slc_HDCAL" : "Изберете празници Календар",
"frm_CALID" : "Календар ID",
"btn_CIDIN"	: "Изберете",
"frm_GOOGLE": "от Google",
"slc_GLIST" : "Изберете календар",
"E_LOADED"  : "Избрани и Внесените Календар",
"E_cal_NAME": "Името на календара",
"E_cal_ID"  : "Календар ID",
"E_cal_DATA": "импортираните данни",
"hld_color" : "празник цветове",
"act_plsID"	: "Моля, въведете ID Календар.",
"act_iptOK"	: "Внос Завършен.",
"act_nonHDY": "празник не може да бъде намерен.",

		"btn_save"	: "Запази",
		"btn_reset"	: "Инициализация",
		"act_save"	: "Запаметени настройки",
		"act_cfrm"	: "Нулира настройките. Сигурни ли сте?",
		"act_reset"	: "Бяха към настройките по подразбиране"
	},
	
	//カタロニア語
	"ca" : {
		"txt_color"	: "carta de color",
		"bg_color"	: "color de fons",
		"week_TODAY": "avui",
		"week_ALL"  : "diumenge,dilluns,dimarts,dimecres,dijous,divendres,dissabte",

"tab_week"	: "El dia de la setmana",
"tab_hldy"	: "Holiday",
"enable_c"	: "Habilita color",
"slc_HDCAL" : "Seleccioneu el calendari de dies de festa",
"frm_CALID" : "Calendari de ID",
"btn_CIDIN"	: "Selecciona",
"frm_GOOGLE": "de Google",
"slc_GLIST" : "Seleccionar un calendari",
"E_LOADED"  : "calendari seleccionat i importats",
"E_cal_NAME": "Nom de calendari",
"E_cal_ID"  : "ID del calendari",
"E_cal_DATA": "Les dades importats",
"hld_color" : "Color de vacances",
"act_plsID"	: "Si us plau, introduïu l'ID de calendari.",
"act_iptOK"	: "Importació completada.",
"act_nonHDY": "Dia de festa no va poder ser trobat.",

		"btn_save"	: "estalviar",
		"btn_reset"	: "inicialització",
		"act_save"	: "Els ajustaments guardats",
		"act_cfrm"	: "Inicialitza la configuració. Segur?",
		"act_reset"	: "Ajustaments s'han inicialitzat"
	},
	
	//チェコ語
	"cs" : {
		"txt_color"	: "dopis barvy",
		"bg_color"	: "barva pozadí",
		"week_TODAY": "dnes",
		"week_ALL"  : "Neděle,Pondělí,Úterý,Středa,Čtvrtek,Pátek,Sobota",

"tab_week"	: "Den v týdnu",
"tab_hldy"	: "dovolená",
"enable_c"	: "Povolit barvy",
"slc_HDCAL" : "Vyberte svátky kalendáře",
"frm_CALID" : "podle kalendářních ID",
"btn_CIDIN"	: "vybrat",
"frm_GOOGLE": "od Google",
"slc_GLIST" : "Vybrat kalendář",
"E_LOADED"  : "Vybraná a dovážených Kalendář",
"E_cal_NAME": "Název kalendáře",
"E_cal_ID"  : "Kalendář ID",
"E_cal_DATA": "importovaných dat",
"hld_color" : "dovolená barev",
"act_plsID"	: "Zadejte prosím ID kalendáře.",
"act_iptOK"	: "Dovoz dokončena.",
"act_nonHDY": "Dovolená nebyla nalezena.",

		"btn_save"	: "uložit",
		"btn_reset"	: "inicializace",
		"act_save"	: "Nastavení uloženo",
		"act_cfrm"	: "Inicializuje nastavení. Jste si jisti?",
		"act_reset"	: "Nastavení byly inicializovány"
	},
	
	//デンマーク語
	"da" : {
		"txt_color"	: "brev farve",
		"bg_color"	: "baggrundsfarve",
		"week_TODAY": "I dag",
		"week_ALL"  : "søndag,mandag,tirsdag,onsdag,torsdag,fredag,lørdag",

"tab_week"	: "Dag i ugen",
"tab_hldy"	: "Holiday",
"enable_c"	: "Aktiver farve",
"slc_HDCAL" : "Vælg Holidays Kalender",
"frm_CALID" : "ved Calendar ID",
"btn_CIDIN"	: "Vælg",
"frm_GOOGLE": "af Googles",
"slc_GLIST" : "Vælg en kalender",
"E_LOADED"  : "Valgte og Importerede Kalender",
"E_cal_NAME": "Kalender Navn",
"E_cal_ID"  : "Kalender-id",
"E_cal_DATA": "importerede data",
"hld_color" : "ferie Color",
"act_plsID"	: "Skriv venligst Kalender ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Ferie kunne ikke findes.",

		"btn_save"	: "Gem",
		"btn_reset"	: "initialisering",
		"act_save"	: "Indstillinger gemt",
		"act_cfrm"	: "Initialiserer indstillingerne. Er du sikker?",
		"act_reset"	: "Indstillinger er blevet initialiseret"
	},
	
	//ドイツ語
	"de" : {
		"txt_color"	: "Brief Farbe",
		"bg_color"	: "Hintergrundfarbe",
		"week_TODAY": "Heute",
		"week_ALL"  : "Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag",

"tab_week"	: "Tag der Woche",
"tab_hldy"	: "Urlaub",
"enable_c"	: "aktivieren Sie Farbe",
"slc_HDCAL" : "Wählen Sie die Feiertage Kalender",
"frm_CALID" : "von Kalender-ID",
"btn_CIDIN"	: "wählen",
"frm_GOOGLE": "von Google",
"slc_GLIST" : "Wählen Sie einen Kalender",
"E_LOADED"  : "Ausgewählte und Importierte Kalender",
"E_cal_NAME": "Kalender Namen",
"E_cal_ID"  : "Kalender-ID",
"E_cal_DATA": "importierte Daten",
"hld_color" : "Ferienwohnung Farbe",
"act_plsID"	: "Bitte geben Sie die Kalender-ID.",
"act_iptOK"	: "Import abgeschlossen.",
"act_nonHDY": "Urlaub konnte nicht gefunden werden.",

		"btn_save"	: "sparen",
		"btn_reset"	: "Initialisierung",
		"act_save"	: "Einstellungen gespeichert",
		"act_cfrm"	: "Initialisiert die Einstellungen. Sind Sie sicher?",
		"act_reset"	: "Einstellungen initialisiert wurden"
	},
	
	//ギリシャ語
	"el" : {
		"txt_color"	: "επιστολή χρώμα",
		"bg_color"	: "χρώμα φόντου",
		"week_TODAY": "σήμερα",
		"week_ALL"  : "Κυριακή,Δευτέρα,Τρίτη,Τετάρτη,Πέμπτη,Παρασκευή,Σάββατο",

"tab_week"	: "Ημέρα της εβδομάδας",
"tab_hldy"	: "αργία",
"enable_c"	: "Ενεργοποίηση χρώμα",
"slc_HDCAL" : "Επιλέξτε το Ημερολόγιο Διακοπές",
"frm_CALID" : "Ημερολόγιο από την ID",
"btn_CIDIN"	: "Επιλέξτε",
"frm_GOOGLE": "από της Google",
"slc_GLIST" : "Επιλέξτε ένα Ημερολόγιο",
"E_LOADED"  : "Επιλεγμένα και εισαγόμενα Ημερολόγιο",
"E_cal_NAME": "Όνομα Ημερολόγιο",
"E_cal_ID"  : "Ημερολόγιο ID",
"E_cal_DATA": "Τα εισαγόμενα δεδομένα",
"hld_color" : "Holiday Χρώμα",
"act_plsID"	: "Παρακαλώ εισάγετε το ID Ημερολόγιο.",
"act_iptOK"	: "Η εισαγωγή ολοκληρώθηκε.",
"act_nonHDY": "Διακοπές δεν θα μπορούσε να βρεθεί.",

		"btn_save"	: "εκτός",
		"btn_reset"	: "αρχικοποίηση",
		"act_save"	: "Ρυθμίσεις αποθηκευμένες",
		"act_cfrm"	: "Αρχικοποιεί τις ρυθμίσεις. Είσαι σίγουρος;",
		"act_reset"	: "Ρυθμίσεις έχουν αρχικοποιηθεί"
	},
	
	//スペイン語
	"es" : {
		"txt_color"	: "carta de color",
		"bg_color"	: "color de fondo",
		"week_TODAY": "hoy",
		"week_ALL"  : "domingo,lunes,martes,miércoles,jueves,viernes,sábado",

"tab_week"	: "Día de la semana",
"tab_hldy"	: "fiesta",
"enable_c"	: "activar el color",
"slc_HDCAL" : "Seleccione el calendario de vacaciones",
"frm_CALID" : "Calendario por ID",
"btn_CIDIN"	: "seleccionar",
"frm_GOOGLE": "por Google,",
"slc_GLIST" : "Seleccione un calendario",
"E_LOADED"  : "Calendario seleccionados e importados",
"E_cal_NAME": "Calendario Nombre",
"E_cal_ID"  : "ID de calendario",
"E_cal_DATA": "Los datos importados",
"hld_color" : "fiesta color",
"act_plsID"	: "Por favor, introduzca el ID de calendario.",
"act_iptOK"	: "Completada la importación.",
"act_nonHDY": "Día de fiesta no pudo ser encontrado.",

		"btn_save"	: "ahorrar",
		"btn_reset"	: "inicialización",
		"act_save"	: "Los ajustes guardados",
		"act_cfrm"	: "Inicializa la configuración. ¿Está seguro?",
		"act_reset"	: "Ajustes se han inicializado"
	},
	
	//フィンランド語
	"fi" : {
		"txt_color"	: "Letter väri",
		"bg_color"	: "taustaväri",
		"week_TODAY": "tänään",
		"week_ALL"  : "sunnuntai,maanantai,tiistai,keskiviikko,torstai,perjantai,lauantai",

"tab_week"	: "Viikonpäivä",
"tab_hldy"	: "Holiday",
"enable_c"	: "Ota väri",
"slc_HDCAL" : "Valitse Holidays Kalenteri",
"frm_CALID" : "mennessä Kalenteri tunnus",
"btn_CIDIN"	: "Valitse",
"frm_GOOGLE": "Googlen",
"slc_GLIST" : "Valitse Kalenteri",
"E_LOADED"  : "Valitut ja tuodaan Kalenteri",
"E_cal_NAME": "kalenterin nimi",
"E_cal_ID"  : "Kalenteri tunnus",
"E_cal_DATA": "tuotujen tietojen",
"hld_color" : "Holiday n Color",
"act_plsID"	: "Syötä kalenterin tunnus.",
"act_iptOK"	: "Tuonti on valmis.",
"act_nonHDY": "Loma ei löytynyt.",

		"btn_save"	: "Tallenna",
		"btn_reset"	: "alustuksen",
		"act_save"	: "Asetukset tallennettu",
		"act_cfrm"	: "Alustaa asetukset. Oletko varma?",
		"act_reset"	: "Asetukset on alustettu"
	},

/*	
	//フィリピノ語???
	"fil" : {
		"txt_color"	: "Letter kulay",
		"bg_color"	: "kulay ng background",
		"week_TODAY": "Ngayong",
		"week_ALL"  : "Linggo,Lunes,Martes,Miyerkules,Huwebes,Biyernes,Sabado",

"tab_week"	: "Day of the week",
"tab_hldy"	: "Holiday",
"enable_c"	: "Enable color",
"slc_HDCAL" : "Select the Holidays Calendar",
"frm_CALID" : "by Calendar ID",
"btn_CIDIN"	: "Select",
"frm_GOOGLE": "by Google's",
"slc_GLIST" : "Select a Calendar",
"E_LOADED"  : "Selected and Imported Calendar",
"E_cal_NAME": "Calendar Name",
"E_cal_ID"  : "Calendar ID",
"E_cal_DATA": "Imported Data",
"hld_color" : "Holiday Color",
"act_plsID"	: "Please Input the Calendar ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Holiday could not be found.",

		"btn_save"	: "I-save ang",
		"btn_reset"	: "Pinasimulan",
		"act_save"	: "Nai-save na mga setting",
		"act_cfrm"	: "Initializes ang mga setting. Sigurado ka ba?",
		"act_reset"	: "Setting ay na-initialized"
	},
*/
	//フランス語
	"fr" : {
		"txt_color"	: "Lettre de couleur",
		"bg_color"	: "couleur de fond",
		"week_TODAY": "aujourd'hui",
		"week_ALL"  : "dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi",

"tab_week"	: "Jour de la semaine",
"tab_hldy"	: "Vacances",
"enable_c"	: "Activer la couleur",
"slc_HDCAL" : "Sélectionnez le calendrier Vacances",
"frm_CALID" : "Calendrier par ID",
"btn_CIDIN"	: "Sélectionnez",
"frm_GOOGLE": "par Google",
"slc_GLIST" : "Sélectionnez un calendrier",
"E_LOADED"  : "Calendrier sélectionnées et importées",
"E_cal_NAME": "Nom Calendrier",
"E_cal_ID"  : "Calendrier ID",
"E_cal_DATA": "Les données importées",
"hld_color" : "Couleur Vacances",
"act_plsID"	: "S'il vous plaît entrer l'ID du calendrier.",
"act_iptOK"	: "Importer Terminé.",
"act_nonHDY": "Vacances n'a pas pu être trouvé.",

		"btn_save"	: "Enregistrer",
		"btn_reset"	: "initialisation",
		"act_save"	: "Paramètres enregistrés",
		"act_cfrm"	: "Initialise les paramètres. Etes-vous sûr?",
		"act_reset"	: "Paramètres ont été initialisés"
	},
	
	//ヒンディー語
	"hi" : {
		"txt_color"	: "पत्र रंग",
		"bg_color"	: "पृष्ठभूमि का रंग",
		"week_TODAY": "आज",
		"week_ALL"  : "रविवार,सोमवार,मंगलवार,बुधवार,बृहस्पतिवार,शुक्रवार,शनिवार",

"tab_week"	: "सप्ताह के दिवस",
"tab_hldy"	: "छुट्टियां",
"enable_c"	: "रंग सक्षम",
"slc_HDCAL" : "अवकाश कैलेंडर का चयन करें",
"frm_CALID" : "कैलेंडर आईडी द्वारा",
"btn_CIDIN"	: "चयन",
"frm_GOOGLE": "गूगल द्वारा",
"slc_GLIST" : "एक कैलेंडर का चयन करें",
"E_LOADED"  : "चयनित और आयातित कैलेंडर",
"E_cal_NAME": "कैलेंडर का नाम",
"E_cal_ID"  : "कैलेंडर आईडी",
"E_cal_DATA": "आयातित डेटा",
"hld_color" : "छुट्टियों के रंग",
"act_plsID"	: "कृपया कैलेंडर आईडी इनपुट.",
"act_iptOK"	: "आयात पूर्ण.",
"act_nonHDY": "छुट्टी पाया नहीं जा सका.",

		"btn_save"	: "बचाना",
		"btn_reset"	: "आरंभीकरण",
		"act_save"	: "सेटिंग्स सहेजे",
		"act_cfrm"	: "मूल सेटिंग्स पर वापस जाएँ. तुम्हें यकीन है?",
		"act_reset"	: "सेटिंग्स प्रारंभ किया गया है"
	},
	
	//クロアチア語
	"hr" : {
		"txt_color"	: "Pismo boja",
		"bg_color"	: "boja pozadine",
		"week_TODAY": "danas",
		"week_ALL"  : "nedjelja,ponedjeljak,utorak,srijeda,četvrtak,petak,subota",

"tab_week"	: "Dan u tjednu",
"tab_hldy"	: "praznici",
"enable_c"	: "Omogući boja",
"slc_HDCAL" : "Odaberite Odmor Kalendar",
"frm_CALID" : "po Kalendar ID",
"btn_CIDIN"	: "odabrati",
"frm_GOOGLE": "Google je",
"slc_GLIST" : "Odaberite kalendar",
"E_LOADED"  : "Odabrani i uvezenih Kalendar",
"E_cal_NAME": "Kalendar Naziv",
"E_cal_ID"  : "Kalendar ID",
"E_cal_DATA": "uvezenih podataka",
"hld_color" : "odmor u boji",
"act_plsID"	: "Molimo unesite Kalendar ID.",
"act_iptOK"	: "Uvoz je dovršen.",
"act_nonHDY": "Odmor nije mogao biti pronađen.",

		"btn_save"	: "spasiti",
		"btn_reset"	: "inicijalizacija",
		"act_save"	: "Postavke su spremljene",
		"act_cfrm"	: "Inicijalizira postavke. Jeste li sigurni?",
		"act_reset"	: "Postavke su inicijalizirana"
	},
	
	//ハンガリー語
	"hu" : {
		"txt_color"	: "Letter színes",
		"bg_color"	: "háttérszín",
		"week_TODAY": "ma",
		"week_ALL"  : "vasárnap,hétfő,kedd,szerda,csütörtök,péntek,szombat",

"tab_week"	: "A hét napja",
"tab_hldy"	: "ünnepek",
"enable_c"	: "Engedélyezze a színes",
"slc_HDCAL" : "Válassza ki az ünnepek Naptár",
"frm_CALID" : "a Naptár ID",
"btn_CIDIN"	: "Válassza ki",
"frm_GOOGLE": "a Google",
"slc_GLIST" : "Válassza ki a naptár",
"E_LOADED"  : "Válogatott és az importált naptár",
"E_cal_NAME": "Naptár neve",
"E_cal_ID"  : "Naptár ID",
"E_cal_DATA": "importált adatok",
"hld_color" : "ünnepek Color",
"act_plsID"	: "Kérjük, adja meg a Naptár ID.",
"act_iptOK"	: "Import Kész.",
"act_nonHDY": "Nyaralás nem található.",

		"btn_save"	: "kivéve",
		"btn_reset"	: "inicializálás",
		"act_save"	: "Beállítások mentése",
		"act_cfrm"	: "Inicializálja a beállításokat. Biztos vagy benne?",
		"act_reset"	: "Beállítások már inicializálva"
	},
	
	//インドネシア語
	"id" : {
		"txt_color"	: "surat warna",
		"bg_color"	: "warna latar belakang",
		"week_TODAY": "Hari ini",
		"week_ALL"  : "Minggu,Senin,Selasa,Rabu,Kamis,Jumat,Sabtu",

"tab_week"	: "Hari dalam seminggu",
"tab_hldy"	: "Wisata",
"enable_c"	: "Aktifkan warna",
"slc_HDCAL" : "Pilih Kalender Wisata",
"frm_CALID" : "oleh Kalender ID",
"btn_CIDIN"	: "pilih",
"frm_GOOGLE": "oleh Google",
"slc_GLIST" : "Pilih Kalender suatu",
"E_LOADED"  : "Dipilih dan Impor Kalender",
"E_cal_NAME": "Nama Kalender",
"E_cal_ID"  : "Kalender ID",
"E_cal_DATA": "impor data",
"hld_color" : "Warna Wisata",
"act_plsID"	: "Silahkan Masukkan ID Kalender.",
"act_iptOK"	: "Impor Selesai.",
"act_nonHDY": "Liburan tidak dapat ditemukan.",

		"btn_save"	: "Simpan",
		"btn_reset"	: "inisialisasi",
		"act_save"	: "Pengaturan Tersimpan",
		"act_cfrm"	: "Menginisialisasi pengaturan. Apakah Anda yakin?",
		"act_reset"	: "Pengaturan telah diinisialisasi"
	},
	
	//イタリア語
	"it" : {
		"txt_color"	: "lettera a colori",
		"bg_color"	: "colore di sfondo",
		"week_TODAY": "Oggi",
		"week_ALL"  : "Domenica,Lunedì,Martedì,Mercoledì,Giovedì,Venerdì,Sabato",

"tab_week"	: "Giorno della settimana",
"tab_hldy"	: "vacanze",
"enable_c"	: "Abilita colore",
"slc_HDCAL" : "Selezionare il calendario vacanze",
"frm_CALID" : "Calendario da ID",
"btn_CIDIN"	: "selezionare",
"frm_GOOGLE": "da Google",
"slc_GLIST" : "Selezionare un Calendario",
"E_LOADED"  : "Calendario selezionati e importati",
"E_cal_NAME": "Nome calendario",
"E_cal_ID"  : "Calendario ID",
"E_cal_DATA": "I dati importati",
"hld_color" : "vacanze a colori",
"act_plsID"	: "Si prega di inserire l'ID del calendario.",
"act_iptOK"	: "Completato l'importazione.",
"act_nonHDY": "Vacanze non è stato trovato.",

		"btn_save"	: "salvare",
		"btn_reset"	: "inizializzazione",
		"act_save"	: "Impostazioni salvate",
		"act_cfrm"	: "Inizializza le impostazioni. Sei sicuro?",
		"act_reset"	: "Impostazioni sono state inizializzate"
	},
	
	//韓国語
	"ko" : {
		"txt_color"	: "글자색",
		"bg_color"	: "배경색",
		"week_TODAY": "오늘",
		"week_ALL"  : "일요일,월요일,화요일,수요일,목요일,금요일,토요일",

"tab_week"	: "요일",
"tab_hldy"	: "휴가",
"enable_c"	: "색상을 사용",
"slc_HDCAL" : "휴일 캘린더를 선택하십시오",
"frm_CALID" : "캘린더 ID에 의해",
"btn_CIDIN"	: "선택",
"frm_GOOGLE": "Google의에 의해",
"slc_GLIST" : "캘린더를 선택하십시오",
"E_LOADED"  : "선택 및 수입 일정",
"E_cal_NAME": "캘린더 이름",
"E_cal_ID"  : "캘린더 ID",
"E_cal_DATA": "가져온 데이터",
"hld_color" : "휴일 색상",
"act_plsID"	: "입력 캘린더 ID를하시기 바랍니다.",
"act_iptOK"	: "가져오기가 완료되었습니다.",
"act_nonHDY": "휴일을 찾을 수 없습니다.",

		"btn_save"	: "저장",
		"btn_reset"	: "초기화",
		"act_save"	: "설정을 저장했습니다",
		"act_cfrm"	: "설정을 초기화합니다. 시겠습니까?",
		"act_reset"	: "설정을 초기화했습니다"
	},
	
	//リトアニア語
	"lt" : {
		"txt_color"	: "Laiškas spalva",
		"bg_color"	: "Fono spalva",
		"week_TODAY": "šiandien",
		"week_ALL"  : "sekmadienis,pirmadienis,antradienis,trečiadienis,ketvirtadienis,penktadienis,šeštadienis",

"tab_week"	: "Savaitės diena",
"tab_hldy"	: "Šventės",
"enable_c"	: "Įjungti spalva",
"slc_HDCAL" : "Pasirinkite Šventės Kalendorius",
"frm_CALID" : "Kalendorius ID",
"btn_CIDIN"	: "pasirinkti",
"frm_GOOGLE": "nuo Google",
"slc_GLIST" : "Pasirinkite kalendorių",
"E_LOADED"  : "Atrinkti ir Importuotas Kalendorius",
"E_cal_NAME": "kalendoriaus pavadinimas",
"E_cal_ID"  : "kalendorius ID",
"E_cal_DATA": "importuotų duomenų",
"hld_color" : "Šventės Spalva",
"act_plsID"	: "Prašome įvesti Kalendorius ID.",
"act_iptOK"	: "Perkėlimas baigtas.",
"act_nonHDY": "Šventės negalėjo rasti.",

		"btn_save"	: "sutaupyti",
		"btn_reset"	: "Pradės",
		"act_save"	: "Nustatymai Išsaugotas",
		"act_cfrm"	: "Inicijuoja nustatymus. Ar tikrai?",
		"act_reset"	: "Nustatymai buvo inicijuoti"
	},
	
	//ラトビア語
	"lv" : {
		"txt_color"	: "vēstule krāsa",
		"bg_color"	: "fona krāsa",
		"week_TODAY": "šodien",
		"week_ALL"  : "svētdiena,pirmdiena,otrdiena,trešdiena,ceturtdiena,piektdiena,sestdiena",

"tab_week"	: "Nedēļas dienas",
"tab_hldy"	: "brīvdienas",
"enable_c"	: "Ieslēgt krāsu",
"slc_HDCAL" : "Izvēlieties Holidays Calendar",
"frm_CALID" : "ar Kalendārs ID",
"btn_CIDIN"	: "izvēlieties",
"frm_GOOGLE": "ar Google",
"slc_GLIST" : "Izvēlieties Calendar",
"E_LOADED"  : "Atlasīti un importētiem Calendar",
"E_cal_NAME": "kalendāra nosaukums",
"E_cal_ID"  : "Kalendārs ID",
"E_cal_DATA": "Importētie dati",
"hld_color" : "brīvdienas Color",
"act_plsID"	: "Lūdzu, ievadiet Calendar ID.",
"act_iptOK"	: "Imports Pabeigts.",
"act_nonHDY": "Brīvdienas nevar atrast.",

		"btn_save"	: "saglabāt",
		"btn_reset"	: "inicializēšana",
		"act_save"	: "Settings Saglabātie",
		"act_cfrm"	: "Initializes uzstādījumus. Vai esat pārliecināts?",
		"act_reset"	: "Uzstādījumi ir inicializēts"
	},
	
	//オランダ語
	"nl" : {
		"txt_color"	: "letter kleur",
		"bg_color"	: "achtergrond kleur",
		"week_TODAY": "vandaag",
		"week_ALL"  : "zondag,maandag,dinsdag,woensdag,donderdag,vrijdag,zaterdag",

"tab_week"	: "Dag van de week",
"tab_hldy"	: "vakantie",
"enable_c"	: "Enable kleur",
"slc_HDCAL" : "Selecteer de feestdagen kalender",
"frm_CALID" : "door Calendar ID",
"btn_CIDIN"	: "kiezen",
"frm_GOOGLE": "door Google",
"slc_GLIST" : "Selecteer een kalender",
"E_LOADED"  : "Geselecteerd en geïmporteerde agenda",
"E_cal_NAME": "kalender Naam",
"E_cal_ID"  : "kalender ID",
"E_cal_DATA": "geïmporteerde data",
"hld_color" : "vakantie Color",
"act_plsID"	: "Voer de Calendar ID.",
"act_iptOK"	: "Importeren voltooid.",
"act_nonHDY": "Vakantie kon niet worden gevonden.",

		"btn_save"	: "besparen",
		"btn_reset"	: "initialisatie",
		"act_save"	: "Instellingen opgeslagen",
		"act_cfrm"	: "Initialiseert de instellingen. Weet je het zeker?",
		"act_reset"	: "Instellingen zijn geïnitialiseerd"
	},
	
	//ノルウェー語
	/*
	"no" : {
		"txt_color"	: "Letter farge",
		"bg_color"	: "bakgrunnsfarge",
		"week_TODAY": "i dag",
		"week_ALL"  : "søndag,mandag,tirsdag,onsdag,torsdag,fredag,lørdag",

"tab_week"	: "Day of the week",
"tab_hldy"	: "Holiday",
"enable_c"	: "Enable color",
"slc_HDCAL" : "Select the Holidays Calendar",
"frm_CALID" : "by Calendar ID",
"btn_CIDIN"	: "Select",
"frm_GOOGLE": "by Google's",
"slc_GLIST" : "Select a Calendar",
"E_LOADED"  : "Selected and Imported Calendar",
"E_cal_NAME": "Calendar Name",
"E_cal_ID"  : "Calendar ID",
"E_cal_DATA": "Imported Data",
"hld_color" : "Holiday Color",
"act_plsID"	: "Please Input the Calendar ID.",
"act_iptOK"	: "Import Completed.",
"act_nonHDY": "Holiday could not be found.",

		"btn_save"	: "Lagre",
		"btn_reset"	: "initialisering",
		"act_save"	: "Settings Saved",
		"act_cfrm"	: "Initialiserer innstillingene. Er du sikker?",
		"act_reset"	: "Innstillingene har blitt initialisert"
	},
	*/
	
	//ポーランド語
	"pl" : {
		"txt_color"	: "list kolor",
		"bg_color"	: "kolor tła",
		"week_TODAY": "dzisiaj",
		"week_ALL"  : "niedziela,poniedziałek,wtorek,środa,czwartek,piątek,sobota",

"tab_week"	: "Dzień tygodnia",
"tab_hldy"	: "Wakacje",
"enable_c"	: "Włącz kolor",
"slc_HDCAL" : "Wybierz Kalendarz Wakacje",
"frm_CALID" : "przez Calendar ID",
"btn_CIDIN"	: "Wybierz",
"frm_GOOGLE": "przez Google",
"slc_GLIST" : "Wybierz kalendarz",
"E_LOADED"  : "Wybrany i importowane Kalendarz",
"E_cal_NAME": "Nazwa kalendarza",
"E_cal_ID"  : "Kalendarz ID",
"E_cal_DATA": "importowanych danych",
"hld_color" : "Kolor Wakacje",
"act_plsID"	: "Proszę wpisać ID kalendarza.",
"act_iptOK"	: "Importowanie zakończone.",
"act_nonHDY": "Wakacje nie można znaleźć.",

		"btn_save"	: "zaoszczędzić",
		"btn_reset"	: "inicjalizacja",
		"act_save"	: "Ustawienia zapisane",
		"act_cfrm"	: "Inicjuje ustawienia. Czy na pewno?",
		"act_reset"	: "Ustawienia zostały zainicjowane"
	},
	
	//ポルトガル語
	"pt" : {
		"txt_color"	: "carta de cor",
		"bg_color"	: "cor de fundo",
		"week_TODAY": "Hoje",
		"week_ALL"  : "Domingo,Segunda-feira,Terça-feira,Quinta-feira,Quinta-feira,Sexta-feira,Sábado",

"tab_week"	: "Dia da semana",
"tab_hldy"	: "férias",
"enable_c"	: "ativar cor",
"slc_HDCAL" : "Selecione o Calendário Feriados",
"frm_CALID" : "Calendário por ID",
"btn_CIDIN"	: "selecionar",
"frm_GOOGLE": "por Google",
"slc_GLIST" : "Selecione um Calendário",
"E_LOADED"  : "Calendário selecionados e importados",
"E_cal_NAME": "Nome de calendário",
"E_cal_ID"  : "Calendário ID",
"E_cal_DATA": "Os dados importados",
"hld_color" : "Cor férias",
"act_plsID"	: "Por favor coloque o ID do Calendário.",
"act_iptOK"	: "Importação concluída.",
"act_nonHDY": "Feriados não pôde ser encontrado.",

		"btn_save"	: "salvar",
		"btn_reset"	: "inicialização",
		"act_save"	: "As configurações salvas",
		"act_cfrm"	: "Inicializa as configurações. Você tem certeza?",
		"act_reset"	: "Configurações foram inicializados"
	},
	
	//ポルトガル語(ポルトガル)
	"ptPT" : {
		"txt_color"	: "carta de cor",
		"bg_color"	: "cor de fundo",
		"week_TODAY": "Hoje",
		"week_ALL"  : "Domingo,Segunda-feira,Terça-feira,Quinta-feira,Quinta-feira,Sexta-feira,Sábado",

"tab_week"	: "Dia da semana",
"tab_hldy"	: "férias",
"enable_c"	: "ativar cor",
"slc_HDCAL" : "Selecione o Calendário Feriados",
"frm_CALID" : "Calendário por ID",
"btn_CIDIN"	: "selecionar",
"frm_GOOGLE": "por Google",
"slc_GLIST" : "Selecione um Calendário",
"E_LOADED"  : "Calendário selecionados e importados",
"E_cal_NAME": "Nome de calendário",
"E_cal_ID"  : "Calendário ID",
"E_cal_DATA": "Os dados importados",
"hld_color" : "Cor férias",
"act_plsID"	: "Por favor coloque o ID do Calendário.",
"act_iptOK"	: "Importação concluída.",
"act_nonHDY": "Feriados não pôde ser encontrado.",

		"btn_save"	: "salvar",
		"btn_reset"	: "inicialização",
		"act_save"	: "As configurações salvas",
		"act_cfrm"	: "Inicializa as configurações. Você tem certeza?",
		"act_reset"	: "Configurações foram inicializados"
	},
	
	//ポルトガル語(ブラジル)
	"ptBR" : {
		"txt_color"	: "cor da Fonte",
		"bg_color"	: "cor de Fundo",
		"week_TODAY": "Hoje",
		"week_ALL"  : "domingo,segunda-feira,terça-feira,quarta-feira,quinta-feira,sexta-feira,sábado",

"tab_week"	: "dia da semana",
"tab_hldy"	: "férias",
"enable_c"	: "ativar cor",
"slc_HDCAL" : "Selecione o Calendário Feriados",
"frm_CALID" : "calendário por ID",
"btn_CIDIN"	: "selecionar",
"frm_GOOGLE": "por Google",
"slc_GLIST" : "selecione um Calendário",
"E_LOADED"  : "calendário selecionados e importados",
"E_cal_NAME": "nome de calendário",
"E_cal_ID"  : "calendário ID",
"E_cal_DATA": "os dados importados",
"hld_color" : "cor férias",
"act_plsID"	: "por favor coloque o ID do Calendário.",
"act_iptOK"	: "importação concluída.",
"act_nonHDY": "feriados não pôde ser encontrado.",

		"btn_save"	: "salvar",
		"btn_reset"	: "inicialização",
		"act_save"	: "As configurações salvas",
		"act_cfrm"	: "Inicializa as configurações. Você tem certeza?",
		"act_reset"	: "Configurações foram inicializados"
	},
	
	//ルーマニア語
	"ro" : {
		"txt_color"	: "scrisoare de culoare",
		"bg_color"	: "culoarea de fundal a",
		"week_TODAY": "astăzi",
		"week_ALL"  : "duminică,luni,marți,miercuri,joi,vineri,sâmbătă",

"tab_week"	: "Ziua din săptămână",
"tab_hldy"	: "concediu",
"enable_c"	: "Activează de culoare",
"slc_HDCAL" : "Selectaţi Calendar Sarbatori",
"frm_CALID" : "Calendar de ID-ul",
"btn_CIDIN"	: "selecta",
"frm_GOOGLE": "de către Google",
"slc_GLIST" : "Selectaţi un calendar",
"E_LOADED"  : "Selectate şi importate Calendar",
"E_cal_NAME": "calendar Nume",
"E_cal_ID"  : "calendar ID-ul",
"E_cal_DATA": "datele importate",
"hld_color" : "Vacanta de culoare",
"act_plsID"	: "Va rog sa introduceti ID-ul Calendar.",
"act_iptOK"	: "Import Finalizat.",
"act_nonHDY": "Vacanta nu a putut fi găsit.",

		"btn_save"	: "salva",
		"btn_reset"	: "Initializarea",
		"act_save"	: "Setări salvate",
		"act_cfrm"	: "Iniţializează setările. Sunteţi sigur?",
		"act_reset"	: "Setări au fost iniţializat"
	},
	
	//ロシア語
	"ru" : {
		"txt_color"	: "Письмо цвет",
		"bg_color"	: "цвет фона",
		"week_TODAY": "сегодня",
		"week_ALL"  : "воскресенье,понедельник,вторник,среда,четверг,пятница,суббота",

"tab_week"	: "День недели",
"tab_hldy"	: "каникулы",
"enable_c"	: "Включите цвет",
"slc_HDCAL" : "Выберите Календарь праздников",
"frm_CALID" : "в календаре ID",
"btn_CIDIN"	: "выбирать",
"frm_GOOGLE": "от компании Google",
"slc_GLIST" : "Выберите календарь",
"E_LOADED"  : "Выбранный и импортированные календарь",
"E_cal_NAME": "Календарь Имя",
"E_cal_ID"  : "Календарь ID",
"E_cal_DATA": "импортируемых данных",
"hld_color" : "Праздники цветов",
"act_plsID"	: "Пожалуйста, введите Календарь ID.",
"act_iptOK"	: "Импорт завершен.",
"act_nonHDY": "Праздники не может быть найден.",

		"btn_save"	: "экономить",
		"btn_reset"	: "инициализация",
		"act_save"	: "Настройки Сохраненные",
		"act_cfrm"	: "Инициализация настроек. Вы уверены?",
		"act_reset"	: "Настройки были инициализированы"
	},
	
	//スロバキア語
	"sk" : {
		"txt_color"	: "Farba písma",
		"bg_color"	: "farba pozadia",
		"week_TODAY": "dnes",
		"week_ALL"  : "nedeľa,pondelok,utorok,streda,štvrtok,piatok,sobota",

"tab_week"	: "Deň v týždni",
"tab_hldy"	: "dovolenka",
"enable_c"	: "povoliť farby",
"slc_HDCAL" : "Vyberte sviatky kalendára",
"frm_CALID" : "podľa kalendárnych ID",
"btn_CIDIN"	: "vybrať",
"frm_GOOGLE": "od Google",
"slc_GLIST" : "Vybrať kalendár",
"E_LOADED"  : "Vybraná a dovážaných Kalendár",
"E_cal_NAME": "Názov kalendára",
"E_cal_ID"  : "kalendár ID",
"E_cal_DATA": "importovaných dát",
"hld_color" : "dovolenka farieb",
"act_plsID"	: "Zadajte prosím ID kalendára.",
"act_iptOK"	: "Dovoz dokončená.",
"act_nonHDY": "Dovolenka nebola nájdená.",

		"btn_save"	: "uložiť",
		"btn_reset"	: "inicializácia",
		"act_save"	: "Nastavenie uložené",
		"act_cfrm"	: "Inicializuje nastavenie. Ste si istí?",
		"act_reset"	: "Nastavenie inicializovaný"
	},
	
	//スロベニア語
	"sl" : {
		"txt_color"	: "pismo barve",
		"bg_color"	: "barva ozadja",
		"week_TODAY": "danes",
		"week_ALL"  : "nedelja,ponedeljek,torek,sreda,četrtek,petek,sobota",

"tab_week"	: "Dan v tednu",
"tab_hldy"	: "prazniki",
"enable_c"	: "Omogoči barve",
"slc_HDCAL" : "Izberite Holidays Calendar",
"frm_CALID" : "Koledar z ID",
"btn_CIDIN"	: "Izberi",
"frm_GOOGLE": "z Google",
"slc_GLIST" : "Izberi Koledar",
"E_LOADED"  : "Izbrane in Uvoženi Koledar",
"E_cal_NAME": "Koledar Name",
"E_cal_ID"  : "Koledar ID",
"E_cal_DATA": "uvoženih podatkov",
"hld_color" : "počitnice Color",
"act_plsID"	: "Prosimo, vhod Koledar ID.",
"act_iptOK"	: "Uvoz končan.",
"act_nonHDY": "Holidays ni bilo mogoče najti.",

		"btn_save"	: "Shrani",
		"btn_reset"	: "inicializacijo",
		"act_save"	: "Nastavitve Shranjeni",
		"act_cfrm"	: "Inicializira nastavitve. Ali ste prepričani?",
		"act_reset"	: "Nastavitve so bila inicializirana"
	},
	
	//セルビア語
	"sr" : {
		"txt_color"	: "Писмо боја",
		"bg_color"	: "Боја позадине",
		"week_TODAY": "данас",
		"week_ALL"  : "недеља,понедељак,уторак,среда,четвртак,петак,субота",

"tab_week"	: "Дан у недељи",
"tab_hldy"	: "празници",
"enable_c"	: "Омогући боје",
"slc_HDCAL" : "Изаберите Празници Календар",
"frm_CALID" : "од Календар ИД",
"btn_CIDIN"	: "изабрати",
"frm_GOOGLE": "Гоогле-овим",
"slc_GLIST" : "Изаберите календар",
"E_LOADED"  : "Изабрани и увозна Календар",
"E_cal_NAME": "Име календара",
"E_cal_ID"  : "Календар ИД",
"E_cal_DATA": "увезене податке",
"hld_color" : "Празници Боја",
"act_plsID"	: "Морате навести Календар ИД.",
"act_iptOK"	: "Увоз Завршена.",
"act_nonHDY": "Празника није могао бити пронађен.",

		"btn_save"	: "сачувати",
		"btn_reset"	: "иницијализација",
		"act_save"	: "Подешавања су сачувана",
		"act_cfrm"	: "Покреће подешавања. Јесте ли сигурни?",
		"act_reset"	: "Подешавања су иницијализована"
	},
	
	//スウェーデン語
	"sv" : {
		"txt_color"	: "brev färg",
		"bg_color"	: "bakgrundsfärg",
		"week_TODAY": "i dag",
		"week_ALL"  : "söndag,måndag,tisdag,onsdag,torsdag,fredag,lördag",

"tab_week"	: "Veckodag",
"tab_hldy"	: "semester",
"enable_c"	: "aktivera färg",
"slc_HDCAL" : "Välj helgdagar kalender",
"frm_CALID" : "av Kalender-ID",
"btn_CIDIN"	: "Välj",
"frm_GOOGLE": "av Googles",
"slc_GLIST" : "Välj en kalender",
"E_LOADED"  : "Valda och importerade Kalender",
"E_cal_NAME": "Kalender Namn",
"E_cal_ID"  : "Kalender-ID",
"E_cal_DATA": "importerade uppgifter",
"hld_color" : "semester Färg",
"act_plsID"	: "Vänligen ange den kalender-ID.",
"act_iptOK"	: "Import slutförd.",
"act_nonHDY": "Semester kunde inte hittas.",

		"btn_save"	: "Spara",
		"btn_reset"	: "initiering",
		"act_save"	: "Inställningar Sparade.",
		"act_cfrm"	: "Initierar inställningarna. Är du säker?",
		"act_reset"	: "Inställningar har initierats."
	},
	
	//タイ語
	"th" : {
		"txt_color"	: "สีตัวอักษร",
		"bg_color"	: "สีพื้นหลัง",
		"week_TODAY": "วันนี้",
		"week_ALL"  : "วันอาทิตย์,วันจันทร์,วันอังคาร,วันพุธ,วันพฤหัสบดี,วันศุกร์,วันเสาร์",

"tab_week"	: "วันของสัปดาห์",
"tab_hldy"	: "วันหยุดพักผ่อน",
"enable_c"	: "เปิดใช้งานสี",
"slc_HDCAL" : "เลือกปฏิทินวันหยุด",
"frm_CALID" : "โดยปฏิทินประจำตัวประชาชน",
"btn_CIDIN"	: "เลือก",
"frm_GOOGLE": "โดยของ Google",
"slc_GLIST" : "เลือกปฏิทิน",
"E_LOADED"  : "ปฏิทินที่เลือกและนำเข้า",
"E_cal_NAME": "ชื่อปฏิทิน",
"E_cal_ID"  : "รหัสปฏิทิน",
"E_cal_DATA": "ข้อมูลที่นำเข้า",
"hld_color" : "สีวันหยุด",
"act_plsID"	: "โปรดป้อนรหัสปฏิทิน",
"act_iptOK"	: "การนำเข้าเสร็จสมบูรณ์",
"act_nonHDY": "วันหยุดพักผ่อนไม่พบ",

		"btn_save"	: "บันทึก",
		"btn_reset"	: "การเริ่มต้น",
		"act_save"	: "ตั้งค่าการบันทึก",
		"act_cfrm"	: "เริ่มต้นการตั้งค่า คุณแน่ใจหรือไม่",
		"act_reset"	: "การตั้งค่าได้รับการเริ่มต้น"
	},
	
	//トルコ語
	"tr" : {
		"txt_color"	: "Mektup renk",
		"bg_color"	: "Arka plan rengi",
		"week_TODAY": "bugün",
		"week_ALL"  : "Pazar,Pazartesi,Salı,Çarşamba,Perşembe,Cuma,Cumartesi",

"tab_week"	: "Haftanın günü",
"tab_hldy"	: "Tatiller",
"enable_c"	: "renk etkinleştirin",
"slc_HDCAL" : "Tatiller Takvim seçin",
"frm_CALID" : "Takvim Kimliği",
"btn_CIDIN"	: "seçmek",
"frm_GOOGLE": "Google tarafından",
"slc_GLIST" : "Bir takvim seçin",
"E_LOADED"  : "Seçilmiş ve İthal Takvim",
"E_cal_NAME": "Takvim Adı",
"E_cal_ID"  : "Takvim Kimliği",
"E_cal_DATA": "İthal Veri",
"hld_color" : "Tatil Renk",
"act_plsID"	: "Giriş Lütfen Takvim Kimliği.",
"act_iptOK"	: "İthalat Tamamlandı.",
"act_nonHDY": "Tatiller bulunamadı.",

		"btn_save"	: "kurtarmak",
		"btn_reset"	: "başlatma",
		"act_save"	: "Ayarlar Kaydedildi",
		"act_cfrm"	: "Ayarları başlatır. Emin misiniz?",
		"act_reset"	: "Ayarlar başlatıldı edilmiştir"
	},
	
	//ウクライナ語
	"uk" : {
		"txt_color"	: "лист колір",
		"bg_color"	: "колір фону",
		"week_TODAY": "сьогодні",
		"week_ALL"  : "Неділя,Понеділок,Вівторок,Середа,Четвер,Пʼятниця,Субота",

"tab_week"	: "День тижня",
"tab_hldy"	: "канікули",
"enable_c"	: "Увімкніть колір",
"slc_HDCAL" : "Виберіть Календар свят",
"frm_CALID" : "в календарі ID",
"btn_CIDIN"	: "вибирати",
"frm_GOOGLE": "від компанії Google",
"slc_GLIST" : "Виберіть календар",
"E_LOADED"  : "Обраний та імпортовані календар",
"E_cal_NAME": "Календар Ім'я",
"E_cal_ID"  : "Календар ID",
"E_cal_DATA": "імпортованих даних",
"hld_color" : "свята квітів",
"act_plsID"	: "Будь ласка, введіть Календар ID.",
"act_iptOK"	: "Імпорт завершений.",
"act_nonHDY": "Свята не може бути знайдений.",

		"btn_save"	: "економити",
		"btn_reset"	: "ініціалізація",
		"act_save"	: "Уподобання були врятовані.",
		"act_cfrm"	: "Ініціалізація налаштувань. Ви впевнені?",
		"act_reset"	: "Установки були ініціалізовані"
	},
	
	//ベトナム語
	"vi" : {
		"txt_color"	: "Màu chữ",
		"bg_color"	: "Màu nền",
		"week_TODAY": "Hôm nay",
		"week_ALL"  : "chủ nhật,thứ hai,thứ ba,thứ tư,thứ năm,thứ sáu,thứ bảy",

"tab_week"	: "Ngày trong tuần",
"tab_hldy"	: "Các ngày lễ",
"enable_c"	: "Kích hoạt tính năng màu sắc",
"slc_HDCAL" : "Chọn Lịch ngày lễ",
"frm_CALID" : "Lịch ID",
"btn_CIDIN"	: "Chọn",
"frm_GOOGLE": "bởi Google",
"slc_GLIST" : "Chọn lịch",
"E_LOADED"  : "Lựa chọn và nhập khẩu Lịch",
"E_cal_NAME": "Lịch Tên",
"E_cal_ID"  : "Lịch ID",
"E_cal_DATA": "nhập khẩu dữ liệu",
"hld_color" : "ngày lễ màu",
"act_plsID"	: "Hãy Nhập ID Lịch.",
"act_iptOK"	: "Nhập khẩu đã hoàn thành.",
"act_nonHDY": "Các ngày lễ không thể được tìm thấy.",

		"btn_save"	: "Tiết kiệm",
		"btn_reset"	: "Ban đầu nhà nước",
		"act_save"	: "Cài đặt đã lưu",
		"act_cfrm"	: "Khởi tạo các thiết lập. Bạn có chắc chắn?",
		"act_reset"	: "Cài đặt đã được khởi tạo"
	},
	
	//中国語(簡体字)
	"zhCN" : {
		"txt_color"	: "信色",
		"bg_color"	: "背景颜色",
		"week_TODAY": "今天",
		"week_ALL"  : "星期日,星期一,星期二,星期三,星期四,星期五,星期六",

"tab_week"	: "星期几",
"tab_hldy"	: "假期",
"enable_c"	: "启用彩色",
"slc_HDCAL" : "选择在假期日历",
"frm_CALID" : "日历ID",
"btn_CIDIN"	: "选择",
"frm_GOOGLE": "由谷歌的",
"slc_GLIST" : "选择一个日历",
"E_LOADED"  : "选择并导入的日历",
"E_cal_NAME": "日历名称",
"E_cal_ID"  : "日历ID",
"E_cal_DATA": "导入数据",
"hld_color" : "假期颜色",
"act_plsID"	: "请输入日历ID。",
"act_iptOK"	: "汇入完成。",
"act_nonHDY": "假期可能不会被发现。",

		"btn_save"	: "保存",
		"btn_reset"	: "初始化",
		"act_save"	: "设置保存",
		"act_cfrm"	: "初始化设置。你确定吗？",
		"act_reset"	: "设置已初始化"
	},
	
	//中国語(繁体字)
	"zhTW" : {
		"txt_color"	: "信色",
		"bg_color"	: "背景顏色",
		"week_TODAY": "今天",
		"week_ALL"  : "星期日,星期一,星期二,星期三,星期四,星期五,星期六",

"tab_week"	: "星期幾",
"tab_hldy"	: "假期",
"enable_c"	: "啟用彩色",
"slc_HDCAL" : "選擇在假期日曆",
"frm_CALID" : "日曆 ID",
"btn_CIDIN"	: "選擇",
"frm_GOOGLE": "由谷歌的",
"slc_GLIST" : "選擇一個日曆",
"E_LOADED"  : "選擇並導入的日曆",
"E_cal_NAME": "日曆名稱",
"E_cal_ID"  : "日曆 ID",
"E_cal_DATA": "導入數據",
"hld_color" : "假期顏色",
"act_plsID"	: "請輸入日曆 ID。",
"act_iptOK"	: "匯入完成。",
"act_nonHDY": "假期可能不會被發現。",

		"btn_save"	: "保存",
		"btn_reset"	: "初始化",
		"act_save"	: "設置保存",
		"act_cfrm"	: "初始化設置。你確定嗎？",
		"act_reset"	: "設置已初始化"
	},
	
	"DUMMY" : {
		"txt_color"	: "文字色",
		"bg_color"	: "背景色",
		"week_TODAY": "今日",
		"week_ALL"  : "日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日",

"tab_week"	: "曜日の設定",
"tab_hldy"	: "祝日の設定",
"enable_c"	: "色を有効",
"slc_HDCAL" : "祝日のカレンダーを選択",
"frm_CALID" : "カレンダーIDから",
"btn_CIDIN"	: "選択",
"frm_GOOGLE": "Googleから",
"slc_GLIST" : "カレンダーを選択",
"E_LOADED"  : "選択してインポートされたカレンダー",
"E_cal_NAME": "カレンダー名",
"E_cal_ID"  : "カレンダーID",
"E_cal_DATA": "データの内容",
"hld_color" : "祝日の色",
"act_plsID"	: "カレンダーIDを入力してください",
"act_iptOK"	: "インポートに成功しました",
"act_nonHDY": "祝日が見つかりませんでした",

		"btn_save"	: "保存",
		"btn_reset"	: "初期化",
		"act_save"	: "設定を保存しました",
		"act_cfrm"	: "設定内容を初期化します。よろしいですか？",
		"act_reset"	: "設定を初期化しました"
	}
}

