var base_url='https://www.citemaker.com/';
var MSG_DISABLED='Access is currently disabled';

var authorAlrtChk=false;
var editorAlrtChk=false;
var revAuthAlrtChk=false;
var producerAlrtChk=false;
var transAlrtChk=false;

var auPersPrevYes=false;
var edPersPrevYes=false;
var rePersPrevYes=false;
var prPersPrevYes=false;
var trPersPrevYes=false;

function getFormName()
{
    var formName='';
    if(document.getElementById('formName'))
        {
            formName=document.getElementById('formName').value;
        }
        return formName;
}

function ReloadTextDiv2(textName,divName,other,other1)	{ 
//alert(textName);
	$('#bookPanel').css('display','block');
	if($("#aWorldcatSearch").hasClass("active")==true){
		if($('#HIDEIN').html()!='WORLDCAT'){
			$("#preview").click();
		}
	}else{
		$("#preview").click();
	}
	if($("#t0").hasClass("active")!=true){
		$("#t0").click();
	}
	FormatCitation(textName,divName,other,other1);
        
        setInText(textName,divName,other);
	var spanvalue = $("#"+divName).html();
	if((spanvalue.endsWith("..")) || (spanvalue.endsWith(",.")) ||(spanvalue.endsWith(":.")) || (spanvalue.endsWith(";.")) || (spanvalue.endsWith("!.")) || (last2(spanvalue)=='?.'))
		spanvalue = spanvalue.substr(0,spanvalue.length-1);
            
          
	$("#"+divName).html(spanvalue);
}

function last2(str) {
	return str.substr(str.length-2)
}

function ReplaceAnd(inStr,noLowerFlg)
{
    if(typeof noLowerFlg == "undefined")
        noLowerFlg=false;
    var Arrstr = new Array('And','Of','On','The','For','In','An','On','About','To','As','At','An','Into','Onto','Unto','this','that','those','then','than','it','et','ou','je','la','je','que','als','aut','da','dass','dem','ehe','ein','ob','von','weil','wenn','de','el','en','la','ni','no','para','por','pues','que','si','una','che','ne','non','un','sans','se','si','al','com','what','when','where','be','is','too','or');
    var matchTag2 = /\b(&)\b/gi;
    var arr=inStr.split(" ");
    var str1=arr[0];
    var str='';
    var temp='';
    var ArrConjuction=new Array('v');
    if(arr.length>1)
    {
        var i=0;
        for(i=1;i<arr.length;++i)
        {
            temp+=' '+arr[i]; 
        }
        inStr=temp;
	str=inStr.replace(matchTag2, "&");
        if(noLowerFlg==false)
            {
                for(i=0;i<Arrstr.length;i++){
                        matchtag = new RegExp('\\b('+Arrstr[i]+')\\b','gi');
                        str = str.replace(matchtag, Arrstr[i].toLowerCase());
                }

                if(arr.length>2)
                {
                    var i=0;
                    for(i=0;i<ArrConjuction.length;i++){
                            matchtag = new RegExp('\\s('+ArrConjuction[i]+')\\s','gi');
                                str = str.replace(matchtag, ' '+ArrConjuction[i].toLowerCase()+' ');
                    }


                }
            }
    }
    
    return str1+str;
}
function ucFirstAllWords( str )
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}


function setInnerText(element1,str){

	//alert(str);

    if(document.getElementById(element1)!=null)

    {

        if(isIE())

        {

            document.getElementById(element1).innerText=str;

        }

        else

        {

            document.getElementById(element1).textContent=str;

        }

    }

}

function setFocus(element){

    document.getElementById(element).focus();

    document.getElementById(element).value = "";

}

function isIE(){

    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))

        return true;

    else

        return false;
}

