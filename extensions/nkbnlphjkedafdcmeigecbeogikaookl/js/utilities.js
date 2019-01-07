function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name)
{
    if(readCookie(name) != null)
    {
        var expires = "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        var value = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }
}
 
Array.prototype.clean = function(to_delete)
{
    var a;
    for (a = 0; a < this.length; a++)
    {
        if (this[a] == to_delete)
        {
            this.splice(a, 1);
            a--;
        }
    }
    return this;
};
  
String.prototype.trim=function()
{
    return this.replace(/^\s+|\s+$/g,"")
};

String.prototype.trimStart=function()
{
    return this.replace(/\s+$/,"")
};

String.prototype.trimEnd=function()
{
    return this.replace(/^\s+/,"")
};

function trim(str, chars) 
{
    return ltrim(rtrim(str, chars), chars);
}
     
function ltrim(str, chars) 
{
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
     
function rtrim(str, chars) 
{
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
    
// chris added new method 15 July 09
String.prototype.startsWith = function(str)
{
    return (this.match("^"+str)==str)
};

/*chris added new functions 14 July 09*/
function replaceSpace(instr)
{
    var matchTag1 = / /g;
    var str=instr.replace(matchTag1, ".");
    return str;
}

function insertCharAfter(inStr,afterStr,insertStr)
{
    if(inStr.indexOf(afterStr)>0)
    {
        if(inStr.indexOf(insertStr)<0)
        {
            return inStr.replace(afterStr,insertStr);
        }
        else
        {
            return inStr;
        }
    }
    else
        return inStr;
}
function FLUprCase(str)
{
//    if(str.length==0)
//        return "";
//    countCaps(str);
    str=str.trim();
    if(str.length>1 && (str.charAt(0)=="\"" || str.charAt(0)=="'"))
    {
        var subStr=str.substr(1).trim();
        if(subStr.charAt(0).toUpperCase())
            return(str.substr(0,1)+subStr.charAt(0).toUpperCase() + subStr.substr(1));
    }
    if(str.charAt(0).toUpperCase())
        return(str.charAt(0).toUpperCase() + str.substr(1));
    else
        return str;

        //name = name.toLowerCase().replace(/\b\w/g, function(match){return match.toUpperCase();});
}
function isValidURL(dtElement)
{
    var url=document.getElementById(dtElement).value.trim();
    if(url!=''){
		if((url.toLowerCase().startsWith("doi:")) || (url.toLowerCase().startsWith("doi ")))
			return true;
		var myRegExp =/^(ftp:\/\/|http:\/\/|https:\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
		//var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.@\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.@\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.@\d\w]|%[a-fA-f\d]{2,2})*)?$/;
		if(myRegExp.test(url))
		{
			return true;
		}
		else
		{
			jAlertMod("Enter a valid internet address","Alert","&nbsp;OK&nbsp;",function(r1){
				document.getElementById("CiteHttp").innerHTML="";
				$("#http").val('');
				if(document.getElementById("http"))
					document.getElementById("http").focus();
			});
			return false;
		}
	}	
}
function CapitalizeAfter(instr,after)
{
    if(instr.indexOf(after)>0)
    {
        return FLUprCase(instr.split(after)[0])+after+ CapitalizeAfter(instr.substring(instr.indexOf(after)+after.length),after);
    }
    else
    {
        return FLUprCase(instr);
    }
}
function countCaps(tt)
{
    console.log(tt);
    var text = tt;
    var count = 0;
    for(i=0; i < text.length; i++) {
        if(text[i].charCodeAt(text[i]) >= 65 && text[i].charCodeAt(text[i]) <= 90)
            count++;
    }
    alert("Number: " + count);
    alert("Percentage: " + count/text.length*100 + " %");
}
function echeck(str)
{
	
    var msg = "Invalid E-mail";
    var at="@"
    var dot="."
    var lat=str.indexOf(at)
    var lstr=str.length
    var ldot=str.indexOf(dot)
    if (str.indexOf(at)==-1){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    if (str.indexOf(at,(lat+1))!=-1){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    if (str.indexOf(dot,(lat+2))==-1){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }
		
    if (str.indexOf(" ")!=-1){
		jAlertMod(msg,"Alert","&nbsp;OK&nbsp;",null);
        return false
    }

    return true
}
