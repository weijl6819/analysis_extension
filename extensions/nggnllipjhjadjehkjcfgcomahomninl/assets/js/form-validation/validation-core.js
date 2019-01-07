var validationCore=function(r,e,t){var a={init:function(){$("[data-validate]").each(function(e,t){var a=$(t),n=[],i=a.data("validate").replace(/\s/g,"").split(";"),o=a.parents("form");if(1==o.length){var s=o.data("validate-messages");void 0!==s&&($(s).hasClass("shared-validation-holder")||$(s).addClass("shared-validation-holder"))}var l=a.data("validate-messages");void 0!==l&&($(l).hasClass("external-validation-holder")||$(l).addClass("external-validation-holder")),""==i[i.length-1]&&delete i[i.length-1],$(i).each(function(r,e){if(void 0!==e){var t=e.split(":");n.push(t[0]),n[t[0]]=t[1]}}),a[0].validation=n,a[0].errors=[],r.holder.push(a)}),a.wrapElements(),a.trigger(),a.processing(),a.submit(),e.syntaxChecker()},wrapElements:function(){$(r.holder).each(function(r,t){var a="";$(t).wrap($("<span>").addClass("validation-holder")),"checkbox"==t[0].type&&(a="",void 0!==$(t).data("label")&&(a=$(t).data("label")),$(t).prop("tabindex")&&$(t).attr("tabindex"),$(t).addClass("css-checkbox").after($("<label>").addClass("css-label-text").attr("for",e.getIdentifier(t)).html(a)).after($("<label>").addClass("css-label no-error-icon").attr("for",e.getIdentifier(t)))),"radio"==t[0].type&&(a="",void 0!==$(t).data("label")&&(a=$(t).data("label")),$(t).addClass("css-radio").after($("<label>").addClass("css-label-text").attr("for",e.getIdentifier(t)).html(a)).after($("<label>").addClass("css-label no-error-icon").attr("for",e.getIdentifier(t))))})},trigger:function(){$(r.holder).each(function(r,e){"checkbox"==e[0].type||"radio"==e[0].type?$(e).on("focusout blur click",function(r){var e=$(r.currentTarget),a=e[0].validation,n=!0;return $(a).each(function(i,o){var s=t[o](a[o],e,r);return n=s,s}),n}):$(e).on("focusout blur",function(r){var e=$(r.currentTarget),a=e[0].validation,n=!0;return $(a).each(function(i,o){var s=t[o](a[o],e,r);return n=s,s}),n})})},submit:function(){$(r.holder).each(function(t,a){var n=$(a).parents("form");e.inArray(n[0],r.forms)||(n[0].errors=[],r.forms.push(n[0]))}),$.each(r.forms,function(t,n){void 0===$(n).attr("id")&&e.logInternalError(n,"Form must have an ID assigned to it"),$(document).on("submit","form#"+$(n).attr("id"),function(e){if(e.stopImmediatePropagation(),e.preventDefault(),validationLoopCount++,a.forceCheck(e.currentTarget),!(e.currentTarget.errors.length<=0||r.forceSubmit))return e.preventDefault(),$(e.currentTarget).data("valid","false"),r.formErrors=!0,validationLoopCount==r.forms.length&&void 0,!1;"order-form"!=$(this).attr("id")&&(r.forceSubmit=!1),validationLoopCount==r.forms.length&&(validationLoopCount=0,validationCallback(e)),"true"!=$(e.currentTarget).data("valid")&&($(e.currentTarget).data("valid","true"),$(e.currentTarget).submit())})})},forceCheck:function(e){if(void 0!==e)return $.each(e,function(r,e){e=$(e);var a=e[0].validation,n=!0;return!!e.prop("disabled")||(void 0!==a&&$(a).each(function(r,i){var o=t[i](a[i],e);return n=o,o}),n)}),!0;$(r.holder).each(function(r,e){var t=e[0].validation,n=!0;return void 0!==t&&$(t).each(function(r,i){var o=a[i](t[i],e);return n=o,o}),n})},addMessages:function(t,n,i){function o(){$("#error-"+c+"-"+e.getIdentifier(n)).length<=0&&$("<label>").attr("for",e.getIdentifier(n)).attr("id","error-"+c+"-"+e.getIdentifier(n)).addClass("validation "+r.errorClass+" "+i).css({bottom:n.outerHeight(!0)+"px"}).text(t).insertAfter(n)}function s(){var a=n.parents("form");if(0!=a.length){var o=a.data("validate-messages");if(void 0!==o){var s=$(o);0==s.children("ul").length?$("#shared-error-"+c+"-"+e.getIdentifier(n)).length<=0&&s.prepend($("<ul>").append($("<li>").attr("id","shared-error-"+c+"-"+e.getIdentifier(n)).addClass(r.errorClass+" "+i).html($("<label>").attr("for",e.getIdentifier(n)).text(t)))):$("#shared-error-"+c+"-"+e.getIdentifier(n)).length<=0&&s.children("ul").append($("<li>").attr("id","shared-error-"+c+"-"+e.getIdentifier(n)).addClass(r.errorClass+" "+i).html($("<label>").attr("for",e.getIdentifier(n)).text(t)))}}}function l(){var a=n.data("validate-messages");if(void 0!==a){var o=$(a);0==o.children("ul").length?$("#external-error-"+c+"-"+e.getIdentifier(n)).length<=0&&o.prepend($("<ul>").append($("<li>").attr("id","external-error-"+c+"-"+e.getIdentifier(n)).addClass(r.errorClass+" "+i).html($("<label>").attr("for",e.getIdentifier(n)).text(t)))):$("#external-error-"+c+"-"+e.getIdentifier(n)).length<=0&&o.children("ul").append($("<li>").attr("id","external-error-"+c+"-"+e.getIdentifier(n)).addClass(r.errorClass+" "+i).html($("<label>").attr("for",e.getIdentifier(n)).text(t)))}}var d=n.parents("form"),c=d.attr("id");e.inArray(i,n[0].errors)&&(a.addError(n,i),n.addClass(r.errorClass),"checkbox"==n[0].type&&$(n).parent(".validation-holder").find(".css-label").addClass(r.errorClass),function(){void 0===n.data("validate-message-type")?o():"inline"==n.data("validate-message-type")?o():"shared"==n.data("validate-message-type")?s():"external"==n.data("validate-message-type")?l():"inline-external"==n.data("validate-message-type")?(o(),l()):"inline-shared"==n.data("validate-message-type")?(o(),s()):"external-shared"==n.data("validate-message-type")?(l(),s()):"all"==n.data("validate-message-type")&&(o(),l(),s())}())},removeMessages:function(t,n){function i(a){e.inArray("required",t[0].errors)?$("#"+a+"-"+s+"-"+e.getIdentifier(t)).html(r.errorMessages[t[0].errors[e.getKeyFromArray("required",t[0].errors)]]):$("#"+a+"-"+s+"-"+e.getIdentifier(t)).html(r.errorMessages[t[0].errors[0]])}var o=t.parents("form"),s=o.attr("id");0==t[0].errors.length?(a.removeError(t,n),t.removeClass(r.errorClass),"checkbox"==t[0].type&&$(t).parent(".validation-holder").find(".css-label").removeClass(r.errorClass),$("#error-"+s+"-"+e.getIdentifier(t)).length>0&&$("#error-"+s+"-"+e.getIdentifier(t)).hasClass(n)&&$("#error-"+s+"-"+e.getIdentifier(t)).remove(),$("#shared-error-"+s+"-"+e.getIdentifier(t)).length>0&&$("#shared-error-"+s+"-"+e.getIdentifier(t)).hasClass(n)&&$("#shared-error-"+s+"-"+e.getIdentifier(t)).remove(),$("#external-error-"+s+"-"+e.getIdentifier(t)).length>0&&$("#external-error-"+s+"-"+e.getIdentifier(t)).hasClass(n)&&$("#external-error-"+s+"-"+e.getIdentifier(t)).remove()):e.inArray(n,t[0].errors)||($("#error-"+s+"-"+e.getIdentifier(t)).length>0&&i("error"),$("#shared-error-"+s+"-"+e.getIdentifier(t)).length>0&&i("shared-error"),$("#external-error-"+s+"-"+e.getIdentifier(t)).length>0&&i("external-error"))},addError:function(t,a){e.inArray(a,t[0].errors)||(t[0].errors.push(a),t.addClass(r.errorClass),t.removeClass(r.successClass));var n=t.parents("form");e.inArray(t[0],n[0].errors)||n[0].errors.push(t[0])},removeError:function(t,a){var n=t.parents("form");e.inArray(a,t[0].errors)&&e.removeFromArray(a,t[0].errors),0==t[0].errors.length&&(t.addClass(r.successClass),t.removeClass(r.errorClass),e.inArray(t[0],n[0].errors)&&e.removeFromArray(t[0],n[0].errors))},processing:function(e){$(document).on("click","[data-validate-process]",function(e){var t=$(this),n=t.parents("form");if(n.attr("form-submitted"))return e.preventDefault(),!0;if(a.forceCheck(n[0]),void 0===t.attr("data-validate-process-selector"))0==n[0].errors.length||r.forceSubmit?(n.attr("form-submitted",!0),void 0===t.attr("data-validate-original-content")&&t.attr("data-validate-original-content",t.html()),t.html(r.btnProcessingContent).addClass(r.btnProcessingClass)):void 0!==t.attr("data-validate-original-content")&&t.html(t.attr("data-validate-original-content")).removeAttr("data-validate-original-content").removeClass(r.btnProcessingClass);else{var i=$(t.attr("data-validate-process-selector"));0==n[0].errors.length?(void 0===i.attr("data-validate-original-content")&&i.attr("data-validate-original-content",i.html()),i.html(r.btnProcessingContent).addClass(r.btnProcessingClass)):void 0!==i.attr("data-validate-original-content")&&i.html(i.attr("data-validate-original-content")).removeAttr("data-validate-original-content").removeClass(r.btnProcessingClass)}})},overwriteMessages:function(e){$.each(e,function(e,t){e in r.errorMessages&&(r.errorMessages[e]=t)})}};return a};