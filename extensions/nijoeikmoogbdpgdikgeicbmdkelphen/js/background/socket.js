if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var Socket = function(){
			
			var self = this;
			var host_socket = null;
			var socketId = null;
			
			// ===============================================================
			this.init = function(  ){
			
				console.log("Socket - init ");
				
				if (coinFeed.gMode == 'test') {
					host_socket = 'ws://localhost:8181';	
				}
				else {
					host_socket = "wss://rssreader.everhelper.me";
				}	
				console.log(host_socket);	
				socket = io(host_socket);
				
				socket.on('connect', function () {

					console.log('SOCKET connection:', socket.connected );
					if (!socket.connected) return;
					
					socketId = socket.id;
					
					// --------------------- обработчик данных с сервера
					socket.on('message', function (msg) {
						
						console.log(msg);

						if ( msg.event == 'feed_add') {
							coinFeed.Storage.socket_feeds_add(JSON.parse(msg.list));
						}
						else if ( msg.event == 'feed_remove') {
							coinFeed.Storage.socket_feeds_remove(msg.list_id);
						}
						else if ( msg.event == 'category_edit') {
							coinFeed.Storage.socket_category_edit(msg.id);
						}

					});

					
					// сообщение о новом пользователе
					socket.emit('userJoined', 'user');		

					// ------------
					socket.on('disconnect', function () {
						console.log('socket-disconnect');
						socket.emit('userSplit', 'user');
						socket.json.send({ 'action': 'disconnect' });
					});
					
					
					
				});
				
				
				
			}
			
			
			// ===============================================================
			
		}
		
		this.Socket = new Socket();
		
	}).apply(coinFeed);
	
}
else
{
	coinFeed.Socket = chrome.extension.getBackgroundPage().coinFeed.Socket;
}