function setInText(textName,divName,other,returnFlag){
	//alert(textName+divName+other);
	fromat = getSectionName();
	$('#wrapintext').css('display','block');
	var pageAlias1 = "";
	var pageAlias2 = "";
	var styleA = false;// MI_25-04-2012
	var styleH = false;// MI_25-04-2012
	var styleM = false;// MI_25-04-2012
	var styleG = false;// MI_29_11_2012
        var styleM8 = false;
	var customFormat = false;
	var govFormat = false; //MIS_18_04_2013
	var chaptertitle = false;
	var ActiveMenu = $('#currentPage').text();
	var ActiveMenu = ActiveMenu.split('/');
	var menuActive = $.trim(ActiveMenu[1]);
	var submenuActive = $.trim(ActiveMenu[2]).toLowerCase();
        var noFilterationFlg=false;
	if(menuActive =="Reference" && submenuActive=="religious"){
		customFormat = true;
	}
	if(menuActive =="Government" && submenuActive=="patents"){
		govFormat = true;
	}
	//MIS_19_April_'13
	if(fromat == 'apa' || fromat == 'apa_ib'){
		if(customFormat){
			//MIS_18_april_'13 (add comma)
			strAPA1 = "(%%A%%, %%Y%%:%%PN%%)";
			strAPA2 = "%%A%% (%%Y%%:%%PN%%)";
		}else if(govFormat){
			strAPA1 = "(%%A%% %%PN%%, %%Y%%)";
			strAPA2 = "%%A%% %%PN%% (%%Y%%)";

		}else{
			strAPA1 = "(%%A%%, %%Y%%, %%PN%%)";
			strAPA2 = "%%A%% (%%Y%%, %%PN%%)";//%%A%%. (%%Y%%, %%PN%%)
			pageAlias = "p.";
		}
		auLim = 9;
		styleA = true;// MI_25-04-2012
		pageAlias1 = 'p. ';
		pageAlias2 = 'pp. ';
		
	}
	else if(fromat == 'harvard'){
		//For harvard there is no comma after Author and only a comma after year. Also, there is no "p." or "pp" before page numbers.
		if(customFormat){
			strAPA1 = "(%%A%% %%Y%%:%%PN%%)";
			strAPA2 = "%%A%% (%%Y%%:%%PN%%)";
		
		}
		else{
			strAPA1 = "(%%A%% %%Y%%, %%PN%%)";
			strAPA2 = "%%A%% (%%Y%%, %%PN%%)";
		}
		auLim = 50;
		styleH = true;// MI_25-04-2012
                pageAlias1 = 'p. ';
		pageAlias2 = 'pp. ';
	}
	else if(fromat == 'mla' || fromat == 'mla8'){
		//For MLA - no year or "p" or "pp" - before page number9s) appear. There is also no commas. Egs. Author (Page) or (Author Page)
		if(customFormat){                    
                    strAPA1 = "(%%A%% .%%PN%%)";
                    strAPA2 = "%%A%% (.%%PN%%)";
		}
		else{                    
                    strAPA1 = "(%%A%% %%PN%%)";
                    strAPA2 = "%%A%% (%%PN%%)";                    
		}
		auLim = 20;
		styleM = true;// MI_25-04-2012
                if(fromat=='mla8')
                    styleM8=true;
	}
	else if(fromat == 'oxford'){
		//For MLA - no year or "p" or "pp" - before page number9s) appear. There is also no commas. Egs. Author (Page) or (Author Page)
		
		strAPA1 = "(%%A%%, %%Y%%, %%PN%%)";
		strAPA2 = "%%A%% (%%Y%%, %%PN%%)";
		auLim = 4;
		styleM = true;// MI_25-04-2012
	}else if(fromat == 'agps'){
		//For AGPS there is no comma after Author and only a comma after year. Also, there is no "p." or "pp" before page numbers. 
		if(customFormat){
			strAPA1 = "(%%A%% %%Y%%:%%PN%%)";
			strAPA2 = "%%A%% (%%Y%%:%%PN%%)";
			
		}else{
			strAPA1 = "(%%A%% %%Y%%, %%PN%%)";
			strAPA2 = "%%A%% (%%Y%%, %%PN%%)";
		}
		auLim = 9;
		styleG = true;// MI_25-04-2012
		pageAlias1 = 'p. ';
		pageAlias2 = 'pp. ';

	}
	if(!document.chapteralert)
		document.chapteralert = false;
	//for citechapter alert
	
		if(document.getElementById("chapter") && (fromat == 'apa' || fromat == 'apa_ib' || fromat == 'harvard' || fromat == 'agps') && textName=='chapter'){
			$('#chapter').keydown(function(event) {
				  var code = event.keyCode;
				  var text = document.getElementById(textName).value;
				  if (code == 16) {
					  if(text.endsWith(" ")){
						 // alert(document.chapteralert);
						 if(document.chapteralert == false){ 
						 document.chapteralert = true; 
					  	jAlertMod1("Use upper case capital letter(s) only if the word you are entering is a proper noun", 'Alert' ,'&nbsp;OK&nbsp;',null);
						 }
					  }
				  }
			});
		}
	//start alert logic
	
	if(!document.ignoreA){
			document.ignoreA = 0;
	}
	for(AL=2;AL<auLim;AL++){
		IAF = 'ignoreA'+AL;
		if(!eval("document." + IAF)){
			eval("document." + IAF+" = 0;");
			//alert(eval("document." + IAF+""));
		}
	}
	
	if(!document.ignoreE){
			document.ignoreE = 0;
	}
	for(EL=2;EL<10;EL++){
		IEF = 'ignoreE'+EL;
		if(!eval("document." + IEF)){
			eval("document." + IEF+" = 0;");
		}
	}
	
	if(!document.ignoreT){
			document.ignoreT = 0;
	}
	for(TL=2;TL<10;TL++){
		ITF = 'ignoreT'+TL;
		if(!eval("document." + ITF)){
			eval("document." + ITF+" = 0;");
		}
	}
	if(!document.ignoreR){
			document.ignoreR = 0;
	}
	for(RL=2;RL<10;RL++){
		ITF = 'ignoreR'+RL;
		if(!eval("document." + ITF)){
			eval("document." + ITF+" = 0;");
		}
	}

	if(!document.ignoreP){
			document.ignoreP = 0;
	}
	for(PL=2;PL<10;PL++){
		IPF = 'ignoreP'+PL;
		if(!eval("document." + IPF)){
			eval("document." + IPF+" = 0;");
		}
	}
	//end alert logic
	//personal Author alert logic
	for(YAU=2;YAU<10;YAU++){
		AF = 'perYesauthor'+YAU;
		if(!eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NAU=2;NAU<10;NAU++){
		NF = 'perNoauthor'+NAU;
		if(!eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
        //end alert logic
	//personal translator alert logic
	for(YAU=2;YAU<10;YAU++){
		AF = 'perYestrans'+YAU;
		if(!eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NAU=2;NAU<10;NAU++){
		NF = 'perNotrans'+NAU;
		if(!eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
        //Producer alert logic
	for(YAU=2;YAU<10;YAU++){
		AF = 'perYesproducer'+YAU;
		if(!eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NAU=2;NAU<10;NAU++){
		NF = 'perNoproducer'+NAU;
		if(!eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
        
	//Editor alert logic 
	for(EAU=2;EAU<10;EAU++){
		EF = 'Okeditor'+EAU;
		if(!eval("document." + EF)){
			eval("document." + EF+" = 0;");
		}
		
	}
	for(YED=2;YED<10;YED++){
		AF = 'perYeseditor'+YED;
		if(!eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NED=2;NED<10;NED++){
		NF = 'perNoeditor'+NED;
		if(!eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	for(YED=2;YED<10;YED++){
		AF = 'perYesrevauthor'+YED;
		if(!eval("document." + AF)){
			eval("document." + AF+" = 0;");
		}
	}
	for(NED=2;NED<10;NED++){
		NF = 'perNorevauthor'+NED;
		if(!eval("document." + NF)){
			eval("document." + NF+" = 0;");
		}
	}
	
	if(!document.Okeditor){
		document.Okeditor = 0;
	}
	if(!document.perYesau1){
		document.perYesau1 = 0;
	}
	if(!document.perNoau1){
		document.perNoau1 = 0;
	}
        if(!document.perYesed1){
		document.perYesed1 = 0;
	}
	if(!document.perNoed1){
		document.perNoed1 = 0;
	}
	if(!document.perYeseditor){
		document.perYeseditor = 0;
	}
	if(!document.perNoeditor){
		document.perNoeditor = 0;
	}
        if(!document.perYestrans){
		document.perYestrans = 0;
	}
	if(!document.perNotrans){
		document.perNotrans = 0;
	}
        if(!document.perYesproducer){
		document.perYesproducer = 0;
	}
	if(!document.perNoproducer){
		document.perNoproducer = 0;
	}
        
	if(!document.perYesrevauthor){
		document.perYesrevauthor = 0;
	}
	if(!document.perNorevauthor){
		document.perNorevauthor = 0;
	}
	
	//end personal Author
	
	
	//Reauthor*/
	var strAuthor = '';
        var strAuthor1 = '';
	Authors = new Array();
	strAuthorArr = '';
	strYear = '';
	strPage = '';
	
	//apa->government->patent 
	strIssue= '';
	//strVolume= '';
	boolAuthor = true;
	j=0;
	theForm = $('#publicationtype').html();
	defaultArr = new Array('author','editor','trans','producer','publisher');
	newDefArr = new Array();
	var replaceAndFlg=true;
	noAuthor = false;
	if(other=="noauthor"){
		document.perYesau1=2;
		document.perNoau1=2;
		noAuthor = true;
	}
        
        var isComma=false;
        var noAuthorFlag=true;
        if(document.getElementById('author'))
        {
            noAuthorFlag=false;
        }
        
	if((document.getElementById('author') && $('#author').val() != '') || (document.getElementById('author2') && $('#author2').val() != '')){
		if(govFormat){
			if($('#issue').val()!=""){
				strAuthor = processExtraDotComma('',$('#issue').val());//+FLUprCase("patent");
				//strAuthor=strAuthor.replace('.','&nbsp;	');
			}
		}else{
                    
                            
				if(document.getElementById('authorHide'))
				{
					strAuthor = $('#authorHide').val();
				}
				else
				{ 
					if(styleH ==true){
                                            var flg=true;
                                            isComma=false;
                                            if(document.perNoau1==1)
						{
							strAuthor = $('#author').val();
						}
						else if(document.perYesau1==1)
						{
                                                    var val=$('#CiteAuthor').html().trim();
                                                    if(val.indexOf(",")>=0)
                                                    {
                                                        strdata=val.split(",");
                                                        strAuthor=strdata[0];
                                                        isComma=true;
                                                        noFilterationFlg=true;
                                                    }
                                                    else
                                                    {
							strdata = processExtraDotComma('',$('#CiteAuthor').html()).split(" ");
                                                        if(strdata.length>1)
                                                        {
                                                            if(strdata[strdata.length-1].length>1)
                                                            {
                                                                var k=0;
                                                                for(k=0;k<strdata.length-1;++k)
                                                                {
                                                                    strAuthor+=strdata[k]+' ';
                                                                }
                                                                strAuthor=strAuthor.trim();
                                                                flg=false;
                                                            }
                                                        }
                                                    }
						}
                                                if(flg==true && isComma==false)
                                                {
                                                    strAuthor = $('#CiteAuthor').html().replace(",","").replace(".","");
                                                }
						
                                                
					}
					pattr1=new RegExp(/^[A-z]+\s+[A-z]{2}$/);
					if(pattr1.test(strAuthor)==true)
					{
						document.ignoreA=0;
					}
				}
				
				if(other == true || document.ignoreA==1){
					//alert(strAuthor);
					strAuthor = Authorfilter(strAuthor,noFilterationFlg);
					
				}
                                else{
                                    
                                    if(document.perNoau1==0)
                                        {
                                            strAuthor = AuthorAlert(strAuthor,'author','','A','CiteAuthor',noFilterationFlg);
                                            if(textName!="author")
                                            {
                                                AuthorAlert(strAuthor,textName,'','A',divName,noFilterationFlg);
                                            }
                                        }
                                        else
                                            {
                                                strAuthor=BeCapital(strAuthor);
                                            }
					
				}
				strAuthor = ReplaceA(strAuthor,'author');
                                
                                var noLowerFlg=false;    
                                
                                if(document.perNoau1==0)
                                    {
                                        var arrConjFlg=noConjLowerFlg('author');
                                        noLowerFlg=arrConjFlg[0];                                        
                                    }
                                    strAuthor = ReplaceAnd(strAuthor,noLowerFlg);
                                replaceAndFlg=false;
				if(styleH ==true){
					for(au=2;au<auLim;au++){
						if(document.getElementById('author'+au) && document.getElementById('author'+au).value != ''){
						
							if(au > 2 ){
								if(styleG== true)
									var AuthorAnd = "<span>, &</span>";
								else	
									var AuthorAnd = "<span>, and";
							}else{
								if(styleG== true)
									var AuthorAnd = "<span> &</span>";
								else	
									var AuthorAnd = "<span> and</span>";
							}
							if(au > 3){
								if(styleG== true)
									strAuthor = strAuthor.replace('<span>, &</span> ',','); //}
								else
									strAuthor = strAuthor.replace('<span>, and</span> ',',');	
							}else{
								if(styleG== true)
									strAuthor = strAuthor.replace('<span> &</span>',','); //}
								else
									strAuthor = strAuthor.replace('<span> and</span>',','); //}	
							}
							
							iaf = 'ignoreA'+au;
                                                         var noLowerFlg=false;    
                                                            var arrConjFlg=noConjLowerFlg('author'+au);
                                                            noLowerFlg=arrConjFlg[0];
                                                            replaceAndFlg=false;
                                                            
                                                            var val=$('#author'+au).val().trim();
                                                            
							if(other == true || eval("document." + iaf)==1){
								
									strAuthor = strAuthor +AuthorAnd+' '+ReplaceAnd(ReplaceA(Authorfilter(val),'author'+au),noLowerFlg);
								
							}
							else{//MI_26_04_2012
                                                            if(styleH==true){
                                                                var flg=true;
                                                                var stra='';
                                                                var val=$('#CiteAuthor'+au).html().trim();
                                                                if(eval("document.perNoauthor"+au) >=1)
                                                                    {
                                                                        data =$('#author'+au).val();
                                                                    }
                                                                    else
                                                                    {
                                                                        isComma=false;
                                                                        noFilterationFlg=false;

                                                                        if(val.indexOf(",")>=0)
                                                                        {
                                                                            strdata=val.split(",");
                                                                            val=strdata[0];
                                                                            isComma=true;
                                                                            noFilterationFlg=true;
                                                                        }
                                                                        if(isComma==false)
                                                                        {
                                                                            strdata = processExtraDotComma('',$('#CiteAuthor'+au).html()).split(" ");
                                                                            if(strdata.length>1)
                                                                            {
                                                                                if(strdata[strdata.length-1].length>1)
                                                                                {
                                                                                    var k=0;
                                                                                    for(k=0;k<strdata.length-1;++k)
                                                                                    {
                                                                                        stra+=strdata[k]+' ';
                                                                                    }
                                                                                    data=stra.trim();
                                                                                    flg=false;
                                                                                }
                                                                            }
                                                                        }
                                                                        else
                                                                        {                                                                
                                                                            data=val;
                                                                        }

                                                                        if(flg==true && isComma==false)
                                                                        {
                                                                            data = processExtraDotComma('',$('#CiteAuthor'+au).html());
                                                                        }
                                                                    }
                                                            }
                                                            else{
									data = processExtraDotComma('',document.getElementById('author'+au).value);
								}
								//if(data)
                                                                if(eval("document.perNoauthor"+au) == 0)
                                                                    {
								strAuthor = strAuthor +AuthorAnd+' '+ReplaceAnd(ReplaceA(AuthorAlert(data,'author'+au,au,'A','CiteAuthor'+au,noFilterationFlg),'author'+au),noLowerFlg);
                                                                    }
                                                                    else
                                                                        {
                                                                            strAuthor = strAuthor +AuthorAnd+' '+ReplaceAnd(ReplaceA(BeCapital(data),'author'+au),false);
                                                                        }
								
							}
					
								
							//Modified by MI_25-04-2012
							for(i=4;i<=10;i++){
								if(document.getElementById("author"+i))
								{
									if(document.getElementById("author"+i).value!='')
									{
										var pattu=new RegExp(/^[A-z]{1}[.|\s]+$/);
								
										//strAuthor = strAuthor + ' et al.';
										word=processExtraDotComma('',$('#author').val()).split(' ');
										//alert(word);
										if(pattu.test(word[0])!=true)
										{
											strAuthor = Authorfilter(word[0]) + ' et al.';
										}
										else
										{	
											 strAuthor = Authorfilter(word[1]) + ' et al.';
										}	
									}
								}
							}//end MI_25-04-2012
						
										
						}
					}
					
				}
			
				}  
	}
                        else if(document.getElementById('chapter') && $('#chapter').val() != '' && (styleM8 || (noAuthorFlag==true && styleH))){
				chaptertitle = true;
				strAuthor = processExtraDotComma(divName,$('#chapter').val());
                                
                                        var tst7=/^\"{1,}/;
                                        var tst8=/\"{1,}$/;
                                        strAuthor=strAuthor.replace(tst7,"");
                                        strAuthor=strAuthor.replace(tst8,"");
                                    
				//MIS_17_april_2013
				if(customFormat){
					//strAuthor = ReplaceA(Authorfilter(strAuthor,textName),textName);
					strAuthor = ReplaceA(strAuthor,textName);
					strAuthor = FLUprCase(strAuthor);
				}else{
					//strAuthor = ReplaceA(Authorfilter(strAuthor,textName),textName);
					strAuthor = ReplaceA(strAuthor,textName);
                                        
                                        strAuthor1 = '"'+FLUprCase(strAuthor)+'"';
                                                
					strAuthor = '"'+FLUprCase(strAuthor)+'"';
				}
			}
			else if(document.getElementById('title') && $('#title').val() != ''  && (styleM8 || (noAuthorFlag==true && styleH))){
					chaptertitle = true;
					strAuthor = processExtraDotComma(divName,$('#title').val());
					strAuthor = ReplaceA(strAuthor,textName);
                                        
                                        strAuthor=FLUprCase(strAuthor);
                                        strAuthor1 = '<i>'+strAuthor+'</i>';
                                        strAuthor = '<i>'+strAuthor+'</i>';
                                                
			}
	else if((document.getElementById('editor') && $('#editor').val() != '') || (document.getElementById('editor2') && $('#editor2').val() != '')){			
				var pattrn=new RegExp(/^[A-z]+\s+[A-z]+\s+[A-z]{1,}$/);
				var pattrn1=new RegExp(/^[A-z]{1}[.\s]+\s+[A-z]{1,}$/);
				var pattrn2=new RegExp(/^[A-z]+$/);
				var pattrn3=new RegExp(/^[A-z]+\s+[A-z]+$/);

				/*if(styleG==true){
					strdata = $('#editor').val().split(" ");
					strAuthor = strdata[0]; 
				}else*/ 
				//alert(textName);
				if((document.perNoeditor == 0)){//LC060615
                                    //// && textName=='editor'
                                    var fstNmLstNmFlag=false;
                                    if(fromat == 'harvard')
                                    {
                                         fstNmLstNmFlag=fNameLnameFrmt('editor');
                                    }
                                    
                                    if(fromat == 'harvard' || (getFormName()=="DigitalDVD" && (fromat=="apa" || fromat == 'apa_ib')))
                                    {
                                        var edi1=processExtraDotComma('',document.getElementById('editor').value).split(' ');
                                        var edi='';
                                        var val=$('#CiteEditor').html().trim();
                                        isComma=false;
                                        noFilterationFlg=false;
                                        if(edi1[edi1.length-1].length>1 && fromat != 'harvard')
                                                {
                                                    edi=edi1[edi1.length-1];
                                                }
                                                else
                                                    {
                                        if(val.indexOf(",")>=0)
                                        {
                                            strdata=val.split(",");
                                            edi=strdata[0];
                                            isComma=true;
                                            noFilterationFlg=true;
                                        }
                                        else
                                        {                                        
                                            if(edi1.length>0)
                                            {
                                            var i=0;
                                            var tmpSt='';
                                            var charPos=-1;
                                            for(i=0;i<edi1.length-1;++i)
                                                {
                                                    if(trimLastChar(edi1[i],".").trim().length==1)
                                                        {
                                                            charPos=i;
                                                            break;
                                                        }
                                                }
                                                if(charPos<0)
                                                {
                                                    if(fromat == 'harvard')
                                                    {
                                                        var k=0;
                                                        if(edi1.length==1)
                                                        {
                                                            edi=edi1[0];
                                                        }
                                                        else
                                                        {
                                                            for(k=0;k<edi1.length-1;++k)
                                                            {
                                                                edi+=edi1[k]+' ';
                                                            }
                                                            edi=edi.trim();
                                                        }
                                                    }
                                                    else
                                                    {
                                                        edi=edi1.join(" ");
                                                    }
                                                    
                                                }
                                                else
                                                {
                                                    var lastStr='';
                                                    for(i=0;i<=charPos;++i)
                                                    {
                                                        lastStr+=edi1[i].trim()+' ';
                                                    }
                                                    edi=lastStr.trim();
                                                }

                                        }
                                        }
                                                    }
                                         data=edi;
                                 
                                    }
                                    
                                    strAuthor = data;
					//alert(strAuthor);
                                        if(other == true || document.ignoreE==1){                                    
					strAuthor = Authorfilter(strAuthor,noFilterationFlg);					
                                        }else{
                                            strAuthor = AuthorAlert(strAuthor,textName,'','E',divName,noFilterationFlg);
                                        }
                                    
				}
                                else{
					strAuthor = $('#editor').val();
                                        strAuthor=BeCapital(strAuthor);
				} //LC 060615
				
				strAuthor = ReplaceA(strAuthor,textName);
                                var noLowerFlg=false;   
                                if((document.perNoeditor == 0))
                                    {
                                var arrConjFlg=noConjLowerFlg('editor');
                                noLowerFlg=arrConjFlg[0];
                                    }
                                strAuthor = ReplaceAnd(strAuthor,noLowerFlg);
                                replaceAndFlg=false;
				for(au=2;au<auLim;au++){
					if(document.getElementById('editor'+au) && document.getElementById('editor'+au).value != ''){
						if(au > 2){
							if(styleG== true)
								var AuthorAnd = "<span>, &</span>";
							else	
								var AuthorAnd = "<span>, and</span>";
						}else{
							if(styleG== true)
								var AuthorAnd = "<span> &</span>";
							else	
								var AuthorAnd = "<span> and</span>";
						}
						if(au > 3){
							if(styleG== true)
								strAuthor = strAuthor.replace('<span>, &</span> ',','); //}
							else
								strAuthor = strAuthor.replace('<span>, and</span> ',',');	
						}else{
							if(styleG== true)
								strAuthor = strAuthor.replace('<span> &</span>',','); //}
							else
								strAuthor = strAuthor.replace('<span> and</span>',','); //}	
						}
						iaf = 'ignoreE'+au;		
						if(other == true || eval("document." + iaf)==1){
							strAuthor = strAuthor +AuthorAnd+' '+ReplaceA(Authorfilter(document.getElementById('editor'+au).value,textName));
						}else{

							/*if(styleG==true){
								edvalue = document.getElementById('editor'+au).value.split(" ");
								data = edvalue[0];

							}else*/ 
                                                    var fstNmLstNmFlag=false;
                                                    if(fromat == 'harvard')
                                                    {
                                                         fstNmLstNmFlag=fNameLnameFrmt('editor'+au);
                                                    }
							if(eval("document.perNoeditor"+au) == 0){
								if(fromat == 'harvard' || (getFormName()=="DigitalDVD" && (fromat=="apa" || fromat == 'apa_ib')))
                                                            {
                                                                var edi1=processExtraDotComma('',document.getElementById('editor'+au).value).split(' ');
                                                                var edi='';
                                                                var val=$('#CiteEditor'+au).html().trim();
                                                                isComma=false;
                                                                noFilterationFlg=false;
                                                                if(edi1[edi1.length-1].length>1 && fromat != 'harvard')
                                                                {
                                                                    edi=edi1[edi1.length-1];
                                                                }
                                                                else
                                                                    {
                                                                if(val.indexOf(",")>=0)
                                                                {
                                                                    strdata=val.split(",");
                                                                    edi=strdata[0];
                                                                    isComma=true;
                                                                    noFilterationFlg=true;
                                                                }
                                                                else
                                                                {
                                                                    if(edi1.length>0)
                                                                    {
                                                                        var i=0;
                                                                        var tmpSt='';
                                                                        var charPos=-1;
                                                                        for(i=0;i<edi1.length-1;++i)
                                                                            {
                                                                                if(trimLastChar(edi1[i],".").trim().length==1)
                                                                                    {
                                                                                        charPos=i;
                                                                                        break;
                                                                                    }
                                                                            }
                                                                            if(charPos<0)
                                                                            {
                                                                                if(fromat == 'harvard')
                                                                                {
                                                                                    var k=0;
                                                                                    if(edi1.length==1)
                                                                                    {
                                                                                        edi=edi1[0];
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        for(k=0;k<edi1.length-1;++k)
                                                                                        {
                                                                                            edi+=edi1[k]+' ';
                                                                                        }
                                                                                        edi=edi.trim();
                                                                                    }
                                                                                }
                                                                                else
                                                                                {
                                                                                    edi=edi1.join(" ");
                                                                                }

                                                                            }
                                                                            else
                                                                            {
                                                                                var lastStr='';
                                                                                for(i=0;i<=charPos;++i)
                                                                                {
                                                                                    lastStr+=edi1[i].trim()+' ';
                                                                                }
                                                                                edi=lastStr.trim();
                                                                            }

                                                                    }
                                                                }
                                                                    }
                                                                 data=edi;
                                                                 
                                                            }
                                                                                                                 
                                                            data=AuthorAlert(data,textName,au,'E',divName,noFilterationFlg);
							}
                                                        else{
								data = document.getElementById('editor'+au).value;
                                                                data=BeCapital(data);
							}
                                                        var noLowerFlg=false;
                                                        if(eval("document.perNoeditor"+au) == 0)
                                                            {
                                                            var arrConjFlg=noConjLowerFlg('editor'+au);
                                                            noLowerFlg=arrConjFlg[0];
                                                            }
                                                            replaceAndFlg=false;
							strAuthor = strAuthor +AuthorAnd+' '+ReplaceAnd(ReplaceA(data,textName),noLowerFlg);
						}
						
				 }
			}
		//boolAuthor = false;
	}                        
			else if(((document.getElementById('trans') && $('#trans').val() != '') || (document.getElementById('trans2') && $('#trans2').val() != '')) && fromat!='mla' && fromat!='mla8'){
				if(styleG==true){
					strdata = $('#trans').val().split(" ");
					strAuthor = strdata[0]; 
				}else{
					strAuthor = $('#trans').val();
				}
				if(other == true || document.ignoreT==1){
					strAuthor = Authorfilter(strAuthor);
				}else{
					strAuthor = AuthorAlert(strAuthor,textName,'','T');
				}
				for(au=2;au<auLim;au++){
					if(document.getElementById('trans'+au) && document.getElementById('trans'+au).value != ''){
						if(au > 2){
							strAuthor = strAuthor.replace(' &',',');
						}
						iaf = 'ignoreT'+au;		
						if(other == true  || eval("document." + iaf)==1){
							strAuthor = strAuthor +' & '+Authorfilter(document.getElementById('trans'+au).value);
						}else{
							if(styleG==true){
								edvalue = processExtraDotComma('',document.getElementById('trans'+au).value).split(" ");
								data = edvalue[0];

							}else{
								data = processExtraDotComma('',document.getElementById('trans'+au).value);
							}
							
							strAuthor = strAuthor +' & '+AuthorAlert(data,textName,au,'T');
						}
						//strAuthor = strAuthor +' & '+AuthorAlert(document.getElementById('trans'+au).value);
					}
				}
				//boolAuthor = false;
			}
			else if((document.getElementById('producer') && $('#producer').val() != '') || (document.getElementById('producer2') && $('#producer2').val() != '')){
				if(styleG==true){
					strdata = processExtraDotComma('',$('#producer').val()).split(" ");
					strAuthor = strdata[0]; 
				}else{
					strAuthor = processExtraDotComma('',$('#producer').val());
				}
				if(other == true  || document.ignoreP==1){
					strAuthor = Authorfilter(strAuthor);
				}else{
					strAuthor = AuthorAlert(strAuthor,textName,'','P');
				}
				for(au=2;au<auLim;au++){
					if(document.getElementById('producer'+au) && document.getElementById('producer'+au).value != ''){
						if(au > 2){
							strAuthor = strAuthor.replace(' &',',');
						}
						iaf = 'ignoreP'+au;		
						if(other == true  || eval("document." + iaf)==1){
							strAuthor = strAuthor +' & '+Authorfilter(document.getElementById('producer'+au).value);
						}else{
							if(styleG==true){
								edvalue = processExtraDotComma('',document.getElementById('producer'+au).value).split(" ");

								data = edvalue[0];

							}else{
								data = processExtraDotComma('',document.getElementById('producer'+au).value);
							}
							strAuthor = strAuthor +' & '+AuthorAlert(data,textName,au,'P');
						}
						//strAuthor = strAuthor +' & '+AuthorAlert(document.getElementById('producer'+au).value);
					}
				}
				//boolAuthor = false;
			}
			else if(document.getElementById('chapter') && $('#chapter').val() != '' && !styleM8){
				chaptertitle = true;
				strAuthor = processExtraDotComma(divName,$('#chapter').val());
                                if(fromat == 'agps')
                                    {
                                        var tst7=/^\'{1,}/;
                                        var tst8=/\'{1,}$/;
                                        strAuthor=strAuthor.replace(tst7,"");
                                        strAuthor=strAuthor.replace(tst8,"");
                                    }
				//MIS_17_april_2013
				if(customFormat){
					//strAuthor = ReplaceA(Authorfilter(strAuthor,textName),textName);
					strAuthor = ReplaceA(strAuthor,textName);
					strAuthor = FLUprCase(strAuthor);
				}else{
					//strAuthor = ReplaceA(Authorfilter(strAuthor,textName),textName);
					strAuthor = ReplaceA(strAuthor,textName);
                           
                                        
                                        strAuthor1 = '"'+FLUprCase(strAuthor)+'",';
                                                
					strAuthor = '"'+FLUprCase(strAuthor)+'"';
				}
			}
			else if(document.getElementById('title') && $('#title').val() != ''  && !styleM8){
					chaptertitle = true;
					strAuthor = processExtraDotComma(divName,$('#title').val());
					strAuthor = ReplaceA(strAuthor,textName);
                                        if(fromat=="agps" && (getFormName()=="legislation" || getFormName()=="courtcases"))
                                            {
                                                //if(getFormName()=="legislation")
                                                  //  {
                                                        strAuthor1 = '<i>'+ReplaceAnd(ucFirstAllWords(strAuthor))+'</i>';
                                                    strAuthor = '<i>'+ReplaceAnd(ucFirstAllWords(strAuthor))+'</i>';
                                                   // }
                                                    /*else
                                                        {
                                                strAuthor1 = ReplaceAnd(ucFirstAllWords(strAuthor));
                                                    strAuthor = ReplaceAnd(ucFirstAllWords(strAuthor));
                                                        }*/
                                            }
                                            else
                                            {
                                                strAuthor1 = '<i>'+FLUprCase(strAuthor)+'</i>,';
                                                
                                                    strAuthor = '<i>'+FLUprCase(strAuthor)+'</i>';
                                            }
			}
			else if(document.getElementById('publisher') && $('#publisher').val() != ''){
				strAuthor = processExtraDotComma('',$('#publisher').val());
				strAuthor = Authorfilter(strAuthor);
			}
			else if(((document.getElementById('revauthor') && $('#revauthor').val() != '') || (document.getElementById('revauthor2') && $('#revauthor2').val() != '')) && fromat == 'agps'){
				if(styleG==true){
					strdata = processExtraDotComma('',$('#revauthor').val()).split(" ");
					strAuthor = strdata[0]; 
				}else{
					strAuthor = processExtraDotComma('',$('#revauthor').val());
				}
				if(other == true || document.ignoreR==1){
					strAuthor = Authorfilter(strAuthor);
				}else{
					strAuthor = AuthorAlert(strAuthor,textName,'','R');
				}
				
				for(au=2;au<auLim;au++){
					if(document.getElementById('revauthor'+au) && document.getElementById('revauthor'+au).value != ''){
						if(au > 2){
							strAuthor = strAuthor.replace(' &',',');
						}
						iaf = 'ignoreR'+au;		
						if(other == true  || eval("document." + iaf)==1){
							strAuthor = strAuthor +' & '+Authorfilter(document.getElementById('revauthor'+au).value);
						}else{
							if(styleG==true){
								edvalue = processExtraDotComma('',document.getElementById('revauthor'+au).value).split(" ");
								data = edvalue[0];

							}else{
								data = processExtraDotComma('',document.getElementById('revauthor'+au).value);
							}
							
						strAuthor = strAuthor +' & '+AuthorAlert(data,textName,au,'R');
						}
						//strAuthor = strAuthor +' & '+AuthorAlert(document.getElementById('trans'+au).value);
					}
				}
				
			}
                        
			//MIS_20_Apr_'13
			else if(document.getElementById('issue') && $('#issue').val() != '' && govFormat){
				strAuthor = processExtraDotComma('',$('#issue').val());
				strAuthor = Authorfilter(strAuthor);
			}
                        
                        if(((document.getElementById('revauthor') && $('#revauthor').val() != '') || (document.getElementById('revauthor2') && $('#revauthor2').val() != '')) && (fromat == 'mla' || fromat == 'mla8')){
	
                            AlertOnly(textName,divName);
				
			}
                        if(((document.getElementById('trans') && $('#trans').val() != '') || (document.getElementById('trans2') && $('#trans2').val() != '')) && (fromat == 'mla' || fromat == 'mla8')){
	
                            AlertOnly(textName,divName);
				
			}
                        
                        strAuthor=strAuthor.replace("<span>","");
                        strAuthor=strAuthor.replace("</span>","");

	if(customFormat){
		if(document.getElementById("subject"))
			strYear = processExtraDotComma('',$('#subject').val());
	}
	//20_April_'13
	else if(govFormat){
		if(document.getElementById("year")){
			strYear = $('#year').val();
                        if(strYear=="n.d" || strYear=="nd." || strYear=="nd")
                        {
                            strYear="n.d.";
                        }
                        else
                        {
                            strYear=processExtraDotComma('CiteYear',strYear.trim());
                            
                        }
			var pattnyr=new RegExp(/^[0-9]{1,}\s$/);
			if(pattnyr.test(strYear)==true && textName=="year"){
				jAlertMod1("Enter a valid Year format. E.g. 2010 or 2010a","Alert","&nbsp;OK&nbsp;",function(c1){
					if(c1){
						document.getElementById(textName).value='';
						document.getElementById(textName).focus();
						document.getElementById(divName).innerHTML = "";

					}
				});
			}
		}
	}
	else if(document.getElementById("year") && $('#year').val() != ''){
			strYear = $('#year').val();
                        if(strYear=="n.d" || strYear=="nd." || strYear=="nd")
                        {
                            strYear="n.d.";
                        }
                        else
                        {
                            strYear=processExtraDotComma(divName,strYear.trim());
                        }
			var pattnyr=new RegExp(/^[0-9]{1,}\s$/);
			if(pattnyr.test(strYear)==true && textName=="year"  && other!="microform"){
				jAlertMod1("Enter a valid Year format. E.g. 2010 or 2010a","Alert","&nbsp;OK&nbsp;",function(c1){
					if(c1){
						document.getElementById(textName).value='';
						document.getElementById(textName).focus();
						document.getElementById(divName).innerHTML = "";

					}
				});
			}
	}else if(document.getElementById("date") && $('#date').val() != ''){
			strYear = $('#date').val();
                        if(strYear=="n.d" || strYear=="nd." || strYear=="nd")
                        {
                            strYear="n.d.";
                        }
                        else
                        {
                            strYear=processExtraDotComma(divName,strYear.trim());
                        }
	}
	
	if(customFormat){
		if(document.getElementById("volume"))
			strPage = processExtraDotComma('',$('#volume').val());
	}else if(govFormat){
		if(document.getElementById("volume"))
			strPage = processExtraDotComma('',$('#volume').val());
	}
	else{
		if(document.getElementById("pageBook")){
                    if(fromat=="agps" || fromat=="harvard")
                    {
                        strPage = formatPgSpc('pageBook');
                    }
                    else{
                        strPage = processExtraDotComma('',$('#pageBook').val());
                    }
		}else if(document.getElementById("pageJournal")){
			strPage = processExtraDotComma('',$('#pageJournal').val());
		}
		else if(document.getElementById("page")){
			if($('#page').val() != 'afterlogin1.php'){
                            if(fromat=="apa" || fromat == 'apa_ib' || fromat=="agps" || fromat=="harvard")
                            {
                                var tmp;
                                tmp = $('#CitePage').html().replace('(' , '').replace(').' , '').replace('pp.' , '');
                                
                                tmp=tmp.replace('p.' , '');
                                tmp=tmp.replace('.' , '').replace('.' , '').trim();
                                strPage=tmp;
                            }
                            else
                            {
                                        strPage = processExtraDotComma('',$('#page').val());
                            }
			}
		}
		
	}
	//strAuthor = AuthorfilterComma(strAuthor);
	//if(fromat == 'apa' || fromat == 'agps'){
		//strAuthor = ReplaceA(strAuthor,textName);
	//}
	if(!chaptertitle){
		if(replaceAndFlg!=false)
                    strAuthor = ReplaceAnd(strAuthor);
                if(strAuthor1=='')
                    strAuthor1 = strAuthor;
	}else{
		strAPA1 = strAPA1.replace('%%A%%,' , '%%A%%');
	}

	if(strAuthor == '.' || strAuthor == '' || !strAuthor){
		strAPA1 = strAPA1.replace('%%A%%' , '');
		strAPA2 = strAPA2.replace('%%A%%' , '');
		strAPA2 = strAPA2.trim();
	}else{
		if(govFormat){
			strAuthor = strAuthor.replace('&nbsp;' , '');
			strAPA1 = strAPA1.replace('%%A%%' , strAuthor+"&nbsp;"+FLUprCase("patent"));
			strAPA2 = strAPA2.replace('%%A%%' , strAuthor+"&nbsp;"+FLUprCase("patent"));
			strAPA2 = strAPA2.trim();		
		}
                else{
			strAuthor = strAuthor.replace('&nbsp;' , '');
			strAuthor1 = strAuthor1.replace('&nbsp;' , '');
			strAPA1 = strAPA1.replace('%%A%%' , strAuthor1);
			strAPA2 = strAPA2.replace('%%A%%' , strAuthor);
			strAPA2 = strAPA2.trim();
		}
	}
	//alert(strYear);
        if(fromat == 'mla8' || fromat == 'mla')
        {
            
        }
        else
        {
            if(strYear == '' || strYear=="n.d" || strYear=="nd." || strYear=="nd" || strYear=="n.d."){
                    strAPA1 = strAPA1.replace('%%Y%%' , 'n.d.');	
                    strAPA2 = strAPA2.replace('%%Y%%' , 'n.d.');	
            }else{
                    strYear = CapitalizeAfter(strYear," ");
                    strAPA1 = strAPA1.replace('%%Y%%' , strYear);	
                    strAPA2 = strAPA2.replace('%%Y%%' , strYear);	
            }
        }
	
	
	if(strPage == ''){
		//alert('kkk');
		if(customFormat){
			if(fromat == 'mla8' || fromat == 'mla'){
				strAPA1 = strAPA1.replace('.%%PN%%' , '');
				strAPA2 = strAPA2.replace('(.%%PN%%)' , '');
			}else{
				strAPA1 = strAPA1.replace(':%%PN%%' , '');
				strAPA2 = strAPA2.replace(':%%PN%%' , '');
			}
		}else if(govFormat){
			strAPA1 = strAPA1.replace('%%PN%%' , '');
			strAPA2 = strAPA2.replace('%%PN%%' , '');
		}
		else if(fromat == 'apa' || fromat == 'apa_ib'){
			strAPA1 = strAPA1.replace(', %%PN%%' , '');
			strAPA2 = strAPA2.replace(', %%PN%%' , '');
		}else if(fromat == 'harvard'){
			strAPA1 = strAPA1.replace(', %%PN%%' , '');
			strAPA2 = strAPA2.replace(', %%PN%%' , '');
		}else if(fromat == 'mla8' || fromat=='mla'){
			strAPA1 = strAPA1.replace(' %%PN%%' , '');
			strAPA2 = strAPA2.replace('(%%PN%%)' , '');
		}else if(fromat == 'oxford'){//MI-15-05-2012
			strAPA1 = strAPA1.replace(', %%PN%%' , '');
			strAPA2 = strAPA2.replace(', %%PN%%' , '');
			//alert(strAPA1+'1');
			//alert(strAPA2);
		}else if(fromat == 'agps'){
			strAPA1 = strAPA1.replace(', %%PN%%' , '');
			strAPA2 = strAPA2.replace(', %%PN%%' , '');
		}
	}else{
            
		if(customFormat){
			strPage =  strPage; 
		}else if(strPage.search("-")!=-1){
		  strPage =  pageAlias2+strPage;  
		}else if((fromat=="apa" || fromat == 'apa_ib' || fromat=="agps" || fromat=="harvard")  && strPage.search(",")!=-1){
                    
		  strPage =  pageAlias2+strPage;  
		}
                else{
			strPage =  pageAlias1+strPage;
		}
                
		
		/*********** 19th may work for removing page number from in text panel *******/
		
		 //strPage='';
		/*********** //19th may work for removing page number from in text panel *******/
		
		strAPA1 = strAPA1.replace('%%PN%%' , strPage); //pageAlias+
		strAPA2 = strAPA2.replace('%%PN%%' , strPage);
                
	}
        if(fromat=="agps" && getFormName()=="legislation")
                    {
                        var publ='';
                        if(document.getElementById('publisher') && $('#publisher').val() != ''){
                                        publ = $('#publisher').val().trim();
                                }
                                strAPA1=strAuthor1;
                                strAPA2=strAuthor;
                                if(publ!='')
                                    {
                                        strAPA2+=' ('+ReplaceAnd(ucFirstAllWords(publ))+')';
                                    }
                    }
                    else if(fromat=="agps" && getFormName()=="courtcases")
                        {
                            strAPA1=strAuthor1;
                            strAPA2=strAuthor;
                            var yr='';
                        if(document.getElementById('year') && $('#year').val() != ''){
                                        yr = $('#year').val().trim();
                                }
                                
                                if(yr!='')
                                    {
                                        strAPA2+=' ('+ReplaceAnd(ucFirstAllWords(yr))+')';
                                    }
                        }
                        
	//alert(strAPA1);
	if(fromat == 'oxford'){
	}else{
            if(typeof returnFlag != "undefined" && returnFlag==true)
            {
                return strAPA1+'`'+strAPA2;
            }
		$('#in_radio1').html('<input type="checkbox" class="intxtChk" name="radio1" id="radio1" checked="checked" />&nbsp;<span id="txt1">'+strAPA1+'</span>');
                $('#in_radio2').html('<input type="checkbox" class="intxtChk" name="radio2" id="radio2" checked="checked"/>&nbsp;<span id="txt2">'+strAPA2+'</span>');
                 
	}
	if((strAuthor == '' && strYear == '' && strPage=='') || (fromat == 'mla8' && strAuthor == '' && strPage=='')){
		$('#in_radio1').html('');
		$('#in_radio2').html('');
	}
}



function AuthorAlert(str,field,au,who,divName,noFilterationFlg){
	var intl;
	var msgf;
        if(typeof noFilterationFlg == "undefined")
        {
            noFilterationFlg=false;
        }
        var flagEdlikeAuth=false;
	format = getSectionName();
		if(fromat == 'apa'){
			msgf='APA';
			intl='Initial(s)';
		}else if(fromat == 'harvard'){
			msgf='HARVARD';
			intl='Initial(s)';
		}else if(fromat == 'mla'){
			msgf='MLA';
			intl='';
		}else if(fromat == 'oxford'){
			msgf='Oxford';
			intl='or initial(s)';
		}else if(fromat == 'agps'){
			msgf='AGPS';
			intl='Initial(s)';
		}
	if(fromat == 'agps'){
		if(document.getElementById("author9")) //au == auLim-1
			{
				setInText(field,divName,true);
			}
		Afield = field;	

		if(document.istablet5){
			ANfield = field;
		}else{
			ANfield = field;
		}
		ANfield = AdditionalAuEd(ANfield.toLowerCase());
		Afield = AdditionalAuEd(Afield.toLowerCase());
	}
	if(msgf=='Oxford'){
		if(field=="trans")
			Afield = "translators";
		else
			Afield = $("#"+field).prev(this).html()+"s";	

		if(document.istablet5){
			ANfield = $("#"+field).parent(this).prev().html();
		}else{
			ANfield = $("#"+field).prev(this).html();
		}			

		ANfield = AdditionalAuEd(ANfield.toLowerCase());
		Afield = AdditionalAuEd(Afield.toLowerCase());
		
		msg =msgf+' formats personal '+Afield+'s as last name + first name '+intl;
	}
	else{
		if(field=="trans")
			Afield = "translator";
		else
                    {
			//Afield = field+"s";
                        Afield = "author";
                    }
                    

		if(document.istablet5){
			ANfield = $("#"+field).parent(this).prev().html();
		}else{
			ANfield = Afield;
		}
		ANfield = AdditionalAuEd(ANfield.toLowerCase());
		Afield = AdditionalAuEd(Afield.toLowerCase());
		msg = msgf+' formats personal '+Afield+' as Last Name + First Name '+intl;	
	}	
	//Add new line to msg
	msg = '<center>'+msg + ' <br/><br/>Enter a space between characters for authors with multiple initials<br/><br/>Follow this format when entering personal author name details.</center>';	
	var patt1=new RegExp(/^[A-z]+\s+[A-z]{2}$/);//mi_20_04_2012
	var patt2=new RegExp(/^[A-z]+[1-9]$/);
	var patt3=new RegExp(/^[A-z]{2,}[,]$/);
	var patt4=new RegExp(/^[A-z]+$/);
	var f1=false;
	var patt5=new RegExp(/^[A-z]{1}[.|\s]+$/);
	var patt6=new RegExp(/^([A-z]{1}\s)+[A-z]{2,}$/);//mi_24_04_2012
	var patt7=new RegExp(/^[A-z]{2,}\s[A-z]{2,}$/);//mi_26_04_2012
	var patt7a=new RegExp(/^[A-z]{2,}[,]\s[A-z]{2,}$/);//JT_18-02-2017
	var patt9=new RegExp(/^[A-z]{1,}\s[A-z]{1,}$/);//mi_26_04_2012
	var patt8=new RegExp(' ');//mi_26_04_2012
	var patt10=new RegExp(/^[A-z]{2,2}$/);//mi_26_04_2012
	var patt11 = new RegExp(/^[editor]+[2-9]$/);
	var patt12=new RegExp(/^[A-z]{2,}\s[A-z]{2}$/);//mi_15_01_2013	
	var patt13 = new RegExp(/^[author]+[2-9]$/);
	var patt14=new RegExp(/^[A-z]{1}[.]$/);
	var patt15=new RegExp(/^[A-z]{1}[.]\s$/);
        var patt16lc = new RegExp(/^(revauthor)+[2-9]$/);
        
        var patt6a=new RegExp(/^[A-z]+\s[A-z]{1}\s[A-z]{2,}$/);
        
         var patt17lc=new RegExp(/^[A-z]+\s[A-z]+\s$/); //on second space
        var patt18lc=new RegExp(/^[A-z]+\s[A-z]+\s[A-z]{2}$/); //on second space _2 char

	if(field=='author' || field=='editor'){
		stringval = $("#"+field).val();
		if(stringval.toLowerCase()=="anon"){
			jAlertMod1("If "+field+" is not recorded on source material leave this field blank.<br/><br/>Your citation will be reformatted correctly without an entry in this field.", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) 			{
			if(c1)
			{
				document.getElementById(field).focus();
				return false;
			}});
		}
	}

  
		
	//For First Auhtor single character + space //mi_26_04_2012
	  if((flagEdlikeAuth==true && field=="editor") || field=='author'){
		if((document.perYesau1 ==0 && document.perNoau1 ==0 && field=='author') || (document.perYesed1 ==0 && document.perNoed1 ==0 && flagEdlikeAuth==true && field=="editor")){ 
			
			if(patt2.test(field)==false && (patt6.test($('#'+patt4.exec(field)).val())==true || patt6a.test($('#'+patt4.exec(field)).val())==true) && !noAuthor)//here it was
			{
                            if((flagEdlikeAuth==true && field=="editor") || (field=='author'))
                            {
				document.getElementById(field).blur();
                                var sbStr='';
                                if(fromat=="agps" || fromat=="harvard")
                                    {
                                       // sbStr='<br/><br/><input type="checkbox" id="authorAlrtChk" onclick="setAuthorAlert();" /> Don\'t show this message again'
                                    }
				jConfirmMod2('<center>Is the '+ANfield+' a person?'+sbStr+'</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;', function(e1) {
					if(e1)
					{ 
                                            if(flagEdlikeAuth==true && field=="editor")
                                            {
                                                document.perYesed1 = 1;
                                                document.perYeseditor = 1;
                                            }
                                            else
                                            {
                                                document.perYesau1 = 1;
                                            }
                                            if(flagEdlikeAuth==true && field=="editor")
                                                {
                                                    reformEdi(field);
                                                }
                                            setInText(field,divName,true);		
                                            //document.perYesau1 = 1;
                                            document.getElementById(field).focus();
                                            
						jAlertMod1("<center>"+msg+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
							if(c1)
							{	
                                                                document.getElementById(field).focus();							
								return false;
							}});
                                                        
                                                   
							return false;
					}
					else
					{
                                            if(flagEdlikeAuth==true && field=="editor")
                                            {
                                                document.perNoed1 = 1;
                                                document.perNoeditor = 1;
                                            }
                                            else
                                            {
							document.perNoau1 = 1;
                                            }
                                            var el=document.getElementById(field);
                                                eval(el.getAttribute('onkeyup'));
                                            if(flagEdlikeAuth==true && field=="editor")
                                            {
                                                document.perNoed1 = 1;
                                                document.perNoeditor = 1;
                                            }
                                            else
                                            {
							document.perNoau1 = 1;
                                            }
							document.getElementById(field).focus();
							return false;
					}
					});
                                    }
			}
		}
	
		if(document.perYesau1 == 1){
			if(fromat == 'agps'){
					strAuthor = $('#CiteAuthor').html();
					firstword = strAuthor.split(' ');	
					//firstword[1]=firstword[1].toUpperCase();
					//strAuthor =firstword.join(' ');
					//document.getElementById("CiteAuthor").innerHTML=strAuthor;	
			}
		}
                //console.log(document.perYesau1+':'+document.perNoau1+':'+field+":"+document.perYesed1+":"+document.perNoed1+":"+flagEdlikeAuth)
		if((document.perYesau1 ==0 && document.perNoau1 ==0 && field=='author') || (document.perYesed1 ==0 && document.perNoed1 ==0 && flagEdlikeAuth==true && field=="editor")){  
			if(patt9.test($('#'+patt4.exec(field)).val())==true){
					if(fromat == 'agps'){
						strAuthor = $('#CiteAuthor').html(); 
						firstword = strAuthor.split('.');
						//firstword[1]=firstword[1]+' ';
						strAuthor =firstword.join(' ');	
						document.getElementById("CiteAuthor").innerHTML=strAuthor;	
					}
			}
                       
			if(patt2.test(field)==false && (patt7.test($('#'+patt4.exec(field)).val())==true || patt7a.test($('#'+patt4.exec(field)).val())==true || patt15.test($('#'+patt4.exec(field)).val())==true))
			{ 
                            if((flagEdlikeAuth==true && field=="editor") || (field=='author'))//here it was
                            {
				document.getElementById(field).blur();
                                var sbStr='';
                                if(fromat=="agps" || fromat=="harvard")
                                    {
                                        //sbStr='<br/><br/><input type="checkbox" id="authorAlrtChk" onclick="setAuthorAlert();" /> Don\'t show this message again'
                                    }
				jConfirmMod2('<center>Is the '+ANfield+' a person?'+sbStr+'</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;', function(e1) {
					if(e1)
					{       
                                            if(flagEdlikeAuth==true && field=="editor")
                                            {
                                                document.perYesed1 = 1;
                                                document.perYeseditor = 1;
                                            }
                                            else
                                            {
                                                document.perYesau1 = 1;
                                                
                                                
                                            }//mi_27_04_2012
                                            
                                            
                                                var el=document.getElementById(field);
                                                eval(el.getAttribute('onkeyup'));
                                            
                                            
                                            
							jAlertMod1("<center>"+msg+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
							if(c1)
							{
								document.getElementById(field).focus();
								if(fromat == 'mla' || fromat == 'mla8' || fromat == 'oxford'){
									strAuthor = $('#CiteAuthor').html(); //mi_14_05_2012
									firstword = strAuthor.split(' ');
									//firstword[0]=firstword[0]+' ';//MIP
									//firstword[0]=firstword[0]+',';
									strAuthor =firstword.join(' ');
									//alert(strAuthor);
									document.getElementById("CiteAuthor").innerHTML=strAuthor;	
								}
								if(fromat == 'agps'){
									document.getElementById(divName).innerHTML="";
									document.getElementById(field).value = '';
									setInText(field,divName,true);		
									strAuthor = $('#CiteAuthor').html();
									firstword = strAuthor.split(' ');	
									if(typeof firstword[1]!="undefined")
										firstword[1]=firstword[1].toUpperCase();
									strAuthor =firstword.join(' ');
									//document.getElementById("CiteAuthor").innerHTML=strAuthor;	
								}
								//------
								return false;
							}});
                                                    
                                                    
                                                  
                                                    
                                                    
							if(fromat == 'agps'){
								strN=document.getElementById("author").value;
								word=strN.split(" ");
								str=str.replace(str,word[0]);
							//110516 removed by lalit causing intext to display old value
								//document.getElementById("authorSec").innerHTML='<input type="hidden" value="'+str+'" id="authorHide" />';
								setInText(field,divName,true);
							}else{
								document.getElementById(field).focus();
							}
							return false;
					}
					else
					{	 
                                            if(flagEdlikeAuth==true && field=="editor")
                                            {
                                                document.perNoed1 = 1;
                                                document.perNoeditor = 1;
                                            }
                                            else
                                            {
                                                document.perNoau1 = 1;
                                            }
                                            var el=document.getElementById(field);
                                                eval(el.getAttribute('onkeyup'));
                                                if(flagEdlikeAuth==true && field=="editor")
                                                {
                                                    document.perNoed1 = 1;
                                                    document.perNoeditor = 1;
                                                }
                                                else
                                                {
                                                    document.perNoau1 = 1;
                                                }
							//-------
							strAuthor = $('#CiteAuthor').html();
							strAuthor = strAuthor.split(" ");
							//alert(strAuthor);
							if(strAuthor[0].endsWith(","))
								strAuthor[0]=strAuthor[0].replace(',','');
							strAuthor = strAuthor.join(" ");
							//alert(strAuthor);
							document.getElementById("CiteAuthor").innerHTML=strAuthor;
							document.getElementById(field).focus();
							return false;
					}
					
		
				});
                            }
			}
		}
	  }
		//For Second Author //MI_27_04_2012

	 var patt10 = new RegExp(/^[author]+[2-9]$/);	
         var patt10E = new RegExp(/^[editor]+[2-9]$/);	
         var pattMLAAuth=new RegExp(/^[A-z]{2,2}$/);
     if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true)) ||(field=='author2' || patt10.test(field)==true)){
         iamauthor=true;
		var strN = document.getElementById(field).value;
                                
                                        if((fromat=='mla' || fromat=='mla8') && patt17lc.test($('#'+field).val()) && eval("document.perNo"+field) ==0)
                                            {
                                                jAlertMod1("<center>Type a comma after first name(s) or first name initial(s) <br/> <br/> to display "+ANfield+"'s last name only in in-text citation.</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(){
                                                 document.getElementById(field).focus();   
                                                });
                                            }
                                
				 if(eval("document.perYes"+field) == 0 && eval("document.perNo"+field) ==0){  
					rel = strN.indexOf(' ');
                                        
                                        
                                        
                                        if(pattMLAAuth.test($('#'+field).val())==true && (fromat == 'mla' || fromat == 'mla8' || fromat=="oxford")){ 
				    
                                    if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true)) ||((field=='author2' || patt10.test(field)==true)))
                                        {
                                            document.getElementById(field).blur();
					jConfirmMod2('<center>Is the '+ANfield+' a person?</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;',function(e1) {
					if(e1)
					{
						Yau = 'perYes'+field;
						eval("document." + Yau+" = 1;");
                                                
                                                    var el=document.getElementById(field);
                                                    eval(el.getAttribute('onkeyup'));
                                                 if(fromat=="mla" || fromat=="mla8" || fromat=="harvard" || fromat=="oxford")
                                                {
                                                    if((field=="editor2" || patt10E.test(field)==true) && editorAlrtChk==true)
                                                    {
                                                        edPersPrevYes=true;
                                                    }
                                                    else if((field=='author2' || patt10.test(field)==true) && authorAlrtChk==true)
                                                    {
                                                        auPersPrevYes=true;
                                                    }
                                                }
                                                
						document.getElementById(field).focus();
                                                
                                                var patt10AU = new RegExp(/^[author]+[2-9]$/);	
                                                var patt10ED = new RegExp(/^[editor]+[2-9]$/);
                                                
                                                if((flagEdlikeAuth==true && (field=="editor2" || patt10ED.test(field)==true) && editorAlrtChk==false) || 
                                                        ((field=='author2' || patt10AU.test(field)==true) && authorAlrtChk==false))
                                                {
                                                
                                                var tm=msgf;
						if(msgf=="HARVARD")
                                                {
                                                    tm='Harvard';
                                                }
                                                jAlertMod1("<center>"+tm+" formats additional "+ANfield+"s by full name or first name initial(s) + last name <br/><br/>Enter a space between characters for "+ANfield+"s with multiple initials<br/><br/>Follow this format when entering author name details.</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
                                                                if(c1)
                                                                {
                                                                        document.getElementById(field).focus();
                                                                        return false;
                                                                }});
                                                            var sbStr='';
                                                            var chkId='';
                                        var chkFun='';
                                        if(flagEdlikeAuth==true && (field=="editor2" || patt10ED.test(field)==true))
                                            {
                                                chkId='editorAlrtChk';
                                                chkFun='setEditorAlert();';
                                            }
                                            else if(field=='author2' || patt10AU.test(field)==true)
                                                {
                                                    chkId='authorAlrtChk';
                                                    chkFun='setAuthorAlert();';                                                    
                                                }
                                        var sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="'+chkId+'" onclick="'+chkFun+'" /> Don\'t show this message again</div>'
                                                                                                           
                                    if(sbStr!='')
                                        {   
                                            $("#alrtDiv").remove();
                                            $("#popup_panel").after(sbStr);
                                        }
                                                                
                                                }                         
                                                            
                                                            
                                                            
						
					}
					else{
						document.getElementById(field).focus();
						Nau = 'perNo'+field;
						eval("document." + Nau+" = 1;");
						 document.getElementById(field).focus();
					
						}
					});
                                        
                                        }
                                        

				  }
					else if(rel!=-1 && fromat != 'oxford' && fromat!='mla' && fromat != 'mla8'){//for harvard only
                                        
                                    if((patt7.test($('#'+field).val())==true || patt7a.test($('#'+field).val())==true || patt15.test($('#'+field).val())==true))
                                                {
                                                    if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true)) || (field=='author2' || patt10.test(field)==true))
                                                    {
							document.getElementById(field).blur();
                                                        
							jConfirmMod2('<center>Is the '+ANfield+' a person?</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;',function(e1) {
							if(e1)
							{
								//document.perYesau2 = 1;
								Yau = 'perYes'+field;
								eval("document." + Yau+" = 1;");
                                                                
                                                                    //var el=document.getElementById(field);
                                                                    //eval(el.getAttribute('onkeyup'));
                                                                
										document.getElementById(field).focus();
                                                                if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true) && editorAlrtChk==false) || (field=='author2' || patt10.test(field)==true && authorAlrtChk==false))
                                                                    {
								if(fromat == 'harvard'){
									msg = 'Harvard formats additional '+Afield+' as Last Name + First Name or First Name Initial(s) <br/><br/>Enter a space between characters for '+Afield+' with multiple initials<br/><br/>Follow this format when entering '+ANfield+' name details.';
								}
								if(fromat == 'harvard'){
									jAlertMod1("<center>"+msg+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
									if(c1)
									{
                                                                            document.getElementById(field).focus();
									}
									});
								}
                                                                
                                                                var sbStr='';
                                                        if(fromat=="agps" || fromat=="harvard")
                                                        {
                                                            if(flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true))
                                                            {
                                                                sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="editorAlrtChk" onclick="setEditorAlert();" /> Don\'t show this message again</div>'
                                                            }
                                                            else
                                                            {
                                                                sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="authorAlrtChk" onclick="setAuthorAlert();" /> Don\'t show this message again</div>'
                                                            }
                                                        }
                                                        
                                                        
                                                        if(sbStr!='')
                                                            {   
                                                                $("#alrtDiv").remove();
                                                                $("#popup_panel").after(sbStr);

                                                            }
                                                                    }
                                                                
                                                                
								document.getElementById(field).focus();
							}
							else{
								//document.perNoau2 = 1;
								Nau = 'perNo'+field;
								eval("document." + Nau+" = 1;");
                                                                
                                                                
                                                                document.perNoau1 = 1;//mi_28_04_2012
							//-------
							var strAuthor = $('#'+field).val();
							strAuthor=ReplaceAnd(ReplaceA(ucFirstAllWords(strAuthor),field),false);
							document.getElementById(divName).innerHTML=strAuthor;
                                                        if(isAllAuthorsBlank())
                                                        {
                                                        var el=document.getElementById(field);
                                                            eval(el.getAttribute('onkeyup'));
                                                        }
							document.getElementById(field).focus();
                                                                //console.log(divName+' : '+strAuthor);

								}
							});
                                                        
                                                         
                                                }
                                            }
                                                
                                                if(eval("document.perYes"+field) == 0 && eval("document.perNo"+field) ==0){   
				 if(patt6.test($('#'+field).val())==true || patt6a.test($('#'+field).val())==true)
				 {
                                     if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true)) || (field=='author2' || patt10.test(field)==true))
                                     {
                                        document.getElementById(field).blur();
                                        console.log(' uuuuiii');
                                        jConfirmMod2('<center>Is the '+ANfield+' a person?</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;', function(e1) {
                                              if(e1)
                                              { 
                                                      Yau = 'perYes'+field;
                                                      eval("document." + Yau+" = 1;");
                                                            var el=document.getElementById(field);
                                                            //eval(el.getAttribute('onkeyup'));
                                                              //setInText(field,divName,true);
                                                              //reformBothAuEd(field);
                                                              //document.getElementById(field).focus();
                                                              if((flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true) && editorAlrtChk==false) || (field=='author2' || patt10.test(field)==true && authorAlrtChk==false))
                                                                  {
                                                      jAlertMod1("<center>"+msg+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
                                                      if(c1)
                                                      {
                                                              document.getElementById(field).focus();
                                                              return false;
                                                      }});
                                                   var sbStr='';
                                                if(fromat=="agps" || fromat=="harvard")
                                                {
                                                    if(flagEdlikeAuth==true && (field=="editor2" || patt10E.test(field)==true))
                                                      {
                                                          sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="editorAlrtChk" onclick="setEditorAlert();" /> Don\'t show this message again</div>'
                                                      }
                                                      else
                                                      {
                                                          sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="authorAlrtChk" onclick="setAuthorAlert();" /> Don\'t show this message again</div>';
                                                      }
                                                }
                                                
                                                
                                                if(sbStr!='')
                                                    {   
                                                        $("#alrtDiv").remove();
                                                        $("#popup_panel").after(sbStr);

                                                    }
                                                  
                                                                  }
                                                  
                                                      return false;
                                              }
                                              else
                                              {
                                                      Nau = 'perNo'+field;
                                                      eval("document." + Nau+" = 1;");

                                                      var strAuthor = $('#'+field).val();
							strAuthor=ReplaceAnd(ReplaceA(ucFirstAllWords(strAuthor),field),false);
							document.getElementById(divName).innerHTML=strAuthor;
							document.getElementById(field).focus();
                                                      return false;
                                              }
                                              });
                                              
                                             
                                          }
                                    }
				}
                                
					}
					
				 }	
	  }
          
          
          var patt10=new RegExp(/^[A-z]{2,2}$/);
	 var patt11 = new RegExp(/^[editor]+[2-9]$/);
	 var patt12=new RegExp(/^[A-z]{2,}\s[A-z]{2}$/);//mi_15_01_2013
	 var patt6=new RegExp(/^[A-z]{1}\s$/);//mi_24_04_2012	
	 var strN = document.getElementById(field).value;
	 var patt15 = new RegExp(/^[revauthor]+[2-9]$/);
	 var patt16	= new RegExp(/^[trans]+[2-9]$/);
	 var patt17=new RegExp(/^[A-z]{2,}\s[A-z]{1}$/);
	 rel = strN.indexOf(' ');
	if(flagEdlikeAuth!=true && (field=='editor' || patt11.test(field)==true)){
		if(fromat == 'mla' || fromat == 'mla8' || fromat == "oxford" || fromat == 'harvard'){
                    
                    if(fromat=='mla' && patt11.test(field)==true && isAllAuthorsBlank() && patt17lc.test($('#'+field).val()) && eval("document.perNo"+field) ==0)
                        {
                            jAlertMod1("<center>Type a comma after first name(s) or first name initial(s) <br/> <br/> to display "+ANfield+"'s last name only in in-text citation.</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(){
                                document.getElementById(field).focus();
                            });
                        }
                        
                        if(field=="editor" && patt18lc.test($('#'+field).val()) && fromat=='oxford' && isAllAuthorsBlank())
                        {
                            jAlertMod1("<center>Type a comma after "+ANfield+"'s last name to correct formatting <br/><br/> if main and in-text citations are incorrect.</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(){
                                                               document.getElementById(field).focus();   
                                                              });
                        }
		 
				 if(eval("document.perYes"+field) == 0 && eval("document.perNo"+field) ==0){  
				  if(patt10.test($('#'+field).val())==true){//patt12.test($('#'+field).val())==true  || 
				    
                                    
                                                document.getElementById(field).blur();
                                                jConfirmMod2('<center>Is the '+ANfield+' a person?</center>', 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;',function(e1) {
                                                if(e1)
                                                {
                                                        Yau = 'perYes'+field;
                                                        eval("document." + Yau+" = 1;");
                                                        if(fromat=="mla" || fromat=="mla8" || fromat=="harvard" || fromat=="oxford")
                                                        {
                                                            var el=document.getElementById(field);
                                                            eval(el.getAttribute('onkeyup'));
                                                            if(editorAlrtChk==true)
                                                            {
                                                                edPersPrevYes=true;
                                                            }
                                                        }
                                                        document.getElementById(field).focus();

                                                        if(field=='editor' || patt11.test(field)==true || field=='translator'){
                                                                if(fromat == 'oxford' && field=='editor'){
                                                                        thirdmsgf = 'Click the checkbox below Editor if editor is also a Translator.';
                                                                }else{
                                                                        thirdmsgf = 'Follow this format when entering '+ANfield+' name details.';
                                                                }
                                                                document.getElementById(field).focus();
                                                                if(fromat == 'mla' || fromat == 'mla8'  || fromat == 'oxford')
                                                                    {
                                                                        //
                                                                    }
                                                                    else
                                                                        {
                                                                            document.getElementById(field).value = '';
                                                                            ReloadTextDiv2(field,divName);
                                                                        }
                                                                if(editorAlrtChk==false)
                                                                    {
                                                                        var tmp=msgf;
                                                                        if(fromat=='agps')
                                                                            {
                                                                                tmp=agpsMsgf;
                                                                            }
                                                                            else if(fromat=="harvard")
                                                                                {
                                                                                    if(field=='editor')
                                                                                        tmp=harvardMsgf;
                                                                                    else
                                                                                        tmp='Harvard';
                                                                                }
                                                                jAlertMod1("<center>"+tmp+" formats "+ANfield+"s by full name or first name initial(s) + last name <br/><br/>Enter a space between characters for "+ANfield+"s with multiple initials<br/><br/>"+thirdmsgf+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
                                                                                if(c1)
                                                                                {
                                                                                        document.getElementById(field).focus();
                                                                                        return false;
                                                                                }});
                                                                            var sbStr='';
                                                            if(fromat=="agps" || fromat=="harvard" || fromat == 'mla' || fromat == 'mla8'  || fromat == 'oxford')
                                                            {
                                                                sbStr='<div id="alrtDiv"><br/><input type="checkbox" id="editorAlrtChk" onclick="setEditorAlert();" /> Don\'t show this message again</div>'
                                                            }
                                                            if(field=='editor')
                                                                {
                                                                    sbStr='';
                                                                }
                                                            if(sbStr!='')
                                                                {   
                                                                    $("#alrtDiv").remove();
                                                                    $("#popup_panel").after(sbStr);

                                                                }
                                                                    }
                                                        }
                                                }
                                                else{
                                                        
                                                        Nau = 'perNo'+field;
                                                        eval("document." + Nau+" = 1;");
                                                         if(fromat == 'oxford'){
                                                                 if((field=='editor' || patt11.test(field)==true)){
                                                                         alttxt = 'editors.';
                                                                 }
                                                                 if(field=='translator' || patt16.test(field)==true){
                                                                          alttxt = 'translators.';
                                                                 }
                                                                jAlertMod1("<center>Oxford style only records person "+alttxt+"</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
                                                                                if(c1)
                                                                                {
                                                                                        document.getElementById(field).value='';
                                                                                        document.getElementById(field).focus();
                                                                                        ReloadTextDiv2(field,divName);
                                                                                        return false;
                                                                                }});
                                                          }
                                                          else
                                                              {
                                                                  var strAuthor = $('#'+field).val();
							strAuthor=ReplaceAnd(ReplaceA(ucFirstAllWords(strAuthor),field),false);
							document.getElementById(divName).innerHTML=strAuthor;
							//document.getElementById(field).focus();
                                                              }
                                                              document.getElementById(field).focus();

                                                        }
                                                });
                                            
                                        
                                        

				  }
			     }
		}
				
 }
	
	return Authorfilter(str,noFilterationFlg);
			
  
}
function Authorfilter(str,noFilterationFlg){
	//alert(str+'=='+field);
        if(typeof noFilterationFlg == "undefined")
        {
            noFilterationFlg=false;
        }
        if(noFilterationFlg==true)
        {
            return BeCapital(str);
        }
       str=str.trim().replace(/,{1,}$/, '');
       str=str.trim().replace(/\.{1,}$/, '');
  format = getSectionName();
	if(str != ''){
		word = new Array();
		str1 =trim(str);//MI_28_04_2012
		word=str1.split(" ");//Ra, T
		
		if(word.length>1){
			var chkTxt2= new RegExp(/[.]/);
			var chkTxt3=new RegExp(/^[A-z]{1}[.][A-z]{1}[.]$/)
			var patt1=new RegExp(/^[A-z][.]?\s[A-z][.]?[,]\s[A-z]$/);
			var patt5=new RegExp(/^[A-z]{1}[.|\s]+$/);
	
			field = arguments[1];
			if(field=="author"){
				var  perNo = document.perNoau1; 	
			}else{
				var  perNo = eval("document.perNo" +field);
			}
			if(word[0].length == 1 && word[1].length == 1){
					narray2 = new Array();
					for(i=0;i<word.length;i++){
						//alert(word[i]);
						if(word[i].length ==1){
							if((perNo==1) ){//format=='apa' &&
              					//narray2[i] = word[i]+'.';
								narray2[i] = word[i];
							}else{
								if(typeof(word[2])!='undefined' && word[2].length == 1)
									narray2[0] = word[0];
								else if(word[1].length == 1 && typeof(word[2])=='undefined')
									narray2[0] = word[0];
								else	
								 	narray2[i] = word[i];	
									
							}
							//narray2[i] = word[i]+'.';
						}else{
							narray2[i] = word[i];
						}
					}
					
					return BeCapital(narray2.join(' ').replace(',',''));
				//return BeCapital(str.replace(',','').trim());
			}
			else if((word[word.length-1].length != 0 && word[word.length-1].length <= 2) || word[word.length-2].length == 1 || chkTxt3.test(word[word.length-1])==true){
				if(word[word.length-1].length == 2 && chkTxt2.test(word[word.length-1])==true){
					narray1 = new Array();
					for(k=0;k<word.length;k++){
						
						if(word[k].length >2){
						
							narray1[k] = word[k];
						}
					}
					return BeCapital(narray1.join(' ').replace(',',''));
				}
				else if(chkTxt3.test(word[word.length-1])==true){
					narray1 = new Array();
					for(k=0;k<word.length;k++){
						
						if(chkTxt2.test(word[k][word[k].length-1])==false){
							
							narray1[k] = word[k];
						}
					}
					
					return BeCapital(narray1.join(' ').replace(',',''));
				}
				else if(patt1.test(str)==true)
				{ 
					narray1 = new Array();
					for(k=0;k<word.length;k++){
						if(word[k].length ==1){
           				      narray1[k] = word[k];
							//narray1[k] = word[k]+'.';
						}else{
							narray1[k] = word[k];
						}
					}
					
					return BeCapital(narray1.join(' ').replace(',',','));
				}
				else if(word[word.length-1].length == 1){
					//alert(word);			
					narray1 = new Array();
					for(k=0;k<word.length;k++){
						if(document.perNoau1 == 1){
							if(word[k].length >=1){
								narray1[k] = word[k];
							}
						}else{
							if(word[k].length >1){
								narray1[k] = word[k];
							}
						}
					}
					
					return BeCapital(narray1.join(' ').replace(',',''));
				}else{ 			
					//alert(word);
					narray = new Array();
					for(j=0;j<word.length;j++){
						if(word[j].length ==1){
              narray[j] = word[j];
							//narray[j] = word[j]+'.';
						}else{
							narray[j] = word[j];
						}
					}
					//narray=narray[1].replace(narray[1],''); BY Anand
                                        return BeCapital(narray.join(' ').replace(',',''));
					//return BeCapital(str);
					//return BeCapital(word[0].replace(',','').trim());
				}
			}
			else{ //alert(format);
        
					var chkTXT4=new RegExp(/[A-z]+[,]/);
					if(chkTXT4.test(str)==true)
					{	//MI-14-05-2012
						if(format=='harvard' || format=='mla' || format=='mla8' || format=='agps'){
							str1=str.split(" ");
							str=str1[0];
						}else{
							str=str.split(" ",1);
						}
					}
				return BeCapital(str.replace(',','').trim());
			}
		}else{ 
			return BeCapital(str.replace(',','').trim());
		}
	}else{ 
		return '';
	}
}


