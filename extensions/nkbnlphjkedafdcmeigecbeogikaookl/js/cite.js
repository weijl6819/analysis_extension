//var baseUrl = 'http://localhost:65220/';
var baseUrl = 'https://www.citemaker.com/';
var openListBtn=false;
var doNotCite=false;
var folderBtnFlag=false;
var wcEmail=false;
var buttonClicked='';
var checkBoxTicked=false;

$(function () {
		
	// load any previously saved setting
	chrome.storage.sync.get(function(value){
		

		citeCurrentPage();
	});	
	
	chrome.runtime.onMessage.addListener(function(message) {
		if (message.type === "tbsHighlightedText"){
			$('.quote-wrapper textarea').val(message.content);
		}
	});
	
	$(document).on('click', '.close-btn', function() {
            
		chrome.runtime.sendMessage({
			type: 'bgToggleFrame',
			content: 'toggleFrame'
		});
                window.close();
	});
		
	$(document).on('click', '.cite-styles li input[type="checkbox"]', function () {
            checkLikeRadio(this);
		$('.cite-styles li input[type="checkbox"]').removeClass('selected');
		var $selectedStyle = $(this);		
		$selectedStyle.addClass('selected');
		checkBoxTicked=false;
		var selectedStyle = $selectedStyle.data('style');
		
		// save it for the future
		//chrome.storage.sync.set({'style': selectedStyle});
                if(selectedStyle=='HARVARD')
                    citeCurrentPage();
	});	
	
	$(document).on('click', '.selectable', function() {
        $(this).selectText();
    });
	
	$('#bib-form').on('submit', function(e) {	
		e.preventDefault();
		
		var addToBibliographyJsString = 'javascript:var form = document.createElement("form");form.setAttribute("method", "post");form.setAttribute("action", "'+baseUrl+'cite/website/citeweb");var urlField = document.createElement("input");urlField.setAttribute("type", "hidden");urlField.setAttribute("name", "autociteUrl");urlField.setAttribute("value", "'+$('#Url').val()+'");form.appendChild(urlField);var quoteField = document.createElement("input");quoteField.setAttribute("type", "hidden");quoteField.setAttribute("name", "quote");quoteField.setAttribute("value", "'+$('#Quote').val()+'");form.appendChild(quoteField);document.body.appendChild(form);form.submit();';
		chrome.runtime.sendMessage({type:'bgOpenUrl', content: addToBibliographyJsString});
	});
});

function getWebsiteNameFromUrl(url) {
	url = url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/g, '');
	
	return url.charAt(0).toUpperCase() + url.slice(1);
}

function toggleError () {
	$('#spinner').hide(0, function () {
		$('#failed-wrapper').show(0);
	});
}

