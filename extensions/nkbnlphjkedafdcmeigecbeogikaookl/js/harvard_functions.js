var numOfAuthors = 2;
var numOfEditors = 2;
var numOfProducers = 2;
var numOfRevAuthors = 2;
var numOfTrans = 2;
var glField;
var clip =null;
var clip11 = null;
var clip22 = null;


var copyToPg = false;
var pSvd = "";
var noAuthorFlg = false;
var placeFlg = false;
var yearFlg = false;
var httpFlg = false;
var webSitePg = false;
var academicLecturePg = false;
var goverFlg = false;
var journalNoPlcFlg = false;
//var govNoPlcFlg = false;
//var elecPlcFlg = false;
var elecPg = false;
var reviewFlg = false;
var govFlg = false;
var seriesFlg = false;
var episodeFlg = false;
var noInOnFlg = false;
var referenceFlg = false;
var obsFlg = false;
var journalFlg = false;
var quoteFlag=false;

alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    

var srcSec = '<span id="CiteAuthor" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="VirCiteAuthor"></span><span id="CiteProducer" style="visibility: hidden;"></span><span id="VirCiteProducer"></span><span id="CiteProd"></span><span id="CiteEditor" style="visibility: hidden;"></span><span id="VirCiteEditor"></span><span id="CiteEd"></span><span id="CiteYear" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteDate"></span><span id="CiteChapter" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteIOn" style="visibility:hidden; position:absolute; top:0; left:-100"></span><i><span id="CiteTitle" style="visibility:hidden; position:absolute; top:0; left:-100"></span></i><span id="CiteEdition" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteVolume" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteIssue" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CitePage" style="visibility:hidden; position:absolute; top:0; left:-100"></span><i><span id="CiteSubject" style="visibility:hidden; position:absolute; top:0; left:-100"></span></i><span id="CiteDescriptor" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteSource" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteCity" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteRecord"></span><span id="CiteObserved"></span><span id="CitePlace"></span><span id="CitePublisher" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CitePublication" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteHttp" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteAccessed" style="visibility:hidden; position:absolute; top:0; left:-100"></span><span id="CiteRevOpen"></span><span id="CiteRevClose"></span><span id="CiteDatabase" style="visibility:hidden; position:absolute; top:0; left:-100"></span>';

var bookPanelArr = new Array("CiteAuthor","VirCiteAuthor","CiteYear","CiteDate","CiteChapter","CiteIOn","CiteEditor","VirCiteEditor","CiteEd","CiteTitle","CiteDescriptor","CiteSubject","CiteTrans","VirCiteTrans","CiteTra","CiteEdition","CiteIssue","CiteVolume","CitePage","CitePlace","CitePublisher","CitePublication","CiteHttp","CiteAccessed","CiteProducer","VirCiteProducer","CiteProd","CiteRevAuthor","VirCiteRevAuthor","CiteRevAuth","CiteRecord","CiteSource","CiteCity","CiteRole","CiteRevOpen","CiteRevClose","CiteObserved","CiteAuth","CiteNotation",'CiteDatabase');

var copyArr = bookPanelArr;
var srcVarGlb;

function Reset(srcSecVar)
{
    numOfAuthors = 2;
    numOfEditors = 2;
    numOfProducers = 2;
    numOfRevAuthors = 2;
    numOfTrans = 2;
    srcVarGlb=srcSecVar;
    noAuthorFlg = false;
    if(document.getElementById('emailSec'))
        document.getElementById('emailSec').style.display = "none";
    //ask4Save();
    placeFlg = false;
    yearFlg = false;
    httpFlg = false;
    webSitePg = false;
    academicLecturePg = false;
    goverFlg = false;
    journalNoPlcFlg = false;
    //    govNoPlcFlg = false;
    elecPg = false;
    //elecPlcFlg = false;
	
    // document.getElementById('CiteAuthor').style.fontStyle = "normal";
	
    if(typeof srcSecVar != "undefined")
    {
        setSrcSec(srcSecVar);
    }
//return true;
}

//set srcSec
function setSrcSec(srcSecVar)
{
    var tmpSrc = "";
	
    for(var i=0;i<srcSecVar.length;i++)
    {
        var index = srcSecVar[i];
        var tmp = '';
        if(bookPanelArr[index] == "VirCiteAuthor" || bookPanelArr[index] == "VirCiteEditor" || bookPanelArr[index] == "VirCiteTrans" || bookPanelArr[index] == "VirCiteRevAuthor" || bookPanelArr[index] == "VirCiteProducer" || bookPanelArr[index] == "CiteEd" || bookPanelArr[index] == "CiteProd" || bookPanelArr[index] == "CiteTra" || bookPanelArr[index] == "CiteRevAuth" || bookPanelArr[index] == "CiteAuth")
            tmp = '<span id="' + bookPanelArr[index] + '"></span>';
        else
            tmp = '<span id="' + bookPanelArr[index] + '" style="visibility:hidden; position:absolute; top:0; left:-100"></span>';
		
        tmpSrc = tmpSrc + tmp;
    }
    document.getElementById("bookPanel").innerHTML = tmpSrc;
    //alert(tmpSrc);
    srcSec = "";
    srcSec = tmpSrc;
}

//Add New Author modify by MI 21_04_2012
function addNewAuthor(secRef , panelArr , tab , performer)
{ //mi_21_04_2012
	if(document.getElementById('author').value == "")
	{
		//do nothing
	}
	else
	{
            var tmpValArr = new Array();
            var tmpVar = "";
            var titlName = "author";
            if (typeof performer != "undefined")
            {
        titlName = performer;
    }
    var authcnt=numOfAuthors;
            if(numOfAuthors<50)
                  {

                        for (var j = 2; j < numOfAuthors; j++)
                        {
                                tmpVar = 'author'+j;
                                tmpValArr[j] = document.getElementById(tmpVar).value;
                                if (tmpValArr[j] == "")
                                {
                                //do nothing
                                return false;
                                }
                        }

                        var tabVal = tab;
                        var authors =  document.getElementById(secRef).innerHTML;
                        var formatNum;
                        var hint = "";
                        var placeHolder=titlName+' '+alphabet[numOfAuthors-1];
                                if(numOfAuthors == 2 )
                                        formatNum = numOfAuthors + 'nd';
                                else if(numOfAuthors == 3 )
                                        formatNum = numOfAuthors + 'rd';
                                else
                                        formatNum = numOfAuthors + 'th';

                        authors = authors + '<div class="form-group"><label class="col-xs-4 control-label">'+formatNum+' '+ titlName +'</label><div class="col-xs-8"><input type="text" class="form-control extraAuth" id="author'+numOfAuthors+'" tabindex="'+tabVal+'" data-div="CiteAuthor'+numOfAuthors+'" placeholder="'+placeHolder+'"/>'+hint+'</div></div>';			

                                document.getElementById(secRef).innerHTML = authors;

                                for (var k = 2; k < numOfAuthors; k++)
                                {
                                        tmpVar = 'author'+k;
                                        document.getElementById(tmpVar).value = tmpValArr[k];
                                }


                                var tmpArr;
                                tmpArr = getArr(panelArr);
                                tmpArr.push("CiteAuthor" + numOfAuthors);
                                tmpArr.push("CiteAndA" + numOfAuthors);
                                tmpArr.push("CiteCommaA" + numOfAuthors);

                                //add new span to the piew panel
                                var newSpan = document.getElementById("VirCiteAuthor").innerHTML;
                                newSpan = newSpan + '<span id="CiteCommaA'+numOfAuthors+'"></span><span id="CiteAndA'+numOfAuthors+'"></span><span id="CiteAuthor'+numOfAuthors+'"></span><span id="CiteEnd'+numOfAuthors+'"></span>';
                                document.getElementById("VirCiteAuthor").innerHTML = newSpan;

                                tabVal += 1;
                                numOfAuthors += 1;
                }
                else if(numOfAuthors == 50)
            {

                                 for (var j = 2; j < numOfAuthors; j++)
                                 { 
                                          tmpVar = 'author'+j;
                                        tmpValArr[j] = document.getElementById(tmpVar).value;
                                        if (tmpValArr[j] == "")
                                        {
                                                //do nothing
                                                return false;
                                        }
                                 }
                                 if(typeof document.wcAuthorExFlg != "undefined" && document.wcAuthorExFlg==true)
                                     {
                                         var tabVal = tab;
                                                var authors =  document.getElementById(secRef).innerHTML;
                                                var formatNum;
                                                var hint = "";

                                                formatNum = 'Last ';

                                                authors=addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,placeHolder);

                                                var tmpArr;
                                                tmpArr = getArr(panelArr);
                                                tmpArr.push("CiteAuthor" + numOfAuthors);
                                                tmpArr.push("CiteAndA" + numOfAuthors);
                                                tmpArr.push("CiteCommaA" + numOfAuthors);
                                                tabVal += 1;
                                                numOfAuthors += 1;
                                     }
                                 else
                                     {

                                jConfirmMod2("For Eleven (11) or more authors et al will be added after the first  authors","Alert","&nbsp;Proceed&nbsp;","&nbsp;Cancel&nbsp;",function(a1) {
                                        if(a1){


                                                var tabVal = tab;
                                                var authors =  document.getElementById(secRef).innerHTML;
                                                var formatNum;
                                                var hint = "";

                                                formatNum = 'Last ';

                                                authors=addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,placeHolder);

                                                var tmpArr;
                                                tmpArr = getArr(panelArr);
                                                tmpArr.push("CiteAuthor" + numOfAuthors);
                                                tmpArr.push("CiteAndA" + numOfAuthors);
                                                tmpArr.push("CiteCommaA" + numOfAuthors);
                                                tabVal += 1;
                                                numOfAuthors += 1;
                                                                        }
                                                                        else
                                                                        { 
                                                                                //document.getElementById("VirCiteAuthor").innerHTML=  "<span> et al.</span>"; 
                                                                                setInText('','',true);
                                                                        }
                                                        });
                                    }
                }	
            else
            {
       
		jConfirmMod2('For Eleven (11) or more authors "et al" will be added after the first author.',"Alert","&nbsp;Proceed&nbsp;","&nbsp;Cancel&nbsp;",function(e1){

			if(e1)
			{
				// document.getElementById("VirCiteAuthor").innerHTML="<span> et al.</span>";
				 setInText('','',true);
			}
			});
        
    }
        
            $( '#author'+authcnt ).keyup(function() {
            ReloadTextDiv2('author'+authcnt,'CiteAuthor'+authcnt);
            });
	}
}

//Add New Editor
function addNewEditor(secRef , panelArr , tab , director)
{
	if(document.getElementById('editor').value == "")
	{
		//do nothing
	}
	else
	{
		
//jAlertMod('HARVARD formats additional editors by full name or first name initial(s) + last name <br/><br/>Enter a space between characters for editors with multiple initials<br/><br/>Follow this format when entering personal editor name details.','Alert','&nbsp;OK&nbsp;',null);
    var tmpValArr = new Array();
    var tmpVar = "";
    var titlName = "editor";
    var myTitle = " eds.";
    var placeHolder=titlName+' '+alphabet[numOfEditors-1];
    if (typeof director != "undefined")
    {
        if(getFormName()=="soundRecording")
                titlName="conductor"
            else
        titlName = director;
        if(director == "director")
            {
            //myTitle = " dirs.";
            if(getFormName()=="soundRecording")
                myTitle=" Conducted by"
            else
            myTitle=" Directed by";
                if(document.getElementById('chkdirector') && document.getElementById('chkproducer'))
                {
                    if(document.getElementById('chkproducer').checked==true && document.getElementById('chkdirector').checked==true)
                        {
                            myTitle=' Produced and directed by';
                        }
                    else if(document.getElementById('chkproducer').checked==true)
                        {
                            if(getFormName()=="soundRecording")
                                myTitle=" Performed by"
                            else
                            myTitle=' Produced by';
                        }
                }
            }
            else if(director == "reviewed")
            {
            //myTitle = " dirs.";
            myTitle="";
            if(isPreviousFilled('CiteEd'))                
                myTitle=" by";
                    if(document.getElementById('chkrevauthor') && document.getElementById('chkdirector'))
                    {
                        if(document.getElementById('chkdirector').checked==true)
                            {
                                myTitle=' directed by';
                            }
                    }
                
            }
        else if(director == "interviewer")
            myTitle = " Interview by";
        else if(director == "performer")
            myTitle = " Performed by";
        else if(director == "translator")
            {
                myTitle = " Translated by";
                if(isPreviousFilled('CiteEd'))
                    {
                       myTitle = " by"; 
                    }
                    
            }
        else if(director == "writer")
            myTitle = " writ.";
		else if(director == "Receiver")
            myTitle = " Email to";	
    }
	if(titlName!='editor'){
		var placeHolder=alphabet[numOfEditors-1]+' '+titlName;
	}
    for (var j = 2; j < numOfEditors; j++)
    {
        tmpVar = 'editor'+j;
        tmpValArr[j] = document.getElementById(tmpVar).value;
		if (tmpValArr[j] == ""){
			//do nothing
			return false;
		}
		
    }
  
    var tabVal = tab;
    var editors =  document.getElementById(secRef).innerHTML;
    var formatNum;
    var hint = "";
	
    if(numOfEditors == 2 )
    {
        formatNum = numOfEditors + 'nd';
    //hint = '<a href="#" class="hintanchor" onmouseover="showhint(\'Insert and before the last author.\', this, event, \'150px\')">[?]</a>';
    }
    else if(numOfEditors == 3 )
        formatNum = numOfEditors + 'rd';
    else
        formatNum = numOfEditors + 'th';
		if(document.istablet5){
			editors = editors + '<div class="form-group"><label class="col-lg-3 control-label">'+formatNum+' '+ titlName +'</label><div class="col-lg-9"><input type="text" class="form-control" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" placeholder="'+placeHolder+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" />'+hint+'</div></div>';
		}else{
			editors = editors + '<label style="margin-top:10px">'+formatNum+' '+ titlName +'</label><input type="text" style="margin-top:10px" value="" id="editor'+numOfEditors+'" tabindex="'+tabVal+'" placeholder="'+placeHolder+'" onkeyup="ReloadTextDiv2(\'editor'+numOfEditors+'\',\'CiteEditor'+numOfEditors+'\',\''+director+'\');" />'+hint+'<br/>';
		}
	
    document.getElementById(secRef).innerHTML = editors;
	
    setInnerText("CiteEd", myTitle);
	
    
    for (var k = 2; k < numOfEditors; k++)
    {
        tmpVar = 'editor'+k;
        document.getElementById(tmpVar).value = tmpValArr[k];
    }
      
    var tmpArr;
    tmpArr = getArr(panelArr);
    tmpArr.push("CiteEditor" + numOfEditors);
    tmpArr.push("CiteAndE" + numOfEditors);
    tmpArr.push("CiteCommaE" + numOfEditors);
	
    //add new span to the piew panel
    var newSpan = document.getElementById("VirCiteEditor").innerHTML;
    newSpan = newSpan + '<span id="CiteCommaE'+numOfEditors+'"></span><span id="CiteAndE'+numOfEditors+'"></span><span id="CiteEditor'+numOfEditors+'"></span>';
    document.getElementById("VirCiteEditor").innerHTML = newSpan;
	
    tabVal += 1;
    numOfEditors += 1;
	}
}

//Function to check place and date
function chkPlcAndDate()
{
    chkPlc();
    chkYearDate();
    chkHTTP();
}

function chkPlc()
{
    if(document.getElementById('place'))
        {
            placeFlg=true;
            $('#bookPanel').css('display','block');
        }
    if(placeFlg)
    {
        showDiv('CitePlace');

        // chris  changed innertext property to innerhtml 07 July 09
        var placeVal ="";
        var publisherVal="";
        if(document.getElementById('place') && placeFlg)
            {
                placeVal=document.getElementById('place').value.trim()
            }
            if(document.getElementById('publisher'))
            {
                publisherVal=document.getElementById('publisher').value.trim();
            }
           
            var httpVal = getInnerText("CiteHttp").trim();
            var myFlg=true;
            if(document.getElementById('publisher') && publisherVal=="")
                myFlg=false;
        if(placeVal == "" && !document.getElementById('chkdvdblue'))
        {
                $('#CitePlace').html("&nbsp;n.p.");
                formatPlPub();
        }
       
    }
}

function chkYearDate()
{
    if(document.getElementById('year'))
                {
                    yearFlg=true;
                }
    if(yearFlg)
    {
        showDiv('CiteYear');
        var dateVal = getInnerText("CiteYear");

        // mark changed - July 2009
        var TheLen = getInnerText("CiteYear").trim().length;

        // mark changed - July 2009
        var nd="";
        var dot="";
        
            if(document.getElementById('year'))
            {
                     var obj=document.getElementById('year');
                     nd=obj.getAttribute("placeholder").trim();
                     if(nd!='')
                         {
                             var idx=nd.indexOf(' ');
                             if(idx<0 && nd!="") {
                             }
                             else
                             {
                                     var no;
                                     var arr = nd.split(' ');
                                     if(arr.length==1){
                                             no = "";
                                     }else {
                                             no = arr[1];
                                     }
                             if(arr[0].endsWith("."))	
                                     nd = arr[0]+" " + no;
                             else
                                     nd = arr[0]+". " + no;	
                             }
                         }
                 }

            if(nd=="")
                nd="n.d.";
            else
                dot='.';
        
        if(dateVal == "" || dateVal == " " || TheLen == 0)
        {
            if(document.getElementById('YearParentheses') && document.getElementById('YearParentheses').checked==true)
                {
                    
                    document.getElementById('CiteYear').innerHTML = "&nbsp;("+nd+")";
                }
        else
            {
           document.getElementById('CiteYear').innerHTML = "&nbsp;"+nd+dot; 
            }
        }
    }
}

function expandcontent2(blockID,other)
{
    var datFlg = false;
    var plcFlg = false;
    var pubFlg = false;

	if(document.getElementById("intexplink"))
		$("#intexplink").text("Internet Sourced [click -]");
	
    document.getElementById(blockID).style.display=(document.getElementById(blockID).style.display!="block")? "block" : "none";
    if (typeof other != "undefined")
    {
    //        if(other == "gov")
    //            document.getElementById('CiteTitle').style.fontStyle=(document.getElementById(blockID).style.display!="block")? "italic" : "normal";
    //
    }
    if(document.getElementById(blockID).style.display!="block")
    {
        setInnerText('CiteHttp',"");
        setInnerText('CiteAccessed',"");
        setInnerText('CiteDatabase',"");
        if(getFieldValue('http').trim()!='')
        {
            document.getElementById('http').value='';
        }
        if(getFieldValue('accessed').trim()!='')
        {
            document.getElementById('accessed').value='';
        }
        if(getFieldValue('db').trim()!='')
        {
            document.getElementById('db').value='';
        }
        

		if(document.getElementById("intexplink"))
			$("#intexplink").text("Internet Sourced [click +]");
    }
    else
        {
            $('#'+blockID+' input:text').first().focus();
        }
    //Hide or Show Date
    //if(document.getElementById('date'))
    //{
    //    document.getElementById('date').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
    //    document.getElementById('date').value = "";
        //document.getElementById('dateTxt').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
    //    datFlg = true;
    //}

    if(document.getElementById('observed'))
    {
        document.getElementById('observed').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
        document.getElementById('observed').value = "";
        //document.getElementById('dateTxt').style.visibility = (document.getElementById(blockID).style.display=="block")? "hidden" : "visible";
        obsFlg = true;
    }
    
    chkPlcAndDate();

    if(datFlg)
        setInnerText('CiteDate',"");

    if(obsFlg)
        setInnerText('CiteObserved',"");
}