function getSectionName() {
	var style = 'harvard';
	return style.toLowerCase();
}

function AuthorfilterComma(str){
	words = new Array();
	words=str.split(",");
	if(words.length>1){
		return words[0];
	}
	return str;
}
function AdditionalAuEd(str){
	if(str.indexOf(' ')>-1){
		str1 = str.split(" ");
		if(typeof(str1[1])!='undefined'){
			if(str1[1]=="or")
				str = str1[0];
                            else if(str1[1]=="/")
				str = str1[0];
                            else	
				str = str1[1];	
		}
	}else if(str.indexOf('/')>-1){
		str1 = str.split("/");
		if(typeof(str1[0])!='undefined'){
				str = str1[0];
		}
	}
	return str.replace('**','');
}

function BeCapital(str){
	
	s = str.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
	return s;
}

function getInnerText(element1){

    return $("#"+element1).text();

}



function doLogin(){
	//alert(document.istablet);
		$.get(base_url + 'slpw/apa_login.php?page='+$("#page").val()+'&chrome_ext=yes&remember='+$("#remember").val()+'&turing='+$("#turing").val()+'&login='+$("#login").val(),
                {password:$("#password").val(),username:$("#username").val()}, function(data) {
		 //alert(data);
		//alert(whichSiteObj);
                $("#username").val("");
    $("#password").val("");
		  justLogin(data);
		  //alert('Load was performed.');
		});
		return false;
}

