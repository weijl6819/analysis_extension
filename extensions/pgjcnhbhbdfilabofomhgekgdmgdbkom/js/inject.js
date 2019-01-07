var btn_text = document.createTextNode("Post to Medium");
var x = document.getElementsByClassName("graf--p");
while (x[0].firstChild) {
    x[0].removeChild(x[0].firstChild);
}
//x[0].removeChild("br");
if(x[0].appendChild(btn_text)){
	console.log("asd");
}else{
	console.log("fail");
}