function insertNthChar(str,chr,nth) 
{
    var output = '';
    for (var i=0; i<str.length; i++)
    {
        if (i>0 && i%nth == 0)
            output += chr;
        output += str.charAt(i);
    }

    return output;
}

function chkHTTP()
{
    if(document.getElementById('accessed') && (document.getElementById('http') || document.getElementById('db')))
        {
            var httpVal='';
            if(document.getElementById('http'))
            {
                httpVal=document.getElementById('http').value.trim();
            }
            var databaseValue='';
            if(document.getElementById('db'))
            {
                databaseValue=document.getElementById('db').value.trim();
            }
            var accessedVal=document.getElementById('accessed').value.trim();
            if(httpVal=="" && accessedVal=="" && databaseValue=="")
                {
                    $("#CiteAccessed").html("");
                }
                else if((httpVal!="" || databaseValue!="") && accessedVal=="")
                    {
                         
                        var obj=document.getElementById('accessed');
                        nd=obj.getAttribute("placeholder").trim();
                        if(nd!='')
                            {
                                showDiv('CiteAccessed');
                                 
                                 
                
                                
                                var exbFlg=false,perfmFlg=false,accessInetFlg=false;
                                var kyup=obj.getAttribute('onkeyup');
                                if(kyup.indexOf('exhibit')>0)
                                    exbFlg=true;
                                if(kyup.indexOf('performence')>0)
                                    perfmFlg=true;
                                if(kyup.indexOf('accessInternet')>0)
                                    accessInetFlg=true;
                                if(exbFlg || perfmFlg)
                                {         
                                                nd = "(viewed: " + CapitalizeAfter(nd.toString().toLowerCase(), " ") + ").";
                                }
                            else
                                nd = "[Accessed " + CapitalizeAfter(nd.toString().toLowerCase(), " ") + "].";
                                
                                      
                                      
                                      
                                $("#CiteAccessed").html('&nbsp;'+nd);
                            }
                                    
                    }
        }
}