function myLogin(username,password)
{
    $.get(base_url + 'slpw/apa_login.php?page='+$("#page").val()+'&chrome_ext=yes&username='+username+'&password='+password+'&remember='+$("#remember").val()+'&turing='+$("#turing").val()+'&login='+$("#login").val(), function(data) {
		 //alert(data);
		//alert(whichSiteObj);
                $("#username").val("");
    $("#password").val("");
		  justLogin(data);
		  //alert('Load was performed.');
		});
		return false;
}

function justLogin(data)
{
    if(data==true)
                  {
                      document.log = true;
			  document.dblog = true;
                          $.ajax({
                                type: 'GET',
				url: base_url+'ajax.php?ms='+new Date().getTime(),
                                data:"type=islogin",
				success: function(data) {
					$('#userLoginDiv').html(data);
                                        logoutEventByAjax();
                                }
                    });
                      if(typeof formPanelSave != "undefined" && formPanelSave==true)
                          {
                            savePrevPanl('bookPanel' , 'svPnl',document.getElementById('bottomSavePreview'));
                          }
			  if(typeof(whichSiteObj)!='undefined'){//whichSiteObj!='undefined' && 
			   
				var user = $("#username").val();
				if(user=='admin' || user=='webmaster@writecite.com'){
					//Do nothing.
				}else{
					
					
				}
			  }
			  document.log = true;
			  document.dblog = true;
                          if(document.dblog==true){
                              
				
			  document.getElementById('login_panel').style.display="none";
                          document.getElementById('result-wrapper').style.display="block";
                          
                              if(buttonClicked=="folderBtn")
                                  {
                                      $('#login_panel').hide();
                                      fetchAllDatabase();
                                      
                                  }
                                  else
                                      {
                                         if(typeof formPanelSave != "undefined" && formPanelSave==true) 
                                        {
                                          var section = getSectionName();
                                                  DetectSection();

                                          saveCitationstoDB(section);
                                        }
                                      }

                                }
	          
		  }
                  else{
			if(data==MSG_DISABLED)
                        {
				
			   $.ajax({
				   type: 'GET',
				   url: base_url+'expired.php?chrome_ext=yes&ajax=Yes&ms='+new Date().getTime(),
				   success: function(data){
				   		$("#login_panel").hide();
                                                $("#expired_inner_panel").html(data);
                                                $("#expired_panel").show();
						//$('#b8').html(data);
			     	}
		   		});
                                /*$.ajax({
				   type: 'GET',
				   url: base_url+'abort_session.php',
				   success: function(data){
			     	}
		   		});*/
				return false;
			}
                        else{
                            
				if(data.search('You are currently logged on via another')>=0)
                                {
                                    jConfirmMod1("<center>You are currently logged on via another device or browser.<br/><p></p>Do you want to close your previous open session?</center>", "Login" ,"&nbsp;Proceed&nbsp;","&nbsp;Cancel&nbsp;",function(c1) {
                                        if(c1){
                                                abortConnection();
                                        }
                                });
                                }
                                else
				{
                                    data='<div style="margin-bottom:10px;">'+data+'</div>';
				$('#errPL').html(data);
                                $("#registerLink, .registerBtn").click(function(){
                                            justRegister();

                                         });
                                }
			}
		  }
}

function LogoutHandler(){
	
	if($.trim($("#svPnl").text())!=""){
		jConfirmMod1("Citations not saved to myCites will be lost.</br>&nbsp;Are you sure you want to leave this page?", 'Logout' ,'&nbsp;Leave this Page&nbsp;','&nbsp;Stay on this Page&nbsp;',function(c1) {
			if(c1){
                            document.broweralert = false;
				if (document.log==true && document.fblog==true){
					FB.getLoginStatus(function(response) {
							 if(response.status === 'connected'){
								 FB.logout(function() {
									window.location = siteloklogout;
								});
							 }
						});
					return false;
				}else{
					//alert(siteloklogout);
					/*if(typeof(whichSiteObj)!='undefined' && typeof(whichSiteObj.wSite)!='undefined' && whichSiteObj.wSite!="" && (whichSiteObj.wSite=="twgs.qld")){
						top.LogoutHandler(siteloklogout);
					 }else{*/
						window.location = siteloklogout;
					 //}
				}
			}
		});
	}else{
		if (document.log==true && document.fblog==true){
					FB.getLoginStatus(function(response) {
							 if(response.status === 'connected'){
								 FB.logout(function() {
									window.location = siteloklogout;
								});
							 }
						});
					return false;
				}else{
					//alert(siteloklogout);
					if(typeof(whichSiteObj)!='undefined' && typeof(whichSiteObj.wSite)!='undefined' && whichSiteObj.wSite!="" && (whichSiteObj.wSite=="twgs.qld")){
						//top.LogoutHandler(siteloklogout);
						window.location = siteloklogout;
					 }else{
						window.location = siteloklogout;
					 }
				}
	}
}

function showAllDatabase(onlyLoadFlg)
{
     
        $.ajax({

				  type: 'POST',

				  url: base_url+ 'islogin.php?chrome_ext=yes&ms='+new Date().getTime(),

				  context: document.body,

				  data: "dat=a&",

				  success: function(data){
                                      
					  if(data=="")
                                          {
                                              document.dblog=true;
                                              if(document.dblog==true){
                                                  fetchAllDatabase(onlyLoadFlg);
                                              }
                                              
                                          }
                                          else{
            if(typeof saveMyCiteBottom == "undefined" || saveMyCiteBottom==false)
                {
                    //RegisterAlert('citation');
                }
                else
                {
                    //RegisterAlert('CitesBottom');
                    document.getElementById('result-wrapper').style.display='none';
                    $("#login_register_panel").show();
                }
                
	}
                                      }
                                  });
}

function fetchAllDatabase(onlyLoadFlg)
{
    if(typeof onlyLoadFlg == "undefined")
        {
            onlyLoadFlg=false;
        }
    var style = 'HARVARD';
    $.ajax({
                type: 'GET',
                async:true,    
                url: base_url+ 'students/scripts/showAlldatabase.php?formatHL='+style.toLowerCase()+'&format='+style.toLowerCase()+'&ms='+new Date().getTime(),
                data: "html=&chrome_ext=yes",
                success: function(data1){
                    $("#fileFolderList"). html(data1);
                                            if(onlyLoadFlg==false)
                                                {
                                                    $("#result-wrapper").hide();
                                                    $("#fileListDiv").show();
                                                    $("#saveAsCitDiv").hide();
                                                    hideLdr('saveFileDiv',false);
                                                    hideLdr('saveAsFileDiv',false);
                                                    hideLdr('saveAsCitDiv',false);
                                                }
                                      }
                                                     
                                                  });
                                                  
}

function saveCitationstoDB2(){
    $.ajax({

				  type: 'POST',

				  url: base_url+ 'islogin.php?chrome_ext=yes&ms='+new Date().getTime(),

				  context: document.body,

				  data: "dat=a&",

				  success: function(data){
					  if(data=="")
                                          {
                                              document.dblog=true;
                                              if(document.dblog==true){
            if(typeof formPanelSave != "undefined" && formPanelSave==true)
                {
                    formPanelSave=false;
                    savePrevPanl('bookPanel' , 'svPnl',document.getElementById('bottomSavePreview'));
                }
		var section = getSectionName();
			DetectSection();
		saveCitationstoDB(section);

	}
        
                                          }
                                          else{
            if(typeof saveMyCiteBottom == "undefined" || saveMyCiteBottom==false)
                {
                    //RegisterAlert('citation');
                }
                else
                {
                    //RegisterAlert('CitesBottom');
                    document.getElementById('result-wrapper').style.display='none';
                    $("#login_register_panel").show();
                }
                
	}
                                          
                                  }
    });
	
}
function saveFootnoteCitationstoDB2(){
	if(document.dblog==true){
		var section = getSectionName();
			//DetectSection();
		saveFootnoteCitationstoDB(section);
	}else{
		RegisterAlert('citation');
	}
}
function saveCitationstoDB(section){
	//alert(section);
    var content="";

    var n = $('.deletecitation').length;

	if(n==1) {

		$('.deletecitation').attr('checked',true);

	}

	/*$('.deletecitation:checked').each(function(index)

    {*/
		/*if(section=="oxford"){
			var inpt = $(this).next('label').html();
			var par = $(this).parent();
			$(this).next('label').html().replace("<i>", "^i^");
			$(this).next('label').html().replace("</i>", "^ii^");
			content1 = $(this).next('label').html();
		}else{
			var inpt = $(this).next('span').html();
			var par = $(this).parent();
			$(this).next('span').html().replace("<i>", "^i^");
			$(this).next('span').html().replace("</i>", "^ii^");
			content1 = $(this).next('span').html();
		}*/
    $('.previewcitation').html(getText('bookPanel'));
                //$('.previewcitation').html($('.previewcitation').html().replace("<i>", "^i^"));
			//$('.previewcitation').html($('.previewcitation').html().replace("</i>", "^ii^"));
			content1 = $('.previewcitation').html();
		content1=content1.replace("^i^", "<i>");
		content1=content1.replace("^ii^", "</i>");
		//$(par).children('input').attr('checked',true);
		content=content+content1+"|";
                
    //});
	content=$.trim(removeNewLine(content));

	content=content.replace(/&nbsp;/g," ");

	content=content.replace(/&amp;/g,"##");
	if(content!="")
        {
            
            
            $.ajax({

				  type: 'POST',

				  url: base_url+ 'islogin.php?chrome_ext=yes&ms='+new Date().getTime(),

				  context: document.body,

				  data: "dat=a",

				  success: function(){

					 
                                              //showFileNameSelection(content,section);
                                              showflsaveoption();
                                          

			      }
            });

	}
        else
        {

		jAlertMod("Click the checkbox alongside citations before saving","Alert","&nbsp;OK&nbsp;",null);

	}



}

function RegisterAlert(which){

/*jAlertMod1("This function is available for registered users only.<br>Register or Login using the links at the top of the page.","Login Required","&nbsp;OK&nbsp;",null);*/

	var msg  = 'When you click OK a login form will open.';

jAlertMod1("<center>This function is available for registered users only.</center><center>"+msg+"</center>","Login Required","&nbsp;OK&nbsp;",function(afteruserRes){

			if(afteruserRes){

				document.getElementById('login_panel').style.display='block';
                                document.getElementById('result-wrapper').style.display='none';

				

			}

		});

		return false;

		

}

function RegisterAlert1(target){
	if(whichSiteObj!='undefined' && typeof(whichSiteObj.changealert)!='undefined' && whichSiteObj.changealert==true){
	var msg  = 'When you click OK a registration form will appear in the right hand panel.';
	}else{
	var msg = 'Register or Login using the links at the top of the page.';
	}
	jAlertMod1("This function is available for registered users only.<br>"+msg,"Login Required","&nbsp;OK&nbsp;",function(){eval(target);});
}

