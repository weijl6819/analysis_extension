
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha

var timerGetPolocy;
var mmSendCheckerSM = (function () {

  var my = {};

  my.get = function (key) {
    return localStorage.getItem(CONFIG_BASE + key);
  }

  return my;

}());

var mmSendCheckerGB = (function (mmSendCheckerSM) {
  var my = {};

  my.vBaseForm = null;

  my.isThrough = false;
  my.lastEvent = null;
  my.localSetting = null;
  my.attemptCount = 0;
  my.isSepaOut = false;

  my.isShowForm = false;

  my.lastEventTimer = null;

  my.targetConfig = null;

  /*-------------------------------------------------------------------------
    関数：SendCheck
  -------------------------------------------------------------------------*/
  my.SendCheck = function( event ) {

    mmSendCheckerGB.lastEventTimer = event;

    var target = event.target;
    my.isShowForm = false;

    //送信ボタンクリックを処理をフック
    if( event.type == "keydown" ) {
      my.lastEvent = null;
      vBaseForm = $(target).parents("div.aoI table.aoP");
      if (!vBaseForm.length) {
        return true;
      }
      $(vBaseForm).find('div.T-I.J-J5-Ji').each(function(){
        if (indexOf($(this).text(), '送信') == 0){
          my.lastEvent = $(this);
        } else if (indexOf($(this).text(), 'Send') == 0) {
          my.lastEvent = $(this);
        }
      })
    } else {
      var cls = target.getAttribute("class");
      if (cls == null) {
        return true;
      }
      //-- 送信・送信＆アーカイブ以外のボタンは処理中断 -------------------------------------
      if (cls.indexOf('aPa T-I-J3') < 0) {
        if (cls.indexOf("T-I") < 0 || cls.indexOf("J-J5-Ji") < 0 || (indexOf($(target).text(), '送信') != 0 && indexOf($(target).text(), 'Send') != 0)) {
          return true;
        }
      }
      my.lastEvent = $(target);
      vBaseForm = $(target).parents("div.aoI table.aoP");
    }

    //-- 確認画面で、「送信」クリック時は、送信処理を継続 ---------------
    if( my.isThrough == true ) {
      my.isThrough = false;
      return true;
    }

    if (my.localSetting == null) {
      alert('誤送信防止機能の読み込みが完了していません。しばらく待ってもう一度送信してください。');
      event.stopPropagation();
      
      return false;
    }

    my.vBaseForm = $(vBaseForm);

    var adrsCnt = 0;
    //-- 宛先の取得 ----
    adrsCnt += my.check($(vBaseForm).find("form input[name='to']"), true);
    adrsCnt += my.check($(vBaseForm).find("form input[name='cc']"), true);
    adrsCnt += my.check($(vBaseForm).find("form input[name='bcc']"), my.localSetting['opt_check_bcc'] == 'true');

    //-- 添付ファイルの取得 ----
    var attach = my.attach($(vBaseForm).find("table input[name='attach']"), my.localSetting['opt_attach_expr']);

    var shreshold = my.localSetting['external_domain_check'] * 1;
    var attach_expr = my.localSetting['opt_attach_expr'];

    //-- 閾値判定 --------
    if (shreshold > adrsCnt && attach == 0 || shreshold > adrsCnt && attach_expr != 'or' || attach == 0 && attach_expr == 'and') {
      return true;
    }

    //-- 送信キャンセル処理 ----
    event.stopPropagation();
//    event.preventDefault();

//-- 強制 Cc の追加 ----

    if (enabled(my.localSetting['btn_add_cc1']) && adrsCnt > 0) {
      var resArray = my.localSetting['add_ccadr1'].split(",");
      for (var i = 0; i < resArray.length; i++) {
        if (resArray[i] == mmSendCheckerGB.targetConfig) {
          var mandatory = my.localSetting['add_cc_caption1'];
          var exist = false;
          $(vBaseForm).find('form input[name="to"],input[name="cc"],input[name="bcc"]').each(function(index) {
            if ($(this).val().indexOf(mandatory) != -1) {
              exist = true;
            }
          });
          if (!exist) {
            $(vBaseForm).find('form').append('<input type="hidden" name="cc" value="' + mandatory + '">');
          }
          break;
        }
      }
    }
    
    
    /*-- 送信内容確認画面表示 --*/
    my.showConfirmWindow( vBaseForm, { 'shreshold' : shreshold, 'count': adrsCnt, 'attach': attach } );

    return false;

  }
  
  my.check = function (items, enabled) {
    if (items == null || !enabled) {
      return 0;
    }
    
    var count = 0;
    
    items.each(function (index) {
      adr = $(this).val();
      
      if (my.foreign(adr)) {
        console.debug("  Check => External Address:", adr);
        count++;
      }
    });
    
    return count;
  };

  my.attach = function (items, expr) {
    if (items == null || expr == null || expr == 'none') {
      return 0;
    }
    
    var count = 0;
    
    items.each(function (index) {
      if ($(this).prop('checked')) {
        console.debug('  Attach:', $(this).val(), $(this).next('a').find('div:first-child').text());
        count++;
      } else {
        console.debug('  Attach: (skip)', $(this).val());
      }
    });
    
    return count;
  }

  /*-------------------------------------------------------------------------
    関数：showConfirmWindow
  -------------------------------------------------------------------------*/
  my.showConfirmWindow = function( vBaseForm, state ) {

    $("body").append( '<div id="sc_confirm_top0" class="Kj-JD" tabindex="0" role="alertdialog" aria-labelledby=":so"></div>' );
    $("#sc_confirm_top0").append( '<div id="sc_confirm_top1" class="Kj-JD" tabindex="0" role="alertdialog" aria-labelledby=":so"></div>' );
    $("#sc_confirm_top1").append( '<div id="sc_confirm_top1h" class="btnBaseAction"><button id="sc_confirm_btn_ng">×</button></div>' );
    $("#sc_confirm_top1").append( '<div id="sc_confirm_topx"></div>' );

    $("#sc_confirm_topx").append( '<div id="sc_confirm_top2" class="Kj-JD-K7 Kj-JD-K7-GIHV4" id=":so"></div>' );
    $("#sc_confirm_top2").append( my.message(state) );
    $("#sc_confirm_topx").append( '<div id="sc_confirm_top5" class="Kj-JD-Jz">' );
    $("#sc_confirm_topx").append( '<div id="sc_confirm_top6">' );

    $("#sc_confirm_top5").append( '<div id="sc_confirm_panel1">' );
    $("#sc_confirm_top5").append( '<div id="sc_confirm_panel2">' );
    $("#sc_confirm_top6").append( '<div id="sc_confirm_panel3">' );
    $("#sc_confirm_top5").append( '<div id="sc_confirm_panel_clear" style="">' );
    if (enabled(my.localSetting['opt_recipientchecker'])) {
      $("#sc_confirm_panel1").addClass( 'sc_confirm_panel1_check' );
      $("#sc_confirm_panel1").css("margin-left","10px");
    }

    //-- 宛先の取得 ----
    var domain = null;
    my.isSepaOut = false;
    var list_count = 0;
    var sub_title = null;
    
    //-- 件名の取得 ---
    if (enabled(my.localSetting['opt_subject'])) {
      sub_title = $(vBaseForm).find("form input[name='subject']")[0].value;
      my.setSubject($(vBaseForm).find("form input[name='subject']")[0],list_count);
      $("#sc_confirm_top1").append( '<div id="sc_confirm_top_sub" role="alertdialog" aria-labelledby=":so"></div>' );
      $("#sc_confirm_top_sub").append($('<div id="sc_confirm_top_subtitle" <span style="margin-left:20px"></span><a>'+ sub_title +'</a></div>'));
      $("#sc_confirm_top2").css("margin-top","7px");

      //-- 添付ファイルの取得           
      if (enabled(my.localSetting['opt_recipientchecker'])) {
        $("#sc_confirm_panel1").append( '<hr style="margin-left: 0px;">' );
      } else {
        $("#sc_confirm_panel1").append( '<hr>' );
      }
      $("#sc_confirm_btn_ng").addClass('close_sub');
      list_count++;
    } else {
        $("#sc_confirm_btn_ng").addClass('close');
    }

    if (enabled(my.localSetting['opt_attach'])) {
      $(vBaseForm).find("table input[name='attach']").each(function (index) {
        if (my.setListAttachments($(this), list_count)) {
          my.isSepaOut = true;
          list_count++;
        }
      });
    }
    $(vBaseForm).find("form input[name='to']").each(function(index){
      if( index == 0 && my.isSepaOut) {
        if (enabled(my.localSetting['opt_recipientchecker'])) {
          $("#sc_confirm_panel1").append( '<hr style="margin-left: 0px;">' );
        } else {
          $("#sc_confirm_panel1").append( '<hr>' );
        }
      }
      domain = my.setListMailAdrs( $(this), domain , list_count);
      my.isSepaOut = true;
      list_count++;
    });
    $(vBaseForm).find("form input[name='cc']").each(function(index){
      if ( index == 0 && my.isSepaOut) {
        if (enabled(my.localSetting['opt_recipientchecker'])) {
          $("#sc_confirm_panel1").append( '<hr style="margin-left: 0px;">' );
        } else {
          $("#sc_confirm_panel1").append( '<hr>' );
        }
      }
      my.isSepaOut = true;
      domain = my.setListMailAdrs( $(this), domain , list_count );
      list_count++;
    });
    $(vBaseForm).find("form input[name='bcc']").each(function(index){
      if( index == 0 && my.isSepaOut) {
        if (enabled(my.localSetting['opt_recipientchecker'])) {
          $("#sc_confirm_panel1").append( '<hr style="margin-left: 0px;">' );
        } else {
          $("#sc_confirm_panel1").append( '<hr>' );
        }
      }
      my.isSepaOut = true;
      domain = my.setListMailAdrs( $(this), domain , list_count );
      list_count++;
    });

    isChecked = " checked";
    var options = [1, 2, 3];
    
    if (!enabled(my.localSetting['opt_default_bcc'])) {
      options.push(options.shift());
    }
    
    for (var m in options) {
      var i = options[m];
      
      if (enabled(my.localSetting['action_use_flg' + i])) {
        $('#sc_confirm_panel3').append('<div id="sc_action_opt' + i + '" class="Kj-JD-Jz"><input type="radio" name="sc_action_opt" id="sc_action_opt_' + i + '" value="' + i + '"' + isChecked + '><label for="sc_action_opt_' + i + '"> ' + my.localSetting['action_disp_message' + i] + '</label>');
        isChecked = '';
      }
    }
    
    //-- 送信ボタン等配置 ----
    $("#sc_confirm_top1").append( '<div id="sc_confirm_top8" class="Kj-JD-Jl" style="display:block; padding:unset"></div>' );
    
    if (enabled(my.localSetting['opt_recipientchecker'])) {
      $("#sc_confirm_top8").append('<div id="sc_confirm_btn_ok" role="button" name="ok" class="T-I J-J5-Ji aoO L3 T-I-Zf-aw2　 ok_hidden" style="border: 1px solid rgba(0,0,0,0.1);" src="' + my.getSP() + '">' + ' ' + my.localSetting['btn_ok_caption'] + ' ' + '</div>');
    } else {
      $("#sc_confirm_top8").append('<div id="sc_confirm_btn_ok" role="button" name="ok" class="T-I J-J5-Ji aoO L3 T-I-Zf-aw2" src="' + my.getSP() + '">' + ' '  + my.localSetting['btn_ok_caption'] + ' '  + '</div>');
    }
    
    if (enabled(my.localSetting['btn_cl_use'])) {
      $('#sc_confirm_top8').append('<div id="sc_confirm_btn_cl" role="button" name="cl" class="T-I J-J5-Ji T-I-ax7 L3" src="' + my.getSP() + '">' + my.localSetting['btn_cl_caption'] + '</div>');
    }

    //-- 送信ボタンクリックのイベント ----
    $("#sc_confirm_btn_ok").click(function(event){
      if ($(this).hasClass('ok_hidden')) {
        return; 
      }
      $act = $("input:radio[name='sc_action_opt']:checked").val();
      if( $act == 1 ) {
        my.isThrough = true;
        my.disableWin();

        // create data for bcc form to, cc and bbc
        var bccMail = '';
        $(vBaseForm).find("form input[name='bcc']").each(function(index){
          bccMail === '' ? bccMail += $(this).val() : bccMail += ',' + $(this).val()
        });

        $(vBaseForm).find("form input[name='to']").each(function(index){
          bccMail === '' ? bccMail += $(this).val() : bccMail += ',' + $(this).val()
        });

        $(vBaseForm).find("form input[name='cc']").each(function(index){
          bccMail === '' ? bccMail += $(this).val() : bccMail += ',' + $(this).val()
          $(this).attr('value','');
        });

        // call event click remove data "to" in input form
        $(vBaseForm).find('table.GS>tbody tr:first-child').find('td.eV').find('div.vR').find('.vM').each(function(){
          $(this).click();
        });
        // call event click remove data "cc" in input form
        $(vBaseForm).find('table.GS>tbody tr:nth-child(2)').find('td.eV').find('div.vR').find('.vM').each(function(){
          $(this).click();
        });

        // 追加の From が指定されている場合は優先して使用する
        //
        fromAdrs = $(vBaseForm).find("form input[name='from']").val();
        if (fromAdrs == '') {
          fromAdrs = findUserEmail();
        }

        // add data into "to" and "bcc" again
        $(vBaseForm).find('table.GS>tbody tr:first-child').find('td.eV').find('textarea').val(fromAdrs);
        $('.aB.gQ.pB').click();
        // add data into "bcc" again
        $(vBaseForm).find('table.GS>tbody tr').find('td.eV').find('textarea[name=bcc]').val(bccMail);
console.debug(' From => To: ' + fromAdrs);

        my.lastEvent.trigger("click");
      }

      if( $act == 2 ) {
        my.disableWin();
      }

      if ( $act == 3 || $act == null) {
        my.isThrough = true;
        my.disableWin();
        console.log(my.lastEvent);
        var ccMail = '';
        $(vBaseForm).find("form input[name='cc']").each(function(index){
          ccMail === '' ? ccMail += $(this).val() : ccMail += ',' + $(this).val()
        });
        $('.aB.gQ.pE').click();
        $(vBaseForm).find('table.GS>tbody tr').find('td.eV').find('textarea[name=cc]').val(ccMail);
        my.lastEvent.trigger("click");
      }

      return false;
    });
    $("#sc_confirm_btn_ok, #sc_confirm_btn_cl").hover(
      function () {
        $(this).addClass("T-I-JW");
      },
      function () {
        $(this).removeClass("T-I-JW");
      }
    );

    //-- 送信キャンセルボタンクリックのイベント ----
    $("#sc_confirm_btn_ng, #sc_confirm_btn_cl").click(function(){
      my.disableWin();
      return false;
    });

    //-- レイアウト変更のイベント ----
    $("#sc_confirm_top4mode01").click(function(){
      my.setLayout();
      return false;
    });

    $("#sc_confirm_top1").css("display", "none");

    my.setLayout();
    my.setLayout();

    my.isShowForm = true
  }

  /*-------------------------------------------------------------------------
    関数：disableWin
  -------------------------------------------------------------------------*/
  my.setSubject = function( subject,list_count ) {
    $('<div/>').attr('id', 'adrslist_sub')
      .addClass('msg_adrs')
      .append(my.rcpt_subcheck(subject.value,list_count))
      .append(($('<label for="agreeBtn' + list_count +'"></label>'))
      .append(my.rcpt_sub(subject.value,list_count)))
      .appendTo('#sc_confirm_panel1');
    return null;
  }
 
  my.setListMailAdrs = function( email, primaryRcptDomain , list_count) {

    $('<div/>').addClass('msg_adrs')
      .append(my.alert(email, primaryRcptDomain))
      .append(my.rcpt_check(email, list_count))
      .append(($('<label for="agreeBtn' + list_count +'"></label>'))
      .append(my.rcpt(email, list_count)))
      .appendTo('#sc_confirm_panel1');
    
    return primaryRcptDomain != null ? primaryRcptDomain : my.domain(email.val());
  }

  my.alert = function (email, primaryRcptDomain) {
    var domain = my.domain(email.val());
    
    if (primaryRcptDomain == null || domain == null) {
      return null;
    }
    
    if (my.foreign(email.val()) && domain != primaryRcptDomain && enabled(my.localSetting['opt_alert3rd'])) {
      if ((enabled(my.localSetting['opt_recipientchecker']))) {
        return $('<div/>').addClass('rcpt_i_check').prop('title', '注意: 異なるドメインの宛先が指定されています');
      } else {
        return $('<div/>').addClass('rcpt_i').prop('title', '注意: 異なるドメインの宛先が指定されています');
      }
    }
    
    return null;
  }

  //-- 取得した件名を画面に表示する ---- 
  my.rcpt_sub = function (subject, list_count) {
    if ((enabled(my.localSetting['opt_recipientchecker']))) {
      return $('<div id="list_id' + list_count +'" />').addClass('rcpt_a_list ngcheck_color')
        .append($('<span style="position: absolute;left: -27px;">件名</span>'))
        .append($('<label for="agreeBtn' + list_count +'"><span style="margin-left:6px;cursor:pointer;">'+ subject +'</label>'));
    } else {
      return $('<div/>').addClass('rcpt_a')
        .append($('<label><span style="margin-left:6px"></span>'+ '件名:' +'<span style="margin-left:6px">'+ subject +'</label>'));
    }
  }
  
  //-- 件名に対してチェックボックスを配置する ----
  my.rcpt_subcheck = function (subject, list_count) {

	  if ((enabled(my.localSetting['opt_recipientchecker']))) {
          return $('<input id="agreeBtn' + list_count +'" type="checkbox" name="agBtn" class="check_position bg_checkbox" />').on('click', function () {
            var check_count = document.getElementsByName('agBtn');
            var all_checked = true;
            for(var i=0; i < check_count.length; i++){
              if(! check_count[i].checked){
                if(document.getElementById('sc_confirm_btn_ok').className.indexOf('ok_hidden') < 0) {
                  document.getElementById('sc_confirm_btn_ok').className += ' ok_hidden';
                }
                all_checked = false;
                break;
              }
            }
            if(all_checked) {
              console.debug('clear');
              document.getElementById('sc_confirm_btn_ok').className = document.getElementById('sc_confirm_btn_ok').className.replace( /ok_hidden/g , '');
            }
            if (! document.getElementById('agreeBtn' + list_count).checked ) {
              if(document.getElementById('list_id' + list_count).className.indexOf('ngcheck_color') < 0){
                document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /okcheck_color/g , 'ngcheck_color');
                return;
              }
            } else {
              document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /ngcheck_color/g , 'okcheck_color');
            }
          }).prop('disabled', false);
      }
  }

  //-- 全ての宛先に対して、チェックボックスを配置する ----
  my.rcpt_check = function (email, list_count) {
    var mailDsp = $('<pre/>').text(email.val()).html();
    var css = {};
    var mail_head = capitalize(email.attr('name')) + ': ';
    if (my.foreign(email.val()) && enabled(my.localSetting['opt_highlight'])) {
      css['color'] = 'red';
    }

    if ((enabled(my.localSetting['opt_recipientchecker']))) {
        return $('<input id="agreeBtn' + list_count +'" type="checkbox" name="agBtn" class="check_position" />').on('click', function () {
          var check_count = document.getElementsByName('agBtn');
          var all_checked = true;
          for(var i=0; i < check_count.length; i++){
            if(! check_count[i].checked){
              if(document.getElementById('sc_confirm_btn_ok').className.indexOf('ok_hidden') < 0) {
                document.getElementById('sc_confirm_btn_ok').className += ' ok_hidden';
              }
              all_checked = false;
              break;
            }
          }
          if(all_checked) {
            console.debug('clear');
            document.getElementById('sc_confirm_btn_ok').className = document.getElementById('sc_confirm_btn_ok').className.replace( /ok_hidden/g , '');
          }
          if (! document.getElementById('agreeBtn' + list_count).checked ) {
            if(document.getElementById('list_id' + list_count).className.indexOf('ngcheck_color') < 0){
              document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /okcheck_color/g , 'ngcheck_color');
              return;
            }
          } else {
            document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /ngcheck_color/g , 'okcheck_color');
          }
        })
        .prop('disabled', false);
    } else {
      return $('<div/>').addClass('rcpt_a')
        .append(mail_head)
        .append($('<span/>').append(mailDsp).css(css));
    }
  }

  //-- 宛先を警告画面に出力する ----
  my.rcpt = function (email, list_count) {
    var mailDsp = $('<pre/>').text(email.val()).html();
    var css = {};
    var mail_head = capitalize(email.attr('name'));
    var head_position = null;
    
    if (my.foreign(email.val()) && enabled(my.localSetting['opt_highlight'])) {
      css['color'] = 'red';
    }
    
    if ((enabled(my.localSetting['opt_recipientchecker']))) {
      return $('<div id="list_id' + list_count +'" />').addClass('rcpt_a_list ngcheck_color')
        .append($('<span class="checklist">' + mail_head + '</span>'))
        .append($('<label  style="cursor:pointer;" for="agreeBtn' + list_count +'"><span style="margin-left:6px;"></span> ' + mailDsp + '</span></label>').css(css));
    }
  }

  my.foreign = function (email) {
    var domains = my.localSetting['tenant_domain_list'].split(/, */);
    var d = my.domain(email);
    
    return length(d) > 0 && domains.indexOf(d) == -1;
  }

  my.domain = function (email) {
    var a = email.split('@');
    return a.length > 1 ? a.pop().replace('>', '') : '';
  }

  //-- 添付ファイルににチェックボックスを配置する ----
  my.setListAttachments = function (attach, list_count) {
    if (!attach.prop('checked')) {
      return false;
    }
    
    var a = attach.next('a');
    var css = {
      'cssText': 'color: #15c!important'
    };

    if ((enabled(my.localSetting['opt_recipientchecker']))) {
      $('<div/>').addClass('msg_adrs')
        .append($('<div/>').addClass('rcpt_f_check').prop('title', '注意: 添付ファイルを確認してください'))
//        .append($('<input id="agreeBtn' + list_count +'" type="checkbox" name="agBtn" class="check_position" onClick="'+ onclick_script +'" />').prop('disabled', false))
        .append ($('<input id="agreeBtn' + list_count +'" type="checkbox" name="agBtn" class="check_position" />').on('click', function () {
            var check_count = document.getElementsByName('agBtn');
            var all_checked = true;
            for(var i=0; i < check_count.length; i++){
              if(! check_count[i].checked){
                if(document.getElementById('sc_confirm_btn_ok').className.indexOf('ok_hidden') < 0) {
                  document.getElementById('sc_confirm_btn_ok').className += ' ok_hidden';
                }
              all_checked = false;
              break;
              }
            }
            if(all_checked) {
             console.debug('clear');
             document.getElementById('sc_confirm_btn_ok').className = document.getElementById('sc_confirm_btn_ok').className.replace( /ok_hidden/g , '');
            }
        if (! document.getElementById('agreeBtn' + list_count).checked ) {
            if(document.getElementById('list_id' + list_count).className.indexOf('ngcheck_color') < 0){
              document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /okcheck_color/g , 'ngcheck_color');
              return;
            }
          } else {
            document.getElementById('list_id' + list_count).className = document.getElementById('list_id' + list_count).className.replace( /ngcheck_color/g , 'okcheck_color');
          }
        }).prop('disabled', false))
        .append(($('<label style="cursor:pointer;" for ="agreeBtn' + list_count +'">'))
        .append($('<span class="checklist">添付</span>'))
        .append($('<div id="list_id' + list_count +'" />').addClass('rcpt_a_list ngcheck_color')
        .append($('<span style="margin-left:6px">'))
        .append(a.find('div:first-child').text()).css(css)))
        .appendTo('#sc_confirm_panel1');
    
      return true;
    } else {
      $('<div/>').addClass('msg_adrs')
        .append($('<div/>').addClass('rcpt_f').prop('title', '注意: 添付ファイルを確認してください'))
        .append($('<div/>').addClass('rcpt_a')
        .append($('<a/>').attr('href', a.attr('href')).attr('target', '_blank')
        .append(a.find('div:first-child').text()).css(css)))
        .appendTo('#sc_confirm_panel1');
    
    return true;
    }
  }

  my.message = function (state) {
    var alertExtern = my.restoreBreak(my.localSetting['alert_message']);
    var alertAttach = my.restoreBreak(my.localSetting['alert_attach']);
    
    return state.attach == 0 ? alertExtern : state.count < state.shreshold ? alertAttach : alertExtern + '<br/>' + alertAttach;
  }

  my.restoreBreak = function (value) {
    if (value == null) {
      return '';
    }
    
    return value.replace(/\r/g, "\n").replace(/\n+/g, "<br />");
  }

  /*-------------------------------------------------------------------------
    関数：disableWin
  -------------------------------------------------------------------------*/
  my.getSP = function() {
    return chrome.extension.getURL("images/space.png");
  }


  /*-------------------------------------------------------------------------
    関数：disableWin
  -------------------------------------------------------------------------*/
  my.disableWin = function() {
    $("#sc_confirm_top0").remove();
  }

  /*-------------------------------------------------------------------------
    関数：getAdrs2domEN
  -------------------------------------------------------------------------*/
  my.getAdrs2domEN = function( email ) {
    if( email.match(/.*<(.*)>/) ) {
      email = RegExp.$1;
    }
    return email.split('@')[1];
  }

  /*-------------------------------------------------------------------------
    関数：setLayout
  -------------------------------------------------------------------------*/
  my.setLayout = function() {

    var top1 = $("#sc_confirm_top1");
    if( top1.length == 0 ) return;

    var maxHeight = $('div#sc_confirm_top0').prop('clientHeight') - 551;
    
    if (maxHeight < 200) {
      maxHeight = 200;
    }
    
    $('div#sc_confirm_panel1').css('max-height', maxHeight);
    $('div#sc_confirm_top8').css('margin-left', '-' + $('div#sc_confirm_top1').css('padding-left'));

    //-- 透過用の画面の重なり優先度を一つ下げる ----
    $("#sc_confirm_top0").css("z-index", $("#sc_confirm_top0").css("z-index")-1);

    /*-- innerSizeから、余白(5px*2)と.Kj-JDのpadding(42px*2)
    */
    var size_hh = $('#sc_confirm_top0').prop('clientHeight') - 307;
    var padding_w = parseInt(top1.css("padding-left")) + parseInt(top1.css("padding-right"));
    var padding_h = parseInt(top1.css("padding-top")) + parseInt(top1.css("padding-bottom"));

    top1.css("max-height", String(size_hh) + "px");
    top1.css("left", String((window.innerWidth-top1.width()-padding_w)/2) + "px");
    top1.css("top",  String((window.innerHeight-top1.height()-padding_h)/2) + "px");
    top1.css("padding", "30px 42px");

    $("#sc_confirm_top1").css("display", "block");

  }

  return my;
}(mmSendCheckerSM));