function citeCurrentPage(form,noAutoCite,wcEdit) {
    $("#username").val("");
    $("#password").val("");
	$('#result-wrapper').hide(0); // hide existing citation
	$('#failed-wrapper').hide(0); // hide any error messages too
        $("#saveFileDiv").hide();
        $("#login_panel").hide();
        $("#expired_panel").hide();
        $("#fileSaveContainer").show();
        $("#openedCitation").hide();
        $("#openSavedCiteBtn").show();
        $("#backBtn").hide();
        $("#copyBtnBtm").hide();
        $("#emailBtn").hide();
        $("#deleteBtn").hide();
        $('#registerPanel').hide();
        $("#subscribeDiv").hide();
        $("#fileListDiv").hide();
        $("#worldcat-searchdiv").hide();
        $("#fileListDiv").hide();
        folderBtnFlag=false;
        
        var subUrl1='&fd=none';
        if(typeof form == "undefined")
            form='website';
        else
            subUrl1='&fd=block';
        
	var style = 'HARVARD';
	var date = new Date();
	accessedOnDay = date.getDate();
	accessedOnMonth = date.getMonth() + 1; // +1 because .getMonth() is zero based
	accessedOnYear = date.getFullYear();	

	chrome.runtime.sendMessage({type: 'bgGetUrl'}, function(response) {
		var urlToCite = response;
                doNotCite=false;
		// check to make sure we're not on a Chrome options page
		var chromePage = urlToCite.indexOf('chrome://');
		if (chromePage !== -1)
		{
                    doNotCite=true;
			//toggleError();
			//return;
		}
		
		// or the chrome extensions gallery (this can't be injected into)
		var extensionsPage = urlToCite.indexOf('chrome.google.com/webstore');
		if (extensionsPage !== -1)
		{
                    doNotCite=true;
			//toggleError();
			//return;
		}

		$('#spinner').show(0, function () {
                    //console.log(baseUrl+'api/autocite/website?url='+encodeURIComponent(urlToCite)+'&style='+style);
                    var style = 'HARVARD';
                    removeAllStyleJs();
                    var jsflname=style.toLowerCase()+'_functions.js';
                    var js = document.createElement("script");
                         js.type = "text/javascript";
                                 js.setAttribute('id',style.toLowerCase()+'_functions');
                         js.src = 'js/'+jsflname;
                         document.body.appendChild(js);
                    //document.getElementById('abcd').innerHTML='<script src=""></script>';
                    $.ajax({
                                type: 'GET',
				url: baseUrl+'ajax.php?ms='+new Date().getTime(),
                                data:"type=islogin",
				success: function(data) {
					$('#userLoginDiv').html(data);
                                        logoutEventByAjax();
                                }
                    });
                    var subUrl='';
                    if(typeof noAutoCite != "undefined" && noAutoCite==true)
                        {
                            doNotCite=noAutoCite;
                        }
                    if(doNotCite==true)
                        {
                            subUrl="&no_citing=1";
                        }
                        if(typeof wcEdit != "undefined" && wcEdit==true)
                            {
                                subUrl+="&wc_edit=1";
                            }                            
                            if(checkBoxTicked==true)
                                {
                                    subUrl+="&clicked=1";
                                }
                            $.ajax({
				url: baseUrl+'api/citeweb/?url='+encodeURIComponent(urlToCite)+'&ms='+new Date().getTime()+subUrl+'&form='+form+'&style='+style+subUrl1,						
				success: function(data) {
                                    //console.log(data);
					//if (data.status === 'ok') {
					// populate the visible area
					$('#result-wrapper').html(data);
					
					// Then show it
					$('#spinner').hide(0, function () {
						$('#result-wrapper').fadeIn('slow');
					});
					/*}
					else {
						toggleError();
					}*/
                                    if(document.getElementById('srcVarGlbInpt'))
                                    {
                                        if($("#srcVarGlbInpt").val()!='')
                                        {
                                            var srcVar = $("#srcVarGlbInpt").val().split(",");
                                            Reset(srcVar);
                                        }
                                    }
                                    
                                        $('.styles li input[type="checkbox"]').click(function () {
                                           checkLikeRadio1(this); 
                                           checkBoxTicked=true;
                                           if($(this).data('wcedit')=="yes")
                                               {
                                                   citeCurrentPage($('.styles li input:checked').val(),true,true);
                                               }
                                               else
                                                   {
                                                        citeCurrentPage($('.styles li input:checked').val());
                                                   }
                                        });
                                        if(style=="HARVARD")
                                            {
                                                var wcAutoFilFlg=false;
                                                if(typeof wcEdit!='undefined' && wcEdit==true)
                                                    {
                                                        wcAutoFilFlg=true;
                                                    }
                                                autofilWCSearch();
                                                reformatHARVARD(wcAutoFilFlg);
                                            }
                                           
                                                $("#saveBtn").click(function(){
                                                    openListBtn=false;
                                                    buttonClicked='saveBtn';
                                                    showHideBtns();
                                                    $("#formFields").hide();
                                                formPanelSave=true;
                                                saveMyCiteBottom=true;
                                                saveCitationstoDB2(); 
                                             });
                                             $("#copyBtn").click(function(){
                                                 buttonClicked='copyBtn';
                                                 $("#formFields").hide();
                                                executeCopy2(document.getElementById('bookPanel').innerHTML); 
                                             });
                                             $("#copyBtnIntxt").click(function(){
                                                 $("#formFields").hide();
                                                 copyIntext();
                                             });
                                             $("#closeBtnWc").click(function(){
                                                 $("#result-wrapper").hide();
                                                 $("#worldcat-searchdiv").show();
                                             });
                                             $('#emaiIcon').click(function() {
                                                 buttonClicked='emailIcon';
                                                 wcEmail=false;
                                                 $("#formFields").hide();
                                                 openEmailPopup();
                                             });
                                            
                                             if(document.getElementById('style-worldcat').checked==true && (typeof wcEdit == "undefined" || wcEdit!=true))
                                                {
                                                    showWorldcatSearchResults();
                                                }
                                            
                                             $(".editBtn").click(function(){
                                                 
                                                 $("#citationPrevHeading").show();
                                                 $("#noAuthorMsgDiv").hide();
                                                $("#formFields").show();
                                                buttonClicked='editBtn';
                                                
                                             });
                                             $("#closeFormBtn").click(function(){
                                                 $("#formFields").hide();
                                             })
                                             $("#folderBtn").click(function(){
                                                 buttonClicked='folderBtn';
                                                openListBtn=true;
                                                folderBtnFlag=true;
                                                $("#formFields").hide();
                                                showHideBtns();
                                                formPanelSave=true;
                                                saveMyCiteBottom=true;
                                                showAllDatabase(); 
                                             });
				},
				error: function(e) {
					toggleError();
				}
			});
		});	
		
	});
}