function savePrevPanl(srcPnlID , destPnlID,obj){
	var log=document.log;
	var whichStyle =getSectionName();
	if(whichStyle=="oxford" && document.getElementById('sc4') && document.getElementById('sc4').style.display=="block" && document.getElementById('http') && document.getElementById('http').value == "")
	{
		jAlertMod1("You have not recorded the internet address of your source.<center>Add URL or click “Internet Sourced” if not applicable.</center>", 'Alert' ,'&nbsp;OK&nbsp;', function(c1) {
				if(c1)
				{
						document.getElementById('http').focus();
						return false;
				}});
				
	}
        else if(whichStyle=="oxford" && document.getElementById('religiousForm')){
		
		jConfirmMod2('It is customary not to include religious sources in reference lists.<center>Do  you want to record source in Footnotes only?</center>', 'Save','&nbsp;Yes&nbsp;',"&nbsp;No&nbsp;", function(r7) {
			if(r7){	
				if(isOpener()){
					document.log=opener.document.log;
				}	
				savePrevPanl1(srcPnlID , destPnlID,document.log);
				saveIntextpreview(srcPnlID,destPnlID,document.log);
				document.publication.reset();
				return false;
			}else {
				document.publication.reset();
				clearPanel(srcPnlID,'reset11');
				return false;
			}
		});	
	}
	else{
		
		
		
		$('.tabContent #publicationtype .cssform input').each(function() {
			if ($(this).val() != '') {
				//$(this).trigger('keyup');
				//$(this).trigger('onchange');
			}
		});
                var myFlg=true;
                if(getFormName()=="internetEmail" || getFormName()=="referenceReligious")
                    {
                        myFlg=false;
                        var msg='<center>APA requires only in-text references for personal communications.<br /><br />Do you want to save in-text citation only?</center>';
                        if(getFormName()=="referenceReligious")
                            {
                                msg='<center>APA requires only in-text references for religious sources.<br /><br />Do you want to save in-text citation only?</center>';
                            }
                        jConfirmMod2(msg, 'Alert' ,'&nbsp;Yes&nbsp;','&nbsp;No&nbsp;', function(e1) {
                                        if(e1)
                                        { 
                                            if(getFormName()=="internetEmail")
                                                {
                                                    formatInternetEmailIntext(true);
                                                }
                                                
                                            myFunction(srcPnlID , destPnlID,obj,false);    
                                            var resetVar = "reset11";
                                            clearPanel(srcPnlID,resetVar);
                                            return false;
                                        }
                                        else
                                        {
                                             myFunction(srcPnlID , destPnlID,obj,true);                                            
                                            return false;
                                        }

                                        });
                                        //alert('hello');
                    }
                
                if(myFlg==true)
                    {
                        myFunction(srcPnlID , destPnlID,obj,true)
                    }
		document.log=log;
	}
}

function myFunction(srcPnlID , destPnlID,obj,flg)
{
    if(flg=="undefined")
    {
        flg=true;
    }
    if(flg==true)
    {  
        savePrevPanl1(srcPnlID , destPnlID,document.log);
    }
    
		//saveIntextpreview(srcPnlID,destPnlID,document.log);
                
		if(document.log==true){
                    if(typeof saveMyCiteBottom == "undefined" || saveMyCiteBottom==false)
			jAlertMod("<center>Your citation has been saved to the Preview panel.</center></br>Click the <b>myCites</b> button when you have completed your citations list.","Alert","&nbsp;OK&nbsp;",null);	
			if($("#aWorldcatSearch").hasClass("active")==true){
				$("#preview").click();
			}
			if(document.istablet){
				var section = getSectionName();
				document.savestyle = section;
			}
			//if($('.topnav ul .active span').text()=="Books"){
				document.publication.reset();
				//window.location.href=obj.href;	
			//}
		}
}

function DetectSection(noMycitesFlg){

	

	var section = getSectionName();

	if(section=='harvard'){

		showHarvard(3,noMycitesFlg);

	}

	

}

function showHarvard(secNo,myCitesDefault){
	$('#savedPanel').html('');
	//section = getSectionName(secNo);
	section = getSectionNameFromSec(secNo);
	extraQueryString = getCustomizeSettings();
        if(typeof myCitesDefault != "undefined" && myCitesDefault==false)
        {
            extraQueryString+='&myCitesDefault=no';
        }
	if(typeof(whichSiteObj)!='undefined' && whichSiteObj.topmenu==false){
		page = "showSavedPanel2.php";
	}else{
		page = "showSavedPanel1.php";
	}
	page = "showSavedPanel2.php";
	$.ajax({
		type: 'GET', 
		url: base_url+'students/scripts/'+page, 
		cache: false, async:false,
		data: "format=harvard&formatHL="+section+extraQueryString,
		success: function(data){
			$("#typetabs_1").show();
			$('#savedPanel').html(data);
			$('.loader').hide();
		}
	});
	return false;
}


function removeNewLine(str){

    str=str.replace(new RegExp( "\\n", "g" ),"").replace(new RegExp( "\\r", "g" ),"");

    return str;

}

Array.prototype.multiSort = function(index){

    // Written By: WillyDuitt@hotmail.com | 03-10-2005 \\;

    for(var i=0; i<this.length; i++)

    {

		$(this[i]);

        var temp = this[i].splice(index,1);
		
        this[i].unshift(temp);

    }

    return this.sort(function(a, b) {
  return removeQuotes(a) > removeQuotes(b);
});

}

function removeQuotes(str) {
  return str[0][0].replace(/['"]/, '')
}Array.prototype.multiSort = function(index){

    // Written By: WillyDuitt@hotmail.com | 03-10-2005 \\;

    for(var i=0; i<this.length; i++)

    {

		$(this[i]);

        var temp = this[i].splice(index,1);
		
        this[i].unshift(temp);

    }

    return this.sort(function(a, b) {
  return removeQuotes(a) > removeQuotes(b);
});

}

function removeQuotes(str) {
  return str[0][0].replace(/['"]/, '')
}

function getSectionNameFromSec(secNo) {
	if(secNo==1) {
		return 'mla';
	}else if(secNo==2) {
		return 'apa';
	}else if(secNo==3) {
		return 'harvard';
	}else if(secNo==4) {
		return 'agps';
	}else if(secNo==5) {
		return 'oxford';
	}
        else if(secNo==6) {
		return 'mla8';
	}else {
		return 'none';
	}
}

function getCustomizeSettings(){
	strReturn = '';
	if(typeof(whichSiteObj)!='undefined'){
		if(typeof(whichSiteObj.bottom_facebook)!='undefined' && whichSiteObj.bottom_facebook==false){
			var fbT = whichSiteObj.bottom_facebook;
		}else{
			var fbT='false';
		}
		if(typeof(whichSiteObj.bottom_twitter)!='undefined' && whichSiteObj.bottom_twitter==false){
			var twT = whichSiteObj.bottom_twitter;
		}else{
			var twT='false';
		}
		if(typeof(whichSiteObj.defaultRightBottom)!='undefined' && whichSiteObj.defaultRightBottom!=""){
			var brT = whichSiteObj.defaultRightBottom;
		}else{
			var brT='';
		}
		if(typeof(whichSiteObj.twitterID)!='undefined' && whichSiteObj.twitterID!=""){
			var twitterID = whichSiteObj.twitterID;
		}else{
			var twitterID='';
		}
		strReturn = "&facebook="+fbT+"&twitter="+twT+"&defaultRightBottom="+brT+"&twitterID="+twitterID;
	}
	return strReturn;
}

function showflsaveoption()
{
    var style = 'HARVARD';
    
    $.ajax({

                type: 'POST',

                async:true,

                url: base_url+ 'students/scripts/getSubjectName.php?chrome_ext=yes&format='+style.toLowerCase()+'&ms='+new Date().getTime(),

                data: "html=&chrome_ext=yes",

                success: function(data){
                if(data != "")

                {

                //alert(data);
                $("#saveFileDiv #filenames1").remove();
                $("#saveFileDiv #popup_prompt").after('<div id="filenames1">'+data+'</div>');
                var $unique = $('#sbName');

                                    $unique.change(function() {
                                    loadFileDiv(this.value,'saveFileDiv');
                                    $("#saveFileDiv #popup_prompt").val(this.value);
                                        });
                //alert('hold');
                changeText();
                if(typeof selectedSubject != "undefined" && selectedSubject!="")
                    {
                        $("#saveFileDiv #popup_prompt").val(selectedSubject);
                        //document.getElementById("popup_prompt").value = selectedSubject;
                    }
                }

                $.ajax({
                type: 'GET',
                async:true,    
                url: base_url+ 'students/scripts/getFileNameNew.php?div_id=saveFileDiv&format='+style.toLowerCase()+'&sub_name='+selectedSubject+'&ms='+new Date().getTime(),
                data: "html=&chrome_ext=yes",
                success: function(data){                                                                
                if(data != "")
                {
                    $("#saveFileDiv #fileNameDiv").html(data);  
                    if($.trim($("#svPnl").text())!="")
                    {
                        $("#saveFileDiv #popup_prompt_file").val(selectedFile);
                    }
                }						

        }

        });



        }

        });

					
    
    document.getElementById('result-wrapper').style.display="none";
    document.getElementById('saveFileDiv').style.display="block";
    
    
    
    
    
}

function showFileNameSelection(content1,section) {
var map = '';
if(section =='oxford'){
	content1 = content1.replace(/<\/?span[^>]*>/g,"");
}
//console.log(map);  

   
   jPrompt1('Enter a filename. If filename exists then citations will be appended to existing file.', 'Default_Citations', 'Save as', function(r1) {

																																			

				if( r1 ) {

					notes=r1;

					//alert(r1);
                                        var s_url='';
                                        if(typeof saveMyCiteBottom != "undefined" && saveMyCiteBottom==true)
                                            {
                                                s_url='&mycitebottom=true';
                                            }

					$.ajax({

						type: 'GET',

						url: base_url+ 'students/scripts/savedatabase.php?formatHL='+section,

						data: "html="+encodeURIComponent(content1)+"&notes="+notes+"&save=append"+s_url,

						success: function(data){
							//alert(data);
							data=data.replace('\r\n','');
							if(data == 'cannot save more citations')
							{
								jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);
							}
							else{
								if(data == '1')
								{//do nothing
									//alert();
									/*if(document.getElementById(r1)){
									  if($("[id='"+r1+"']").attr('checked',true))
									  	OpenCitations();
									}else{
									  fireAjaxRequest('students/scripts/showAlldatabase.php','','formatHL='+section+'&format='+section,'c8Content','','SF');
									}*/
                                                            jAlertMod("Citation saved successfully.","Alert","&nbsp;OK&nbsp;",null);
									
								}
								else{ 
									if(data == 'cannot save more files')
									{
										jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);
									}else{
										//alert();
									 var filename = $("#c8Content").find("div").find("p").find('span').text();
									 if(filename!='' && filename==r1){
    									var fid = $("#c8Content").find("div").find("p").find('span').attr("id");
										fireAjaxRequest("students/scripts/showAlldatabase2.php","","fileid="+fid,"c8Content","")
									 }else if(filename!=''){ 
											fireAjaxRequest('students/scripts/showAlldatabase.php','','formatHL='+section+'&format='+section,'c8Content','','SF');										 
											//$("#"+r1).attr('checked',true);
											//setTimeout("$('#'+r1).attr('checked',true)", 1000)
											//setTimeout('OpenCitations()', 1000);
											//return false;
											//alert(11);
									 }else{
											$("[id='"+r1+"']").attr('checked',true);
											OpenCitations();
									 }
									}
								}
							}
								if(document.istablet){
										tabcontent('database');
								}
						}
					});
			
				//$("#savePanelUITabs").tabs('load', $("#savePanelUITabs").tabs('option', 'selected'));

				}

				

			});

  // 

}

function showFileNameSelection2(content1,section,filenm1) {

        //alert(content1+filenm1);

   jPrompt2('Enter a filename. If filename exists then citations will be appended to existing file.', 'Default_Citations', 'Save as', function(r1) {

				if( r1 ) {

					notes=r1;

					if(notes==filenm1)

					{

					jAlertMod("Cannot save Duplicate Citation to the same Filename.<br>Save to a New File or Existing File.","Failure","&nbsp;OK&nbsp;",null);

					}

					else

					{

						//alert(filenm1);

					$.ajax({

						type: 'POST',

						url: base_url+ 'students/scripts/savedatabase.php?formatHL='+section,

						data: "html="+encodeURIComponent(content1)+"&notes="+notes+"&save=append&fileid="+filenm1,

						success: function(data){

							//alert(data);

							if(data == 'cannot save more citations'){

								jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);

							}else if(data == '1' || data == '11'){

							jAlertMod("Citations save successfully.","Success","&nbsp;OK&nbsp;",null);
							  //formData = "fileid="+id;
							 // fireAjaxRequest("students/scripts/showAlldatabase2.php","",formData,"c8Content","")
					fireAjaxRequest("students/scripts/showAlldatabase.php","","formatHL="+section+"&format="+section+"","c8Content","","SF");
							}else if(data == 'cannot save more files'){

								jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);

							}									

						}



					});

				

				$("#savePanelUITabs").tabs('load', $("#savePanelUITabs").tabs('option', 'selected'));

				}

				}

				

			},filenm1);

}

function OpenCitations(which){	

    var n = $('.opencitationbody:checked').length;

    if(n>0) {
		var fileid ='';
		$('.opencitationbody:checked').each(function(index)
		{		
			fileid = $(this).attr('name');
			filenm1 = $(this).attr('id');
		});
		if(fileid!="") {
			if(which=="footnote"){
				fireAjaxRequest("students/scripts/showAllfootnote2.php","","fileid="+fileid,"c8Content","")
			}else{		
				fireAjaxRequest("students/scripts/showAlldatabase2.php","","fileid="+fileid,"c8Content","")
			}	
		}
	}
	else {
		jAlertMod("No saved citations or Citations file was not selected","Alert","&nbsp;OK&nbsp;",null);
		}
}

function abortConnection()
{
    $.ajax({
		type: "GET",
		url: base_url+"abort_session.php?ms="+new Date().getTime(),
		data: "type=menu",
		success: function(data){
                    console.log(data)
			$("#errPL").html(data);
		}
	});
}

function showSavedCitations(fileid)
{
    if(typeof fileid == "undefined" || fileid=='')
        {
    var n = $('#fileListDiv .opencitationbody:checked').length;
            if(n>0) {
                        $('#fileListDiv .opencitationbody:checked').each(function(index)
                        {		
                                fileid = $(this).attr('name');

                        });

            }
        }
            //console.log(base_url + 'students/scripts/showAlldatabase2.php?fileid=' + fileid)
    $.ajax({

							type: 'GET',

							async:true,

							url: base_url + 'students/scripts/showAlldatabase2.php?fileid=' + fileid,

							data: "html=&chrome_ext=yes",

							success: function(data){
                                          hideLdr('saveFileDiv',false);
                                          hideLdr('saveAsFileDiv',false);
                                          hideLdr('saveAsCitDiv',false);
							if(data != "No Saved Citations")

							{

							//alert(data);
                                                        $("#fileSaveContainer").hide();
							$("#openedCitationInner").html(data);
                                                        $("#openedCitation").show();
                                                        $("#fileListDiv").hide();
                                                        $("#copyBtnBtm").show();
                                                        $("#emailBtn").show();
                                                        $("#deleteBtn").show();
                                                         $("#sendEmailBtn").click(function(){
                    
                                                                email1();
                                                            });
                                                        //alert('hold');
                                                        
                                                        }
                                                        else
                                                            {
                                                                jAlertMod("No Saved Citations","Alert","&nbsp;OK&nbsp;",null);
                                                            }
                                                        }
    });
}

//Close Popups and Fade Layer

	$('a.close, #fade').live('click', function() { //When clicking on the close or fade layer...

		$('#fade , .popup_block').fadeOut(function() {

			$('#fade, a.close').remove();  //fade them both out

		});

		return false;

	});
        
function DeleteSelectedfromDB(which){

	var n = $('.deletecitationbody:checked').length;

	if(n>0) {

		jConfirm('Are you sure that you want to delete the selected citation', 'Delete Citation', function(r9) {

			if(r9) {
					var CitationArr = new Array();
					CiCount = 0;
					$('.deletecitationbody:checked').each(function(index)
					{
						$(this).parent().remove();
						CitationArr[CiCount] = $(this).attr('name');
						CiCount++;
					});
						$.ajax({

							type: 'GET',

							url: base_url+ 'students/scripts/deldatabase.php',

							data: "Cid="+CitationArr+"&chrome_ext=yes&which="+which,

							success: function(data){
								//alert(data);
							}
						});
			}
		}); 
	}
	else {
		jAlertMod("Click the checkbox alongside citations before Deleting","Alert","&nbsp;OK&nbsp;",null);
	}
}


function registerByAjax(url,frmName,strData,divName,afterSuccessJS,ActiveTab){
	formData = '';
	if(frmName!=""){
		formData = getFormData(frmName);
	}
       
        var subUrl='';
        
        var loggedinflg=false;
	$.ajax({
		type: "GET",
		url: base_url+url+subUrl,
		data: formData,
		success: function(datar){
			//data=datar.replace('\n','');
			data=datar.replace('\r\n','');
			if(afterSuccessJS!=""){
				if(afterSuccessJS=='divnull'){
					//$('.content-bottom').html('');
					$("#"+divName).html(data);
				}else{
					//alert(afterSuccessJS + "('" + data + "');");
					//alert(data);
					//replace('\n','')
					//var a = getFormData + "('" + data + "');";
					afterRegister(data);
				}
			}else{
				//alert(data);
				$("#"+divName).html(data);
			}
			/*if(document.istablet){
				makeFooterFlexible();
			}*/
                   
		}
	});
	return false;
}

function getFormData(frmID){

	// TODO add script to handle select / textarea in future development

	

	// get all the inputs into an array.

	var $inputs = $('#'+frmID+' :input');

	// not sure if you wanted this, but I thought I'd add it.

	// get an associative array of just the values.

	var values = {};

	$inputs.each(function() {

		if(this.type == 'checkbox'){

			if(this.checked==true){

				values[this.name] = $(this).val();

			}

		}else{

			values[this.name] = $(this).val();

		}

		//alert(this.type+"===="+this.name+"==="+$(this).val());

	});	

	return values;

}

function afterRegister(data){
                var arrData=data.split("|");
		if(data == 'Registration Successful' || arrData[0]=='Registration Successful Customization'){
                        var str="";
                        
                                    jAlertMod1("<center>Registration Successful.</center>"+str+"<center>Please check your email for Password.</center>","Alert","&nbsp;OK&nbsp;",null);
                                    
                                        $('#login_panel').show();
                                                     $('#registerPanel').hide();
                               
		}else{
			//alert(data);
			jAlertMod1(data,"Alert","&nbsp;OK&nbsp;",null);
			return false;
		}
	
}



function locateNear(id){
	jQuery('#HIDEVAR').html("http://worldcat.org/oclc/"+id);
	jQuery('#HIDEVAL').html(id);
	return true;
}

function SaveSearch(){
	var hrefs='';
	hrefs = $('#HIDEVAR').html();
	if(hrefs=='') {
		HIDEIN = $('#HIDEIN').html();
		var nwc = $('#chkResultsWCS:checked').length;
		if(nwc==0 && HIDEIN=='WORLDCAT'){
			//$("#worldcatMsg").html('Click Citation to proceed with your request');
                        jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
		}else{
			if(($("#txtSearch1").val()!="") || ($("#txtSearch2").val()!="") || ($("#txtSearch3").val()!="")){
				msgH1 = 'Click WorldCat search button first';
			}else{
				msgH1 = 'Please enter search criteria';
			}
			//$("#main").html('<h1 style="color:#C80000;margin-top:10px;margin-bottom:10px;text-align:center;">'+msgH1+'</h1>');
                        jAlertMod1(msgH1,"Alert","&nbsp;OK&nbsp;",null);
		}
	}
	else {
            if(isPlcPubBlank()==true)
            {
                editWCSearch();
            }
            else
            {
		id = $('#HIDEVAL').html();
		preval = $('#TD'+id).html();
		
		$("#worldcatMsg").html('');
		preval =preval.replace('<p class="citation_style_APA">','');
		preval =preval.replace('<p class="citation_style_HARVARD">','');
		preval =preval.replace('<p class="citation_style_MLA">','');
		preval =preval.replace('<p class="citation_style_MLA8">','');
		preval =preval.replace('<P class=citation_style_APA>','');
		preval =preval.replace('<P class=citation_style_HARVARD>','');
		preval =preval.replace('<P class=citation_style_MLA8>','');
		preval =preval.replace('<P class=citation_style_MLA>','');
		preval =preval.replace('</p>','');
		preval =preval.replace('</P>','');
		preval = $.trim(preval);
		//preval = '<div id="citation1" class="citation"><input id="ckbcitation1" class="deletecitation" type="checkbox">'+preval+'</div>';
		var preval1=preval.replace("<i>", "^i^");
                preval1=preval1.replace("</i>","^ii^");
		$("#bookPanel").html('<span>'+preval1+'</span>');
                openListBtn=false;
        $("#worldcat-searchdiv").hide();   
        savePrevPanl1WordCat('bookPanel' , 'svPnl');
        showHideBtns();
                                                formPanelSave=true;
                                                saveMyCiteBottom=true;
                                                saveCitationstoDB2(); 
		//$('#svPnl').html(preval);
            }
	}
	return false;
}

function ShowButtons()
{
    $("#footerPanelFl").show();
    $("#footerPanelFo").hide();
}

function ShowButtonsSubFolder()
{
    $("#footerPanelFl").hide();
    $("#footerPanelFo").show();
}

function addFolderPopup()
{
    $("#fileListDiv").hide();
    $("#createFolderDiv").show();
}

function saveSubFolder()
{
    
    var r11=$("#createFolderDiv #popup_prompt").val();
    var s_url='';
    var section = 'HARVARD';
    
       var flNm=''; 
       flNm=$("#createFolderDiv #popup_prompt_file").val();
       if(r11!='')
           {
                $.ajax({
                type: 'POST',

                url: base_url+ 'students/scripts/savesubjectfile.php?formatHL='+section+'&sub_name='+r11,

                data: "html=&notes="+flNm+s_url,

                success: function(data1){
                        //alert(data);
                        var arrData=data1.split("`");
                        var data=arrData[0];
                        var citationId='';
                        if(arrData.length>1)
                            {
                                if(arrData[1]!='')
                                    citationId=arrData[1];
                            }
                        $('#popup_container').remove();
                        data=data.replace('\r\n','');
                        if(data == 'cannot save more citations')
                        {
                                jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);
                        }
                        else{
                                if(data == '1')
                                {
                                    showAllDatabase();
                                    $("#createFolderDiv").hide();
                                }
                                else{ 
                                        if(data == 'cannot save more files')
                                        {
                                                jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);
                                        }
                                       
                                }
                        }
                }
        });
           }
           else
               {
                   jAlertMod("Please enter subject name.","Alert","&nbsp;OK&nbsp;",null);
               }
	return false;		
}

