function initializeTooltips(){$(".has-tip").each(function(){$(this).qtip({content:{text:$(this).next(".tip")}})})}function equalize(){var i=$("#front").height(),n=$("#back .inner-back"),t=n.outerHeight()-n.height();n.css({height:i-t})}function setupFlipCardClickHandlers(){var i=$(".bg-overlay");$(document).on("click",".info-icon",function(n){var t=$(this),e=t.parents(".flip-container");e.addClass("vis"),e.parents(".panel").addClass("fix-z"),i.addClass("vis").css("pointer-events","inherit")}),$(document).on("click",".info-icon-back, .bg-overlay",function(n){var t=($(this),$(".flip-container.vis"));t.removeClass("vis");var e=t.parents(".panel");setTimeout(function(){e.removeClass("fix-z")},400),i.removeClass("vis").css("pointer-events","none")})}$(document).ready(function(){$(document).foundation(),initializeTooltips(),setupFlipCardClickHandlers()});