function reformatHARVARD()
{
    var placeHolder='author';
    srcVarGlb=new Array($("#srcSecVar").html());
    if($("#author").data('plc')!='undefined' && $("#author").data('plc')!='')
        {
            placeHolder=$("#author").data('plc');
        }
    $("#addAuthorDiv").click(function(){
       addNewAuthor('authorSec','bookPanel',2,placeHolder) 
    });
    $("#addEditorDiv").click(function(){
       addNewEditor('editorSec','bookPanel',13) 
    });
     $("#YearParentheses").click(function()
     {
         setLS(this,'YearParentheses');
         ReloadTextDiv2('year','CiteYear');
     });
     
     $("#onlinechk").click(function(){
        setLS(this,'onlinechk');
        ReloadTextDiv2('http','CiteHttp'); 
     });
     
     $("#l_chapterttl").change(function(){
        setChapTtlQt(this);
        ReloadTextDiv2('chapter','CiteChapter'); 
     });
     
    var arr = document.forms["publication"].elements;
            var patt11 = new RegExp(/^[editor]+[2-9]$/);
                
            for (var i = 0; i < arr.length; i++) {
              var el = arr[i];
               var cmBtnId=el.getAttribute("id");
               var cmBtnType=el.getAttribute("type");
               var disp=el.style.display;
               var val=el.value.trim();
                        if(cmBtnId!='' && cmBtnId!=null && cmBtnType=="text" && val!='')
                        {
                            if(disp!='none')
                            {                                
                                if(cmBtnId=="http")
                                    httpAlertFlg=false;
                               
                                    
                                    if(patt11.test(cmBtnId)==true || cmBtnId=="author")
                                    {
                                        
                                    }
                                    else
                                        {
                                            if (typeof $("#"+cmBtnId).data("keyup") != "undefined" && $("#"+cmBtnId).data("keyup")!='')
                                            {
                                                eval($("#"+cmBtnId).data("keyup"));
                                            }
                                                else
                                                    {
                                                        ReloadTextDiv2(cmBtnId,$("#"+cmBtnId).data('div'));
                                                    }
                                        }
                 
                 
                                if(cmBtnId=="http")
                                    httpAlertFlg=true;                                      
                                    
                            }
                            
                        }
                        else if((cmBtnId=='year' || cmBtnId=='date') && val=="")
                        {
                            if(cmBtnId=='year')
                                yearFlg=true;
                            else if(cmBtnId=='date')
                                dateFlg=true;
                            chkYearDate();
                        }
                    }
   
    $("#author").keyup(function() {
        ReloadTextDiv2('author','CiteAuthor');
    });
    $("#editor").keyup(function(){
       ReloadTextDiv2('editor','CiteEditor'); 
    });
    $("#descriptor").keyup(function(){
       ReloadTextDiv2('descriptor','CiteDescriptor'); 
    });
    $( "#year" ).keyup(function() {
        ReloadTextDiv2('year','CiteYear');
    });
    $("#year").blur(function(){
        chkYearDate();
    });
    $( "#date" ).keyup(function() {
        ReloadTextDiv2('date','CiteDate');
    });
    $("#date").blur(function(){
        chkYearDate();
    });
    
    $( "#format" ).keyup(function() {
        ReloadTextDiv2('format','CiteFormat');
    });
    $( "#chapter" ).keyup(function() {
        ReloadTextDiv2('chapter','CiteChapter');
    });
    $( "#title" ).keyup(function() {
        ReloadTextDiv2('title','CiteTitle');
    });
    $("#pageBook").keyup(function(){
        ReloadTextDiv2('pageBook','CitePage','books');
    });
    $("#pageJournal").keyup(function(){
        ReloadTextDiv2('pageJournal','CitePage');
    });
    $("#database").keyup(function(){
        ReloadTextDiv2('database','CitePublication');
    });
    $( "#volume" ).keyup(function() {
        ReloadTextDiv2('volume','CiteVolume','journal');
    });
    $( "#issue" ).keyup(function() {
        ReloadTextDiv2('issue','CiteIssue','journal');
    });
    $( "#http" ).keyup(function() {
        ReloadTextDiv2('http','CiteHttp');
    });
    
    $("#abstractChk").click(function(){
        checkchkabstract(document.getElementById('abstractChk'));
    });
    
    $("#specialChk").click(function(){
        checkchkspecialissue(document.getElementById('specialChk'));
    });
    

    $("#year").change(function(){
        chkYear();
    });
    $("#date").change(function(){
        ValidateDate('date','CiteDate');
    });
    
    $("#accessed").keyup(function() {
        ReloadTextDiv2('accessed','CiteAccessed');
    });
    $("#accessed").change(function() {
        ValidateDate('accessed','CiteAccessed',true);
    });
    
    $("#pageBook").change(function(){
       chkPage(); 
    });
    $("#pageJournal").change(function(){
       chkPage(); 
    });
    $("#page").keyup(function(){
        ReloadTextDiv2('page','CitePage');
    });
    
    $("#page").change(function(){
       chkPage(); 
    });
    
    $("#edition").keyup(function(){
        ReloadTextDiv2('edition','CiteEdition');
    });
    
    $("#publisher").keyup(function(){
        ReloadTextDiv2('publisher','CitePublisher');
    });
    
    $("#place").keyup(function(){
        ReloadTextDiv2('place','CitePlace');
    });
    
    $("#http").change(function(){
        //isValidURL('http');
    });
}