function DeleteSelectedfromDBFolder(){
    var subid ='';
    $('#fileListDiv .opencitationbody:checked').each(function(index)
    {
		subid = $(this).attr('name');
		filenm = $(this).val();
    });
   
    var which='harvard';
    if(subid!="") {
            jConfirmMod('Are you sure you want to delete <b>'+filenm+'</b>', 'Delete Confirmation','&nbsp;Proceed&nbsp;', function(r4) {
                            if(r4) {
                                    $.ajax({
                                    type: 'GET',
                                    async:false,
                                    url: base_url+ 'students/scripts/deldatabasebyfolderid.php?subid='+subid+"&which="+which+"&ms="+new Date().getTime(),
                                    success: function(data){
                                        if(data=="Not Empty")
                                            {
                                                jAlertMod("Delete all files in folder(s) before deleting.","Alert","&nbsp;OK&nbsp;",function(f3){
                                                    openSubjectPanel(subid);
                                                });
                                            }
                                            else
                                                {
                                                    showAllDatabase();
                                                }
                                    }
                            });
                    
            }
            });  
    }
    else{
                    jAlertMod("Click the checkbox alongside citations before Deleting","Alert","&nbsp;OK&nbsp;",null);
    }
}

function openSubjectPanel()
{
    var n = $('#fileListDiv .opencitationbody:checked').length;

	  if(n>0)

	{
            var fileId=$('#fileListDiv .opencitationbody:checked').attr('name');
            
               showHideSubDiv('subDiv'+fileId,'subplus'+fileId);
        }
        else
            {
                jAlertMod("Click the checkbox alongside subject folders before using Open functionality.","Alert","&nbsp;OK&nbsp;",null);
            }
}

function saveAsSubFolder()
{
    var r11=$("#saveAsFolderDiv #popup_prompt").val();
    var s_url='';
    var section = 'HARVARD';
    
        var folderName = $('#fileListDiv .opencitationbody:checked').val();
        var subId = $('#fileListDiv .opencitationbody:checked').attr('name');
        if(folderName.toLowerCase()!=r11.toLowerCase())
        {
            $.ajax({
                type: 'POST',

                url: base_url+ 'students/scripts/saveassubject.php?sub_id='+subId+'&formatHL='+section,

                data: "html="+s_url+"&sub_name="+r11,

            success: function(data){
                        //alert(data);
                        data=data.replace('\r\n','');
                        if(data == '1')
                        {
                            showAllDatabase();
                        }
                        else{
                            
                            console.log('Error in save');
                        }
                      backToFlList(); 
                }
        });
      }
	return false;	
}

function DeleteSelectedfromDBFile(){
    var fileid ='';
    $('#fileListDiv .opencitationbody:checked').each(function(index)
    {
		fileid = $(this).attr('name');
		filenm = $(this).attr('id');
    });
var which='harvard';
if(fileid!="") {
	jConfirmMod('Are you sure you want to delete <b>'+filenm+'</b>', 'Delete Confirmation','&nbsp;Proceed&nbsp;', function(r4) {
			if(r4) {
				$.ajax({
				type: 'GET',
				async:false,
				url: base_url+ 'students/scripts/deldatabasebyfileid.php?fileid='+fileid+"&which="+which+"&ms="+new Date().getTime(),
                                success: function(data){
                                    if(data=="Not Empty")
                                            {
                                                jAlertMod("Delete all citation(s) in your list(s) first.","Alert","&nbsp;OK&nbsp;",function(f3){
                                                 OpenCitations1("",fileid);   
                                                });
                                            }
                                            else
                                                {
                                                    showAllDatabase();
                                                }
                                }
			});
		
	}
	});  
}
else{
		jAlertMod("Click the checkbox alongside citations before Deleting","Alert","&nbsp;OK&nbsp;",null);
}
}

function duplicateCitation2(){

var section = 'HARVARD';

var n = $('#fileListDiv .opencitationbody:checked').length;

	  if(n>0){

		 var flNm='';
                flNm=$("#fileListDiv .opencitationbody:checked").val();
                
                var section=getSectionName();
                var subjectId=0;
                var filenm1=$("#fileListDiv .opencitationbody:checked").attr('name');
                $("#fileNameDiv").remove();
                $.ajax({
                                                    type: 'POST',

						url: base_url+ 'students/scripts/fetchsubidbyfid.php?fid='+filenm1,
                                                async:false,
						data: "html=",
                                                success: function(data){
                                                  subjectId=data;  
                                                  
                                                  
                                                  $.ajax({

                                type: 'POST',

                                async:false,

                                url: base_url+ 'students/scripts/getSubjectName.php?chrome_ext=yes&format='+section,

                                data: "html=&sub="+subjectId,

                                success: function(data){
                                if(data != "")
                                {
                                    
                                    $("#filenamesFL1").remove();
                                    $("#saveAsFileDiv #popup_prompt").after('<div id="filenamesFL1">'+data+'</div>');
                                    if(typeof selectedSubject != "undefined" && selectedSubject!="")
                                                            {
                                                                $("#saveAsFileDiv #popup_prompt").val(selectedSubject);
                                                            }
                                                            var $unique = $('#sbName');

                                    $unique.change(function() {
                                    loadFileDiv1(this.value,'saveAsFileDiv');
                                    $("#saveAsFileDiv #popup_prompt").val(this.value);
                                        });
                                }
                                
                                $.ajax({
                                type: 'POST',
                                async:false,    
                                url: base_url+ 'students/scripts/getFileNameNew.php?div_id=saveAsFileDiv&format='+section+'&sub_name='+selectedSubject,
                                data: "html=&fl="+flNm,
                                success: function(data){  
                                    $("#saveAsFileDiv").show();
                                    $("#fileListDiv").hide();
                                if(data != "")
                                {
                                    $("#saveAsFileDiv #fileNameDiv").html(data);  

                                    $("#saveAsFileDiv #popup_prompt_file").val(flNm);

                                }						

                        }

                        });



                        }

                        });
                                                  
                                                }
                });
		

	}	

	else

	{jAlertMod("Click the checkbox alongside citations before using Save As functionality.","Alert","&nbsp;OK&nbsp;",null);}

}

function loadFileDiv(subjectName,divId)
{
    var section = 'HARVARD';
    $.ajax({

            type: 'POST',
            async: false,
            url: base_url+ 'students/scripts/getFileNameNew.php?div_id='+divId+'&sub_name='+subjectName+'&format='+section,

            data: "html=ht",

            success: function(data){
                $("#"+divId+" #fileNameDiv").html(data);
            }
    });
}

function loadFileDiv1(subjectName,divId)
{
   var section = 'HARVARD';
     var flNm='';
     flNm=$("#fileListDiv .opencitationbody:checked").val();
    $.ajax({

            type: 'POST',
            async: false,
            url: base_url+ 'students/scripts/getFileNameNew.php?div_id='+divId+'&sub_name='+subjectName+'&format='+section,

            data: "html=ht&fl="+flNm,

            success: function(data){
                $("#"+divId+" #fileNameDiv").html(data);
               
                $("#"+divId+" #popup_prompt_file").val(flNm);
            }
    });
}

function saveDuplicateCitation2()
{
    var notes=$("#saveAsFileDiv #popup_prompt_file").val();
    var filenm1='';
    var sub=$("#saveAsFileDiv #popup_prompt").val();
    filenm1=$("#fileListDiv .opencitationbody:checked").val();
    var section=getSectionName();
    if(notes!='')
        {
            
            
                var filId=$("#fileListDiv .opencitationbody:checked").attr('name');
                showLdr('saveAsFileDiv');
		$.ajax({

						type: 'POST',

						url: base_url+ 'students/scripts/savedatabase.php?formatHL='+section+'&sub_name='+sub,

						data: "html=GROUP&notes="+notes+"&save=append&fileid="+filId,

						success: function(data){

							//alert(data);

							if(data == 'cannot save more citations'){

								jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);

							}else if(data == '1' || data == '11'){

							//jAlertMod("Citations saved successfully.","Success","&nbsp;OK&nbsp;",null);
                                                        var flId=fetchFileId(base_url+ 'students/scripts/fetchfileid.php?formatHL='+section+'&sub_name='+sub,notes);

                                                                    if(typeof flId !='undefined' && flId!='0')
                                                                        {
                                                                            
                                                                            OpenCitations1("",flId);
                                                                        }
                                                                        //else
                                                                          //  {
                                                                                showAllDatabase(true);
                                                                            //}
                                                        
                                                        //backToFlList();
                                                                
							}else if(data == 'cannot save more files'){

								jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);

							}									

						}



					});

				

				
        }
        else
            {
                jAlertMod("Please enter file name.","Alert","&nbsp;OK&nbsp;",null);
            }
            return false;
}


function saveSubFile()
{
    var section=getSectionName();
    var content="";
    var content1;
    $('.previewcitation').html(getText('bookPanel'));
    content1 = $('.previewcitation').html();
		
		//$(par).children('input').attr('checked',true);
                var cont='';
                
                cont+=$("#txt1").html();
                cont+='~';
                cont+=$("#txt2").html();
                if(cont!='')
                    {
                       content1+='`'+cont; 
                    }
                    content1=content1.replace("^i^", "<i>");
		content1=content1.replace("^ii^", "</i>");
                content1=content1.replace(/\|/g, "###");
		content=content+content1+"|";
                
    //});
	content=$.trim(removeNewLine(content));

	content=content.replace(/&nbsp;/g," ");

	content=content.replace(/&amp;/g,"##");

	console.log(content);
        
                            var s_url='';
                            var r11=$("#saveFileDiv #popup_prompt").val();
                            if(typeof saveMyCiteBottom != "undefined" && saveMyCiteBottom==true)
                                {
                                    s_url='&mycitebottom=true';
                                }
                                var notes=$("#saveFileDiv #popup_prompt_file").val();
                                if(notes=='')
                                {
                                    notes='Default_Citations';
                                }
                                showLdr('saveFileDiv');
                                
                                $.ajax({
                                        type: 'POST',

                                        url: base_url+ 'students/scripts/savesubjectfile.php?formatHL='+section+'&sub_name='+r11,

                                        data: "html="+encodeURIComponent(content)+"&notes="+notes+"&save=append"+s_url,

                                        success: function(data){
                                                //alert(data);
                                                data=data.replace('\r\n','');
                                                if(data == 'cannot save more citations')
                                                {
                                                        jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);
                                                }
                                                else{
                                                        if(data == '1')
                                                        {
                                                                

                                                        }
                                                        else{ 
                                                                if(data == 'cannot save more files')
                                                                {
                                                                        jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);
                                                                }
                                                        }
                                                        
                                                        $("#saveFileDiv").hide();
                                                        var flId=fetchFileId(base_url+ 'students/scripts/fetchfileid.php?formatHL='+section+'&sub_name='+r11,notes);
                                                        if(typeof flId !='undefined' && flId!='0')
                                                        {
                                                            OpenCitations1("",flId)
                                                        }
                                                        //else
                                                        //{
                                                            showAllDatabase(true);
                                                        //}
                                                }
                                               
                                        }
                                });
                        return false;
}

function duplicateCitation(){



var n = $('#openedCitation .deletecitationbody:checked').length;


	  if(n>0){
              
        $("#openedCitation").hide();
        $("#saveAsCitDiv").show();
              var section=getSectionName();
                var subjectId=0;
                var citationId=$("#openedCitation .deletecitationbody:checked").attr('name');
                
                var filenm1='';
                var flNm='';
                $.ajax({
                                                    type: 'POST',

						url: base_url+ 'students/scripts/fetchfileidbycid.php?cid='+citationId,
                                                async:false,
						data: "html=",
                                                success: function(data){
                                                  var arr=data.split("`");  
                                                  filenm1=arr[0];
                                                  flNm=arr[1];
                                                  $.ajax({
                                                    type: 'POST',

						url: base_url+ 'students/scripts/fetchsubidbyfid.php?fid='+filenm1,
                                                async:false,
						data: "html=",
                                                success: function(data){
                                                  subjectId=data;  
                                                  $.ajax({

                                type: 'POST',

                                async:false,

                                url: base_url+ 'students/scripts/getSubjectName.php?chrome_ext=yes&format='+section,

                                data: "html=&sub="+subjectId,

                                success: function(data){
                                if(data != "")
                                {
                                    $("#saveAsCitDiv #filenamessd").remove();
                                    $("#saveAsCitDiv #popup_prompt").after('<div id="filenamessd">'+data+'</div>');
                                    var $unique = $('#sbName');

                                    $unique.change(function() {
                                    loadFileDiv1(this.value,'saveAsCitDiv');
                                    $("#saveAsCitDiv #popup_prompt").val(this.value);
                                        });
                                    if(typeof selectedSubject != "undefined" && selectedSubject!="")
                                                            {
                                                                $("#saveAsCitDiv #popup_prompt").val(selectedSubject);
                                                            }
                                }
                                
                                $.ajax({
                                type: 'POST',
                                async:false,    
                                url: base_url+ 'students/scripts/getFileNameNew.php?div_id=saveAsCitDiv&format='+section+'&sub_name='+selectedSubject,
                                data: "html=&fl="+flNm,
                                success: function(data){                                                                
                                if(data != "")
                                {
                                    $("#saveAsCitDiv #fileNameDiv").html(data);  

                                    $("#saveAsCitDiv #popup_prompt_file").val(flNm);

                                }						

                        }

                        });



                        }

                        });
                                                }
                                                });
                                                  
                                                }
                });
                
		

	}	

	else

	{jAlertMod("Click the checkbox alongside citations before using Save As functionality.","Alert","&nbsp;OK&nbsp;",null);}


}

function saveDuplicateCitation()
{
    var notes=$("#saveAsCitDiv #popup_prompt_file").val();
    var filenm1='';
    var sub=$("#saveAsCitDiv #popup_prompt").val();
    filenm1=$("#saveAsCitDiv .opencitationbody:checked").val();
    var section=getSectionName();
    if(notes!='')
        {
            var n = $('#openedCitation .deletecitationbody:checked').length;
            
                 if(n>0)

	{

	  var content="";
          var fileIds='';
	  $('#openedCitation .deletecitationbody:checked').each(function(index)

        {

		
                if(fileIds!='')
                    {
                        fileIds+=',';
                    }
                    fileIds+=$(this).attr('name');

	    });
		//alert(content);
                showLdr('saveAsCitDiv');
		$.ajax({

						type: 'POST',

						url: base_url+ 'students/scripts/savedatabase.php?formatHL='+section+'&sub_name='+sub,

						data: "html=fnids&ids="+fileIds+"&notes="+notes+"&save=append",

						success: function(data){

							//alert(data);
                                                        console.log(data);
							if(data == 'cannot save more citations'){

								jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);

							}else if(data == '1' || data == '11'){

							//jAlertMod("Citations saved successfully.","Success","&nbsp;OK&nbsp;",null);
                                                        var flId=fetchFileId(base_url+ 'students/scripts/fetchfileid.php?formatHL='+section+'&sub_name='+sub,notes);
                                                        if(typeof flId !='undefined' && flId!='0')
                                                        {
                                                            OpenCitations1("",flId)
                                                        }
                                                        //else
                                                        //{
                                                            showAllDatabase(true);
                                                        //}
                                                           
                                                                
							}else if(data == 'cannot save more files'){

								jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);

							}
                                                        

						}



					});

	}


				
        }
        else
            {
                jAlertMod("Please enter file name.","Alert","&nbsp;OK&nbsp;",null);
            }
            return false;
}



function saveFileindb()
{
    var content="";
    var content1;
    $('.previewcitation').html(getText('bookPanel'));
    content1 = $('.previewcitation').html();
		content1=content1.replace("^i^", "<i>");
		content1=content1.replace("^ii^", "</i>");
                content1=content1.replace(/\|/g, "###");
		//$(par).children('input').attr('checked',true);
		content=content+content1+"|";
                
    //});
	content=$.trim(removeNewLine(content));

	content=content.replace(/&nbsp;/g," ");

	content=content.replace(/&amp;/g,"##");
        
        
        
        notes=document.getElementById('popup_prompt').value;

					//alert(r1);
                                        var s_url='';
                                        if(typeof saveMyCiteBottom != "undefined" && saveMyCiteBottom==true)
                                            {
                                                s_url='&mycitebottom=true';
                                            }

					$.ajax({

						type: 'GET',

						url: base_url+ 'students/scripts/savedatabase.php?formatHL='+section,

						data: "html="+encodeURIComponent(content)+"&notes="+notes+"&save=append"+s_url,

						success: function(data){
							data=data.replace('\r\n','');
							if(data == 'cannot save more citations')
							{
								jAlertMod("Storage Full. Please delete unwanted citations before saving Or save to a new list.","Failure","&nbsp;OK&nbsp;",null);
							}
							else{
								if(data == '1')
								{//do nothing
									//alert();
									/*if(document.getElementById(r1)){
									  if($("[id='"+r1+"']").attr('checked',true))
									  	OpenCitations();
									}else{
									  fireAjaxRequest('students/scripts/showAlldatabase.php','','formatHL='+section+'&format='+section,'c8Content','','SF');
									}*/
                                                            showflsaveoption();
                                                            jAlertMod("Citation saved successfully.","Alert","&nbsp;OK&nbsp;",null);
									
								}
								else{ 
									if(data == 'cannot save more files')
									{
										jAlertMod("You have exceed your storage capacity. Please delete unwanted files.","Failure","&nbsp;OK&nbsp;",null);
									}else{
										//alert();
									 var filename = $("#c8Content").find("div").find("p").find('span').text();
									 if(filename!='' && filename==r1){
    									var fid = $("#c8Content").find("div").find("p").find('span').attr("id");
										fireAjaxRequest("students/scripts/showAlldatabase2.php","","fileid="+fid,"c8Content","")
									 }else if(filename!=''){ 
											fireAjaxRequest('students/scripts/showAlldatabase.php','','formatHL='+section+'&format='+section,'c8Content','','SF');										 
											//$("#"+r1).attr('checked',true);
											//setTimeout("$('#'+r1).attr('checked',true)", 1000)
											//setTimeout('OpenCitations()', 1000);
											//return false;
											//alert(11);
									 }else{
											$("[id='"+r1+"']").attr('checked',true);
											OpenCitations();
									 }
									}
								}
							}
								if(document.istablet){
										tabcontent('database');
								}
						}
					});
        
        
        
}

function getFormNameGlobal()
{
    var ActiveMenu = $('#currentPage').text();
    var ActiveMenu = ActiveMenu.split('/');
    if(ActiveMenu.length>2)
    {
        var menuActive = $.trim(ActiveMenu[2]).toLowerCase();
        return menuActive;
    }
    return '';
}

function getCurStyl()
{
    var ActiveMenu = $('#currentPage').text();
	var ActiveMenu = ActiveMenu.split('/');
	var menuActive = $.trim(ActiveMenu[0]).toLowerCase();
	//var submenuActive = $.trim(ActiveMenu[2]).toLowerCase();
        if(menuActive.indexOf('japa')>=0)
            menuActive='japa';
        else if(menuActive.indexOf('jagps')>=0)
            menuActive='jagps';
        return menuActive;
}

function showPreviewChk(){
    if(document.getElementById('previewChkDiv'))
                  {
                        if($("#bookPanel").text().trim()!='')
                            {
                                $("#previewChkDiv").html('<input type="checkbox" id="previewChk" />&nbsp;');
                                $('#previewChkDiv').css('display','inline-block');
                                $('#bookPanel').css('display','inline-block');

                            }
                            else
                                {
                                    $('#previewChkDiv').css('display','none');
                                    $("#previewChkDiv").html('');

                                }
                  }
}

function isAllAuthorsBlank()
{
    var author;
    if(document.getElementById('author'))
    {
        author=document.getElementById('author').value.trim();
        if(author!='')
            return false;
    }
    var i;
    for(i=2;i<=10;++i)
    {
        if(document.getElementById('author'+i))
        {
            author=document.getElementById('author'+i).value.trim();
            if(author!='')
                return false;
        }
    }
    return true;
}


function isAllEditorsBlank()
{
    var editor;
    if(document.getElementById('editor'))
    {
        editor=document.getElementById('editor').value.trim();
        if(editor!='')
            return false;
    }
    var i;
    for(i=2;i<=10;++i)
    {
        if(document.getElementById('editor'+i))
        {
            editor=document.getElementById('editor'+i).value.trim();
            if(editor!='')
                return false;
        }
    }
    return true;
}

function isChapterBlank()
{
    var chapter;
    if(document.getElementById('chapter'))
    {
        chapter=document.getElementById('chapter').value.trim();
        if(chapter!='')
            return false;
    }
  
    return true;
}

function isTitleBlank()
{
    var title;
    if(document.getElementById('title'))
    {
        title=document.getElementById('title').value.trim();
        if(title!='')
            return false;
    }
  
    return true;
}


function reprocessEditorChapterTitle()
{
    
    if(document.getElementById('title') || document.getElementById('chapter') || document.getElementById('editor'))
    {
        
        if((document.getElementById('title') && $("#title").val().trim()!='') || (document.getElementById('chapter') && $("#chapter").val().trim()!='') || (document.getElementById('editor') && $("#editor").val().trim()!=''))
        {
            
            var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var disp=el.style.display;
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='' && (cmBtnId=='title' || cmBtnId=='chapter' || cmBtnId=='editor' || (patt11.test(cmBtnId)==true && disp!='none')))
                        {
                            eval($("#"+cmBtnId).data("keyup"));                            
                        }
                    }
                }
    }
}

function reprocessChapterTitle()
{
    if(document.getElementById('title') || document.getElementById('chapter'))
    {
        if((document.getElementById('title') && $("#title").val().trim()!='') || (document.getElementById('chapter') && $("#chapter").val().trim()!=''))
        {
            var arr = document.forms["publication"].elements;
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='' && (cmBtnId=='title' || cmBtnId=='chapter'))
                        {
                            eval($("#"+cmBtnId).data("keyup"));                            
                        }
                    }
                }
    }
}
function reprocessTitle()
{
    if(document.getElementById('title'))
    {
        if($("#title").val().trim()!='')
        {
            var arr = document.forms["publication"].elements;
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='' && cmBtnId=='title')
                        {
                            eval($("#"+cmBtnId).data("keyup"));                            
                        }
                    }
                }
    }
}

function reprocessTitleEditor()
{
    if(document.getElementById('title') || document.getElementById('editor'))
    {
        if((document.getElementById('title') && $("#title").val().trim()!='') || (document.getElementById('editor') && $("#editor").val().trim()!=''))
        {
            var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='' && (cmBtnId=='title' || cmBtnId=='editor' || patt11.test(cmBtnId)==true))
                        {
                            eval($("#"+cmBtnId).data("keyup"));                            
                        }
                    }
                }
    }
}


function reprocessEditor()
{
    if(document.getElementById('editor'))
    {
        if((document.getElementById('editor') && $("#editor").val().trim()!=''))
        {
            var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='' && (cmBtnId=='editor' || patt11.test(cmBtnId)==true))
                        {
                            eval($("#"+cmBtnId).data("keyup"));                            
                        }
                    }
                }
    }
}

var dtCh= "/";
var minYear=1700;
var maxYear=2100;

function DaysArray(n) {
    for (var i = 1; i <= n; i++) {
        this[i] = 31
        if (i==4 || i==6 || i==9 || i==11) {
            this[i] = 30
        }
        if (i==2) {
            this[i] = 29
        }
    }
    return this
}