function chkTitle(tagName)
{
    if(reviewFlg)
    {
        if(document.getElementById('revauthor') && document.getElementById('revauthor').value == "")
        {
            showDiv('CiteRevAuthor');
            if(tagName == 'descriptor')
            {
                document.getElementById('CiteRevAuthor').innerHTML = document.getElementById('CiteRevOpen').innerHTML
                + document.getElementById('CiteDescriptor').innerHTML
                + document.getElementById('CiteSubject').innerHTML
                + document.getElementById('CiteAuthor').innerHTML
                + document.getElementById('CiteYear').innerHTML
                + document.getElementById('CiteRevClose').innerHTML;
                document.getElementById('VirCiteAuthor').innerHTML = "";
                document.getElementById('CiteDescriptor').innerHTML ="";
                document.getElementById('CiteSubject').innerHTML ="";
                document.getElementById('CiteAuthor').innerHTML ="";
                document.getElementById('CiteYear').innerHTML ="";
                document.getElementById('CiteRevOpen').innerHTML = "";
                document.getElementById('CiteRevClose').innerHTML = "";
            }
        }
    }
    else if(govFlg)
    {
        var ch = document.getElementById('CiteTitle').innerHTML;
        ch = ch.replace("&nbsp;","");
        document.getElementById('CiteTitle').innerHTML = ch;
    }

    else if(document.getElementById('author') && document.getElementById('author').value == "")
    {
        showDiv('CiteAuthor');

        if( tagName == 'editor')
        {
				var pattrn=new RegExp(/^[A-z]+\s+[A-z]+\s+[A-z]{1,}$/);
				var pattrn1=new RegExp(/^[A-z]{1}[.\s]+\s+[A-z]{1,}$/);
				var pattrn2=new RegExp(/^[A-z]+$/);
				var pattrn3=new RegExp(/^[A-z]+\s+[A-z]+$/);
				ExtraEd = false;
            //document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText;
           var  perNo = document.perNoeditor; 
		    var edi = document.getElementById('CiteEditor').innerHTML;
            edi = edi.replace("(","");
            edi = edi.replace("&nbsp;","");
			
				if(document.getElementById('VirCiteEditor').innerHTML !='')
					ExtraEd = true;
				edval = document.getElementById('editor').value;
				/*if(pattrn.test(edval)==true && perNo==0){
					str=edi.split(' ');
					if(typeof(str[2])!='undefined'){
						if(ExtraEd)
							str[2] = str[2].replace(".","")+", ";
						else
							str[2] = str[2].replace(".",",");	
						datastr = str[2]+' '+str[0]+' '+str[1];
					}else{
						datastr = str[1]+', '+str[0];
					}
				}
                                else */
            var splittable=false;
            if(edi!='')
                {
                    str1=edi.split(' ');
                    if(typeof(str1[1])!='undefined' && str1[1].length>2)
                        {
                            if(str1[0].length==2)
                                {
                                    var tmp=str1[0];
                                    if(tmp[1]==".")
                                        {
                                           splittable=true; 
                                        }
                                }
                        }
                }
            if(splittable){
					str1=edi.split(' ');
					if(ExtraEd)
						datastr = str1[1].replace(".","")+', '+str1[0];
					else
						datastr = str1[1].replace(".",",")+' '+trimLastChar(str1[0],'.')+'.';
				}
                                /*else if(pattrn2.test(edval)==true && perNo==0){
					str2=edi.split(' ');
					datastr = str2[0];
				}
                                else if(pattrn3.test(edval)==true && perNo==0){
					str2=edi.split(' ');
					if(ExtraEd)
						datastr = str2[1].replace(".","")+', '+str2[0];
					else
						datastr = str2[1].replace(".",",")+' '+trimLastChar(str2[0],'.')+'.';
				}*/
                                else{
					datastr =edi;
				}
			edi = datastr;
			
			if(document.getElementById('CiteEd')){
				var eds = document.getElementById('CiteEd').innerHTML;
				eds =eds.replace(",","");
			}else{
				//do nothing
				var eds="";
			}
                        //Lalit added to remove CiteEd if citeEd is followed by editors
                        if(followedBy('CiteEd','CiteEditor'))
                            {
                                eds="";
                            }
            //Chris added to account for translator
            //document.getElementById('CiteAuthor').innerHTML = edi + eds;
			var edi2 =  document.getElementById('VirCiteEditor').getElementsByTagName('span');
			for (var i = 0; i < edi2.length; i++) {
				//omitting undefined null check for brevity
				if (edi2[i].id.lastIndexOf("CiteEditor", 0) === 0) {
					filedno = edi2[i].id.charAt(edi2[i].id.length - 1);
					var  addperNo = eval("document.perNoeditor"+filedno);
					edit = document.getElementById(edi2[i].id).innerHTML;
					edit1 = edit.split(" ");
                                        if(splittable)
                                            {
					if(typeof(edit1[2])!="undefined" && addperNo==0)
						edit = trimLastChar(edit1[2],'.') +", "+ edit1[0]+" "+edit1[1];
					else if(typeof(edit1[1])!="undefined" && addperNo==0)
						edit = trimLastChar(edit1[1],'.') +", "+ edit1[0];
                                            }
					
	
					document.getElementById(edi2[i].id).innerHTML = edit;	
				}
			}
			
            if(ExtraEd){
				document.getElementById('CiteAuthor').innerHTML = edi;
			}else{
				document.getElementById('CiteAuthor').innerHTML = edi + eds;
			}
			exspan = '';
			if(ExtraEd){
				exspan = '<span>'+eds+'</span>';
			}
			
            document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteEditor').innerHTML + exspan;
			if(document.getElementById('CiteEd')){
            	document.getElementById('CiteEd').innerHTML = "";
			}
            document.getElementById('CiteEditor').innerHTML = "";
            document.getElementById('VirCiteEditor').innerHTML = "";

        }

        else if( tagName == 'chapter')
        {
            var ch = document.getElementById('CiteChapter').innerHTML;
            ch = ch.replace("&nbsp;","");
            setInnerText('CiteIOn',"");
            document.getElementById('CiteAuthor').innerHTML = ch;
            document.getElementById('CiteChapter').innerHTML = "";
//            document.getElementById('CiteIOn').innerHTML = "";
			if(document.getElementById('title') && document.getElementById('title').value!= ""){
				
				var tit=document.getElementById('title').value;
				tit = tit.replace("&nbsp;","");
				if(document.getElementById('volume') && document.getElementById('volume').value!= ""){
					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";
				}else if(document.getElementById('issue') && document.getElementById('issue').value!= ""){
					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";
				}else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){
					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+",";
				}
				else{
					document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";
				}
				//MI_06_april_2013
				document.getElementById('CiteTitle').innerHTML = "&nbsp;"+FLUprCase(tit)+".";
				document.getElementById('CiteTitle').style.fontStyle = "italic";

			}
            //if(document.getElementById('CiteIOn'))
				//document.getElementById('CiteIOn').innerHTML = "";

        }

        else if( tagName == 'title')
        {
            var tit = document.getElementById('CiteTitle').innerHTML;
            tit = tit.replace("&nbsp;","");
            document.getElementById('CiteAuthor').innerHTML = tit
            document.getElementById('CiteAuthor').style.fontStyle = "italic";
			//if(document.getElementById('volume') && document.getElementById('volume').value!= ""){
				//document.getElementById('CiteTitle').innerHTML = ",";
			//}else
                            if(document.getElementById('issue') && document.getElementById('issue').value!= ""){
				document.getElementById('CiteTitle').innerHTML = ",";
			}else if(document.getElementById('pageJournal') && document.getElementById('pageJournal').value!= ""){
				document.getElementById('CiteTitle').innerHTML = ",";
			}
			else{
				document.getElementById('CiteTitle').innerHTML = "";
			}           
		   // document.getElementById('CiteTitle').innerHTML = "";
//            document.getElementById('CiteIOn').innerHTML = "";
            if(document.getElementById('CiteIOn'))
				document.getElementById('CiteIOn').innerHTML = "";

        }

        else if( tagName == 'publisher')
        {
            var pub = document.getElementById('CitePublisher').innerHTML
            pub = pub.replace("&nbsp;","");
            document.getElementById('CiteAuthor').innerHTML = pub;
            
            if(document.getElementById('CitePlace'))
                {
                    var place = document.getElementById('CitePlace').innerHTML;
                    place = place.replace(":", "");
                    document.getElementById('CitePlace').innerHTML = place;
                }
            
            document.getElementById('CitePublisher').innerHTML = "";
        }
        else if( tagName == 'subject')
        {
            var sub = document.getElementById('CiteSubject').innerHTML
            sub = sub.replace("&nbsp;","");
            document.getElementById('CiteAuthor').innerHTML = sub;
            document.getElementById('CiteSubject').innerHTML = "";
        }

        else if( tagName == 'http')
        {
            var path = document.getElementById('CiteHttp').innerHTML;
            path = path.replace("&nbsp;","");
            document.getElementById('CiteAuthor').innerHTML = path;
            document.getElementById('CiteHttp').innerHTML = "";
        }
    }
    else if(!document.getElementById('author') && document.getElementById('CiteChapter'))
    {
        if( tagName == 'publisher')
        {
            var pub = document.getElementById('CitePublisher').innerHTML
            pub = pub.replace("&nbsp;","");
            document.getElementById('CiteChapter').innerHTML = pub;
            
            if(document.getElementById('CitePlace'))
                {
                    var place = document.getElementById('CitePlace').innerHTML;
                    place = place.replace(":", "");
                    document.getElementById('CitePlace').innerHTML = place;
                }
            
            document.getElementById('CitePublisher').innerHTML = "";
        }
    }
    else if(!document.getElementById('author') && document.getElementById('CiteTitle'))
    {
        if( tagName == 'publisher')
        {
            var pub = document.getElementById('CitePublisher').innerHTML
            pub = pub.replace("&nbsp;","");
            document.getElementById('CiteTitle').innerHTML = pub;
            
            if(document.getElementById('CitePlace'))
                {
                    var place = document.getElementById('CitePlace').innerHTML;
                    place = place.replace(":", "");
                    document.getElementById('CitePlace').innerHTML = place;
                }
            
            document.getElementById('CitePublisher').innerHTML = "";
        }
    }

}
//Define 'endsWith(sting)' function for String Type variables
String.prototype.endsWith = function(str)
{
    return (this.match(str+"$")==str)
}
var id = "";
var NewText = "";
function FormatCitation(textName,divName,other)
{
	//alert(divName);
    var otherFlg = false;
    var myTitle = " ed.";
    //    var teleFlg =false;
    //    var noDateWebsite = false;
    document.editor = 0;
    var academicFlg = false;
    var lectureFlg = false;
    var patentsFlg = false;
    var exhibitFlg = false;
    var performenceFlg = false;
    var journalFlg = false;
    var paperFlg = false;
    var posterFlg = false;
    var creativeFlg = false;
    var legislationFlg=false;
    var parliamentFlg=false;
    var presentationFlg = false;
    var booksFlg=false;
    var pubplfrmtFlg=false;
	var reyear = false;
	var religiousFlg = false;
	var noInOnFlg = false;
	var reviewFlg = false;
        var italicFlg=false;     
        var imageFlg=false;
        var firstFieldId=$(".cssform input:text").first().attr('id');
        
    if (typeof other != "undefined")
    {
        otherFlg = true;
        if(other == "director")
            {
                if(getFormName()=="soundRecording")
                myTitle=" Conducted by"
            else
            myTitle = " Directed by";
            }
        if(other == "reviewed")
            {
                if(document.getElementById('title') && document.getElementById('title').value.trim()!="")
                myTitle = " by";
            else
                myTitle="";
            }
        else if(other == "translator")
            {
                if(isPreviousFilled('CiteEd'))
                    myTitle = " by";
                    else
            myTitle = " Translated by";
            }
        else if(other == "writer")
            myTitle = " writ.";
        else if(other == "interviewer")
            myTitle = " Interview by";
        else if(other == "performer")
            myTitle = " Performed by";
        else if(other == "prod")
            myTitle = " Produced by";
        else if(other == "writ")
            myTitle = " Written by";
		
        else if(other == "Receiver")
             myTitle = " Email to";
		//Reprint
		else if(other == "Reprint")
             reyear = true;	 
        else if(other == "gov")
        {
            govFlg = true;
        //            govNoPlcFlg = true;
        }
        else if(other == "noInOn")
            noInOnFlg = true;
        else if(other == "reference")
            referenceFlg = true;
        else if(other == "presentation")
            presentationFlg = true;
        else if(other == "review")
        {
            reviewFlg = true;
            noInOnFlg = true;
        }
        else if(other == "series")
            seriesFlg = true;
         else if(other == "image")
            imageFlg = true;
        else if(other == "episode")
            episodeFlg = true;
        else if(other=="italic")
            {
                italicFlg=true;
            }
        else if(other == "legislation")
            {
                legislationFlg=true;
            }
            else if(other=="parliament")
                {
                    parliamentFlg=true;
                }
        else if(other == "journal")
        {
            journalFlg = true;
            journalNoPlcFlg = true;
        }
        else if(other == "pubplfrmt")
            {
                pubplfrmtFlg=true;
            }
        else if(other == "performence")
            performenceFlg = true;
        else if(other == "electronic")
            elecPg = true;
        else if(other == "creative")
            creativeFlg = true;
        else if(other == "exhibit")
            exhibitFlg = true;
        else if(other == "gover")
            goverFlg = true;
        else if(other == "patents")
            patentsFlg = true;
        else if(other == "books")
        {
            booksFlg=true;
        }
        else if(other == "academic")
        {
            academicFlg = true;
            academicLecturePg = true;
            //document.getElementById('CiteTitle').style.fontStyle = "normal";
        }
        else if(other == "lecture")
        {
            lectureFlg = true;
            academicLecturePg = true;
            document.getElementById('CiteTitle').style.fontStyle = "normal";
        }
        else if(other == "paper")
            paperFlg = true;
        else if(other == "poster")
            posterFlg = true;
        else if(other == "website")
            webSitePg = true;
        else if(other == "noItalic")
        {
            if(document.getElementById('CiteTitle'))
                document.getElementById('CiteTitle').style.fontStyle = "normal";
            academicLecturePg = true;
        }
        else if(other == "religious")
           religiousFlg = true;

    }
		
    if(document.getElementById('http'))
        httpFlg = true;
    if(document.getElementById('place'))
        placeFlg = true;
    if(document.getElementById('year'))
    {
        yearFlg = true;
    }
   if(document.getElementById('title'))
   {	
     titleFlg = true;
   }
   if(document.getElementById('chapter'))
   {	
     chapFlg = true;
    }
	
    var NewText = document.getElementById(textName).value;
    NewText=processExtraDotComma(divName,NewText);
    var copyVal = NewText;
    showDiv(divName);
	
    var wordArr = NewText.split(" ");
    var tmpNewText = "";
    for(var i = 0; i < wordArr.length ; i++)
    {
        if(wordArr[i] != "" && wordArr[i].length > 50)
        {
            wordArr[i] = insertNthChar(wordArr[i] , "\r\n" , 50);
        }
		
        if( i == 0)
            tmpNewText = tmpNewText + wordArr[i];
        else
            tmpNewText = tmpNewText + " " + wordArr[i];
    }
	
    NewText = tmpNewText;
    
		
    if(NewText == "")
        NewText = "";
	
    else if(textName == 'issue' || textName == 'date' || textName == 'observed')
    {
        NewText = NewText.replace(/[()]/g,"");
        if(textName == 'issue')
        {
            //            if(teleFlg)
            //            {
            //                NewText = "(broadcast " + FLUprCase(NewText) + ")";
            //            }
            if(document.getElementById('chkVolume') && document.getElementById('chkEdition'))
            {
                if(document.getElementById('chkVolume').checked)
                {
                    NewText ="Vol. " + FLUprCase(NewText) + ".";
                }
                else if(document.getElementById('chkEdition').checked)
                {
                    NewText ="" + FLUprCase(NewText) + " ed.";
                }
                else
                {
                    NewText ="" + FLUprCase(NewText) + ".";
                }
            }
            else if(other=="brouchure")
                {
                    NewText ="" + FLUprCase(NewText) + ".";
                }
            else if(elecPg)
                NewText = FLUprCase(NewText) + ":";
            else if(patentsFlg)
                NewText = " filed " + FLUprCase(NewText) + ",";
            else if(episodeFlg)
                NewText = " Episode " + FLUprCase(NewText) + ".";
           // else if(parliamentFlg || pubplfrmtFlg || reviewFlg)
           else if(followedBy('CiteVolume','CiteIssue'))
            {
                var dt='';
                if(reviewFlg)
                    dt='.';
                NewText = "(" + FLUprCase(NewText) + ")"+dt;
            }
            else
            {
                //NewText = "&nbsp;" + "(" + FLUprCase(NewText) + "):";
                //NewText ="(" + FLUprCase(NewText) + "):";
                NewText ="(" + FLUprCase(NewText) + ").";
            }
        }
		
        else
        {
            if(patentsFlg)
            {
                if(document.getElementById('issue').value != "")
                    NewText = " and issued " + FLUprCase(NewText) +".";
                else
                    NewText = " issued " + FLUprCase(NewText) +".";
            }
            else if((elecPg||seriesFlg) && getFormName()!="digitalInterview")
            {
               // NewText = "(Broadcast: " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ").";
                NewText = "" + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ".";
            }
            /*else if(reviewFlg)
            {
                NewText = NewText.replace(/[()]/g,"");
                NewText = "(reviewed: " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ").";
            }*/
            //            else if(journalFlg)
            //            {
            //                //chris fixed . issue after date 20 July 09
            //                NewText = rtrim( FLUprCase(NewText),".")+".";
            //            }

            else if(creativeFlg)
                {
                    
                if((getFormName()=="performance" || getFormName()=="creativeExhibition" || getFormName()=="academicLecture") && textName == 'observed')
                    {
                        NewText =CapitalizeAfter(NewText.toString().toLowerCase(), " ");
                    }
                    else
                        { 
                            NewText = "(viewed " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ").";
                        }
                }

            else
            {
                if(isDateYYYYMonth(NewText))
                {
                    var NewTextArray;
                    if(NewText.indexOf(",")!=-1)
                        NewTextArray = NewText.trimStart().split(",");
                    else
                        NewTextArray = NewText.trimStart().split(" ");

                    NewTextArray[0]=NewTextArray[0].replace(",", "");

                    NewText = "(" + FLUprCase(NewTextArray[0]) + ", " + FLUprCase(NewTextArray[1].trim()) + ").";
					
                }
                else{
                    if(reyear)
                        {
                            var reprnt='Reprint';
                            if(document.getElementById('chkimprint') && document.getElementById('chkimprint').checked==true)
                                reprnt="Imprint";
						NewText = "("+reprnt+" " + CapitalizeAfter(NewText.toString().toLowerCase(), " ")+ ").";
                        }
					else
						NewText = CapitalizeAfter(NewText.toString().toLowerCase(), " ")+".";	
				}
            }
            
            if(textName == 'date')
            {
                console.log(NewText);
                if(NewText.toLowerCase().indexOf('n.d.')>=0 || NewText.toLowerCase().indexOf('nd.')>=0)
                    {
                        NewText = NewText.toLowerCase().replace("n.d.","n.d.");
                        NewText = NewText.toLowerCase().replace("nd.","n.d.");
                    }
                    else if(NewText.toLowerCase().indexOf('nd')>=0)
                        {
                            NewText = NewText.toLowerCase().replace("nd","n.d.");
                        }
                    else if(NewText.toLowerCase().indexOf('n.d')>=0)
                        {
                            NewText = NewText.toLowerCase().replace("n.d","n.d.");
                        }
                    }
        }
        
        
        //chris - changed innertext property to innerhtml
        document.getElementById(divName).innerHTML = NewText;
		
    }
	else if(textName=="database" && religiousFlg){
		NewText=CapitalizeAfter(NewText," ")+ ".";
	}
	
    else if(textName == 'descriptor' && performenceFlg)
    {
        NewText = "Performance: " + FLUprCase(NewText) + ". ";
    }
    /*else if(textName == 'descriptor' && academicFlg)
    {
        
                    NewText = FLUprCase(NewText) + ":";
               
    }*/ 
	else if(textName == 'descriptor' && other=="translation")
    {
        NewText = "Translated from " + FLUprCase(NewText) + ".";
    }
   
    else if(textName == 'descriptor')
    {
        NewText= "[" + makeKeywordsCapital(FLUprCase(NewText)) + "].";
	
    }
    else if(textName=="db")
        {
            NewText='Available through '+NewText+'.';
        }
    else if(textName == 'notation')
    {
        NewText= "[" + FLUprCase(NewText) + "].";
	
    }
    else if(textName == 'chapter' && lectureFlg)
    {
        NewText = FLUprCase(NewText);
    }
    else if(textName == 'chapter' && legislationFlg)
    {
        document.getElementById(divName).style.fontStyle = "italic";
        NewText = FLUprCase(NewText)+'.';
        
    }
    else if(textName == 'record' && referenceFlg)
    {
        NewText = "sheet " + FLUprCase(NewText) + ",";
    }
    else if(textName == 'record' && other=="version")
    {
        NewText = "Version. " + FLUprCase(NewText) + ".";
    }
    else if(textName=="record" && getFormName()=="academicData")
        {
            NewText='['+NewText+']';
        }
    else if(textName == 'source' && reviewFlg)
    {
        NewText = "Performed " + FLUprCase(NewText) +    ".";
    }
    else if(textName == 'subject' && referenceFlg)
    {
        NewText = FLUprCase(NewText) + ":";
    }
    else if(textName=="subject" && academicFlg)
        {
            document.getElementById(divName).style.fontStyle="italic";
            NewText = FLUprCase(NewText) + ".";
        }
    else if(textName == 'title' && titleFlg)
    {
        if((legislationFlg==true && getFieldValue('chapter')!='') || (booksFlg==true && getFieldValue('volume')!='' && getFormName()!="books") || ((getFormName()=="dvd" || getFormName()=="soundRecording") && getFieldValue('volume')!=''))
            {
               NewText = CapitalizeAfter(NewText,". ") + ":"; 
            }
            else
                {   
                    NewText = CapitalizeAfter(NewText,". ");
                   
                        NewText = NewText+".";
                    if(reviewFlg)
                    {
                        NewText="Review of "+NewText;
                    }
                    
                }
                
		
    }
    
    else if(textName == 'chapter' && chapFlg)
    {
        if(italicFlg==true)
            document.getElementById(divName).style.fontStyle="italic";
		if(religiousFlg)
		{
			NewText=CapitalizeAfter(CapitalizeAfter(NewText,". "),": ")+ ".";
		}
                else if(parliamentFlg)
                    {
                        NewText = "Parliament " + CapitalizeAfter(CapitalizeAfter(NewText,". "),": ") + "."; //MI_12_Apr_13
                    }
                else{
				NewText = "" + CapitalizeAfter(CapitalizeAfter(NewText,". "),": ") + "."; //MI_12_Apr_13
		}
          //code start for single quote  
          
        if(document.getElementById('l_chapterttl') && document.getElementById('chapter') && document.getElementById('CiteChapter'))
        {
            if(document.getElementById('l_chapterttl').checked==true)
                        {
                            quoteFlag=true;
                        }
                        else
                            {
                                quoteFlag=false;
                            }
            if(document.getElementById('chapter').value!="")
                {
                    
                    if(document.getElementById('l_chapterttl').checked==true)
                        {
                            NewText="'"+CapitalizeAfter(CapitalizeAfter(document.getElementById('chapter').value,". "),": ")+"'.";
                            quoteFlag=true;
                        }
                        else
                            {
                               NewText=''+CapitalizeAfter(CapitalizeAfter(document.getElementById('chapter').value,". "),": ")+'.'; 
                            }
                }
                else
                    {
                        NewText=''; 
                    }
        }
        //code end for single quote
        
        if(getFormName()=="academicData")
            {
                if(document.getElementById('uniUnpublished') && document.getElementById('uniUnpublished').checked==true)
                            {
                                if(!document.getElementById('http') || document.getElementById('http').value.trim()=='')
                                    {
                                        NewText=trimLastChar(NewText,'.');
                                        NewText+=', unpublished.'
                                    }
                            }
            }
                
		
    }

	else if(textName == 'year' && yearFlg)
    {
                if(NewText=="n.d" || NewText=="nd." || NewText=="nd")
                {
                    NewText="n.d.";
                }
		//Changes #1 Begin by Manoj G
		var idx=NewText.indexOf(' ');
		if(idx<0 && NewText!="") {
			NewText = NewText;
		}
		else
		{
			var no;
			var arr = NewText.split(' ');
			if(arr.length==1){
				no = "";
			}else {
				no = arr[1];
			}
		if(arr[0].endsWith("."))	
			NewText = arr[0]+" " + no;
		else
			NewText = arr[0]+". " + no;	
		}
	}
    else if(textName == 'place')
    {
        if(patentsFlg)
            NewText = FLUprCase(NewText) + " Patent";
        else if(exhibitFlg)
            NewText = "Exhibited " + FLUprCase(NewText) + ".";
        else if(performenceFlg)
        {
            //if(getFormName()=="performance")
            //{
                NewText = FLUprCase(NewText) + ".";
            //}
            /*else
            {
                NewText = "Performed " + FLUprCase(NewText) + ".";
            }*/
        }
        else if(lectureFlg)
            NewText = "Lecture presented " + FLUprCase(NewText) + ".";
        else if(paperFlg)
            {
            //NewText = "Paper presented " + FLUprCase(NewText) + ".";
            NewText =FLUprCase(NewText) + ".";
            }
        else if(posterFlg)
            NewText = "Poster presented " + FLUprCase(NewText) + ".";
        else if(presentationFlg)
            NewText = "Presented " + FLUprCase(NewText) + ".";
        else if(reviewFlg)
            {
            NewText = FLUprCase(NewText) + ".";
            }
            else
            NewText=CapitalizeAfter(NewText," ") + ".";

        
    }
	
	else if(textName == 'publisher')
    	{
            if(exhibitFlg || getFormName()=="performance" || performenceFlg)
                {
                    if(document.getElementById('place').value!='')
                        {
                            NewText = CapitalizeAfter(NewText," ") + ",";
                        }
                        else
                            {
                                NewText = CapitalizeAfter(NewText," ") + ".";
                            }
                            
                }
                else
                    { 
                        if(reviewFlg)
                        {
                            document.getElementById(divName).style.fontStyle="italic";
                        }
                        NewText = CapitalizeAfter(NewText," ") + ".";
                        
                        
                    }
		NewText = NewText.replace(/And /g,"and ");
     }
	
    else if(textName == 'volume')
    {
        //chris added  code to remove extra '.' 12 July 09
        if(goverFlg || elecPg)
            {
                if(goverFlg)
                    {
                        document.getElementById(divName).style.fontStyle="italic";
                        if(getFieldValue('title')!='')
                        NewText= rtrim(FLUprCase(NewText.trim()),'.')+":";
                    else
                        NewText= rtrim(FLUprCase(NewText.trim()),'.')+".";
                    }
                    else
                        {   
                            NewText= rtrim(FLUprCase(NewText.trim()),'.')+".";
                            
                        }
            }
        if(academicFlg)
            NewText = FLUprCase(NewText);
        else if(patentsFlg)
            NewText = FLUprCase(NewText) + ",";
        else if(seriesFlg)
            NewText = "Series " + FLUprCase(NewText)+ '.';
    }
		
    else if(textName == "edition")
    {
        var re2digit=/^\d{3}$/; //regular expression defining a 2 digit number
        var regRev1 = new RegExp("re[a-z]", "i")
        var regRev2 = new RegExp("re[a-z]+\\.\\s", "i")

        if((NewText.search(regRev1)!=-1) ||(NewText.search(regRev2)!=-1) )
        {
            if(NewText.charAt(2)=="v")
                NewText = "(Rev. ed.).";
            else if (NewText.charAt(2)=="p")
                NewText = "(Reprint ed.).";
        }

        else if(NewText.search(re2digit)  && NewText <= 30)
        {
            if(NewText == "1" || NewText == "21")
                NewText = FLUprCase(NewText) + "st ed.";
            else if(NewText == "2" || NewText == "22")
                NewText = FLUprCase(NewText) + "nd ed.";
            else if(NewText == "3" || NewText == "23")
                NewText = FLUprCase(NewText)+ "rd ed.";
            else
                NewText = FLUprCase(NewText) + "th ed.";
        }
        else
            NewText = FLUprCase(NewText) + " ed.";
    }
	
    else if(textName == "accessed")
    {
        NewText = NewText.replace(/[()]/g,"");
        if(exhibitFlg || performenceFlg)
            {         
                            NewText = "(viewed: " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + ").";
            }
        else
            NewText = "[Accessed " + CapitalizeAfter(NewText.toString().toLowerCase(), " ") + "].";
    }
    else if(textName == "http")
    {
        NewText = NewText ;//+ "." MIP
    }
    else if(!NewText.endsWith("."))
    {
		var matchStrc = /^author[0-9]+$/;
		var matchStre = /^editor[0-9]+$/;		               
		var matchStrt = /^trans[0-9]+$/;	
		 var matchStra = /^revauthor[0-9]+$/;	
        if(textName == 'author' || textName=="page" || textName.search(matchStrc)==0 || textName == 'editor' || textName.search(matchStre)==0) 
		          NewText = FLUprCase(NewText);
 		else
          NewText = FLUprCase(NewText) + ".";
    }
	
    /*chris added new way to handle chars in authors 17 July 09*/
    if(textName =="author" || textName=="editor" || textName=="trans" || textName=="producer" || textName=="revauthor")
    {
		if(textName=="editor")
			document.editor = 1;
        NewText=HandleAuthors(NewText.replace(",,",","),textName);
       
    }
    /*chris end of area.*/
	
    var matchStrc = /^author[0-9]+$/;
    var matchStrd = /^producer[0-9]+$/;
    var matchStre = /^editor[0-9]+$/;
    var matchStrf = /^trans[0-9]+$/;
    var matchStrg = /^revauthor[0-9]+$/;
    if(textName.search(matchStrc)==0 || textName.search(matchStrd)==0 || textName.search(matchStre)==0 || textName.search(matchStrf)==0 || textName.search(matchStrg)==0)
    {
		if(textName.search(matchStre)==0)
			document.editor = 1;
		else if(textName.search(matchStrc)==0)
			document.editor = 1;	
			
        
        NewText=HandleAuthors(NewText,textName);
    }
    
    if(textName == "editor" && getInnerText("CiteEd") != " eds.")
    {
        if(document.getElementById('chkdirector') && document.getElementById('chkproducer'))
            {
                if(document.getElementById('chkproducer').checked==true && document.getElementById('chkdirector').checked==true)
                        {
                            myTitle=' Produced and directed by';
                        }
                        else if(document.getElementById('chkproducer').checked==true)
                    {
                        if(getFormName()=="soundRecording")
                myTitle=" Performed by"
            else
                        myTitle=' Produced by';
                    }
            }
            else if(document.getElementById('chkdirector') && document.getElementById('chkrevauthor'))
            {
                if(document.getElementById('chkdirector').checked==true)
                    {
                        if(getFormName()=="soundRecording")
                myTitle=" Conducted by"
            else
                        myTitle=' Directed by';
                    }
            }
        if(copyVal != "")
            setInnerText("CiteEd",myTitle);
        else
            setInnerText("CiteEd","");
			
    /*if(document.getElementById('author').value == "")
		{
			showDiv('CiteAuthor');
			document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText + document.getElementById('CiteEditor').innerText;
		}*/
				
    }
	
    if(textName == "revauthor" && document.getElementById("CiteRevAuth") )
    {
        if(copyVal != "")
            setInnerText("CiteRevAuth"," by ");
        else
            setInnerText("CiteRevAuth","");
			
    }
	
    if(textName == "trans" && document.getElementById("CiteTrans") && getInnerText("CiteTrans") != " Trans."  )
    {
        if(copyVal != "")
            setInnerText("CiteTra",myTitle);
        else
            setInnerText("CiteTra","");
			
    }
	
    if(textName == "producer" && document.getElementById("CiteProd") && getInnerText("CiteProd") != " prods.")
    {
        if(copyVal != "")
            setInnerText("CiteProd",myTitle);
        else
            setInnerText("CiteProd","");
			
    /*if(document.getElementById('author').value == "")
		{
			showDiv('CiteAuthor');
			document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText + document.getElementById('CiteEditor').innerText;
		}*/
				
    }
	
    var matchStr5 = /^trans[0-9]+$/;
    if(!textName.search(matchStr5))
    {
        for(var i=2; i<numOfTrans ; i++)
            setInnerText('CiteAndTRA'+i, "");
			
        var last = numOfTrans - 1;
			
        if(last == 2)
        {
            setInnerText('CiteCommaTRA2', "");
        }
        else
        {
            setInnerText('CiteCommaTRA'+last, ", ");
            setInnerText('CiteCommaTRA2', ", ");
				
            var index =0;
            var tmp ="";
            for(var j=2 ; j<=last ; j++)
            {
                tmp = getInnerText('CiteTrans'+j);
                index = tmp.length - 1;
					
                var index2 =  getInnerText('CiteTrans').length - 1;
                var tmp2 = getInnerText('CiteTrans');
                if(tmp2.endsWith("."))
                    tmp2 = tmp2.slice(0,index2);
                setInnerText('CiteTrans', tmp2);
					
                try
                {
                    document.getElementById('CiteTrans').innerText.slice(0,index);
                }
                catch(e)
                {
                    document.getElementById('CiteTrans').textContent.slice(0,index);
                }
					
                if(tmp.endsWith("."))
                {
                    tmp = tmp.slice(0,index);
                }
                setInnerText('CiteTrans'+j, tmp);
            }
        }
		
			
        if(textName == 'trans'+last)
        {
            setInnerText('CiteAndTRA'+last, " and ");
        }

        //chris changed innertext to inner html
        document.getElementById(divName).innerHTML = NewText;
		
		
    }
	
    var matchStr4 = /^revauthor[0-9]+$/;
    if(!textName.search(matchStr4))
    {
        for(var i=2; i<numOfRevAuthors ; i++)
            setInnerText('CiteAndRA'+i,"");
			
        var last = numOfRevAuthors - 1;
			
        if(last == 2)
        {
            setInnerText('CiteCommaRA2',"");
        }
        else
        {
            setInnerText('CiteCommaRA'+last, ", ");
            setInnerText('CiteCommaRA2', ", ");
				
            var index =0;
            var tmp ="";
            for(var j=2 ; j<=last ; j++)
            {
                tmp = getInnerText('CiteRevAuthor'+j);
                index = tmp.length - 1;
					
                var index2 =  getInnerText('CiteRevAuthor').length - 1;
                var tmp2 = getInnerText('CiteRevAuthor');
                if(tmp2.endsWith("."))
                    tmp2 = tmp2.slice(0,index2);
                setInnerText('CiteRevAuthor', tmp2);
					
                try
                {
                    document.getElementById('CiteRevAuthor').innerText.slice(0,index);
                }
                catch(e)
                {
                    document.getElementById('CiteRevAuthor').textContent.slice(0,index);
                }
					
                if(tmp.endsWith("."))
                {
                    tmp = tmp.slice(0,index);
                }
                setInnerText('CiteRevAuthor'+j, tmp);
            }
        }
		
			
        if(textName == 'revauthor'+last)
        {
            setInnerText('CiteAndRA'+last," and ");
        }

        //chris changed inner text to innerhtml
        document.getElementById(divName).innerHTML = NewText;
		
		
    }
	
    var matchStr3 = /^producer[0-9]+$/;
    if(!textName.search(matchStr3))
    {
        for(var i=2; i<numOfProducers ; i++)
            setInnerText('CiteAndP'+i,"")
			
        var last = numOfProducers - 1;
			
        if(last == 2)
        {
            setInnerText('CiteCommaP2', "");
        }
        else
        {
            setInnerText('CiteCommaP'+last, ", ");
            setInnerText('CiteCommaP2', ", ");
				
            var index =0;
            var tmp ="";
            for(var j=2 ; j<=last ; j++)
            {
                tmp = getInnerText('CiteProducer'+j);
                index = tmp.length - 1;
					
                var index2 = getInnerText('CiteProducer').length - 1;
                var tmp2 = getInnerText('CiteProducer');
                if(tmp2.endsWith("."))
                    tmp2 = tmp2.slice(0,index2);
                setInnerText('CiteProducer', tmp2);
					
                try
                {
                    document.getElementById('CiteProducer').innerText.slice(0,index);
                }
                catch(e)
                {
                    document.getElementById('CiteProducer').textContent.slice(0,index);
                }
					
                if(tmp.endsWith("."))
                {
                    tmp = tmp.slice(0,index);
                }
                setInnerText('CiteProducer'+j, tmp);
            }
        }
		
			
        if(textName == 'producer'+last)
        {
            setInnerText('CiteAndP'+last, " and ");
        }

			
        //chris - changed innertext property to innerhtml
        document.getElementById(divName).innerHTML = NewText;
		
		
    /*if(document.getElementById('author').value == "")
		{
			showDiv('CiteAuthor');
			document.getElementById('CiteAuthor').innerHTML = document.getElementById('CiteEd').innerText + document.getElementById('CiteEditor').innerText;
			document.getElementById('VirCiteAuthor').innerHTML = document.getElementById('VirCiteEditor').innerText;
		}*/
    }
	
    var matchStr = /^author[0-9]+$/;
    var matchStr2 = /^editor[0-9]+$/;
    if(!textName.search(matchStr) || !textName.search(matchStr2))
    {
        if(!textName.search(matchStr))
        {
	
            for(var i=2; i<numOfAuthors ; i++)
            {
                setInnerText('CiteAndA'+i,"");
		setInnerText('CiteEnd'+i,"");
                //if(i!=(numOfAuthors - 1))
                //{  
                    if($("#author"+i).val()!='')
                        {   
                            setInnerText('CiteCommaA'+i,", ");                            
                        }
                        else
                            {
                                setInnerText('CiteCommaA'+i,"");                            
                            }
                //}
            }
			
             var last = numOfAuthors - 1;

		last=getLastFilledAuthor();	
                if(last==0)
                {
                    last = numOfAuthors - 1;
                }
			
            if(last == 2)
            {
                    var index2 =  getInnerText('CiteAuthor').length - 1;
                    var tmp2 = getInnerText('CiteAuthor');
                    /*var lastDot=false;  // code was for displaying comma only after dot just before and
                    tmp2t=tmp2.trim();
                    if(tmp2t[tmp2t.length-1]=='.')
                        {
                            lastDot=true;
                        }
                        if(lastDot==true)
                            {*/
                                setInnerText('CiteCommaA2', ',');   
                            /*}
                            else
                                {
                                    setInnerText('CiteCommaA2',"");
                                }*/
                                     
	             setInnerText('CiteAuthor', tmp2);
    	         //setInnerText('CiteCommaA2',"");
            }
            else
            {
                
                                setInnerText('CiteCommaA'+last,", ");  
                        
		
                
				
                var index =0;
                var tmp ="";
               
            }
            
            if($("#"+textName).val()=='')
                {
                    textName='author'+last;
                }
			
            if(textName == 'author'+last)
            {
				var  perNo = eval("document.perNo" +textName);
				if(perNo==1){
					setInnerText('CiteEnd'+last,".");
				}
                                

                if(last == 2){
                    setInnerText('CiteAndA'+last, " and ");
				}else{
					setInnerText('CiteAndA'+last, " and ");
				}
            }
		
        }
		
        else
        {
            for(var i=2; i<numOfEditors ; i++)
            {
                setInnerText('CiteAndE'+i,"");
                if(i!=(numOfEditors - 1))
                {  
                    setInnerText('CiteCommaE'+i,", ");
                }
            }
			
            var last = numOfEditors - 1;
			
            if(last == 2)
            {
				 var index2 =  getInnerText('CiteEditor').length - 1;
                    var tmp2 = getInnerText('CiteEditor');
	             setInnerText('CiteEditor', tmp2);
                     /*var lastDot=false;
                    tmp2t=tmp2.trim();
                    if(tmp2t[tmp2t.length-1]=='.')
                        {
                            lastDot=true;
                        }
                        if(lastDot==true)
                            {*/
                                setInnerText('CiteCommaE2',",");
                           /* }
                            else
                                {
                                    setInnerText('CiteCommaE2',"");
                                }*/
                 
            }
            else
            {
                /*var lastDot=false;
                var tmp2 = getInnerText('CiteEditor'+(last-1));
                    tmp2t=tmp2.trim();               
                    if(tmp2t[tmp2t.length-1]=='.')
                        {
                            lastDot=true;
                        }
                        if(lastDot==true)
                            {*/
                                setInnerText('CiteCommaE'+last,", ");  
                            /*}
                            else
                                {
                                    setInnerText('CiteCommaE'+last," ");
                                }*/
                	
                var index =0;
                var tmp ="";
                
            }
			
            if(textName == 'editor'+last)
            {
                setInnerText('CiteAndE'+last, " and ");
            }
			
			
        }
        //chris - changed innertext property to innerhtml
		//mi_25-04-2012
        
		document.getElementById(divName).innerHTML = NewText;
            
            if(firstFieldId=='author')
            {

                if(isAllAuthorsBlank()==true)
                {     
                    showDiv('CiteAuthor');
                    var fontStyle=$('#CiteEditor').css("font-style");
                    $("#CiteAuthor").css("font-style",fontStyle);
                    reformatEditor();

                }
            }
		
 
    }
    else if(textName == 'author')
    {
        if(NewText!="")
        {
            if(divName=="CiteAuthor")
            {
                $("#CiteAuthor").css("font-style",'normal');
            }
            document.getElementById(divName).innerHTML = FLUprCase(NewText);////MI_14_05_2012
            noAuthorFlg = false;
        }
        else
        {
			//document.firstperau==0;
            document.getElementById(divName).innerHTML = "";
            
        }
        $('#previewEditors').remove();
        $('#CiteEditor').show();
        $('#CiteEd').show();
        $('#VirCiteEditor').show();
        reprocessEditorChapterTitle();
    }

    else if(textName == 'http')
    {
        //chris - changed innertext property to innerhtml
        if(NewText!='')
            {
                var preText='';
                if(getFieldValue('db')=='')
                    {
                        preText='Available at ';
                    }
                document.getElementById(divName).innerHTML = " "+preText + NewText;
                if(NewText.search(/http:\/\//) != 0 && NewText != "")
                if(NewText.search(/https:\/\//) != 0 && NewText != "")
                {
                    if((NewText.toLowerCase().startsWith("doi:")) || (NewText.toLowerCase().startsWith("doi ")))
                    {
                        NewText = NewText.replace("doi ", "DOI: ");
                        NewText = NewText.replace("doi:", "DOI:");
                        NewText = NewText.replace("DOI ", "DOI: ");
                        document.getElementById(divName).innerHTML = "&nbsp;"+preText + NewText;
                    }
                    else
                    {
                        document.getElementById(divName).innerHTML = "&nbsp;"+preText+"http://" + NewText;
                    }

                }
                if((!document.getElementById('descriptor') || document.getElementById('descriptor').value.trim()=='') && getFormName()=="academicData")
                    {
                        if(document.getElementById('publisher') && document.getElementById('publisher').value.trim()!=='')
                            {
                            showDiv('CiteDescriptor');
                            setInnerText("CiteDescriptor"," [online]");
                            }
                    }
                    if(document.getElementById('onlinechk'))
                        {
                            if(document.getElementById('onlinechk').checked==true)
                                {
                                    showDiv('CiteDescriptor');
                                    if(imageFlg==true)
                                        {
                                            setInnerText("CiteDescriptor"," [online image]");
                                        }
                                        else
                                            {                       
                                                setInnerText("CiteDescriptor"," [online]");
                                                
                                            }
                                    if(document.getElementById('pformat'))
                                    document.getElementById('pformat').style.display='none';
                                }
                                else
                                    {
                                        if(document.getElementById('descriptor'))
                                        ReloadTextDiv2('descriptor','CiteDescriptor');
                                    }
                        }
                            
                    
            }
            else
                {
                   document.getElementById(divName).innerHTML=''; 
                   if((!document.getElementById('descriptor') || document.getElementById('descriptor').value.trim()=='') && getFormName()=="academicData")
                    {
                            showDiv('CiteDescriptor');
                            setInnerText("CiteDescriptor","");
                    }
                    if(getFieldValue('http')=='' && getFieldValue('db')=='' && document.getElementById('descriptor') && document.getElementById('onlinechk'))
                        {
                        showDiv('CiteDescriptor');
                        setInnerText("CiteDescriptor","");
                        ReloadTextDiv2('descriptor','CiteDescriptor');
                        }
                }
                
                if(getFormName()=="academicData" || getFormName()=="academicCourseNotes")
                    {
                        ReloadTextDiv2('publisher','CitePublisher','noItalic');
                    }
                    chkHTTP();
    }
    else if(textName == 'accessed')
    {
        if(NewText!="")
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
        else
            document.getElementById(divName).innerHTML = "";
        chkHTTP();
    }
    else if(textName == 'descriptor')
    {
        if((getFieldValue('http')=='' && getFieldValue('db')=='') || (getFormName()!="academicData" && (!document.getElementById('onlinechk') || document.getElementById('onlinechk').checked==false)))
        {
            if(document.getElementById('pformat'))
            document.getElementById('pformat').style.display='block';
        }
    else
    {
        
        NewText= "[online]";
        if(document.getElementById('pformat'))
        document.getElementById('pformat').style.display='none';
    }
    if(NewText!='')
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
        }
        else
            {
                document.getElementById(divName).innerHTML = "";
            }
	
    }
    else if(textName == "chapter" && legislationFlg)
        {
            if(NewText!="")
            {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            
        }
        ReloadTextDiv2('title','CiteTitle','legislation');
        }
        else if(textName=="issue")
            {
                if(NewText!="")
                    {
                        var spc='&nbsp;';
                        if(followedBy('CiteVolume','CiteIssue'))
                            {
                                if(getFieldValue('volume')!='')
                                    {
                                        spc='';
                                    }
                            }
                    document.getElementById(divName).innerHTML = spc + FLUprCase(NewText);
                    }
                else
                    document.getElementById(divName).innerHTML = "";
            }
    else if(textName=="db")
        {
            
            if(exhibitFlg)
                {
                    document.getElementById(divName).style.fontStyle = "italic";
                }
            if(NewText!='')
                {
                    showDiv('CiteDatabase');
                    document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
                    
                    if(document.getElementById('onlinechk'))
                        {
                            if(document.getElementById('onlinechk').checked==true)
                                {
                                    showDiv('CiteDescriptor');
                                    if(imageFlg==true)
                                        {
                                            setInnerText("CiteDescriptor"," [online image]");
                                        }
                                        else
                                            {                       
                                                setInnerText("CiteDescriptor"," [online]");
                                                
                                            }
                                            
                                    if(document.getElementById('pformat'))
                                    document.getElementById('pformat').style.display='none';
                                }
                                else
                                    {
                                        ReloadTextDiv2('descriptor','CiteDescriptor');
                                    }
                        }
                        if(getFieldValue('http')!='')
                        {
                            ReloadTextDiv2('http','CiteHttp',other);
                        }
                            
                }
                else
                    {
                        document.getElementById(divName).innerHTML = "";
                        
                        ReloadTextDiv2('http','CiteHttp',other);
                        if(getFieldValue('http')=='' && getFieldValue('db')=='' && document.getElementById('onlinechk'))
                        {
                        showDiv('CiteDescriptor');
                        setInnerText("CiteDescriptor","");
                        ReloadTextDiv2('descriptor','CiteDescriptor');
                        }
                    }
                    chkHTTP();
        }
//-----------------------MIS-16-april-2013----------------------------
	else if(textName== "page"){
		
		NewText = NewText.replace(/\s{2,}/g, ' ');
                NewText=NewText.trim();
		var pos = NewText.indexOf(' ');
		var pos1 = NewText.indexOf(',');
		//alert(pos1);
		if ( NewText!= "")
        {
			if(pos!=-1)
			{	
			Text = NewText.split(' ');	
				if(pos1!=-1)
				{
										
					document.getElementById(divName).innerHTML = Text.join('&nbsp;') + ".";
					if((document.getElementById(divName).innerHTML.indexOf('&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split(',,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;,'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;,');	
						document.getElementById(divName).innerHTML = Text.join(',&nbsp;') ;	
					}
				}else{
					document.getElementById(divName).innerHTML = Text.join(',&nbsp;') + ".";
					//---
					if((document.getElementById(divName).innerHTML.indexOf('-,&nbsp;'))){	
						Text = document.getElementById(divName).innerHTML.split('-,&nbsp;');	
						document.getElementById(divName).innerHTML = Text.join('-&nbsp;') ;	
					}
					if((document.getElementById(divName).innerHTML.indexOf(',&nbsp;-.'))){	
						Text = document.getElementById(divName).innerHTML.split(',&nbsp;-');	
						document.getElementById(divName).innerHTML = Text.join('&nbsp;-') ;	
					}
					//--
				}
					 //formatEdVolPg();
                                         document.getElementById(divName).innerHTML=" pp. "+document.getElementById(divName).innerHTML;
			}
			else{
				
                if(NewText.search("-")!=-1){
                  document.getElementById(divName).innerHTML =  " pp. "+NewText+'.';  
                  //formatEdVolPg();
                }else{
                    if(legislationFlg)
                        {
                            document.getElementById(divName).style.fontStyle="italic";
                            document.getElementById(divName).innerHTML =  " Chapter "+NewText+'.';
                        }
                        else if(patentsFlg)
                        {
                            document.getElementById(divName).innerHTML =  " Pat. "+NewText+'.';
                        }
                        else
                    document.getElementById(divName).innerHTML =  " p. "+NewText+'.';
                    //formatEdVolPg();
                }
                
			}
		}
		else{
			 document.getElementById(divName).innerHTML = "";
			 //formatEdVolPg();
		}
	
	}


    else if(textName == "edition")
    {
        if( NewText!= "")
            document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
        else
            document.getElementById(divName).innerHTML = "";
    }
	else if(textName == "title")
    {
        if( NewText!= ""){
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);
			document.getElementById(divName).innerHTML = "&nbsp;" +  NewText;
                        if(firstFieldId=='author')
                        {
                            
                            if(isAllAuthorsBlank()==true && isAllEditorsBlank()==true && isChapterBlank()==true)
                            {     
                                showDiv('CiteAuthor');
                                var fontStyle=$('#CiteTitle').css("font-style");
                                $("#CiteAuthor").css("font-style",fontStyle);
                                document.getElementById('CiteAuthor').innerHTML=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
                                document.getElementById('CiteTitle').innerHTML='';
                            }
                        }
		}
        else{
            document.getElementById(divName).innerHTML = "";
            if(firstFieldId=='author' && isAllAuthorsBlank()==true)
            {
                $("#CiteAuthor").css("font-style",'normal');
                
            }
		}
                if(goverFlg)
                    {
                        ReloadTextDiv2('volume','CiteVolume','gover');
                    }
                    if(document.getElementById('chkpdf'))
                        insertPdf();
    }
    else if(textName == "chapter")
    {
        if(NewText!="")
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            
        }
    }
	else if(textName == "database")
    {
        if( NewText!= ""){
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);
			document.getElementById(divName).innerHTML = "&nbsp;" +  NewText;
		}
        else{
            document.getElementById(divName).innerHTML = "";
		}
    }
    else if(textName == "place")
    {
        if( NewText!= "")
		{
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);
            document.getElementById(divName).innerHTML = "&nbsp;"+ NewText;
            if(getFormName()!="performance" && !performenceFlg && !reviewFlg && getFormName()!="academicLecture")
                {
                    if(followedBy('CitePlace','CitePublisher'))
                        {
                    formatPlPub();
                        }
                    
                }
        }  
		else
		{
			document.getElementById(divName).innerHTML = "";
                        if(!performenceFlg && !reviewFlg && getFormName()!="academicLecture")
			formatPlPub();  
		}
                if(exhibitFlg)
                    {
                        ReloadTextDiv2('publisher','CitePublisher','exhibit');
                    }
                    else if(performenceFlg)
                        {
                            ReloadTextDiv2('publisher','CitePublisher','performence');
                        }
    } 

    else if(textName == "publisher")
    {
        if( NewText!= "")
        {	
			NewText = ucFirstAllWords(NewText);
			NewText = ReplaceAnd(NewText);
                        NewText=FLUprCase(NewText);
                        if(document.getElementById('uniUnpublished') && document.getElementById('uniUnpublished').checked==true && getFormName()!="academicData")//on data unpublished is used on title
                            {
                                if(!document.getElementById('http') || document.getElementById('http').value.trim()=='')
                                    {
                                        NewText=trimLastChar(NewText,'.');
                                        NewText+=', unpublished.'
                                    }
                            }
                            if(performenceFlg)
			document.getElementById(divName).innerHTML = NewText;
                    else if(exhibitFlg && getFormName()=="poster")
                        {
                            document.getElementById(divName).innerHTML = ' exhibied at '+NewText;
                        }
                    else
                        document.getElementById(divName).innerHTML = " " +  NewText;
                        if(pubplfrmtFlg)
                                {
                                    document.getElementById(divName).innerHTML = "&nbsp;" +  NewText;
                                    formatPubCity();//MI_24-05-2012
                                    formatPlPub();
                                }
                                else
                                    {
                                        
                                        if(followedBy('CitePlace','CitePublisher'))
                                        {
                                            var tmpPlc=document.getElementById('CitePlace').innerHTML;
                                            tmpPlc=tmpPlc.replace("&nbsp;","").trim();
                                            if(tmpPlc.indexOf('n.p.')<0)
                                                ReloadTextDiv2('place','CitePlace');
                                            else
                                               formatPlPub(); 
                                        }
                                    }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
			formatPubCity();//MI_24-05-2012
            formatPlPub();
            
        }
    
    }    
	//MI_24-05-2012
	else if(textName == "city")
    {
        if( NewText!= "")
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            formatPubCity();
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            formatPubCity();
        }
    }
	//End
    else if(textName == 'date' || textName == 'observed')
    {
        if(NewText!="")
            document.getElementById(divName).innerHTML = "&nbsp;" + NewText;
        else
            document.getElementById(divName).innerHTML = "";
    }
	else if(textName == 'year' && yearFlg)
    {
        if(NewText!="")
        {
			//MIS_16_april_'13
			if(reviewFlg)
                document.getElementById(divName).innerHTML = "," + "&nbsp;" + NewText;
            else
                {
                                if(!document.getElementById('YearParentheses') || document.getElementById('YearParentheses').checked==true)
                                    {
                                        
                                        document.getElementById(divName).innerHTML = "&nbsp;" + "(" + NewText + ")";
                                    }
                                    else
                                        {
                                            document.getElementById(divName).innerHTML = "&nbsp;"+ NewText + ".";
                                        }
                }
	}
        else
            document.getElementById(divName).innerHTML = "";
    }
    else if(textName=="volume")
    {
	if( NewText!= "")
        {
            if(referenceFlg){
                    document.getElementById(divName).innerHTML = " "+FLUprCase(NewText) + ".";
            }
            else if(booksFlg || getFormName()=="dvd" || getFormName()=="soundRecording")
            {
                document.getElementById(divName).innerHTML = " Vol. "+FLUprCase(NewText) + ".";
            }
            else
            {
                document.getElementById(divName).innerHTML = "&nbsp;"+ FLUprCase(NewText);
            }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
        }
        if(followedBy('CiteVolume','CiteIssue'))
            {
                ReloadTextDiv2('issue','CiteIssue');
            }
            else if(booksFlg || getFormName()=="dvd" || getFormName()=="soundRecording")
            {
                //if(getFormName()=="dvd")
                if(getFormName()!="books" && getFormName()!="encyclopaedia")
                document.getElementById(divName).style.fontStyle="italic";
                if(getFormName()!="books")
                ReloadTextDiv2('title','CiteTitle','books');
            }
    }
    else
    {
        if(NewText!="")
        {
            document.getElementById(divName).innerHTML = "&nbsp;" + FLUprCase(NewText);
            if(textName=='editor')
            {
               if(firstFieldId=='author')
                   {

                       if(isAllAuthorsBlank()==true)
                       {     
                           showDiv('CiteAuthor');
                           var fontStyle=$('#CiteEditor').css("font-style");
                           $("#CiteAuthor").css("font-style",fontStyle);
                           reformatEditor();
                           
                           reprocessChapterTitle();
                           

                       }
                   }
            }
        }
        else
        {
            document.getElementById(divName).innerHTML = "";
            if(textName=="editor")
            {
                if(firstFieldId=="author" && isAllAuthorsBlank()==true)
                {
                    reformatEditor();
                    $("#CiteAuthor").css("font-style",'normal');
                    $("#CiteAuthor").html('');
                    $("#CiteAuthor").html('');
                    reprocessChapterTitle();
                }
            }
        }
    }
	
    if(document.getElementById('chkauthor'))
            {
                clearGroupAll(document.getElementById('chkauthor'),'editor','CiteAuth');
            }
        
       
        if(document.getElementById('parentheses') && getInnerText('CiteEd').trim()!='')
        {
            if(document.getElementById('parentheses').checked==true)
            {
                setInnerText("CiteEd"," (ed.).");
            }
            else
            {
                setInnerText("CiteEd"," ed.");
            }
        }
    
        if(document.getElementById('edparentheses') && getInnerText('CiteAuth').trim()!='')
        {
            
                var tmp= getInnerText('CiteAuth').trim();
                tmp=tmp.replace("(", "");
                tmp=tmp.replace(").", "");
                tmp=tmp.replace(")", "");
            if(document.getElementById('edparentheses').checked==true)
            {
                setInnerText("CiteAuth"," ("+tmp+").");
            }
            else
            {
                setInnerText("CiteAuth"," "+tmp);
            }
        }
       
    if(document.getElementById("chapter") && document.getElementById("title") && !noAuthorFlg)
    {
        //ADDED BY LALIT 01/05/2017 START (FOR TRIMMING LAST DOT OR COMMA AND REPLACINMG WITH DOT)
        if(document.getElementById('inIn1') && getInnerText("CiteIOn").trim()!='')
        {
            var lastDiv=getPrevActiveDiv('CiteIOn');
            var divVal=$("#"+lastDiv).html();
            divVal=trimLastChar(divVal,".");
            divVal=trimLastChar(divVal,",");
            if(divVal!="")
            {               
                
                $("#"+lastDiv).html(divVal+'.');
            }

        }
        //END
        //if((document.getElementById('inIn1') && document.getElementById("chapter").value != "" && document.getElementById("title").value != "") || (textName == "chapter" && document.getElementById("chapter").value != "" && document.getElementById("title").value != "") || (textName == "title" && document.getElementById("title").value && document.getElementById("chapter").value != ""))
        if((document.getElementById('inIn1') && document.getElementById("chapter").value != "" && document.getElementById("title").value != ""))
        {
            
            if(otherFlg && !lectureFlg && !academicLecturePg && !reviewFlg && !journalFlg && !noInOnFlg && !elecPg)
                inOn('on');
            else if(lectureFlg)
                inOn(':');
            else if(reviewFlg || journalFlg || noInOnFlg)
                inOn('');
            else
                {
                    if(document.getElementById('inIn1') && document.getElementById('inIn1').checked==true)
                        {
                            var io=" in";
                            if(getFieldValue('inIn1')=='ioon')
                                {
                                    io=" on"
                                }
                            setInnerText('CiteIOn', io);
                            if(document.getElementById('chapter').value!="" && textName=="chapter")
                                {
                                    if(quoteFlag==true)
                                        {
                                            document.getElementById('CiteChapter').innerHTML=" '"+CapitalizeAfter(document.getElementById('chapter').value,". ")+"',";
                                        }
                                        else
                                            {
                                                document.getElementById('CiteChapter').innerHTML=' '+CapitalizeAfter(document.getElementById('chapter').value,". ")+',';
                                            }
                                            
                                           
                                }
                                //ADDED BY LALIT TO REPLACE LAST CHAR WITH COMMA IN CASE OF in OR IN START
                                var lastDiv=getPrevActiveDiv('CiteIOn');
                                var divVal=$("#"+lastDiv).html();
                                if(divVal.trim()!='')
                                    {
                                        divVal=trimLastChar(divVal,".");
                                        divVal=trimLastChar(divVal,",");
                                        $("#"+lastDiv).html(divVal+',');
                                    }
                                //END
                        }
                        else
                            {
                                //var io="in:";
                                var io="in"; // : REMOVED BY LALIT DATE 01/05/2017
                                if(document.getElementById('inIn1') && document.getElementById('inIn2'))
                                    {
                                        if(getFieldValue('inIn1')=='ioon')
                                            {
                                                io="on"
                                            }
                                    }
                                if(document.getElementById('inIn2') && document.getElementById('inIn2').checked==true)
                                    {
                                        if(document.getElementById('chapter').value!=""  && textName=="chapter")
                                            {
                                                if(quoteFlag==true)
                                                    {
                                                        document.getElementById('CiteChapter').innerHTML=" '"+CapitalizeAfter(document.getElementById('chapter').value,". ")+"'.";
                                                    }
                                                    else
                                                        {
                                                            document.getElementById('CiteChapter').innerHTML=' '+CapitalizeAfter(document.getElementById('chapter').value,". ")+'.';
                                                        }
                                                        
                                                        
                                            }
                                    }
                                inOn(io);
                            }
                            
                }
        }
        else if(document.getElementById('inIn1') && ((textName == "chapter" && (document.getElementById("chapter").value == "" || document.getElementById("title").value == "")) || (textName == "title" && (document.getElementById("title").value == "" || document.getElementById("chapter").value == ""))))
            inOn('');
    }
    
 
    
   if(textName == "chapter")
    {
        if(NewText!="")
        {
            if(firstFieldId=='author')
            {

                if(isAllAuthorsBlank()==true && isAllEditorsBlank()==true)
                {     
                    showDiv('CiteAuthor');
                    var fontStyle=$('#CiteChapter').css("font-style");
                    $("#CiteAuthor").css("font-style",fontStyle);
                    if(document.getElementById('CiteIOn') && $("#CiteIOn").html().trim()!='')
                        {
                          var chap=document.getElementById('CiteChapter').innerHTML.replace('&nbsp;','').trim();
                          chap=trimLastChar(chap,'.');
                          chap=trimLastChar(chap,',');
                          document.getElementById('CiteAuthor').innerHTML=chap+'.';
                        }
                        else
                            {
                                document.getElementById('CiteAuthor').innerHTML=document.getElementById('CiteChapter').innerHTML.replace('&nbsp;','').trim();
                            }
                    document.getElementById('CiteChapter').innerHTML='';
                }
            }
        }
        else
            {
                if(firstFieldId=='author' && isAllAuthorsBlank()==true)
                {
                    $("#CiteAuthor").css("font-style",'normal');

                }
            }
    }
    
  if(getFormName()=="performance" || getFormName()=="creativeExhibition" || getFormName()=="academicLecture")
  {
      if(getFieldValue('publisher')!='' || getFieldValue('place')!='' || getFieldValue('observed')!='')
          {
            showDiv('CiteRevOpen');
            showDiv('CiteRevClose');
            document.getElementById('CiteRevOpen').innerHTML=" [";
            document.getElementById('CiteRevClose').innerHTML="]";
          }
          else
              {
                  showDiv('CiteRevOpen');
                document.getElementById('CiteRevOpen').innerHTML="";
                document.getElementById('CiteRevClose').innerHTML="";
              }
  }

  var matchStre = /^editor[0-9]+$/;	               
        if(textName != 'editor' && textName.search(matchStre)!=0 && (getFormName()=="review" || other=="translator"))
            {
                if(other=="translator")
                    {
                       ReloadTextDiv2('editor','CiteEditor','translator'); 
                    }
                    else
                        {     
                            ReloadTextDiv2('editor','CiteEditor','reviewed');
                            
                        }
            }
            
            if(((followedBy('CiteRecord','CiteDescriptor') && followedBy('CiteDescriptor','CiteVolume'))|| followedBy('CiteRecord','CiteVolume')) && followedBy('CiteVolume','CiteIssue'))
            {
                dottocomma('CiteRecord',Array('CiteVolume','CiteIssue'));
            }

  if(getFormName()=="review")
      {
       formatReview();   
      }
      else if(followedBy('CiteVolume','CiteIssue') && followedBy('CiteIssue','CitePage'))
          {
              dottocomma('CiteIssue',Array('CitePage'));
          }
      else if(getFormName()=="academicBlackboard")
          {
              dottocomma('CiteChapter',Array('CiteSubject'));
          }
          else if(getFormName()=="academicLecture" && (textName=="publisher" || textName=="place"))
              {
                  dottocomma('CitePublisher',Array('CitePlace'));
              }
              else if(getFormName()=="digitalInterview" || getFormName()=="tvseries" || getFormName()=="television")
                  {
                      dottocomma('CitePublisher',Array('CiteDate','CiteRecord'));
                      dottocomma('CiteDate',Array('CiteRecord'));
                      if(isFollowedByAny('CiteDescriptor') && getFormName()=="digitalInterview")
                          {
                              removeDot('CiteDescriptor');
                          }
                  }
                  else if(getFormName()=="podcast")
                      {
                          dottocomma('CiteTitle',Array('CitePublication'));
                      }
                      else if(getFormName()=="newspaper")
                      {
                          dottocomma('CiteTitle',Array('CiteObserved'));
                      }
	 
        
        if(document.getElementById('CiteYear') && document.getElementById('YearParentheses') && document.getElementById('YearParentheses').checked)
            {
            if(isFollowedByAny('CiteYear'))
                {
                    removeDot('CiteYear');
                }
                else
                    {
                        removeDot('CiteYear');
                        document.getElementById('CiteYear').innerHTML=document.getElementById('CiteYear').innerHTML+'.';
                    }
            }
            
            if(document.getElementById('CiteDescriptor') && document.getElementById('CiteDescriptor').innerHTML.trim().replace("&nbsp;","").trim()!='')
            {
                var justPre=isJustPreviousFilled('CiteDescriptor');
                if(justPre!='')
                    {
                      removeDot(justPre);  
                    }
                    
            if(isFollowedByAny('CiteDescriptor'))
                {
                    removeDot('CiteDescriptor');
                }
                else
                    {
                        removeDot('CiteDescriptor');
                        document.getElementById('CiteDescriptor').innerHTML=document.getElementById('CiteDescriptor').innerHTML+'.';
                    }
            }
            else if(document.getElementById('CiteDescriptor') && document.getElementById('CiteDescriptor').innerHTML.trim().replace("&nbsp;","").trim()=='')
                {
                   var justPre=isJustPreviousFilled('CiteDescriptor');
                if(justPre!='')
                    {
                      removeDot(justPre);
                      var tt=document.getElementById(justPre).innerHTML.trim().replace("&nbsp;","");
                      if(tt[tt.length-1]!=":")
                      document.getElementById(justPre).innerHTML=document.getElementById(justPre).innerHTML+'.';
                    } 
                }
                
                showPreviewChk();
                
        var patt11a = new RegExp(/^[author]+[2-9]$/);
        var patt11e = new RegExp(/^[editor]+[2-9]$/);
        if (patt11a.test(textName)==true || patt11e.test(textName)==true)
            {
                var tmp=$("#"+textName).val().trim();
                if(tmp=='')
                    {
                        reformBothAuEd(textName);
                    }
            }
}