function replaceDotToComma()
{
    var temp;
    temp=document.getElementById('CiteAuthor').innerHTML;
    temp=trimLastChar(temp,'.');
    if(temp.trim()!='')
    {  
        if(document.getElementById('author')=='')
        {
            document.getElementById('CiteAuthor').innerHTML=trimLastChar(temp,',')+',';
        }
    }
    
    temp=document.getElementById('CiteYear').innerHTML;
    temp=trimLastChar(temp,'.');
    if(temp.trim()!='')
    { 
        document.getElementById('CiteYear').innerHTML=trimLastChar(temp,',')+',';
    }
    
    temp=document.getElementById('CiteTitle').innerHTML;
    temp=trimLastChar(temp,'.');
    if(temp.trim()!='')
    { 
         document.getElementById('CiteTitle').innerHTML=trimLastChar(temp,',')+',';
    }
    
    temp=document.getElementById('CiteAccessed').innerHTML;
    temp=trimLastChar(temp,'.');
    if(temp.trim()!='')
    { 
         document.getElementById('CiteAccessed').innerHTML=trimLastChar(temp,',')+',';
    }
    
    temp=document.getElementById('CiteAccessed').innerHTML;
    temp=trimLastChar(temp,'.');
    if(temp.trim()!='')
    { 
         document.getElementById('CiteAccessed').innerHTML=trimLastChar(temp,',')+',';
    }
}




function reformatAuthorHARVARD()
{
    if(document.getElementById('author').value=='')
    {
        document.getElementById('CiteAuthor').style.fontStyle="italic";
        document.getElementById('CiteAuthor').style.position="relative";
        document.getElementById('CiteAuthor').style.visibility="visible";
        document.getElementById('CiteAuthor').innerHTML=document.getElementById('CiteTitle').innerHTML.replace('&nbsp;','').trim();
        document.getElementById('CiteTitle').innerHTML='';
    }
}

function removeAllStyleJs()
{
    if(document.getElementById('apa_functions'))
        document.body.removeChild(document.getElementById('apa_functions'));
    
    if(document.getElementById('agps_functions'))
        document.body.removeChild(document.getElementById('agps_functions'));
    
    if(document.getElementById('harvard_functions'))
        document.body.removeChild(document.getElementById('harvard_functions'));
    
    if(document.getElementById('mla_functions'))
        document.body.removeChild(document.getElementById('mla_functions'));
}