function isDateMMDDYYYY(dtStr)
{
    var daysInMonth = DaysArray(12)
    var pos1=dtStr.indexOf(dtCh)
    var pos2=dtStr.indexOf(dtCh,pos1+1)
    var strDay=dtStr.substring(0,pos1)
    var strMonth=dtStr.substring(pos1+1,pos2)
    var strYear=dtStr.substring(pos2+1)

    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
    if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)


    if (pos1==-1 || pos2==-1){
        //alert("The date format should be : mm/dd/yyyy")
        return false
    }
    if (strMonth.length<1 || strMonth<1 || strMonth>12){
        //alert("Please enter a valid month")
        return false
    }
    if (strDay.length<1 || strDay<1 || strDay>31 || (strMonth==2 && strDay>daysInFebruary(strYear)) || strDay > daysInMonth[strMonth]){
        //alert("Please enter a valid day")
        return false
    }
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear){
        //alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
        return false
    }
    if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
        //alert("Please enter a valid date")
        return false
    }
    return true
}

function isDateDDMonthYYYY(dtStr)
{
    var pos1=dtStr.indexOf(" ")
    var pos2=dtStr.indexOf(" ",pos1+1)
    var strDay=dtStr.substring(0,pos1)
    var strMonth=dtStr.substring(pos1+1,pos2).toLowerCase()
    var strYear=dtStr.substring(pos2+1)

    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)

    if (pos1==-1 || pos2==-1)
    {
        return false;
    }

    var months_obj = new Array("jan","feb","mar","apr","may","jun",
        "jul","aug","sep","sept","oct","nov","dec","january","february","march",
        "april","june","july","august","september","october","november","december");

    var isMonth = false;
    for(var j=0; j<months_obj.length;j++)
    {
        if(months_obj[j]==strMonth)
        {
            isMonth = true;
        }
    }
    if(!isMonth)
        return false;

    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function isDateMonthDDYYYY(dtStr)
{
    var pos1=dtStr.indexOf(" ")
    var pos2=dtStr.indexOf(" ",pos1+1)
    var strMonth=dtStr.substring(0,pos1).toLowerCase()
    var strDay=dtStr.substring(pos1+1,pos2)
    var strYear=dtStr.substring(pos2+1)

    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)

    if (pos1==-1 || pos2==-1)
    {
        return false
    }

    var months_obj = new Array("jan","feb","mar","apr","may","jun",
        "jul","aug","sep","sept","oct","nov","dec","january","february","march",
        "april","june","july","august","september","october","november","december");

    var isMonth = false;
    for(var j=0; j<months_obj.length;j++)
    {
        if(months_obj[j]==strMonth)
        {
            isMonth = true;
        }
    }
    if(!isMonth)
        return false;
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function isDateYYYY(dtStr)
{
    var strYear =dtStr
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function isDateMonthYYYY(dtStr)
{
    var pos1=dtStr.indexOf(" ");
    if (pos1==-1)
    {
        if(dtStr.indexOf(",")==-1)
            return false;
        else
            pos1=dtStr.indexOf(",");
    }

    var strMonth=dtStr.substring(0,pos1);
    if(strMonth.charAt(strMonth.length-1)==",")
    {
        strMonth = strMonth.substring(0, strMonth.length-1);
    }

//    if (pos1==-1)
//    {
//        return false;
//    }

    var months_obj = new Array("jan","feb","mar","apr","may","jun",
        "jul","aug","sep","sept","oct","nov","dec","january","february","march",
        "april","june","july","august","september","october","november","december");

    var isMonth = false;
    for(var j=0; j<months_obj.length;j++)
    {
        if(months_obj[j]==strMonth)
        {
            isMonth = true;
        }
    }
    if(!isMonth)
        return false;

    var strYear=dtStr.substring(pos1+1);
//    if(strYear.charAt(strYear.length-1)==",")
//    {
//        strYear = strYear.substring(0, strYear.length-1);
//    }
//
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function isDateYYYYMonth(dtStr)
{
    var pos1=dtStr.indexOf(" ");
    if (pos1==-1)
    {
        if(dtStr.indexOf(",")==-1)
            return false;
        else
            pos1=dtStr.indexOf(",");
    }

    var strYear=dtStr.substring(0,pos1);
    if(strYear.charAt(strYear.length-1)==",")
    {
        strYear = strYear.substring(0, strYear.length-1);
    }

    var strMonth=dtStr.substring(pos1+1);

    if (pos1==-1)
    {
        return false;
    }

    var months_obj = new Array("jan","feb","mar","apr","may","jun",
        "jul","aug","sep","sept","oct","nov","dec","january","february","march",
        "april","june","july","august","september","october","november","december");

    var isMonth = false;
    for(var j=0; j<months_obj.length;j++)
    {
        if(months_obj[j]==strMonth || strMonth==toTitleCase(months_obj[j]))
        {
            isMonth = true;
        }
    }
    if(!isMonth)
        return false;

    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function isDateYYYYMonthDD(dtStr)
{
    var pos1=dtStr.indexOf(" ")
    var pos2=dtStr.indexOf(" ",pos1+1)
    var strYear=dtStr.substring(0,pos1);
    var strMonth=dtStr.substring(pos1+1,pos2).toLowerCase();
    var strDay=dtStr.substring(pos2+1);
	
	strYear = strYear.replace(',','');
	
    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)

    if (pos1==-1 || pos2==-1)
    {
        return false
    }

    var months_obj = new Array("jan","feb","mar","apr","may","jun",
        "jul","aug","sep","sept","oct","nov","dec","january","february","march",
        "april","june","july","august","september","october","november","december");

    var isMonth = false;
    for(var j=0; j<months_obj.length;j++)
    {
        if(months_obj[j]==strMonth)
        {
            isMonth = true;
        }
    }
    if(!isMonth)
        return false;
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        return false
    }
    return true
}

function isDateDDMMYYYY(dtStr)
{
    var daysInMonth = DaysArray(12)
    var pos1=dtStr.indexOf(dtCh)
    var pos2=dtStr.indexOf(dtCh,pos1+1)
    var strMonth=dtStr.substring(0,pos1)
    var strDay=dtStr.substring(pos1+1,pos2)
    var strYear=dtStr.substring(pos2+1)

    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
    if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)

    if (pos1==-1 || pos2==-1)
    {
        //alert("The date format should be : mm/dd/yyyy")
        return false
    }
    if (strMonth.length<1 || strMonth<1 || strMonth>12)
    {
        //alert("Please enter a valid month")
        return false
    }
    if (strDay.length<1 || strDay<1 || strDay>31 || (strMonth==2 && strDay > daysInFebruary(strYear)) || strDay > daysInMonth[strMonth]){
        //alert("Please enter a valid day")
        return false
    }
    if (strYear.length != 4 || strYear==0 || strYear<minYear || strYear>maxYear)
    {
        //alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
        return false
    }
    if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false)
    {
        //alert("Please enter a valid date")
        return false
    }
    return true
}

function IntextTextDiv(textName,divName,other){
   var secName=getSectionName();
   
   if(secName=="agps" || secName=="apa" || secName=="apa_ib")
   {
        var doNothingFlag=false;
        inTextOnly=true;
      if(document.getElementById(textName).value.trim()=="")
          doNothingFlag=true;
       if(doNothingFlag==false)
       {
                        var globalAlertFlg=getGlobalLS('stopAlertFlag');
                        if(!document.intextonly && globalAlertFlg!="set"){
                         jAlertMod("Page number(s) will appear for in-text citation only.\n\
                 \n\
                 <center><input type=\"checkbox\" onclick=\"setAlertFlag(this)\" id=\"stopAlertCheck\" /> Do not show this alert again.</center>","Alert","&nbsp;OK&nbsp;",function(){
                                         $("#"+textName).focus();
                                         document.intextonly = true;
                                         if(stopAlertFlag==true)
                                         {
                                             setGlobalLS('stopAlertFlag','set');
                                         }
                                 });
                         }
        }
   }
   else
   {
	if(!document.intextonly){
	jAlertMod("Page number(s) will appear for in-text citation only.","Alert","&nbsp;OK&nbsp;",function(){
			$("#"+textName).focus();
			document.intextonly = true;
		});
	}
    }
	setInText(textName,divName,other);
}

function setGlobalLS(item,val)
{
    
                localStorage.setItem(item, val);
}

function getGlobalLS(itm)
{
    return localStorage.getItem(itm); 
}

function showLdr(id,hideFlg)
{
    if(typeof hideFlg == "undefined")
        {
            var hideFlg=true;
        }
    if(hideFlg==true)
    {
        $("#"+id).hide();
    }
    $("#"+id).after('<div id="loadingDiv" style="height:150px;width:150px;text-align:center;margin: 0 auto;"><img id="loading-image" style="width:100%" src="'+base_url+'images/page-loader.gif"/></div>');
}

function hideLdr(id,hideFlg)
{
    if(typeof hideFlg == "undefined")
        {
            var hideFlg=true;
        }
    if(hideFlg==true)
    {
        $("#"+id).show();
    }
    $("#loadingDiv").remove();
}

function OpenCitations1(which,fileid){
        if(fileid!="") {
            $("#saveCitationFileBtn").hide();
    $("#backBtn").show();
    showSavedCitations(fileid);
        }
	
}

function fetchFileId(url,notes)
{
    var fileId=0;
    $.ajax({

            type: 'POST',
            async: false,
            url: url,

            data: "fl_name="+notes,

            success: function(data){
                fileId=data;
            }
    });
    return fileId;
}

function clearWcPanel()
{
    $('#main').html('');
    $('#HIDEVAR').html('');
    $('#HIDEVAL').html('');
    $('#HIDEIN').html('');
    $('#txtSearch1').val('');
    $('#txtSearch2').val('');
    $("select#drpSearch1").prop('selectedIndex', 0);
    $("select#drpSearch2").prop('selectedIndex', 2);
}

function copyIntext(){
    var n = $('.intxtChk:checked').length;
    if(n>0) {
            var content="";
            var s = window.getSelection();
s.removeAllRanges();
            $('.intxtChk:checked').parent().each(function(index){
                    content+="<div>"+$(this).children("span").html()+"</div>";

            });
            $("#myCopySpan").html(content);
            var element=document.getElementById("myCopySpan");
            var r = document.createRange();
r.selectNode(element);

s.addRange(r);
            document.execCommand('copy');
            s.removeAllRanges();
            $("#myCopySpan").html("");
            //executeCopy(content);
    }else{
                    if($('.intxtChk:checked').length <= 0){
                                    jAlertMod("<center>Click the checkbox alongside citations before using Copy.</center>","Alert","&nbsp;OK&nbsp;",null);
                    }
            
            return false;
    }
}

function submitLibForm()
{
    if($("#libForm #name").val()=="")
        {
            jAlertMod1('Please enter Your Name on this form',"Alert","&nbsp;OK&nbsp;",function(){
                $("#libForm #name").focus();
            });
            
        }        
        else if($("#libForm #role").val()=="")
        {
            jAlertMod1('Please enter Your Role on this form',"Alert","&nbsp;OK&nbsp;",function(){
                $("#libForm #role").focus();
            });
            
        }
        else if($("#libForm #institution").val()=="")
        {
            jAlertMod1('Please enter Your Institution on this form',"Alert","&nbsp;OK&nbsp;",function(){
                $("#libForm #institution").focus();
            });
            
        }
        else if($("#libForm #country").val()=="")
        {
            jAlertMod1('Please enter Your Country on this form',"Alert","&nbsp;OK&nbsp;",function(){
                $("#libForm #country").focus();
            });            
        }
        else if($("#libForm #email").val()=="")
        {
            jAlertMod1('Please enter your Email Address on this form',"Alert","&nbsp;OK&nbsp;",function(){
                $("#libForm #email").focus();
            });            
        }
        else
            {
                var name=$("#libForm #name").val();
                var role=$("#libForm #role").val();
                var institution=$("#libForm #institution").val();
                var institutiontype='';
                $('.institutiontype:checked').each(function(index)
		{		
			if(institutiontype!='')
                            {
                                institutiontype+=',';
                            }
                            institutiontype+=$(this).val();
		});
                var country=$("#libForm #country").val();
                var department=$("#libForm #department").val();
                var phone=$("#libForm #phone").val();
                var email=$("#libForm #email").val();
                var referencingstyle='';
                $('.referencingstyle:checked').each(function(index)
		{		
			if(referencingstyle!='')
                            {
                                referencingstyle+=',';
                            }
                            referencingstyle+=$(this).val();
		});
                var library_website=$("#libForm #library_website").val();
                var institute_website=$("#libForm #institute_website").val();
                var student_number=$("#libForm #student_number").val();
                $.ajax({
                        type: 'POST',
                        url: base_url+'contact_mail_ext.php' + '?ms=' + new Date().getTime(),
                        data: "name="+name+'&role='+role+'&institution='+institution+'&institutiontype='+institutiontype+'\
    &country='+country+'&department='+department+'&phone='+phone+'&email='+email+'&referencingstyle='+referencingstyle+'&library_website='+library_website+'\
&institute_website='+institute_website+'&student_number='+student_number,
                        success: function(data) {
                            jAlertMod1('Your enquiry has been sent. Thank you.',"Success","&nbsp;OK&nbsp;",null);
                            $('#libFormRst').trigger("click");
                        }
                    });
            }
}

function savePrevPanl1WordCat(srcPnlID , destPnlID, log,preval){
	preval = jQuery.trim(preval);
	sectionCat=getSectionName();
	var sortedArr = new Array();
	citationCount=0;
	$('#bookPanel').each(function(index){
           
		sortedArr[citationCount]= new Array(3);
		sortedArr[citationCount][1] = $(this).find('span').html();
		//if(sortedArr[citationCount][1] ==''){sortedArr[citationCount][1]=preval;} 
		sortedArr[citationCount][0] = $(this).text().trim();
		sortedArr[citationCount][2]=  "citation"+parseInt(citationCount+1);
		citationCount++;
	});
    var cnt=parseInt(sortedArr.length);
	sortedArr[cnt]= new Array(3);
	sortedArr[cnt][1] = getText(srcPnlID);
	if(sortedArr[cnt][1] == ''){
		sortedArr[cnt][1]=preval;
		sortedArr[cnt][0] = preval.trim();
	}else{
		sortedArr[cnt][1]=preval;//mi_19_04_2012
		sortedArr[cnt][0] = $("#"+srcPnlID).text().trim();
	}
	sortedArr[cnt][2]="citation"+sortedArr.length;
        var citationID=	"citation"+sortedArr.length;
        if(document.getElementById('curCitaId'))
            {
                $("#curCitaId").val(citationID);
            }
            else
                {
                    $("body").append('<input type="hidden" id="curCitaId" value="'+citationID+'" />');
                }
        
	citationCount++;
	sortedArr.multiSort(0);
        var checked='';
        if(typeof doCompleteSave != "undefined" && doCompleteSave==true)
            {
                checked='checked';
            }
	var temp = "";
	var nameArrays = new Array();
	var yrArrays = new Array();
        var idArrays=new Array();
	if(sectionCat=='mla'){
		for (i=0 ; i <= sortedArr.length - 1 ; i++){
			temp = temp + "<div class='citation previewcitation' id='"+ sortedArr[i][2] +"' ><input type='checkbox' class='deletecitation' id=ckb"+sortedArr[i][2] +" name='data"+sortedArr[i][2]+"'";
                if(checked=="checked" && "ckb"+sortedArr[i][2]=="ckbcitation"+sortedArr.length)
                {
                    temp+='checked';
                }        
                temp+="/><span id=data"+sortedArr[i][2] +">"+ sortedArr[i][1] +"</span></div>";
		}
	}else{
		for (i=0 ; i <= sortedArr.length - 1 ; i++){
			temp = temp + "<div class='citation previewcitation' id='"+ sortedArr[i][2] +"' ><input type='checkbox' class='deletecitation' id=ckb"+sortedArr[i][2] +" name='data"+sortedArr[i][2]+"'";
                        if(checked=="checked" && "ckb"+sortedArr[i][2]=="ckbcitation"+sortedArr.length)
                {
                    temp+='checked';
                }
                        temp+= "/><span id=data"+sortedArr[i][2] +">"+ sortedArr[i][1] +"</span></div>" ;
            
			/******* 20th may work for in-text panel ******/
			var testo = sortedArr[i][1].split(',');
			nameArrays[i] = testo[0];
			
			if(sectionCat=='agps')
			{
                            idArrays[i]=sortedArr[i][2];
				if(sortedArr[i][1].indexOf('n.d.') === -1)
				{
					if(sortedArr[i][1].indexOf('&nbsp;') === -1)
					{
						var streetaddress =sortedArr[i][1].split('http')[0];
						streetaddress=streetaddress.replace(' ','');
						var newstreetaddress='';
						for(k=0;k<streetaddress.length;k++)
						{
						  if(streetaddress[k]!=" ")
						  {
							if(isNaN(streetaddress[k]))
							{
								newstreetaddress=newstreetaddress+streetaddress[k];
							}

							else			  
							{
								break;
							}
						  }
						}
						var tempstr = newstreetaddress.split(',');
						var tempstrArr='';
						var r = 0;
						for(var q=0;q<tempstr.length-1;q++)
						{
							if(tempstr[q].length>3)
							{						
								tempstrArr+=tempstr[q]+', ';
								r++;
							}
						}
						nameArrays[i] = tempstrArr.slice(0,-2);
						checked = streetaddress.replace ( /[^\d.]/g, '' );
						yrArrays[i] = checked.split('.').join("");
						nameArrays[i] = nameArrays[i]+"@";
					}
					else
					{
						var newstr =  sortedArr[i][1].split('&nbsp;');
						//var tempyr = sortedArr[i][1].match(/\(([^)]+)\)/)[1]
						
						for(var q=0;q<newstr.length;q++)
						{
							newstr[q] = newstr[q].replace(',<i>','');
							newstr[q] = newstr[q].replace(',','');
							if(isNaN(newstr[q]))
							{}
							else
							{
								var tempyr = newstr[q];
							}
						}
						nameArrays[i] = newstr[0]+" manual "+tempyr+"@";
					}
				}
				else
				{
					var newstr =sortedArr[i][1].split('n.d.')[0];
					newstr = newstr.replace(/&nbsp;/g, '');
					newstr = newstr.split(',');
					nameArrays[i] = newstr[0].trim()+" n.d.@";
				}
			}
			else
			{
                            idArrays[i]=sortedArr[i][2];
				if(sortedArr[i][1].indexOf('n.d.') === -1)
				{
					
					if(sortedArr[i][1].indexOf('&nbsp;') === -1)
					{
						var str = sortedArr[i][1],
						pos = str.indexOf("(") + 1;
						yrArrays[i] = str.slice(pos, str.lastIndexOf(")"));
						nameArrays[i] = sortedArr[i][1].split('(')[0];
						tempstr = nameArrays[i].split(',');
						var tempstrArr='';
						var r = 0;
						for(var q=0;q<tempstr.length-1;q++)
						{	
                                                        //ignoring initials
							if(tempstr[q].length>3)
							{
								
								if(tempstr[q].indexOf('.') === -1)
								{ 
								  tempstrArr+=tempstr[q]+',';
									r++;
								}
								else
								{
									var tts1 = tempstr[q].split('&amp;')[1];
									if(typeof tts1 != "undefined" && tts1!="undefined" && tts1!='')
									{
										tempstrArr+='&amp; '+tts1+',';
										r++;
									}
                                                                        else
                                                                        {
                                                                            var tm=tempstr[q].replace(".","");
                                                                            tempstrArr+=' '+tm+'';
										r++;
                                                                        }
								}
							}
						}
						nameArrays[i] = tempstrArr.slice(0,-1);
						nameArrays[i] = nameArrays[i]+"@";
                                                
					}
					else
					{
						var newstr =  sortedArr[i][1].split('&nbsp;');
						var tempyr = sortedArr[i][1].match(/\(([^)]+)\)/)[1]
						nameArrays[i] = newstr[0]+" manual "+tempyr+"@";
					}
				}
				else
				{
					var newstr =sortedArr[i][1].split('n.d.')[0];
					newstr = newstr.replace(/&nbsp;/g, '');
					newstr = newstr.split(',');
					nameArrays[i] = newstr[0].trim()+" n.d.@";
				}
			}
			/****** //20th may work for in-text panel ********/
		}
		/******* 20th may work for in-text panel ******/
		
		for (i=0 ; i <= sortedArr.length - 1 ; i++){
		nameArrays=nameArrays.toString().replace("&amp;","$");
		}
		//alert(nameArrays);
		var s=0;
		var nOld = $('.intexts:checked').length;
		var totCount = parseInt(nOld) + parseInt(nameArrays.length);
		//nameArrays=nameArrays+"@";
		nameArrays1=nameArrays.toString().replace("&amp;","$"); 
		nameArrays=nameArrays1.toString().replace("&amp;","$"); 
		whichsite = '';
		
                var cid=$("#curCitaId").val();
		$.ajax({ 
			type: "POST",   
			url: base_url+"ajax.php",   
			data: "type=apisetsession&namearr="+nameArrays+"&chrome_ext=yes&cid="+cid+"&idarr="+idArrays+"&yrarr="+yrArrays+"&style="+sectionCat+"&whichsite="+whichsite,
			success: function(data){
				var arr=data.split('`');
                                
                                $('#in_radio1').html('<input type="checkbox" name="radio1" id="radio1" class="intxtChk" checked="checked" />&nbsp;<span id="txt1">'+arr[0]+'</span>');
                                $('#in_radio2').html('<input type="checkbox" name="radio2" id="radio2" class="intxtChk" checked="checked"/>&nbsp;<span id="txt2">'+arr[1]+'</span>');	
			}
		});	
		
		
		/****** //20th may work for in-text panel ********/
		
	}
	
}

function GetIntext(){
	var section =getSectionName();	
	
		var whichsite = '';
	

	$.ajax({ 
			type: "POST",   
			url: base_url+"ajax.php",   
			data: "type=getintextsession&style="+section+"&site="+whichsite,
                        async: false,
			success: function(data){
				//alert(data);
				if(data == ''){
					//$('#navid').addClass('inline30');
				}else{
					//$('#navid').removeClass('inline30');
				}
                            $('#intext_content').html(data);
                                
			}
		});				
}

function openTabletSite(url) {
                         CM_openNewWindow(490,700,false,false,false,false,true,true,'OpenTablet',url);                                
			} 
                        
