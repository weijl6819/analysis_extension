var http = require("http");
var fs = require("fs");

function process(req) {
    console.log(req.url);
    var url = req.url.split("/");
    console.log(url.length)
    if(url.length < 3) {
        return 
    } 
    var extension_id = url[1];
    var data = url[2];
    var cdata = data.split("-")
    cdata = cdata[cdata.length - 1]
    cdata = new Buffer.from(cdata, "base64").toString()

    console.log(cdata)
    fs.appendFile("data/" + extension_id, "\n" + cdata, (err)=>{
        if(err) throw err;
        console.log("added success");
    })
}

http.createServer((req, res)=>{
    process(req);
    res.write("hello world");
    res.end();
}).listen(8080);