$(document).ready(function() {

  //-- clickイベントより送信ボタンクリック判定 ----
  document.addEventListener( "click", function(event) {
    try{
      return mmSendCheckerGB.SendCheck(event);
    } catch( e ) {
      console.debug( e );
      mmSendCheckerGB.disableWin();
      mmSendCheckerGB.lastEventTimer.stopPropagation();
      alert( '誤送信チェック機能で内部エラーが発生しました。' );
      location.reload(true);
      return false;
    }
  },true);

  document.addEventListener( "keydown", function(event) {

    try{
      if( mmSendCheckerGB.isShowForm ) {
        //-- ESC 押下 ----
        if( event.keyCode == 27 ) {
          mmSendCheckerGB.disableWin();
        }
        event.stopPropagation();
      } else {
        if( ( event.ctrlKey == true || event.metaKey == true ) && event.keyCode == 13 ) {
          return mmSendCheckerGB.SendCheck(event);
        }
        if ( event.keyCode == 13 || event.keyCode == 32 ) {
          var target = event.target;
          //-- 送信・送信＆アーカイブ以外のボタンは処理中断 -------------------------------------
          if (($(target).text() == '送信' || indexOf($(target).text(), '送信') == 0) || ($(target).text() == 'Send' || indexOf($(target).text(), 'Send') == 0)) {
          return mmSendCheckerGB.SendCheck(event);
          }
        }
      }
    } catch( e ) {
      return false;
    }
  },true);

  var resizeTimer = false;
  window.addEventListener( "resize", function(event) {
    if (resizeTimer !== false) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function() {
      mmSendCheckerGB.setLayout();
      return true;
    }, 500);
    return true;
  },true);

  timerGetPolicy = setInterval("getPolicy()",5000);
})