function CM_openNewWindow(w,h,nav,loc,sts,menu,scroll,resize,name,url){//v1.0
	scroll = true;
	var windowProperties=''; 
	
	if(nav==false) 
		windowProperties+='toolbar=no,';
	else
		windowProperties+='toolbar=yes,'; 

	if(loc==false)
		windowProperties+='location=no,'; 
	else 
		windowProperties+='location=yes,'; 

	if(sts==false)
		windowProperties+='status=no,';
	else 
		windowProperties+='status=yes,'; 

	if(menu==false)
		windowProperties+='menubar=no,';
	else 
		windowProperties+='menubar=yes,'; 

	if(scroll==false)
		windowProperties+='scrollbars=no,';
	else 
		windowProperties+='scrollbars=yes,'; 

	if(resize==false)
		windowProperties+='resizable=no,';
	else 
		windowProperties+='resizable=yes,'; 

	if(w!="")
	windowProperties+='width='+(w)+',';

	if(h!="") 
	windowProperties+='height='+(h); 


	if(windowProperties!="") { 
	
	if( windowProperties.charAt(windowProperties.length-1)==',') 
		windowProperties=windowProperties.substring(0,windowProperties.length-1);
	}

	window1 = window.open(url,name,windowProperties);
	//MI_23_04_2012
	if(is_chrome || is_safari){
		setTimeout(function(){
								 window1.moveTo(705,200);	
								 window1.focus();
							},100);
	
	}else{
		window1.moveTo(705,200);
	}
	
	//End MI
	if (window1)
	{
	window1.focus();
	}
}

function chkYear()
{
    var txtVal = document.getElementById('year').value;
	var numberValid=false;
	var no ='';
	txtVal = txtVal.trim();

    if(txtVal!="")
    {
        if(txtVal=='n.d.' || txtVal=='n.d' || txtVal=='nd.' || txtVal=='nd')
            {
                numberValid=true;
            }
            else
                {
		if(txtVal.indexOf(' ') <0 ) {
			
			if (txtVal.charAt(txtVal.length-1)=='a' || txtVal.charAt(txtVal.length-1)=='b' || txtVal.charAt(txtVal.length-1)=='c') 
				{
				no = parseInt(txtVal.substring(0,txtVal.length-1));
				str = "c.";
				if(no!="Nan" && no>1000 && no<3000)
				 {
					numberValid=true;
				}
			}
			else {
			no = parseInt(txtVal.substring(0,txtVal.length));
				str = "c.";
				if(no!="Nan" && no>1000 && no<3000)
				 {
					numberValid=true;
				}
			}

		}
		

		if(txtVal.indexOf(' ') >0) {
			if(txtVal.indexOf('.') <0) {
				txtVal = txtVal.replace(' ','. ');
			}
			var arr = txtVal.split('. ');
			var str = arr[0];
			no=parseInt(arr[1]);
		
				if((str == 'C' || str == 'c' || str == 'Ca' || str == 'ca' || str == 'Circa' ||str == 'circa' || str == 'C.' || str == 'c.' || str == 'Ca.' || str == 'ca.' || str == 'Circa.' ||str == 'circa.'))
			{
				if(no!="Nan" &&  no>1000 && no<3000)
				 { numberValid=true;
				}
			} 
		}

                if(!numberValid)
                     {
				jAlertMod("Enter a valid Year format. E.g. 2010 or 2010a","Alert","&nbsp;OK&nbsp;",null);
                document.getElementById("CiteYear").innerHTML = "";
				document.getElementById('year').focus();
                setTimeout('setFocus("year")',10);

            }
                }

	}
}

function reformBothAuEd(id)
{
    var patt11a = new RegExp(/^[author]+[2-9]$/);
    var patt11e = new RegExp(/^[editor]+[2-9]$/);
    
    if (patt11a.test(id)==true || id=="author") {
        if(id=="author")
            {
                reformAuth(0);
            }
            else
                {
                    reformAuth(fetchAuthNo(id));
                }
    }
    else if(patt11e.test(id)==true || id=="editor") {
        if(id=="editor")
            {
                reformEdi(0);
            }
            else
                {
                    reformEdi(fetchEdNo(id));
                }
    }
}

function reformAuth(au)
{
    if(typeof au != "undefined" && au!='' && au>0)
    {
        var section =getSectionName();	
        document.getElementById('CiteCommaA'+au).innerHTML="";
        document.getElementById('CiteAndA'+au).innerHTML="";
        if(au>2)
        {
            document.getElementById('CiteCommaA'+(au-1)).innerHTML=", ";
            if(section=="apa" || section=="agps")
                document.getElementById('CiteAndA'+(au-1)).innerHTML="& ";
            else
                document.getElementById('CiteAndA'+(au-1)).innerHTML="and ";
        }
    }
}

function reformEdi(ed)
{
    var section =getSectionName();
    if(typeof ed != "undefined" && ed!='' && ed>0)
    {
        	
        document.getElementById('CiteCommaE'+ed).innerHTML="";
        document.getElementById('CiteAndE'+ed).innerHTML="";
        if(ed>2)
        {
            document.getElementById('CiteCommaE'+(ed-1)).innerHTML=", ";
            if(section=="apa" || section=="agps")
                document.getElementById('CiteAndE'+(ed-1)).innerHTML="& ";
            else
                document.getElementById('CiteAndE'+(ed-1)).innerHTML="and ";
        }
    }
    
    var firstFieldId=$(".cssform input:text").first().attr('id');
    if(firstFieldId=='author' && section!="mla8")
    {
        if(isAllAuthorsBlank()==true)
        {
            reformatEditor();

        }
    }
                                                
}


function fetchEdNo(id)
{
    var patt11 = new RegExp(/^[editor]+[2-9]$/);
    var idn=0;
    if (patt11.test(id)==true) {
        idn=id.substring(6,id.length);
    }
    return idn;
}

function fetchAuthNo(id)
{
    var patt11 = new RegExp(/^[author]+[2-9]$/);
    var idn=0;
    if (patt11.test(id)==true) {
        idn=id.substring(6,id.length);
    }
    return idn;
}

function editWCSearch()
{
    HIDEIN = $('#HIDEIN').html();
		var nwc = $('#chkResultsWCS:checked').length;
		if(nwc==0 && HIDEIN=='WORLDCAT'){
			//$("#worldcatMsg").html('Click Citation to proceed with your request');
                        jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
		}else{
                    //$("#style-worldcat").prop('checked', false);
                    $("#worldcat-searchdiv").hide();
                    citeCurrentPage('book',true,true);
                    
                }
}

function autofilWCSearch()
{
    var jsn=$("#chkResultsWCS:checked").data('json');
    var authorFlag=false;
    if(typeof jsn.author != "undefined")
        {
            var i;
            
            for(i=0;i<jsn.author.length;++i)
                {
                    authorFlag=true;
                    if(i==0)
                        {
                            $("#author").val(jsn.author[i]);
                            ReloadTextDiv2('author','CiteAuthor');
                        }
                        else if(document.getElementById('authorSec'))
                            {
                                var placeHolder='author';
                                if($("#author").data('plc')!='undefined' && $("#author").data('plc')!='')
                                    {
                                        placeHolder=$("#author").data('plc');
                                    }
                                if(i>=50) //check main site common.js value is different for each style
                                {
                                    document.wcAuthorExFlg=true;
                                }
                                addNewAuthor('authorSec','bookPanel',2,placeHolder);
                                
                                var cnt=i+1;
                                if(i>=50) //check main site common.js value is different for each style
                                {
                                    i=jsn.author.length-1;
                                }
                                
                                $("#author"+cnt).val(jsn.author[i]);
                                ReloadTextDiv2('author'+cnt,'CiteAuthor'+cnt);
                            }
                            
                }
                
                $(".extraAuth").keyup(function(){
                    ReloadTextDiv2($(this).attr('id'),$(this).data('div'));
                });
        }
        if(typeof jsn.year != "undefined")
            {
                 if(document.getElementById('year'))
                     $("#year").val(jsn.year);
                else if(document.getElementById('date'))
                    $("#date").val(jsn.year);
                if(jsn.year!='')
                    $("#dateAlert").hide();
            }
            else
                {
                    if(document.getElementById('year'))
                        $("#year").val('n.d.');
                    else if(document.getElementById('date'))
                        $("#date").val('n.d.');
                }
            
            var plcFlg=false;
            var pubFlg=false;
        if(typeof jsn.title != "undefined")
            {
                if(document.getElementById('chapter'))
                    $("#chapter").val(jsn.title);
                else
                   $("#title").val(jsn.title);
            }
            if(typeof jsn.place != "undefined")
            {
                $("#place").val(jsn.place);
                plcFlg=true;
            }
            if(typeof jsn.publisher != "undefined")
            {
                $("#publisher").val(jsn.publisher);
                pubFlg=true;
            }
            
            var plcAlrt=false;
            if(plcFlg==false && pubFlg==false)
                {
                    if(document.getElementById('place'))
                    {
                        $("#journalTtlMsgDiv p").html('This citation requires publisher/place details.');
                        showDiv('CitePlace');
                        $("#CitePlace").html(' n.p.');
                        $(".optAlrt").hide();
                        plcAlrt=true;
                    }
                }
                if(authorFlag==true && plcAlrt==false)
                {
                    var txt='';
                    if($(".optAlrt").css('display')!="none")
                        {
                            txt=$(".optAlrt").html();
                        }
                        if(typeof txt !="undefined" && txt!='' && txt!='undefined')
                            {
                                $("#journalTtlMsgDiv p").html(txt);
                                $(".optAlrt").hide();
                            }
                            else
                                {
                                    $("#journalTtlMsgDiv p").html("Use this form to edit your citation.");
                                }
                        
                }
}

function showHideWCAuAlrt()
{
    if($("#drpSearch1").val()=="au" || $("#drpSearch3").val()=="au")
        {
            $("#wcAuAlrt").show();
        }
        else
            {
                $("#wcAuAlrt").hide();
            }
}

function autofilExtraAuth()
{
    var jsn=$("#author").data('author');
    if(typeof jsn.otherAuthors != "undefined")
        {
            var i;
            for(i=0;i<jsn.otherAuthors.length;++i)
                {
                    var placeHolder='author';
                    if($("#author").data('plc')!='undefined' && $("#author").data('plc')!='')
                        {
                            placeHolder=$("#author").data('plc');
                        }
                    addNewAuthor('authorSec','bookPanel',2,placeHolder);

                    var cnt=i+2;

                    $("#author"+cnt).val(jsn.otherAuthors[i]);
                    ReloadTextDiv2('author'+cnt,'CiteAuthor'+cnt);
                            
                            
                }
                
                $(".extraAuth").keyup(function(){
                    ReloadTextDiv2($(this).attr('id'),$(this).data('div'));
                });
        }
}

function isPlcPubBlank()
{
    var jsn=$("#chkResultsWCS:checked").data('json');
            
            var plcFlg=false;
            var pubFlg=false;
            if(typeof jsn.place != "undefined")
            {
                $("#place").val(jsn.place);
                plcFlg=true;
            }
            if(typeof jsn.publisher != "undefined")
            {
                $("#publisher").val(jsn.publisher);
                pubFlg=true;
            }
            
            if(plcFlg==false || pubFlg==false)
                {
                    return true;
                }
                return false;
}

function isFollowedByAny(divName){
	var SpanArr = new Array();
	var flag=false;
        var myF=false;
	$('#bookPanel span').each(function(index)
     {
         if($(this).css('display')!='none')
             {
                 if($(this).text().trim()!='' && flag==true){
                    if($(this).attr("id")!="undefined")
                    {
			myF=true;
                    }
		}
                
                 if($(this).attr("id")!="undefined" && $(this).attr("id")==divName)
                 {
                     flag=true;
                 }
             }
	});
        return myF;
}

function getFieldValue(id)
{
    if(document.getElementById(id))
        {
            return document.getElementById(id).value.trim();
        }
        return '';
}

function processInTextEdLF(val)
{
    var edi1=processExtraDotComma('',val).split(' ');
    var edi='';
    if(edi1.length>0)
    {
        var i=0;
        var tmpSt='';
        var charPos=0;
        for(i=0;i<edi1.length;++i)
            {
                if(trimLastChar(edi1[i],".").trim().length==1)
                    {
                        charPos=i;
                        break;
                    }
            }
            if(charPos==0)
            {
                edi=edi1[charPos].trim();
            }
            else
            {
                var lastStr='';
                for(i=0;i<charPos;++i)
                {
                    lastStr+=edi1[i].trim()+' ';
                }
                edi=lastStr.trim();
            }

    }
    return edi;
}

function noConjLowerFlg(field)
{
    
    var Yau = 'perYes'+field;
    var Nau = 'perNo'+field;
    var patt10 = new RegExp(/^[author]+[2-9]$/);	
    var patt10E = new RegExp(/^[editor]+[2-9]$/);
    var patt15 = new RegExp(/^[revauthor]+[2-9]$/);
    var patt16	= new RegExp(/^[trans]+[2-9]$/);
    var patt17	= new RegExp(/^[producer]+[2-9]$/);
    var patt18	= new RegExp(/^[trans]+[2-9]$/);
    var noLowerFlg=false;
    var lstNmFstNmFlag=false;
    var fstNmLstNmFlag=false;
    var arr=new Array();
    if((field=="author" && typeof document.perYesau1 != "undefined" && (document.perYesau1>0 || document.perNoau1==0)) 
    || (field=="editor" && typeof document.perYesed1 != "undefined" && document.perYesed1>0) 
    || (patt10E.test(field)==true && edPersPrevYes==true)  
    || (patt10.test(field)==true && auPersPrevYes==true)  
    || (patt17.test(field)==true && prPersPrevYes==true)  
    || ((patt10.test(field)==true 
    || field=="editor" || patt10E.test(field)==true 
    || field=="translator" || patt16.test(field)==true 
    || field=="producer" || patt17.test(field)==true 
    || field=="revauthor" || patt15.test(field)==true
    || field=="trans" || patt18.test(field)==true)
    && (eval("document." + Yau)>0 || eval("document." + Nau)==0)))
    {
        noLowerFlg=true;
        var obj=document.getElementById(field);
        var plcHldr=obj.getAttribute("placeholder").trim();
        if(typeof plcHldr != "undefined" && plcHldr!='')
        {
            var arrPlcHl=plcHldr.split(' ');
            if(arrPlcHl.length==2)
            {
                var lastName=arrPlcHl[0].trim();
                var firstName=arrPlcHl[1].trim();
                if(lastName!='' && firstName!='')
                {
                    if(lastName.length>1 && firstName.length==1)
                    {
                        lstNmFstNmFlag=true;
                    }
                    else if(lastName.length==1 && firstName.length>1)
                    {
                        fstNmLstNmFlag=true;
                    }
                }
            }
        }
    }
    
    if(field=="editor" || patt10E.test(field)==true 
    || field=="translator" || patt16.test(field)==true 
    || field=="producer" || patt17.test(field)==true 
    || field=="revauthor" || patt15.test(field)==true
    || field=="trans" || patt18.test(field)==true)
    {
        var obj=document.getElementById(field);
        var plcHldr=obj.getAttribute("placeholder").trim();
        if(typeof plcHldr != "undefined" && plcHldr!='')
        {
            var arrPlcHl=plcHldr.split(' ');
            if(arrPlcHl.length==2)
            {
                var lastName=arrPlcHl[0].trim();
                var firstName=arrPlcHl[1].trim();
                if(lastName!='' && firstName!='')
                {
                    if(lastName.length==1 && firstName.length>1)
                    {
                        noLowerFlg=true;
                    }
                    else if(lastName.length==1 && firstName.length>1)
                    {
                        fstNmLstNmFlag=true;
                    }
                }
            }
        }
        else
            {
                noLowerFlg=true;
            }
    }
    arr[0]=noLowerFlg;
    arr[1]=lstNmFstNmFlag;
    arr[2]=fstNmLstNmFlag;
    return arr;
}

function fNameLnameFrmt(field)
{
    var obj=document.getElementById(field);
    var fstNmLstNmFlag=false;
        var plcHldr=obj.getAttribute("placeholder").trim();
        if(typeof plcHldr != "undefined" && plcHldr!='')
        {
            var arrPlcHl=plcHldr.split(' ');
            if(arrPlcHl.length==2)
            {
                var lastName=arrPlcHl[0].trim();
                var firstName=arrPlcHl[1].trim();
                if(lastName!='' && firstName!='')
                {
                    if(lastName.length==1 && firstName.length>1)
                    {
                        fstNmLstNmFlag=true;
                    }
                }
            }
        }
        return fstNmLstNmFlag;
}

function getGroupName()
{
    var groupName='';
    if(document.getElementById('groupName'))
        {
            groupName=document.getElementById('groupName').value;
        }
        return groupName;
}

function processExtraDotComma(divName,NewText)
{
    var tst=/ \.{2,}$/;
    var tst1=/\. \.{1,}$/;
    var tst2=/\.{2,}$/;
    //if(divName=="CiteTitle" || divName=="CiteChapter")
        //{
    if(tst1.test(NewText.trim()))
        {
           var arrNT=NewText.trim().split(" "); 
           var i=0;
           if(arrNT.length>1)
               {
                   NewText='';
                    for(i=0;i<arrNT.length-1;++i)
                        {
                            if(i>0)
                                {
                                    NewText+=' ';
                                }
                            NewText+=arrNT[i];
                            
                        }
               }
        }
       // }
    if((divName=="CiteTitle" || divName=="CiteChapter") && (tst.test(NewText.trim()) || tst2.test(NewText.trim())))
        {            
            //NewText=NewText.trim().replace(/\.{1,}$/, '...');
        }
        else
            {
                
                NewText=NewText.trim().replace(/\.{1,}$/, '');
            }
	NewText=NewText.trim().replace(/,{1,}$/, '');
        return NewText;
}

function processSpCharDot(NewText)
{
    var tst1=/\?{1,}$/;
    var tst2=/\!{1,}$/;
    var NewText1=NewText.trim().replace(/\.{1,}$/, '');
    if(tst1.test(NewText1.trim()) || tst2.test(NewText1.trim()))
        {
           return NewText1;
        }
        return NewText;
}

function setAuthorAlert()
{
    if(document.getElementById('authorAlrtChk') && $('#authorAlrtChk').attr('checked')==true)
    {
        authorAlrtChk=true;
    }
    else
        {
            authorAlrtChk=false;
        }
}

function ignoreMoreQuotes(NewText)
{
    var arrCh=NewText.split("'");
    var tst=/^\"{2,}/;
    var tst1=/^\"{2,}/;
    var tst2=/\"{1,}$/;
    var tst7=/^\"/;
    var tst8=/\"$/;
    
    var flg=false;
    
          
    if(tst1.test(NewText.trim()) && tst2.test(NewText.trim()))
        {
            NewText=NewText.replace(tst1, '"');
            NewText=NewText.replace(tst2, '"');
            flg=true;
        }
        else if(tst7.test(NewText.trim()) && tst8.test(NewText.trim()))
        {
           NewText=NewText.replace(tst7, '"'); 
           NewText=NewText.replace(tst8, '"'); 
        }
        
        if(tst7.test(NewText.trim()) && !tst8.test(NewText.trim()))
            {
                NewText=NewText.replace(tst7, "");
            }
        
        if(flg==false)
        {
            NewText=NewText.replace(tst1,'"');
            NewText=NewText.replace(tst2, '"');
            NewText=NewText.replace(tst7, '"'); 
            NewText=NewText.replace(tst8, '"'); 
        }
        return NewText;
}

function ignoreMoreSingleQuotes(NewText)
{
    var arrCh=NewText.split("'");
    var tst=/^\'{2,}/;
    var tst1=/^\'{2,}/;
    var tst2=/\'{1,}$/;
    var tst3=/^\"{1,}/;
    var tst4=/^\'{1,}\"{1,}/;
    var tst5=/\"{1,}$/;
    var tst6=/\'{1,}\"{1,}$/;
    var tst7=/^\'/;
    var tst8=/\'$/;
    
    var flg=false;
        
    if(tst1.test(NewText.trim()) && tst2.test(NewText.trim()))
        {
            NewText=NewText.replace(tst1, "'");
            NewText=NewText.replace(tst2, "'");
            flg=true;
        }
        else if(tst7.test(NewText.trim()) && tst8.test(NewText.trim()))
        {
           NewText=NewText.replace(tst7, "'"); 
           NewText=NewText.replace(tst8, "'"); 
        }
        
        if(tst7.test(NewText.trim()) && !tst8.test(NewText.trim()))
            {
                NewText=NewText.replace(tst7, "");
            }
        
        if(flg==false)
        {
            NewText=NewText.replace(tst1, "'");
            NewText=NewText.replace(tst2, "'");
            NewText=NewText.replace(tst7, "'"); 
            NewText=NewText.replace(tst8, "'"); 
        }
        return NewText;
}

function getAuthorCount()
{
   var authorCnt=0;
    if(document.getElementById('author'))
    {
        
        if(document.getElementById('author'))
        {
            var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[author]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && (cmBtnId=='author' || patt11.test(cmBtnId)==true))
                {
                    authorCnt++;                            
                }
            }
        }
    
    }
    return authorCnt;
}

function getEditorCount()
{
   var authorCnt=0;
    if(document.getElementById('editor'))
    {
        
        if(document.getElementById('editor'))
        {
            var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var val=el.value.trim();
                if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && (cmBtnId=='editor' || patt11.test(cmBtnId)==true))
                {
                    authorCnt++;                            
                }
            }
        }
    
    }
    return authorCnt;
}


function getLS(itm)
{
    return localStorage.getItem(itm); 
}

function setLSChk(itm,id,dflt)
{
    if(typeof dflt == "undefined")
        {
            dflt='';
        }
    if(getLS(itm)=="checked" || (getLS(itm)!="notchecked" && dflt=="checked"))
        {
            if(document.getElementById(id))
                {
                    document.getElementById(id).checked=true;
                }
        }
}

function setLS(elm,itm)
{
    if(elm.checked==true)
        {
            localStorage.setItem(itm, "checked");
        }
        else
            {
                localStorage.setItem(itm, "notchecked");
            }
}


function setGlobalLS(item,val)
{
    
                localStorage.setItem(item, val);
}

function getGlobalLS(itm)
{
    return localStorage.getItem(itm); 
}
function setLibSearchChk(id)
{    
    $('.libSearchChk').attr('checked',false);
    $("#"+id).attr('checked',true);            
}

function openSubjectPanel(flId)
{
    var n = $('.opencitationbody:checked').length;
    
	  if(n>0 || typeof flId != "undefined")
	{
            if(typeof flId != "undefined")
                {
                    var fileId=flId;
                }
                else
                    {
                        var fileId=$('.opencitationbody:checked').attr('name');
                    }
            var section=getSectionName();
            var filenm1=$('.opencitationbody:checked').val();
               showHideSubDiv('subDiv'+fileId,'subplus'+fileId);
        }
        else
            {
                jAlertMod("Click the checkbox alongside subject folders before using Open functionality.","Alert","&nbsp;OK&nbsp;",null);
            }
}

function forgotpw()
{
  if (document.siteloklogin.username.value=="")
  {
    jAlertMod1("Please enter your username or email address","Alert","&nbsp;OK&nbsp;",null);
    document.siteloklogin.username.focus()
    return(false)
  }
  document.siteloklogin.forgotpassword.value="forgotten-it"
  
  var formData = getFormData('siteloklogin');
  $.ajax({
		type: "GET",
		url: base_url+'slpw/apa_login.php',
		data: formData,
                async: true,
		success: function(datar){
                   jAlertMod1(datar,"Alert","&nbsp;OK&nbsp;",null); 
                }
  });
}