function ReplaceA(str,field){
		var matchTag3=new RegExp(/\b(.|:|;)\s([A-Z])\b/g);
		if(field=="author"){
			var  perNo = document.perNoau1; 	
		}else{
			var  perNo = eval("document.perNo" +field);
		}
		var arrau = str.split(" ");
		for (i=0;i<arrau.length;i++)
		{
			if((typeof(arrau[i-1])!='undefined' && CheckIsWord(arrau[i-1])) && !CheckIsWord(arrau[i])){
				if(perNo == 1){
					var fval = document.getElementById(field).value;
					var arrval = fval.split(' ');
					if(typeof(arrval[i-1])!='undefined' && arrval[i]!=arrau[i] && (!arrval[i-1].endsWith(":") && !arrval[i-1].endsWith(";") && !arrval[i-1].endsWith(".") && !arrval[i-1].endsWith(","))){
						arrau[i] = arrau[i].toLowerCase();
					}
				}
			}
		}
	return arrau.join(" ");
}


function HandleAuthors(str)
{
  	field = arguments[1];
	if(field=="author"){
		var  perNo = document.perNoau1; 	
	}else{
		var  perNo = eval("document.perNo" +field);
	}
	
	var editortxt = false;
         
	var matchStre = /^editor[0-9]+$/;
	if(field=="editor" || field.search(matchStre)==0){
		var editortxt = true;
	}
        var EdTrFlag = false;
        var pat11 = new RegExp(/^[editor]+[2-9]$/);
	 var pat16	= new RegExp(/^[trans]+[2-9]$/);
        if((field=='editor' || pat11.test(field)==true || field=='translator' || pat16.test(field)==true)){
		 var EdTrFlag = true;
	 }
    if(str=="")
        return "";
    
    if((field=="author" && document.perNoau1>0) || (field=="editor" && document.perNoed1>0) || eval("document.perNo"+field)>0)
        {
            var str=$("#"+field).val().trim();
            //str=trimLastChar(str,".")+'.';
            if(field=="author")
                {   
                    str=trimLastChar(str,".")+'.';
                    
                }
            str=ReplaceAnd(ReplaceA(BeCapital(str),field),false);
            console.log('str: '+str);
            return str;
        }
        
    var arr= splitString(str.trim(),true);
    
    var arr2=str.trim().split(" ");
    if(arr2.length==2)
        {
            var seconW=trimLastChar(trimLastChar(arr2[1],','),'.');
            if(seconW.length==1)
            {
                str=str.replace(",","");
                var arr= splitString(str.trim(),true);
            }
        }
    
  
        var noCommaFlg=false;
        
    var wordCnt=0;
    var joinChar="";
    var str1=$("#"+field).val();
    if(str1!='')
    {
        var tst1=/^\,{2,}/;
        if(tst1.test(str1.trim()))
        {
            str1=str1.replace(tst1, ",");
        }
    }
    var arr1=str1.trim().split(" ");
    for(i=0;i<arr1.length;++i)
        {
            if(arr1[i].trim()!='')
                {
                    wordCnt++;
                }
        }
       
       
        var Yau = 'perYes'+field;
    var noLowerFlg=false;
    var lstNmFstNmFlag=false;
    var fstNmLstNmFlag=false;
    var arrConjFlg=noConjLowerFlg(field);
    noLowerFlg=arrConjFlg[0];
    lstNmFstNmFlag=arrConjFlg[1];
    fstNmLstNmFlag=arrConjFlg[2];
    
    var allSingleFlag=false;
         arrAu=ucFirstAllWords(str1.trim()).split(" ");
        if(arrAu.length>0)
        {
            for(i=0;i<arrAu.length;++i)
            {
                if(arrAu[i].trim()!='' && arrAu[i].trim().replace(/\./g,"").trim().length>1)
                    {
                        allSingleFlag=false;
                        break;
                    }
                    allSingleFlag=true;
            }
        }
        
        if(allSingleFlag==true)
        {
            arr=arrAu;
            for(i=0;i<arrAu.length;++i)
                {
                    if(arr[i].replace(/\./g,"").trim()!='')
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                
                if(arr.length>1)
                {
                    arr[0]=arr[0].replace(/\./g,"").trim()+', ';
                }
                return arr.join("");
        }
        else if(wordCnt>2 && lstNmFstNmFlag==true)
        {
            noCommaFlg=true;
            
            arr=ucFirstAllWords(str1.trim()).split(" ");
            
                       
                var i=0;
                //if(field=="author")
                    //{
                        for(i=0;i<arr.length;++i)
                            {
                                if(arr[i].replace(/\./g,"").trim().length==1)
                                {
                                    arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                                }
                                else
                                {
                                    arr[i]=arr[i].trim();
                                }
                            }
                            if(str1.indexOf(",")>=0)
                            {
                               // arr[lastWPos-1]=arr[lastWPos-1].trim()+' ';
                            }
                            else
                            {
                                arr[0]=arr[0].replace(/[\.\,]/g,"")+',';
                            }
                    //}
                    
            
        }
        else if(wordCnt==2 && lstNmFstNmFlag==true)
        {
            noCommaFlg=true;
            console.log('inge ku');
            /*if(str1.indexOf(",")>=0)
            {
                arr[0]=arr[0].trim()+' ';
            }
            else
            {*/
                arr[0]=arr[0].replace(",","").trim()+', ';
            //}
            
            var i=0;
            for(i=0;i<arr.length;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                            {
                                arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                            }
                }
                
        }
        else if(fstNmLstNmFlag==true)
            {
                noCommaFlg=true;
                
                arr=ucFirstAllWords(str1.trim()).split(" ");
                
                
                var i=0;
                var tmpSt='';
                var firstWPos=-1;
                for(i=0;i<arr.length;++i)
                {
                    if(trimLastChar(arr[i],".").trim().length>1)
                        {
                            firstWPos=i;
                            break;
                        }
                }
                var toLp=0;
                if(firstWPos==-1)
                    {
                        toLp=arr.length;
                    }
                    else
                        {
                         toLp=firstWPos;  
                        }
                for(i=0;i<toLp;++i)
                {
                    if(arr[i].replace(/\./g,"").trim().length==1)
                    {
                        arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                    }
                }
                if(firstWPos>=0)
                {
                    for(i=firstWPos;i<arr.length;++i)
                        {
                            if(arr[i].replace(/\./g,"").trim().length==1)
                            {
                                arr[i]=arr[i].replace(/\./g,"").trim()+'.';
                            }
                            else
                                {
                                    arr[i]=' '+arr[i];
                                }
                        }
                }
                
            
                
            }
            var lastIsChar=false;
for (i=0;i<arr.length;i++)
    {
        var isChar=false;
        if(arr[i].replace(/\./g,"").trim().length==1)
            {
                isChar=true;
            }
            if(i>0)
                {
                    if(lastIsChar)
                        {
                            if(!isChar)
                                {
                                   arr[i]=' '+ arr[i].trim();
                                }
                        }
                        else
                            {
                                
                                   arr[i]=' '+ arr[i].trim();
                                
                            }
                }
                lastIsChar=isChar;
    }
    for (i=0;i<arr.length;i++)
    {
        //alert(arr[i]);
        if(i>0)
        {
            var firstIsWord=false;
            firstIsWord =CheckIsWord(arr[i-1]);

            var secondIsWord=false;
            secondIsWord =CheckIsWord(arr[i]);

			if(firstIsWord && !secondIsWord){
				if(perNo == 1){
					var fval = document.getElementById(field).value;
					var arrval = fval.split(' ');
					if(arrval[i]!=arr[i] && (!arrval[i-1].endsWith(":") && !arrval[i-1].endsWith(";") && !arrval[i-1].endsWith(".") && !arrval[i-1].endsWith(","))){
						arr[i] = arr[i].toLowerCase();
					}
				}
			}
                        
            if(noCommaFlg==true)
             {
                 //if(joinChar!=" ")
                    //joinChar="";
             }
             else
                 {
                    if(!firstIsWord && !secondIsWord){
                                        if(perNo == 1){	
                                                changeItem(arr,i-1,arr[i-1]+" ")
                                        }else{
                                                if(!CheckIsWord(arr[0]) && !CheckIsWord(arr[1]) && !editortxt){
                                                        changeItem(arr,i-1,arr[i-1]+", ")
                                                }else{
                                        changeItem(arr,i-1,arr[i-1]+".")
                                                }
                                        }
                                }
                    else if(!firstIsWord && secondIsWord){
                                        if(perNo == 1){	
                                changeItem(arr,i-1,arr[i-1]+" ")
                                        }else{
                                            changeItem(arr,i-1,arr[i-1]+". ")
                                        }
                                }
                    else if(firstIsWord && !secondIsWord){
                                        if(perNo == 1){	
                                changeItem(arr,i-1,arr[i-1]+" ")
                                        }else{
                                                changeItem(arr,i-1,arr[i-1]+", ")
                                        }
                                }
                    else if(firstIsWord && secondIsWord){
				if(perNo == 1){	
                	changeItem(arr,i-1,arr[i-1]+" ")
				}else{
					if(arr[i].toLowerCase()=="al")
						changeItem(arr,i-1,arr[i-1]+" ")
					else if(i==1 && field=="author")
						changeItem(arr,0,arr[0]+", ")
					else if(EdTrFlag)
						changeItem(arr,i-1,arr[i-1]+" ")
					else
						changeItem(arr,i-1,arr[i-1]+", ")
				}			
			}
                        arr[0]=arr[0].replace(",","").trim()+', ';
                        //var joinChar="";
                 }
			
        }
    }
	if((perNo == 1 && field!="editor") || (perNo == 1 && field!="author")){
		var joinstr = "";
	}else{
		var joinstr = ".";
	}
	//alert(arr.join("")+joinstr);
        
        var lastSingleChar=false;
        if(arr[arr.length-1].trim().replace(/\./g,"").length==1)
            {
                lastSingleChar=true;
            }
        if(noLowerFlg==true)
        {
        var strr=ReplaceAnd(arr.join(joinChar)+joinstr,true);
        }
        else
        {   
            var strr=ReplaceAnd(arr.join(joinChar)+joinstr);
        }
        strr=strr.trim();
        var arr=strr.trim().split(" ");
        if(arr.length>0 && allSingleFlag==false)
        {
            var lastw=arr[arr.length-1];
            if(lastw!='')
            {
                lastw=trimLastChar(lastw.trim(),".");
                if(lastSingleChar==false)
                {
                    arr[arr.length-1]=lastw;
                }
                else
                    {
                        arr[arr.length-1]=lastw+'.';
                    }
            }
            strr=arr.join(" ");
        }
        return strr
}


function HandleAddAuthors(str)
{
    var arr= splitString(str.trim());

    for (i=0;i<arr.length;i++)
    {
        if(i>0)
        {
            var firstIsWord=false;
            firstIsWord =CheckIsWord(arr[i-1]);

            var secondIsWord=false;
            secondIsWord =CheckIsWord(arr[i]);
           
            if(!firstIsWord && !secondIsWord)
                changeItem(arr,i-1,arr[i-1]+".")
                      
            else if(!firstIsWord && secondIsWord)
                changeItem(arr,i-1,arr[i-1]+". ")
           
            else if(firstIsWord && !secondIsWord)
                changeItem(arr,i-1,arr[i-1]+" ")
           
            else if(firstIsWord && secondIsWord)
                changeItem(arr,i-1,arr[i-1]+" ")
        }
    }
    return arr.join("")+".";
}
function changeItem(arr,indx,itm)
{
    arr[indx]=itm;
    return arr;
}
function CheckIsWord(strng)
{
    if(strng.length>1)
        return true;
    else
        return false;
}

function splitString(txt, removeComma)
{
    var matchTag1 = / /g;
    txt= txt.replace(matchTag1, "@");
    if(removeComma)
    {
        matchTag1= /,/g;
        txt= txt.replace(matchTag1, ",");
    }
    txt= txt.replace("..", ".");
    txt= CapitalizeAfter(txt,"@");
    txt= CapitalizeAfter(txt,",");
    txt=rtrim(txt,"@");
    var arr1= txt.split("@");
    return arr1.clean("");
}

function chkAcademicDate()
{
    var dt = document.getElementById('date').value;
    if(!isDateYYYYMonth(dt)&& !isDateYYYY(dt) && !isDateMonthYYYY(dt))
    {
		jAlertMod("Please enter a valid date in 'yyyy, month' or 'month, yyyy' or 'yyyy' format","Alert","&nbsp;OK&nbsp;",null);
        document.getElementById("CiteDate").innerHTML = "";
        setTimeout('setFocus("date")', 10);
    }

}

/*chris new method to check editions 07 July 09*/
function chkEdition()
{

    var edi = document.getElementById('edition').value;

    if (isNaN(edi))
    {
        //        var re1 = new RegExp("\\brev\\s\\b[0-9]", "gi");
        //        var re2 = new RegExp("\\brevised\\s\\b[0-9]", "gi");
        //        var re3 = new RegExp("\\brev\\.\\s\\b[0-9]", "gi");
        //        var re4 = new RegExp("\\brevised\\.\\s\\b[0-9]", "gi");
        //
        //        if((edi.match(re1)) || (edi.match(re2)) || (edi.match(re3)) || (edi.match(re4)))
        //        {
        //        }
        if((edi == "rev") || (edi == "rev.") || (edi == "revised") || (edi == "revised.") || (edi == "reprint") )
        {}
        else
        {
			jAlertMod("Enter numerals or 'rev'/ 'rev.'/ 'revised'/ 'revised.'/ 'reprint'","Alert","&nbsp;OK&nbsp;",null);
            document.getElementById("CiteEdition").innerHTML = "";
            setTimeout('setFocus("edition")', 10);
        }
    }
    else
    {
        if (edi < 2) {
			jAlertMod("Edition is recorded for '2' and above only!","Alert","&nbsp;OK&nbsp;",null);
            setTimeout('setFocus("edition")', 10);
            document.getElementById("CiteEdition").innerHTML = "";
        }
    }

}
function chkNum(field,divelem)
{
	var num = document.getElementById(field).value;
    if(isNaN(num))
    {
		jAlertMod1("Enter number only for this field.","Alert","&nbsp;OK&nbsp;",function(c1){
		if(c1)
		{
			document.getElementById(divelem).innerHTML = "";
			document.getElementById(field).value = '';
			document.getElementById(field).focus();
			return false;
		}});
    }
	
}

function chkVolume(flag)
{
   if(flag && flag=='journal')
	{
	var vol = document.getElementById('volume').value;
	var ck_VolIss = /^[A-Za-z0-9' ']{0,100}$/;
	if(!ck_VolIss(vol)){
		jAlertMod("Please enter alphanumerals only!","Alert","&nbsp;OK&nbsp;",null);
      	document.getElementById("CiteVolume").innerHTML = "";
      	setTimeout('setFocus("volume")', 10);
		}
	}
    else
	{
    var vol = document.getElementById('volume').value;
    if(vol.search(" ")!=-1)
    {
        var vols=vol.split(" ");
        if (isNaN(vols[0]))
        {
			jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
            document.getElementById("CiteVolume").innerHTML = "";
            setTimeout('setFocus("volume")', 10);
        }
    }
    else if(vol.search("-")!=-1)
    {
        var vols=vol.split("-");
        if (isNaN(vols[0]) || isNaN(vols[1]))
        {
			jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
            document.getElementById("CiteVolume").innerHTML = "";
            setTimeout('setFocus("volume")', 10);
        }
    }
    else if(isNaN(vol))
    {
		jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
        document.getElementById("CiteVolume").innerHTML = "";
        setTimeout('setFocus("volume")', 10);
    }
}
    
}

function chkIssue(flag)
{
   if(flag && flag=='journal')
	{
	var vol = document.getElementById('issue').value;
	var ck_VolIss = /^[A-Za-z0-9' ']{0,100}$/;
	if(!ck_VolIss(vol)){
		jAlertMod("Please enter alphanumerals only!","Alert","&nbsp;OK&nbsp;",null);
      	document.getElementById("CiteIssue").innerHTML = "";
      	setTimeout('setFocus("issue")', 10);
		}
	}
 
    else
    {
    var iss = document.getElementById('issue').value;
    if(isNaN(iss))
    {
		jAlertMod("Please enter numerals only!","Alert","&nbsp;OK&nbsp;",null);
        document.getElementById("CiteIssue").innerHTML = "";
        setTimeout('setFocus("issue")', 10);
    }
   }
}
//------OLD
//var id = "";
//var pg_no = "";
function chkPage()
{
return false;

}
//------OLD
var pub2="";
var place2="";
function formatPlPub()
{
    if(document.getElementById('CitePlace')!=null)
    {
        place2 = document.getElementById('CitePlace').innerHTML;
    }
    if(document.getElementById('CitePublisher')!=null)
    {
        pub2 = document.getElementById('CitePublisher').innerHTML;
    }
var tempPlc=place2.replace("&nbsp;","").trim();
    if(place2.trim()!="" && pub2.trim()!="")
    {
        if(tempPlc.indexOf('n.p.')>=0)
        {
            if(tempPlc.indexOf(":")<0)
                place2= place2+":";
        }
        else
        {
            place2= place2.replace(".",":");
        }
    }
    else if(place2.trim()!="" && pub2.trim()=="")
    {
            if(tempPlc.indexOf('n.p.')>=0)
            {
                place2=place2.replace(":","");
            }
            else
            {
    		place2=place2.replace(":",".");
            }
     }
   
    if(document.getElementById('CitePlace')!=null)
        document.getElementById('CitePlace').innerHTML = place2;

    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML =pub2;

}

//MI_24_May_2012
var publ = "";
var city = "";
function formatPubCity()
{
    if(document.getElementById('CitePublisher')!=null)
    {
        publ = document.getElementById('CitePublisher').innerHTML.trim();
    }
    if(document.getElementById('CiteCity')!=null)
    {
        city = document.getElementById('CiteCity').innerHTML.trim();
    }

    if(publ!="" && city!="")
    {
        publ= publ.replace(".", ",");
    }
    else if(publ!="" && city=="")
    {
        publ = publ.replace(",",".")
    }
   
    if(document.getElementById('CitePublisher')!=null)
        document.getElementById('CitePublisher').innerHTML = publ;
    if(document.getElementById('CiteCity')!=null)
        document.getElementById('CiteCity').innerHTML = city;
}
//End

/*chris - end of functions*/
function showDiv(id)
{ 
    if (document.getElementById) 
    { 

        if(document.getElementById(id)!=null)
        {
            document.getElementById(id).style.visibility = 'visible';
            document.getElementById(id).style.position = 'relative'; 
            document.getElementById(id).style.left = 'auto';
            document.getElementById(id).style.top = 'auto';
        }
    } 
    else 
    { 
        if (document.layers) 
        { // Netscape 4 
            document.hideshow.visibility = 'visible'; 
        } 
        else 
        { // IE 4 
            document.all.hideshow.style.visibility = 'visible'; 
        } 
    } 
}



/*chris added new method to handle line breaks and br tags 01 July 09*/
function replaceBR(instr)
{
    var matchTag1 = /<br*?>/g;
    var matchTag2 = /<BR*?>/g;
    var str=instr.replace(matchTag1, "�");
    return str.replace(matchTag2, "�")
}
function replaceNBSP(istr)
{
    var matchTag1 = /&nbsp;/g;
    var str=istr.replace(matchTag1, " ");
    return str;
}
function replaceSpecial(instr)
{
    var matchTag1 = /�/g;
    var str=instr.replace(matchTag1, "\r\n");
    return str;
}
function replaceNewLineBR(str)
{
    str=str.replace(new RegExp( "\\n", "g" ),"<br>").replace(new RegExp( "\\r", "g" ),"");
    return str;
}
/*chris end of 2 functions*/



function savePrevPanl1(srcPnlID , destPnlID,log)
{

}

//Get Array Name
function getArr(arrName)
{
    var tmpArr;
    switch(arrName)
    {
        case "bookPanel":
            tmpArr = bookPanelArr;
            break;
    }
	
    return tmpArr;
}

//Clear piew panel
function clearPanel(panelArr,resetNum)
{
	//for reset personal author flag MI_28-04-2012
	document.perYesau1=0;
	document.perNoau1=0;
	document.perYesau2 = 0;
	document.perNoau2 = 0;
	document.chapteralert = false;
	document.perYeseditor=0;
	document.perNoeditor=0;
	document.intextonly = false;
	//end
	for(YAU=2;YAU<10;YAU++){
		AF = 'perYesauthor'+YAU;
		if(eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NAU=2;NAU<10;NAU++){
		NF = 'perNoauthor'+NAU;
		if(eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	for(YED=2;YED<10;YED++){
		AF = 'perYeseditor'+YED;
		if(eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NED=2;NED<10;NED++){
		NF = 'perNoeditor'+NED;
		if(eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	//end
    var tmpArr;
    tmpArr = getArr(panelArr);
	
    if (typeof resetNum != "undefined")
    {
        numOfAuthors = 2;
        numOfEditors = 2;
        numOfProducers = 2;
        numOfRevAuthors = 2;
        numOfTrans = 2;
        noAuthorFlg = false;
    }
    document.getElementById(panelArr).innerHTML = "";
    document.getElementById(panelArr).innerHTML = srcSec;
		
    if(document.getElementById('authorSec'))
    {
        document.getElementById('authorSec').innerHTML = "";
    }
	
    if(document.getElementById('editorSec'))
    {
        document.getElementById('editorSec').innerHTML = "";
    }
	
    if(document.getElementById('producerSec'))
    {
        document.getElementById('producerSec').innerHTML = "";
    }
	
    if(document.getElementById('revauthorSec'))
    {
        document.getElementById('revauthorSec').innerHTML = "";
    }
	
    if(document.getElementById('transSec'))
    {
        document.getElementById('transSec').innerHTML = "";
    }
	
    bookPanelArr = new Array("CiteAuthor","VirCiteAuthor","CiteYear","CiteDate","CiteChapter","CiteIOn","CiteEditor","VirCiteEditor","CiteEd","CiteTitle","CiteDescriptor","CiteSubject","CiteTrans","VirCiteTrans","CiteTra","CiteEdition","CiteIssue","CiteVolume","CitePage","CitePlace","CitePublisher","CitePublication","CiteHttp","CiteAccessed","CiteProducer","VirCiteProducer","CiteProd","CiteRevAuthor","VirCiteRevAuthor","CiteRevAuth","CiteRecord","CiteSource","CiteCity","CiteRole","CiteRevOpen","CiteRevClose","CiteObserved","CiteAuth","CiteNotation",'CiteDatabase');
	
//document.getElementById('CiteAuthor').style.fontStyle = "normal";
	
}


//Email Function
function email(id)
{
     var section=getSectionName();
     if(getInnerText('bookPanel') != "")
        chkPlcAndDate();

    //clearEditor();
    if(reviewFlg)
    {
        if( document.getElementById('descriptor') && document.getElementById('descriptor').value != "")
            chkTitle('descriptor');
    }
    else if(document.getElementById('editor') && document.getElementById('editor').value != "")
        chkTitle('editor');
    else if( document.getElementById('chapter') && document.getElementById('chapter').value != "")
        chkTitle('chapter');
    else if(document.getElementById('title') && document.getElementById('title').value != "")
        chkTitle('title');
    else if(document.getElementById('publisher') && document.getElementById('publisher').value != "")
        chkTitle('publisher');
    else if(document.getElementById('http') && document.getElementById('http').value != "")
        chkTitle('http');

    if($.trim($("#svPnl").text())!="")
        {
            var n=$('.deletecitation:checked').length;
            if(n>0)
            {
        var content="";
	  
        $('.deletecitation:checked').each(function(index)
        {
			var par = $(this).parent("div");
                        
			content1 = $(par).children("span").html();
			content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'><span>"+content1+"</span></div><br />"; 
			content=content+content1;
                    

	      });
   
			content=content.replace(/&nbsp;/g , " ");
			content=content.replace(/&/g , "##");
                        content=content.replace(/%20/g , "#####");
   		
     var txtToEmail = "<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
   	
    //var txtToEmailReal = document.getElementById(id).innerText;
	var txtToEmailReal =id;
	txtToEmail = removeNewLine(txtToEmail);
    var emailAddr = document.getElementById('emailAddr').value;
	//alert(emailAddr);
	    if(echeck(emailAddr))
    {

        var lngth = txtToEmail.length;
         document.getElementById('emailedData1').value = txtToEmail
     
        if(txtToEmailReal != "")
        {	
		$.ajax({
               type: 'POST',
		   async:false,
               url: base_url+ 'students/scripts/phpMailer.php',
              data: "html="+txtToEmail+"&emailAddr="+emailAddr+"&set=email&format="+section+"&time="+new Date().toString().substring(4,28),
		   success: function(data){
				//alert(data);
   				if(data == 'An error has occured.' )
					{
                                jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
					}
					else
				if(data == 'success' )
				  	{
					  $("img.btn_close").parent("a").trigger("click");
					  jAlertMod("Your CiteMaker references have been e-mailed. ","Success","&nbsp;OK&nbsp;",null);					
					  $('#fade , .popup_block').fadeOut(function() {
							$('#fade, a.close').remove();  //fade them both out
					  });					
					}					
					  }
	      });
    }
 }
  }
            else
            {
             jAlertMod("Please select citation to email.","Alert","&nbsp;OK&nbsp;",null);   
            }
        }
return false;
}

function email1()
{
	  var section=getSectionName();
	  var n = $('.deletecitationbody:checked').length;
	  if(n>0)
	{
	  var content="";
        $('.deletecitationbody:checked').parent().each(function(index)
        {
			var inpt = $(this).html();
			var par = $(this);
			$(par).children('input').remove();
			content1 = $(par).html();
			$(par).html(inpt);
			
			content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'>"+content1+"</div><br />"; 
			content=content+content1;
			//content=content.replace("&nbsp;",""); 


        });
		content=content.replace(/&nbsp;/g , " ");
		content=content.replace(/&/g , "##");
                content=content.replace(/%20/g , "#####");
   		

	var txtToEmail = "<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
	txtToEmail = removeNewLine(txtToEmail);
	var emailAddr1 = document.getElementById('emailAddr4').value;
	
	if(echeck(emailAddr1))
	{
        var lngth = txtToEmail.length;
        document.getElementById('emailedData5').value = txtToEmail;
	$.ajax({
               type: 'POST',
		   async:false,
		   url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr1="+emailAddr1+"&set=email1&format="+section+"&time="+new Date().toString().substring(4,28),
		   success: function(data){
   				if(data =='An error has occured.' )
					{
                                jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
					}
					else
				if(data =='success' )

					{
					  jAlertMod("Your CiteMaker citations have been e-mailed.","Success","&nbsp;OK&nbsp;",null);		
					  $('#fade , .popup_block').fadeOut(function() {
							$('#fade, a.close').remove();  //fade them both out
						});			
					}
			}					
		
	      });


	}
	return false;
	}
	 else
		{jAlertMod("Click the checkbox alongside citations before using Email.","Alert","&nbsp;OK&nbsp;",null);}


return false;		
}

function email_intext_(){
  var section=getSectionName();
  var content="";
  $('.chkIntext:checked').parent().each(function(index){
		var inpt = $(this).html();
		var par = $(this);
		$(par).children('input').remove();
		content1 = $(par).html();
		$(par).html(inpt);
		
		content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'>"+content1+"</div><br />"; 
		content=content+content1;
		//content=content.replace("&nbsp;",""); 


	});
	content=content.replace(/&nbsp;/g , " ");
	content=content.replace(/&/g , "##");

	var txtToEmail = "<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
	txtToEmail = removeNewLine(txtToEmail);
	var emailAddr1 = document.getElementById('mail_id').value;
	if(echeck(emailAddr1)){
        var lngth = txtToEmail.length;
        document.getElementById('emailedData5').value = txtToEmail;
		$.ajax({
               type: 'POST',
			   async:false,
			   url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr1="+emailAddr1+"&set=email1&format="+section+"&time="+new Date().toString().substring(4,28),
		  	 success: function(data){
   				if(data =='An error has occured.' ){
                  jAlertMod("An error has occured, please report this to the website administrator.","Failure","&nbsp;OK&nbsp;",null);
				}else if(data =='Your WriteCite references have been e-mailed.' ){
				  jAlertMod("Your WriteCite references have been e-mailed. ","Success","&nbsp;OK&nbsp;",null);					 
				}
				$('#fade , .popup_block').fadeOut(function() {
						$('#fade, a.close').remove();  //fade them both out
					});
			}					
	      });
	}
return false;		
}

function clearEditor()
{
    if(document.getElementById('author').value == "")
    {
        document.getElementById('CiteEd').innerText = "";
        document.getElementById('CiteEditor').innerText = "";
        document.getElementById('VirCiteEditor').innerHTML = "";
    }
}
//Email Check
//When changing from page to another one
function onPgChange()
{
    ask4Save();
}

function onPgChange1()
{
    ask4Save1();
}

//Check if there's smth to read from the clipboard


	
String.prototype.trim = function() 
{ 
    return this.replace(/^\s+|\s+$/, '');
 
};


function inOn(inOnStr)
{
    showDiv('CiteIOn');
    if(inOnStr == "in")
        setInnerText('CiteIOn', " In");
    else if(inOnStr == "on")
        setInnerText('CiteIOn', " On");
    else if(inOnStr == ":")
        setInnerText('CiteIOn', ":");
    else if(inOnStr == "in:")
        setInnerText('CiteIOn', " In:");
	else
        setInnerText('CiteIOn',"");
}

//show Email Section
function showEmailDiv(secID)
{
    document.getElementById(secID).style.display=(document.getElementById(secID).style.display!="block")? "block" : "none";
    document.getElementById('emailAddr').value = "";
}

//show Email Section
function showEmailDiv2()
{
	secID = 'emailSec1';
    document.getElementById(secID).style.display=(document.getElementById(secID).style.display!="block")? "block" : "none";
    document.getElementById('emailAddr1').value = "";
}

function onPgClose()
{
  
}

/*chris changed method to validate 10 July 09*/
function ValidateDate(dtElement,clrElement,other)
{
    if(typeof clrElement == "undefined")
        clrElement="CiteAccessed";
    
    var noNdFlg=false;
    if(clrElement!='CiteDate')
    {
        noNdFlg=true;
    }

if(typeof other == "undefined")
        other="";

    var dt=document.getElementById(dtElement);
    if(dt.value.trim()=='')
    {}
    else
    {
        if((dt.value=="n.d." || dt.value=="n.d" || dt.value=="nd" || dt.value=="nd.") && noNdFlg!=true)
        {
            return true;
        }
        else if(dtElement=="accessed")
            {
                if (isDateDDMonthYYYY(dt.value))
                    {
                    return true;
                }
                else
                {
                  
                               jAlertMod("Please enter a valid date in DD MMMM YYYY format","Alert","&nbsp;OK&nbsp;",function(c1){
                                   if(c1)
                                    {
                                            document.getElementById(clrElement).innerHTML="";
                                                    document.getElementById(dtElement).value="";
                                                    document.getElementById(dtElement).focus();
                                            return false;
                                    }
                               });
                    return false;
                }
            }
            else if(other=="podcast")
            {
                if (isDateDDMonth(dt.value) || isDateDDMonthYYYY(dt.value) || isDateMonthYYYY(dt.value))
                    {
                    return true;
                }
                else
                {
                               jAlertMod("Please enter a valid date in DD MMMM / DD MMMM YYYY/ MMMM YYYY format","Alert","&nbsp;OK&nbsp;",function(c1){
                                   if(c1)
                                    {
                                            document.getElementById(clrElement).innerHTML="";
                                                    document.getElementById(dtElement).value="";
                                                    document.getElementById(dtElement).focus();
                                            return false;
                                    }
                               });
                    return false;
                }
            }
            else if(dtElement=="observed" && other=="movie")
            {
                if (isDateDDMonthYYYY(dt.value))
                    {
                    return true;
                }
                else
                {
                               jAlertMod("Please enter a valid date in DD MMMM YYYY format","Alert","&nbsp;OK&nbsp;",function(c1){
                                   if(c1)
                                    {
                                            document.getElementById(clrElement).innerHTML="";
                                                    document.getElementById(dtElement).value="";
                                                    document.getElementById(dtElement).focus();
                                            return false;
                                    }
                               });
                    return false;
                }
            }
            else if(dtElement=="observed")
            {
                if (isDateDDMonth(dt.value))
                    {
                    return true;
                }
                else
                {
                               jAlertMod("Please enter a valid date in DD MMMM format","Alert","&nbsp;OK&nbsp;",function(c1){
                                   if(c1)
                                    {
                                            document.getElementById(clrElement).innerHTML="";
                                                    document.getElementById(dtElement).value="";
                                                    document.getElementById(dtElement).focus();
                                            return false;
                                    }
                               });
                    return false;
                }
            }
            else
                {
                    var part2Date=false;
                    if(dt.placeholder!='')
                        {
                            var arrplchldr=dt.placeholder.split(" ");
                            if(arrplchldr.length==2)
                                part2Date=true
                        }
                        if(part2Date)
                            {
                               if (isDateDDMonth(dt.value))
                                    {
                                    return true;
                                }
                                else
                                {
                                                jAlertMod("Please enter a valid date in DD MMMM format","Alert","&nbsp;OK&nbsp;",function(){
                                                    if(c1)
                                                    {
                                                            document.getElementById(clrElement).innerHTML="";
                                                            document.getElementById(dtElement).value="";
                                                            document.getElementById(dtElement).focus();
                                                            return false;
                                                    }
                                                });

                                    return false;
                                } 
                            }
                            else
                             {   
                                if (isDateDDMonthYYYY(dt.value))
                                    {
                                    return true;
                                }
                                else
                                {
                                                jAlertMod("Please enter a valid date in DD MMMM YYYY format","Alert","&nbsp;OK&nbsp;",function(c1){
                                                    if(c1)
                                                    {
                                                            document.getElementById(clrElement).innerHTML="";
                                                            document.getElementById(dtElement).value="";
                                                            document.getElementById(dtElement).focus();
                                                            return false;
                                                    }
                                                });

                                    return false;
                                }
                             }
                    /*if (isDateDDMMYYYY(dt.value)|| isDateMMDDYYYY(dt.value) ||
                        isDateDDMonthYYYY(dt.value) || isDateMonthDDYYYY(dt.value) ||
                        isDateYYYYMonth(dt.value) || isDateYYYY(dt.value)|| isDateMonthYYYY(dt.value))
                        {
                        return true;
                    }
                    else
                    {
                        dt.focus();
                        dt.value="";
                        document.getElementById(clrElement).innerHTML="";
                        setTimeout('setFocus("'+dtElement+'")',10);
                                    jAlertMod("Please enter a valid date in dd/mm/yyyy or mm/dd/yyyy or dd mmm yyyy or mmm dd yyyy or dd month yyyy or month dd yyyy or yyyy, month or yyyy, mmm or yyyy format","Alert","&nbsp;OK&nbsp;",null);
                                    
                        return false;
                    }*/
                }
        
    }
    return true;
}
/*Change Date Validation by MI on 15-05-2012*/
function ValidateDate1(dtElement,clrElement)
{
    if(typeof clrElement == "undefined")
        clrElement="CiteAccessed";


    var dt=document.getElementById(dtElement);
    if(dt.value.trim()=='')
    {}
    else
    {
        if (isDateDDMonth(dt.value))
        {
            return true;
        }

        else
        {
			jAlertMod("Please enter a valid date in  dd month ","Alert","&nbsp;OK&nbsp;",function(c1){
                            if(c1)
                            {
                                    document.getElementById(clrElement).innerHTML="";
                                            document.getElementById(dtElement).value="";
                                            document.getElementById(dtElement).focus();
                                    return false;
                            }
                        });
            return false;
        }
    }
    return true;
}
/*End Date Validation by MI on 15-05-2012 */

function init() {
	//alert(456);
	//copy_intext();
	var n = $('.deletecitation:checked').length;
	//if(n>0){
	clip11 = new ZeroClipboard.Client();
	clip11.setHandCursor( true );
	
	clip11.addEventListener('mousedown', function (client) {
	
	var content="";
	$("#d_clip_container").parent().addClass("active");
        var previewChkFlag=false;
                if(document.getElementById('previewChk') && $('#previewChk:checked').length>0 && $("#bookPanel").text().trim()!='')
                    {
                        previewChkFlag=true;
                        
                    }
	if($.trim($("#svPnl").text())!="" || previewChkFlag==true)
	{
            if(previewChkFlag==true)
                {
                    content=content+getText('bookPanel')+"<br/>\r\n \r\n";
                }
		$('.deletecitation:checked').parent().each(function(index){
			content=content+$.trim($(this).children("span").html())+"<br/>\r\n \r\n";
		})
                //02-07-2016 copy without login allowed on preview panel- Lalit
		//if(document.dblog==true){
			if(content=="")
			{
				jAlertMod("Click the checkbox alongside citations before using Copy.","Alert","&nbsp;OK&nbsp;",null);
				return false;
			}
			else{
				clip11.setText(content);	
			}
		/*}else{
			RegisterAlert();
		}*/
		
	
	}
	else{
			
		clip11.addEventListener('Complete', function () {
				if($.trim($("#svPnl").text())==""){
						jAlertMod("No citation found. Save your citation(s) first.","Alert","&nbsp;OK&nbsp;",null);
						return false;
				}
		});
	}
	});
	clip11.addEventListener('mouseOver', function (client) {
		$("#d_clip_container").parent().addClass("active");
		
	});
	clip11.addEventListener('mouseOut', function (client) {
		//$("#svPnl").parent().removeClass("active");
		$("#d_clip_container").parent().removeClass("active");
		
	});
	
	clip11.glue('d_clip_button','d_clip_container');
}
//-------------------------------MIS_16_april_'13----------------------------------------------

function ReplaceInternetS(){
	$('#publicationtype a').each(function(index, element) {
        if($(element).html()=="Internet Sourced [click +]"){
			$(element).attr("id","intexplink");
		}else if($(element).html()=="Internet Sourced [click here]"){
			$(element).attr("id","intexplink");
			$(element).html("Internet Sourced [click +]");
		}
    });
}
function translationformat(){
	if(document.getElementById('descriptor') && document.getElementById('descriptor').value != "" && document.getElementById('editor') && document.getElementById('editor').value != ""){
		setInnerText('CiteEd', " by");
		var lang = getInnerText("CiteDescriptor").trim();
		lang = lang.replace(/[.;]$/,"");	
		setInnerText('CiteDescriptor', " "+lang);
	}
}
function removeDotFromEnd(which){
	var lang = getInnerText(which).trim();
	lang = lang.replace(/[.;]$/,"");	
	setInnerText(which, " "+lang);
}
function setChapTtlQt(elm)
{
    if(elm.checked==true)
        {
            localStorage.setItem("chapTtlQt", "checked");
        }
        else
            {
                localStorage.setItem("chapTtlQt", "notchecked");
            }
}

function clearGroupAll(elem,which,div){
	var editorVal = getInnerText("CiteAuthor2").trim();
	var firsteditorVal = getInnerText("CiteAuthor").trim(); 
	if(firsteditorVal!=''){
		if(which == 'editor' && elem.checked){
			 if(editorVal==''){
				 setInnerText(div, " ed.");
			 }else{
				 setInnerText(div, " eds.");
			 }
		}else{
			 if(editorVal==''){
				 setInnerText(div, "");
			 }else{
				 setInnerText(div, "");
			 }
		}
	}
        if(elem.checked==false)
            {
                setInnerText(div, "");
            }
}

function showHideEditorBlock(elem)
{
    if(elem.checked==true)
        {
            document.getElementById('editorp').style.display="none";
            document.getElementById('editor').value="";
            document.getElementById('editorSec').style.display="none";
            document.getElementById('editorSec').innerHTML="";
            document.getElementById('addEditdiv').style.display="none";
            document.getElementById('VirCiteEditor').style.display="none";
            document.getElementById('VirCiteEditor').innerHTML="";
            document.getElementById('CiteEditor').style.display="none";
            document.getElementById('CiteEditor').innerHTML="";
            document.getElementById('CiteEd').style.display="none";
            document.getElementById('CiteEd').innerHTML="";
            if(document.getElementById('CiteAuth'))
            document.getElementById('CiteAuth').style.display="inline";
            numOfEditors=2;
        }
        else
            {
                document.getElementById('editorp').style.display="block"; 
                document.getElementById('editorSec').style.display="block";
                document.getElementById('addEditdiv').style.display="block";               
                document.getElementById('VirCiteEditor').style.display="inline";
                document.getElementById('CiteEditor').style.display="inline";
                document.getElementById('CiteEd').style.display="inline";
                if(document.getElementById('CiteAuth'))
                document.getElementById('CiteAuth').style.display="none";
            }
}

function trimLastChar(str,charToRemove)
{
    var arr=str.split(charToRemove);
    var i;
    var str1='';
    if(arr.length>0)
        {
          for(i=0;i<arr.length;++i)
          {
              if(arr[i].replace("&nbsp;","").trim()!='')
                {
                    if(i>0)
                        {
                            str1+=charToRemove;
                        }
                    str1+=arr[i];
                }
          }
          return str1;
        }
        return str;
}

function getFieldValue(id)
{
    if(document.getElementById(id))
        {
            return document.getElementById(id).value.trim();
        }
        return '';
}

function clearCreativeGroup(elem,which){
	var group = document.publication.chkproducer;
        var isChecked=elem.checked;//LC 30052015
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
        elem.checked=isChecked;
}

function lastEdAuth(id)
{
    var i=0;
    var j='';
    var sel=0;
    for(i=0;i<10;++i)
        {
            if(i!=1)
                {
                    if(i==0)
                        {
                            j='';
                        }
                        else
                            {
                                j=i;
                            }
                            if(document.getElementById(id+j) && document.getElementById(id+j).value.trim()!='')
                                {
                                    sel=j;
                                }
                }
        }
        return sel;
}

function formatReview()
{
    dottocomma('CiteTitle',Array('CiteEditor','CitePublisher'));
    var lastEd=lastEdAuth('editor');
    if(lastEd!==0)
        {
            var i;
            removeLastComma('CiteEditor');
            for(i=2;i<10;++i)
                {
                    if(document.getElementById('CiteEditor'+i))
                        {
                            removeLastComma('CiteEditor'+i);
                        }
                        else
                            {
                                break;
                            }
                }
            dottocomma('CiteEditor'+lastEd,Array('CitePublisher','CitePlace'));
        }
    dottocomma('CitePublisher',Array('CitePlace'));
    dottocomma('CiteIssue',Array('CiteObserved','CitePage'));
    dottocomma('CiteObserved',Array('CitePage'));
}

function dottocomma(div,arr)
{
    
            var i=0;
            flg=false;
            if(getInnerText(div).trim().replace("&nbsp;","")!="")
                {
                    for(i=0;i<arr.length;++i)
                        {
                           if(getInnerText(arr[i]).trim().replace("&nbsp;","")!="")
                               {
                                   flg=true;
                                   break;
                               }
                        }
                        var tmp=document.getElementById(div).innerHTML;
                        if(flg)
                            {
                                tmp = tmp.replace(/[.;]$/,"");
                                tmp = tmp.replace(/[,;]$/,"")+',';
                            }
                            else
                                {
                                    tmp = tmp.replace(/[,;]$/,"");
                                    tmp = tmp.replace(/[.;]$/,"")+'.';
                                }
                                document.getElementById(div).innerHTML=tmp;
                }
}

function removeLastComma(id)
{
    var tmp=document.getElementById(id).innerHTML;
    
    tmp = tmp.replace(/[,;]$/,"");
    document.getElementById(id).innerHTML=tmp;
}

function followedBy(citeType,followedBy)
{
    var i;
    var citeTypeNo=-1,followedByNo=-1;
    for(i=0;i<bookPanelArr.length;++i)
        {
            if(bookPanelArr[i]==citeType && document.getElementById(citeType))
                {
                    citeTypeNo=i;
                }
                if(bookPanelArr[i]==followedBy && document.getElementById(followedBy))
                {
                    followedByNo=i;
                }
        }
        if(citeTypeNo>-1 && followedByNo>-1)
            {
                for(i=0;i<srcVarGlb.length;++i)
                    {
                        if(srcVarGlb[i]==citeTypeNo)
                            {
                                if((i+1)<srcVarGlb.length && srcVarGlb[i+1]==followedByNo)
                                {
                                    return true;
                                }
                                else
                                    {
                                        return false;
                                    }
                            }
                            
                    }
                    
            }
            return false;
}

function isPreviousFilled(citeType)
{
    var i;
    for(i=0;i<srcVarGlb.length;++i)
    {
        if(bookPanelArr[srcVarGlb[i]]==citeType)
            {
                return false;
            }
            var temp;
            if(document.getElementById(bookPanelArr[srcVarGlb[i]]))
                {
                    temp=document.getElementById(bookPanelArr[srcVarGlb[i]]).innerHTML;
                    temp=temp.replace("&nbsp;","");
                    temp=temp.trim();
                    if(temp!='')
                        {
                            return true;
                        }
                }
    }
    return false;
}

function isJustPreviousFilled(citeType)
{
    var i;
    for(i=0;i<srcVarGlb.length;++i)
    {
        if(bookPanelArr[srcVarGlb[i]]==citeType)
            {
                if(i>0)
                    {
                        var temp;
                    if(document.getElementById(bookPanelArr[srcVarGlb[i-1]]))
                        {
                            temp=document.getElementById(bookPanelArr[srcVarGlb[i-1]]).innerHTML;
                            temp=temp.replace("&nbsp;","");
                            temp=temp.trim();
                            if(temp!='')
                                {
                                    return bookPanelArr[srcVarGlb[i-1]];
                                }
                        }
                    }
                    break;
            }
         
    }
    return '';
}

function isNextFilled(citeType)
{
    var i;
    flg=false;
    for(i=0;i<srcVarGlb.length;++i)
    {
        if(bookPanelArr[srcVarGlb[i]]==citeType)
            {
                flg=true;
                continue;
            }
            if(flg==false)
                continue;
            var temp;
            if(document.getElementById(bookPanelArr[srcVarGlb[i]]))
                {
                    temp=document.getElementById(bookPanelArr[srcVarGlb[i]]).innerHTML;
                    temp=temp.replace("&nbsp;","");
                    temp=temp.trim();
                    if(temp!='')
                        {
                            return true;
                        }
                }
    }
    return false;
}

function removeDot(div)
{
    
            flg=false;
            if(getInnerText(div).trim().replace("&nbsp;","")!="")
                {
                    
                        var tmp=document.getElementById(div).innerHTML;
                        if(flg)
                            {
                                tmp = tmp.replace(/[.;]$/,"");
                                tmp = tmp.replace(/[,;]$/,"");
                            }
                            else
                                {
                                    tmp = tmp.replace(/[,;]$/,"");
                                    tmp = tmp.replace(/[.;]$/,"");
                                }
                                document.getElementById(div).innerHTML=tmp;
                }
}

function formatTvserieseBlue()
{
    if(document.getElementById('chkdvdblue').checked==true)
        {
            document.getElementById('pplace').style.display="block";
            document.getElementById('descriptor').placeholder="Blu-ray";
            document.getElementById('pbroadcastdt').style.display="none";
            document.getElementById('date').value="";
            setInnerText('CiteDate',"");
            document.getElementById('pbroadcasttm').style.display="none";
            document.getElementById('record').value="";
            setInnerText('CiteRecord',"");
            ReloadTextDiv2('publisher','CitePublisher');
        }
        else
            {
                document.getElementById('pplace').style.display="none";
                document.getElementById('place').value="";
                document.getElementById('descriptor').placeholder="";
                document.getElementById('pbroadcastdt').style.display="block";
                document.getElementById('pbroadcasttm').style.display="block";
                ReloadTextDiv2('place','CitePlace');
            }
}


function formatEjournal()
{
    if(document.getElementById('ejournal').checked==true)
        {
            document.getElementById('pformat').style.display="none";
            document.getElementById('descriptor').value="";
            setInnerText('CiteDescriptor',"");
        }
        else
            {
                document.getElementById('pformat').style.display="block";
            }
}


function clearVolEdiGroup(elem){
	var group = document.publication.chkVolume;
        var isChecked=elem.checked;//LC 30052015
	for (var i=0; i<group.length; i++) {
		if (group[i] != elem) {
			group[i].checked = false;
		}
	}
        elem.checked=isChecked;
}

function makeKeywordsCapital(inStr)
{

    var Arrstr = new Array('pdf','dvd','cd');
    var matchTag2 = /\b(&)\b/gi;
	str=inStr.replace(matchTag2, "&");
	for(i=0;i<Arrstr.length;i++){
		matchtag = new RegExp('\\b('+Arrstr[i]+')\\b','gi');
		str = str.replace(matchtag, Arrstr[i].toLowerCase());
	}
    return str;
}

function insertPdf()
{
    if(document.getElementById('chkpdf').checked)
        {
            showDiv('CiteDescriptor');
            document.getElementById('CiteDescriptor').innerHTML=" [pdf]";
            
        }
        else
            {
                setInnerText('CiteDescriptor','');
            }
}

function reformatEditor(myFlg)
{
            var pattrn=new RegExp(/^[A-z]+\s+[A-z]+\s+[A-z]{1,}$/);
				var pattrn1=new RegExp(/^[A-z]{1}[.\s]+\s+[A-z]{1,}$/);
				var pattrn2=new RegExp(/^[A-z]+$/);
				var pattrn3=new RegExp(/^[A-z]+\s+[A-z]+$/);
				ExtraEd = false;
                                var  perNo = document.perNoeditor; 
                                var field='editor';
                var edi = document.getElementById('CiteEditor').innerHTML;
                var virEdiCnt=0;
            edi = edi.replace("(","");
            edi = edi.replace("&nbsp;","");
			
				if(document.getElementById('VirCiteEditor').innerHTML !='')
					ExtraEd = true;
				edval = document.getElementById('editor').value;
                                
        
        var fstNmLstNmFlag=fNameLnameFrmt(field);
        
				
            var splittable=false;
            
            if(edi!='')
                {
                    str1=edi.split(' ');
                }
                
                if(perNo>0)
                {
                    if(document.getElementById(field))
                    {
                        edi=$("#"+field).val();
                        edi = ucFirstAllWords(edi);
                        edi = ReplaceAnd(edi);
                        
                    }
                    //edi=trimLastChar(edi.trim(),".").trim()+'.';
                    //
                }
                else if(fstNmLstNmFlag==true)
                    {
                        edi=reformatEd(field);
                    }
              
			
			if(document.getElementById('CiteEd')){
				var eds = document.getElementById('CiteEd').innerHTML;
				eds =eds.replace(",","");
			}else{
				//do nothing
				var eds="";
			}
                        //Lalit added to remove CiteEd if citeEd is followed by editors
                        if(followedBy('CiteEd','CiteEditor'))
                            {
                                eds="";
                            }



                //Chris added to account for translator

                            var edi2 =  document.getElementById('VirCiteEditor').getElementsByTagName('span');
                        var strSpan='';
                            
                            
                            for (var i = 0; i < edi2.length; i++) {

                                    //omitting undefined null check for brevity
                                    edit = document.getElementById(edi2[i].id).innerHTML;
                                    
                                    
                                    
                                    if (edi2[i].id.lastIndexOf("CiteEditor", 0) === 0) {

                                            filedno = edi2[i].id.charAt(edi2[i].id.length - 1);

                                            var  addperNo = eval("document.perNoeditor"+filedno);

                                           fstNmLstNmFlag=fNameLnameFrmt(field+filedno); 
                                        if(addperNo>0)
                                        {
                                            if(document.getElementById(field+filedno))
                                            {
                                                edit=$("#"+field+filedno).val();
                                                edit = ucFirstAllWords(edit);
                                                edit = ReplaceAnd(edit);
                                            }
                                            //edit=trimLastChar(edit.trim(),".").trim()+'.';
                                        }
                                        else if(fstNmLstNmFlag==true)
                                        {
                                            edit=reformatEd(field+filedno);
                                        }
                                        
                                        virEdiCnt++;                                                    
                                        
                                            

                                                
                                                
                                            

                                    }
                                    strSpan+='<span>'+edit+'</span>';

                            }

                            if(virEdiCnt>0)
                            {
                                eds=' '+eds;
                            }

                            if(eds!='')
                                {
                                eds = "<span>"+eds+"</span>";
                                }
                                else
                                    {
                                        edi=edi.trim();
                                    }
                                    if(virEdiCnt>0)
                                    {
                                        edi=edi.trim();
                                    }
                                    var st='';
                                    var en='';

                                    if(ExtraEd){
				document.getElementById('CiteAuthor').innerHTML = edi;
			}else{
				document.getElementById('CiteAuthor').innerHTML = edi + eds;
			}
			exspan = '';
			if(ExtraEd){
				exspan = '<span>'+eds+'</span>';
			}


                //document.getElementById('CiteAuthor').innerHTML = edi;
                

                            
                

                
                            $('#previewEditors').remove();
                            $('#VirCiteAuthor').append('<span id="previewEditors">'+strSpan+exspan+'</span>')
                            $('#CiteEditor').hide();
                            $('#CiteEd').hide();
                            $('#VirCiteEditor').hide();
                

}

function putInterviewOfBy()
{
    if(getFormName()=="digitalInterview")
                                {
                                    putInterviewBy();
                                }
                                else if(getFormName()=="periodicalInterview")
                                    {
                                       putInterviewOf(); 
                                    }
}


function getPrevActiveDiv(divName){
	var SpanArr = new Array();
	var DivText ="";
	$('#bookPanel span').each(function(index)
        {

               if($(this).attr("id")!="undefined" && $(this).attr("id")!='' && typeof $(this).attr("id") != "")
               {
                   if(($(this).css('display')!='none' && $(this).text()) || divName==$(this).attr("id") )
                   {
                       SpanArr[index] = $(this).attr("id");
                       
                   }

               }


           });
           
	var SpanArr = SpanArr.filter(function(v){return v!==''});
	var matchSE1 = /^CiteCommaE[0-9]+$/;
	var matchSE2 = /^CiteAndE[0-9]+$/;
	var matchSRA1 = /^CiteCommaRA[0-9]+$/;
	var matchSRA2 = /^CiteAndRA[0-9]+$/;
	var matchST1 = /^CiteCommaTRA[0-9]+$/;
	var matchST2 = /^CiteAndTRA[0-9]+$/;	
	var matchSP1 = /^CiteCommaP[0-9]+$/;		
	var matchSP2 = /^CiteAndP[0-9]+$/;		
	for(i=0;i<SpanArr.length;i++){
		if(SpanArr[i].search(matchSE1)==0 || SpanArr[i].search(matchSE2)==0 || SpanArr[i].search(matchSRA1)==0 
			|| SpanArr[i].search(matchSRA2)==0 || SpanArr[i].search(matchST1)==0 || SpanArr[i].search(matchST2)==0
			|| SpanArr[i].search(matchSP1)==0 || SpanArr[i].search(matchSP2)==0){
			SpanArr.splice(i,1);
		}
	}

	
	var crntDiv;
		var SpanIn = $.inArray(divName, SpanArr);//SpanArr.indexOf(divName);//
                if(SpanIn>=0)
                    {
                        crntDiv=SpanArr[SpanIn];
                        if(SpanIn>0)
                            Divchange = SpanArr[SpanIn-1];
                        
                    }
        if(typeof Divchange != "undefined")
            {
                return Divchange;
            }
            else
                {
                    return '';
                }
    
}

function addField(authors,formatNum,titlName,numOfAuthors,tabVal,tmpValArr,secRef,hint,placeHolder)
{
                                        
        authors = authors + '<div class="form-group" style="display:none;"><label class="col-xs-4 control-label">'+formatNum+' '+ titlName +'</label><div class="col-xs-8"><input type="text" class="form-control" value="last" id="author'+numOfAuthors+'" placeholder="'+placeHolder+'" tabindex="'+tabVal+'" data-div="CiteAuthor'+numOfAuthors+'" />'+hint+'</div></div>';			

        document.getElementById(secRef).innerHTML = authors;
        for (var k = 2; k < numOfAuthors; k++)
        {
                tmpVar = 'author'+k;
                document.getElementById(tmpVar).value = tmpValArr[k];
        }

        var newSpan = document.getElementById("VirCiteAuthor").innerHTML;
        newSpan = newSpan + '<span id="CiteCommaA'+numOfAuthors+'"></span><span id="CiteAndA'+numOfAuthors+'"></span><span id="CiteAuthor'+numOfAuthors+'"></span><span id="CiteEnd'+numOfAuthors+'"></span>';
        document.getElementById("VirCiteAuthor").innerHTML = newSpan;


        //newSpan = document.getElementById("VirCiteAuthor").innerHTML;
        document.getElementById("VirCiteAuthor").innerHTML=  newSpan+"<span> </span>"; 
        setInText(document.getElementById("author50").value,'author50',true);
        return authors;
}

function generateWCIntextHARVARD()
{
    var jsn=JSON.parse($("#chkResultsWCS:checked").attr("data-json"));
    var strAuth='';
    if(typeof jsn.author != "undefined")
        {
            var i;
            for(i=0;i<jsn.author.length;++i)
                {
                    
                    if(jsn.author[i]!='')
                        {
                            var auth1=jsn.author[i];
                            var arrAuth=auth1.split(" ");
                            var temp=''
                            var strAuthi='';
                            if(arrAuth.length>1)
                                {
                                    var j;
                                    var flg=false;
                                    for(j=1;j<arrAuth.length;++j)
                                        {
                                            temp+=arrAuth[j].trim()+' ';
                                            if(arrAuth[j].trim().length>1)
                                            {
                                                flg=true;
                                            }
                                        }
                                        strAuthi=arrAuth[0];
                                        if(flg==true)
                                        {
                                            strAuthi+=' '+temp.trim();
                                        }
                                        if(i!=jsn.author.length-1)
                                            strAuthi+=', ';
                                }
                                else
                                    {
                                        strAuthi=auth1;
                                        if(i!=jsn.author.length-1)
                                            strAuthi+=', ';
                                    }

                            if(i==jsn.author.length-1 && jsn.author.length>1)
                            {
                                strAuth+='& ';
                            }
                            strAuth+=strAuthi;

                        }

                            
                }
        }       
            
            var strTitle='';
            var strPlace='';
        if(typeof jsn.title != "undefined")
            {
                strTitle='"'+jsn.title+'"';
            }
            
            
            var strPub='';
            if(typeof jsn.publisher != "undefined")
            {
                strPub=jsn.publisher;
                
            }
            
            var strYear='';
            if(typeof jsn.year != "undefined")
            {
                strYear=jsn.year;                
            }
            
            if(strYear=='')
            {
                strYear='n.d.';
            }
            
            var strFinal='';
            if(strAuth!='')
            {
                strFinal=strAuth;
            }
            else if(strTitle!='')
            {
                strFinal=strTitle;
            }
            else if(strPub!='')
            {
                strFinal=strPub;
            }
            return '('+strFinal+', '+strYear+')`'+strFinal+' ('+strYear+')';
}

function reformatEd(field)
{
    var edi='';
    if(document.getElementById(field))
                        {
                            edi=$("#"+field).val();
                            edi = ucFirstAllWords(edi);
                            edi = ReplaceAnd(edi);
                            var arrEdi=edi.split(" ");
                            var k=0;
                            var firstWPos=-1;
                            for(k=0;k<arrEdi.length;++k)
                            {
                                if(arrEdi[k].trim().length>1)
                                {
                                    firstWPos=k;
                                    break;
                                }
                            }
                            if(firstWPos==0)
                                {
                                    if(arrEdi.length==1)
                                        {
                                            edi=arrEdi[0];
                                        }
                                        else
                                            {
                                                edi='';
                                                for(k=0;k<arrEdi.length-1;++k)
                                                    {
                                                        edi+=arrEdi[k]+' ';
                                                    }
                                                    edi=edi.trim()+', '+arrEdi[k];
                                            }
                                }
                                else if(firstWPos==-1)
                                    {
                                        if(arrEdi.length>0)
                                            edi=arrEdi.join(".");
                                    }
                                    else
                                        {
                                            var firstName='';
                                            var lastName='';
                                            for(k=0;k<firstWPos;++k)
                                                {
                                                    firstName+=arrEdi[k]+'.';
                                                }
                                               for(k=firstWPos;k<arrEdi.length;++k)
                                                {
                                                    lastName+=arrEdi[k]+' ';
                                                } 
                                                edi=lastName.trim()+', '+firstName;
                                        }
                        }
                        edi=trimLastChar(edi.trim(),".").trim()+'.';
                        return edi;
}

function getLastFilledAuthor()
{
    var i=50;
    for(i=50;i>=2;--i)
    {
        if(document.getElementById('author'+i) && document.getElementById('author'+i).value!='')
        {
                            return i;
        }
    }
                    return 0;
}