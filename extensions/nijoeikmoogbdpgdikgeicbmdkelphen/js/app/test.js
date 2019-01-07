var host = '';
var hash = '';
var baseUrl = '';
var mediaContainer = null;
var messageContainer = null;

var order = 0;

function query( sql ){

	var container = document.getElementById("test_container_sql");
	while( container.firstChild )			container.removeChild( container.firstChild );

	chrome.extension.sendRequest( { command:"websql_query", sql: sql, params: []} , function(info){

		if ( info.error ) {
			var table = document.createElement("table");
			table.setAttribute("border", "1");
			container.appendChild(table);
			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			var tr1 = document.createElement("tr");
			var td1 = document.createElement("td");
			tr1.textContent = info.message;
			tr1.appendChild(td1);
			tbody.appendChild(tr1);
			return;
		} 
		
		results = info.rows;
		if (results.length>0) {
			var hh = results[0];

			var table = document.createElement("table");
			table.setAttribute("border", "1");
			container.appendChild(table);
			var tbody = document.createElement("tbody");
			table.appendChild(tbody);

			var tr = document.createElement("tr");
			tbody.appendChild(tr);

			for (var k in hh) {
				var th = document.createElement("th");
				th.textContent = k;
				tr.appendChild(th);
			}

			var xx, nn;
			for (var i=0; i<results.length; i++) {
				var tr = document.createElement("tr");
				tbody.appendChild(tr);

				var dd = results[i];
				for (var k in dd) {
					xx = dd[k];
					var td = document.createElement("td");
					td.textContent = xx;
					tr.appendChild(td);
				}
			}
		}

	});

}


window.addEventListener( "load", function(){

	host = document.location.host;
	hash = document.location.hash;
	hash = hash.substring(1, hash.length);
	var mm = hash.split('/');

	var buttonRun = document.getElementById("add-admin-run");
	buttonRun.addEventListener("click", function(e){

			var sql = document.getElementById("app-admin-sql").value;

			query( sql );

	});

}, false );

function E(event) {
	event.stopPropagation();
}