function findUserEmail() {
  var userEmail = undefined;
  
  $('div#gb').find('div').each(function () {
    var value = $(this).text();
    
    if (email(value)) {
      userEmail = value;
      return false;
    }
  });
  
  if(!userEmail){
    $('header#gb').find('div').each(function () {
      var value = $(this).text();
      if (email(value)) {
        userEmail = value;
        return false;
      }
    });
  }

  if (userEmail) {
    return userEmail;
  }
  
  return 'notfound@example.jp';
}

function getPolicy() {
  //-- メールアドレスの取得とオートコンプリートの削除 ----
  mmSendCheckerGB.targetConfig = findUserEmail();
console.debug( " Target Address", mmSendCheckerGB.targetConfig );

  if( mmSendCheckerGB.targetConfig.length > 0 && mmSendCheckerGB.targetConfig.indexOf('@') != -1 ) {
    chrome.extension.sendMessage({"command": "getAllKey", "key": mmSendCheckerGB.targetConfig, "url": location.href}, function(response) {
console.debug( "SendMessage Receive Response", response );
      if (response == undefined) {
        if (mmSendCheckerGB.attemptCount++ < 5) {
          return;
        }
        console.debug("Failed to retrieve policy. Give up.");
      }
      mmSendCheckerGB.localSetting = response;
      clearInterval(timerGetPolicy);
      // 空値でなく、'opt_autocomplete_hide'が'true'の場合、オートコンプリートを非表示にする。
      if (mmSendCheckerGB.localSetting['opt_autocomplete_hide'] != 'null' && enabled(mmSendCheckerGB.localSetting['opt_autocomplete_hide'])) {
        var link = document.createElement( 'link' );
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.extension.getURL('css/autocomplete-hide.css');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
      }

      // 空値でなく、'opt_link_invalid'が'true'の場合、「To」「Cc」「Bcc」 の宛先選択画面へのリンクを無効にする。
      if (mmSendCheckerGB.localSetting['opt_link_invalid'] != 'null' && enabled(mmSendCheckerGB.localSetting['opt_link_invalid'])) {
        var link_invalid = document.createElement( 'link' );
        link_invalid.rel = 'stylesheet';
        link_invalid.type = 'text/css';
        link_invalid.href = chrome.extension.getURL('css/link-invalid.css');
        var link_invalid_head = document.getElementsByTagName('head')[0];
        link_invalid_head.appendChild(link_invalid);
      }
    });
  }
}

function enabled(value) {
  return value == true || value == 'true';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function email(s) {
  return length(s) < 65 && indexOf(s, ' ') == -1 && indexOf(s, '@') != -1 && s.match('^[A-Za-z0-9]') && s.match('[A-Za-z0-9]$');
}

function indexOf(s, v) {
  return s == null ? -1 : s.indexOf(v);
}

function length(s) {
  return s == null ? 0 : s.length;
}
