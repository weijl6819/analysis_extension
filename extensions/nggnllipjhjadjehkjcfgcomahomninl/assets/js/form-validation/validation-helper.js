var validationHelper=function(r,n){var t={inArray:function(r,n){for(var t in n){if(n[t]===r)return!0}return!1},getFromArray:function(r,n){for(var t in n){var e=n[t];if(e===r)return e}return!1},getKeyFromArray:function(r,n){for(var t in n){if(n[t]===r)return t}return!1},removeFromArray:function(r,n){for(var t in n){if(n[t]===r)return n.splice(t,t+1),!0}return!1},getIdentifier:function(r){var n;return void 0!==r.attr("id")?n=r.attr("id"):void 0!==r.attr("name")?n=r.attr("name"):void 0===$(r).data("internal-error")&&t.logInternalError(r,"Field must have a unique attribute i.e. name, id"),n},syntaxChecker:function(){$(r.holder).each(function(r,e){t.getIdentifier(e);var i=e[0].validation;$(i).each(function(r,i){void 0!==n[i]||$.isFunction(n[i])||t.logInternalError(e,"Validation attribute '"+i+"' doesn't exits")})})},logInternalError:function(n,t){$(n).attr("data-internal-error","").css(r.internalErrorStyling),void 0,void 0,void 0,void 0}};return t};