function logoutEventByAjax()
{
    $("#logout").click(function(){
        $.ajax({
		type: "GET",
		url: baseUrl+"logout.php",
		data: "type=menu",
		success: function(data){
                    $('#userLoginDiv').html('');
                    citeCurrentPage();
		}
	});
        
    });
}

function showHideBtns()
{
    if(openListBtn==true)
        {
            $("#saveCitationFileBtn").hide();
            $("#fileSavePromptDiv").hide();
        }
        else
            {
                $("#saveCitationFileBtn").show();
                $("#fileSavePromptDiv").show();
            }
}


$("#registerLink, .registerBtn").click(function(){
    
          justRegister();                      
});

function justRegister(glogin,username,email,id)
{
     var gLoginFlag='';
    var gUserName='';
    var gEmail='';
    var gId='';
    if(typeof glogin != "undefined")
        {
            gUserName=username;
            gEmail=email;
            gId=id;
        }
                $.ajax({
                                             url: baseUrl+'register_ext.php?chrome_ext=yes&g_id='+gId+'&g_email='+gEmail+'&g_user='+gUserName+'&ms='+new Date().getTime(),						
                                             success: function(data) {
                                                 //console.log(data);
                                                     //if (data.status === 'ok') {
                                                     // populate the visible area
                                                     $('#login_panel').hide();
                                                     $('#login_register_panel').hide();
                                                     $('#registerPanel').show();
                                                     $('#registerPanel-inner').html(data);
                                                     $('#gregister').click(function(){
                                                         interactiveSignIn();
                                                     })
                                                     $("#registerBtn").click(function(){
                                                        registerByAjax('register_ext.php?ms='+new Date().getTime(),'sitelokfbregisteruser','','pProfileRegister','afterRegister',''); 
                                                     });
                                                     $("#loginLink").click(function(){
                                                        $('#login_panel').show();
                                                        $('#registerPanel').hide();
                                                    });                                                     
                                                     $("#subscription-fee-link").click(function(){
                                                         openSubscriptionPage();
                                                     })
                                             }
                });
        
}

$("#style-worldcat").click(function(){
    $("#expired_panel").hide();
    $("#subscribeDiv").hide();
    if(document.getElementById('style-worldcat').checked==true)
        {
            showWorldcatSearchResults();
        }
    else
            {
                $("#worldcat-searchdiv").hide();
                citeCurrentPage();
            }
})

function showWorldcatSearchResults()
{
    
            $("#result-wrapper").hide();
            hideAllDiv();
                $('#spinner').show(0, function () {
                    $.ajax({
                                                url: baseUrl+'api/citeweb/wordcatform.php?ms='+new Date().getTime()+'&form=website&style=harvard',						
                                                success: function(data) {
                                                    $('#spinner').hide(0, function () {
                                                                $('#worldcat-searchdiv').fadeIn('slow');
                                                        });
                                                    $("#worldcat-searchdiv-inner").html(data);
                                                     $('#worldcatsearchBtn').click(function(){
                                                                getCitation(0); 
                                                             });
                                                             $("#worldcatsaveBtn").click(function(){
                                                                 SaveSearch();
                                                             });
                                                              $("#wcClearBtn").click(function(){
                                                        clearWcPanel(); 
                                                     });        
                                                             
                                                     $(".libSearchChk").click(function(){
                                                        setLibSearchChk($(this).attr('id')); 
                                                     });
                                                }
                    });
                    });
        
        

}

function hideAllDiv()
{
    $('#result-wrapper').hide(0); // hide existing citation
	$('#failed-wrapper').hide(0); // hide any error messages too
        $("#saveFileDiv").hide();
        $("#login_panel").hide();
        $("#openedCitation").hide();
        $('#registerPanel').hide();
        $("#fileListDiv").hide();
}


function openEmailPopup(){
    
                    if(document.getElementById('emailAddr1ext') && document.getElementById('sleml'))
                    document.getElementById('emailAddr1ext').value=document.getElementById('sleml').value;

	

	

	

		var popID = 'emailSec1ext'; //Get Popup Name

	

		//Pull Query & Variables from href URL


		var popWidth = 370; //Gets the first query string value

	

		//Fade in the Popup and add close button

		$('#' + popID).fadeIn().css({ 'width': Number( popWidth ) }).prepend('<a href="#" class="close" style="opacity:1"><img src="images/close_pop.gif" class="btn_close" title="Close Window" alt="Close" /></a>');

	

		//Define margin for center alignment (vertical   horizontal) - we add 80px to the height/width to accomodate for the padding  and border width defined in the css

		var popMargTop = ($('#' + popID).height() + 80) / 2;

		var popMargLeft = ($('#' + popID).width() + 80) / 2;

	

		//Apply Margin to Popup

		$('#' + popID).css({

			'margin-top' : -popMargTop,

			'margin-left' : -popMargLeft

		});

	

		//Fade in Background

		$('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.

		$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn(); //Fade in the fade layer - .css({'filter' : 'alpha(opacity=80)'}) is used to fix the IE Bug on fading transparencies 

               

		return false;

	

	}
        
               $("#sendEmailBtnext").click(function(){
                   
                   if(wcEmail==true)
                       {
                           var val=$('input[name=1234chkResultsWCS]:checked').val();
                           email1ext('TD'+val);
                       }
                       else
                           {
                               email1ext('bookPanel');
                           }
                                                            });
                                                            
function email1ext(id)
{
	  var section=getSectionName();
	  
	
	  	var content="";
        
		var	content1 = getText(id);
                var re = new RegExp(String.fromCharCode(160), "g");
                content1=content1.replace(re, " ");
                content1=content1.replace(/&amp;/g , "||");                
                content1=content1.replace(/#/g , "~`~");
		content1=content1.replace(/&/g , "````");
                content1=content1.replace(/%20/g , "``");
			
			content1="<div style='width: 600px; height: auto; text-indent: -30px; white-space: normal;'>"+content1+"</div><br />"; 
			content=content+content1;
	
                        
		
   		//alert(content);

	var txtToEmail="<div style='width:650px;padding-left:30px; margin-left:30px'>"+content+"</div>";
	txtToEmail = removeNewLine(txtToEmail);
	var emailAddr1 = document.getElementById('emailAddr1ext').value;
	
	if(echeck(emailAddr1))
	{
        var lngth = txtToEmail.length;
		
        document.getElementById('emailedData5ext').value = txtToEmail;
	$.ajax({
               type: 'GET',
		   url: base_url+ 'students/scripts/phpMailer.php',
               data: "html="+txtToEmail+"&emailAddr1="+emailAddr1+"&set=email1&chrome_ext=yes&format="+section+"&time="+new Date().toString().substring(4,28),
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

function getCitation(p)
{
	secName = getSectionName();
	$('#main').html('');
	var mt=$("#mt").val();
        
	strData = "chrome_ext=yes&secName="+secName+"&p=" + p + "&txtSearch1="+jQuery("#txtSearch1").val() + "&drpSearch1="+jQuery("#drpSearch1").val()+"&mt="+mt;
	jQuery("#main").html("<center><img src='images/loading_bar.gif' align='center'></center>");
        
        var searchUrl="worldcat.php";
        if(document.getElementById('openLibraryChk') && document.getElementById('openLibraryChk').checked==true)
        {
           searchUrl="openlibrary.php"; 
        }
        else if(document.getElementById('googleBookChk') && document.getElementById('googleBookChk').checked==true)
        {
           searchUrl="googlebook.php"; 
        }
        
	jQuery.ajax({
		type: "GET",
		url: base_url+searchUrl,
		data: strData,
		success: function(msg){
			//alert(msg);
                        if(msg!="searchcriteria")
                            {
                                jQuery("#main").html(msg);
                            }
                            else
                                {
                                    jQuery("#main").html('');
                                    jAlertMod1('Please enter search criteria',"Alert","&nbsp;OK&nbsp;",null);
                                }
                        $(".wcpn").click(function(){
                           getCitation($(this).data('pn')); 
                        });
                        $("input[name='1234chkResultsWCS']").click(function(){
                            locateNear($(this).val());
                        });
                        $("#worldcatsaveBtn").show();
                        $("#saveIcnWc").click(function()
                        {
                            SaveSearch();
                        });
                        $("#editBtnWc").click(function(){
                            editWCSearch();
                        });
                        $("#copyBtnWc").click(function(){
                            var val=$('input[name=1234chkResultsWCS]:checked').val();
                            if(typeof val !="undefined" && val!="undefined" && val!="")
                                {
                                    executeCopy3('TD'+val);
                                }
                        else
                            {
                                jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
                            }
                            
                        });
                        $("#emaiIconWC").click(function(){
                            var val=$('input[name=1234chkResultsWCS]:checked').val();
                            if(typeof val !="undefined" && val!="undefined" && val!="")
                                {
                                    wcEmail=true;
                                    openEmailPopup();
                                }
                        else
                            {
                                jAlertMod1('Click Citation to proceed with your request',"Alert","&nbsp;OK&nbsp;",null);
                            }
                            
                        });
                                                             
		}
	});
	return false;
}

function getText(srcPnlID)
{
	 	//MI_15_march_13
		/*if(document.getElementById('author').value== "")
		{
			document.getElementById('CiteYear').innerHTML="";
		}*/
		var content="";
            var found;
            if(wcEmail==false)
                {
                    found= $("#"+srcPnlID).find("span");
                }
                else
                    {
                        found = $("#"+srcPnlID).find("p");
                    }
				//alert(found.length);
				//alert($("#"+srcPnlID).html());
                    //alert(found);  
                    
                if(found.length >0)
                {					
                    for( i=0; i < found.length; i++){	
                        /*if ($(found[i]).attr('id') == 'CiteTitle' && $.trim(removeNewLine($(found[i]).text()))!= "")*/
                        $(found[i]).html($(found[i]).html().replace(/\<i\>/g,"^i^").replace(/\<\/i\>/g,"^ii^"));
                        if ($(found[i]).css('font-style') == 'italic' && $.trim(removeNewLine($(found[i]).text()))!= "")
						{
                            content=content+"^i^"+ removeNewLine($(found[i]).text())+"^ii^";
							//content=content.replace(",","");
							
                        }
						else if ($(found[i]).attr('id')=='VirCiteAuthor' || $(found[i]).attr('id')=='VirCiteEditor') {
							//do nothing
						}
						else {
							content=content+removeNewLine($(found[i]).text());
						}
                                                $(found[i]).html($(found[i]).html().replace(/\^i\^/g,"<i>").replace(/\^ii\^/g,"</i>"));
						//alert($(found[2]).text());
				     }
					 
                }
                console.log(content);
            content=$.trim(removeNewLine(content));
			var count_i = content.split("^i^");
			for(var i=0; i<count_i.length;i++){
			content=content.replace("^i^", "<i>");
            content=content.replace("^ii^", "</i>");
			}
			return content;

 

}

function openSubscriptionPage()
{
    
    $.ajax({
               type: 'GET',
		   url: base_url+ 'subscribe.php',
               data: "chrome_ext=yes&ms="+new Date().toString().substring(4,28),
		   success: function(data){
                       $("#subscribeDiv").show();
                             $("#registerPanel").hide();
   				$("#subscribeDiv-inner").html(data);
                                $("#subscBtn1").click(function(){
                                    checkform('frm1');
                                });
                                $("#subscBtn2").click(function(){
                                    checkform('frm2');
                                });
                                $("#subscBtn3").click(function(){
                                    checkform('frm3');
                                });
                                $("#subscBtn4").click(function(){
                                    checkform('frm4');
                                });
			}					
		
	      });
}

function checkform(frmid){

	if($('#subscriber_email').val() == ''){

		jAlertMod('Please enter valid Email address',"Alert","&nbsp;OK&nbsp;",null);

		return false;

	}else if(!echeck($('#subscriber_email').val())){

		return false;

	}else{

		  $.ajax({

		  type: 'GET',

		  url: base_url+'ajax.php',

		  data: "type=CheckUser&user="+$('#subscriber_email').val(),

		  success: function(data){

			  //alert(data);

			  if(data=='This Email Already in System. Please try different Email.'){

				  jAlertMod(data,"Alert","&nbsp;OK&nbsp;",null);

				  return false;

			  }else{

				  myForm = document.forms[frmid];

				  joinvar =  $('#subscriber_email').val()+$('#customvars').val();

				  myForm.custom.value=joinvar;

				  myForm.submit();

					return true;

			  }

		  }

		});

	return false;  

	}

}