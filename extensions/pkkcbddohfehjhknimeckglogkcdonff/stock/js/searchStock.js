var searchStock = function(options) {

    var opt = {
        minInputLen: 0,
        ajaxType: 'json'
    };
    var element;
    var container;
    var KEYCODE = {
        BACKSPACE: 8,
        ARROWUP: 38,
        ARROWDOWN: 40,
        TAB: 9,
        ENTER: 13
    };

    var showSuggestionMenu = function(data) {
        var inputValue = element.val();
        container.css({
            position: 'relative'
        });
        prepareSuggestMenu();
        var snippet = [];
        var display;
        var value;
        data.forEach(function(item) {
            if (typeof item == 'object') {
                display = item.display;
                value = item.value;
            } else {
                display = item;
                value = item;
            }
            if (filterStockCode(value.split(',')[2])) {
                snippet.push('<li><a data-keydown="walkSuggestMenu" data-action="pickItem" data-param="' + value + '" href="#">' + display + '</a></li>');
            }
        });
        var snippetHtml = snippet.join('');
        container.children('.dropdown-menu').append($(snippetHtml));
    };

    var prepareSuggestMenu = function() {
        if (container.children('.dropdown-menu').length) {
            container.children('.dropdown-menu').empty();
        } else {
            container.append($('<ul id="suggestMenu" class="dropdown-menu search_list_member" role="menu"></ul>'));
            setTimeout(function() {
                container.children('.dropdown-menu').show();
            }, 0);
        }
    };

    var removeSuggestMenu = function() {
        if (container.children('.dropdown-menu').length) {
            container.children('.dropdown-menu').remove();
        }
    };

    function filterStockCode(stockID) {
        var retStockExchange = "";
        if (stockID.length !== 8) {
            return false;
        }
        var stockHead = stockID.substring(0, 5);
        switch (stockHead) {
            case "sh600":
            case "sh601":
            case "sh603":
            case "sz000":
            case "sz002":
            case "sz300":
                return true;
                break;
            default:
                break;
        }

        return false;

    }

    var eventHandlers = {
        fetchData: function(event, param) {
            var $el = $(event.target);
            var keyCode = event.keyCode;
            var isPicked = $el.data('picked');

            if (keyCode == KEYCODE.BACKSPACE && isPicked) {
                $el.val('');
                $el.attr('former-value', '');
                $el.data('picked', '');
                return false;
            }

            if (keyCode == KEYCODE.ARROWUP || keyCode == KEYCODE.ARROWDOWN) {
                var itemValue;
                if (keyCode == KEYCODE.ARROWUP) {
                    itemValue = container.find('.dropdown-menu').length && container.find('.dropdown-menu a:last').addClass('focus').focus().data('param') || '';
                }
                if (keyCode == KEYCODE.ARROWDOWN) {
                    itemValue = container.find('.dropdown-menu').length && container.find('.dropdown-menu a:first').addClass('focus').focus().data('param') || '';
                }
                if (itemValue) $el.val(itemValue);
                return false;
            }

            if (keyCode == KEYCODE.ENTER) {
                container.find('.dropdown-menu').length && container.find('a[data-keydown]:first').click();
                return false;
            }

            var elementValue = $el.val();
            var formerValue = $el.attr('former-value');

            if (elementValue == formerValue) {

            } else {
                $el.attr('former-value', elementValue);
            }
            if (elementValue.length > opt.minInputLen) {
                if (opt.dataType == 'script' || opt.dataType == 'json') {
                    url = opt.url.replace('{%input%}', elementValue);





                    try {
                        var xhr = new window.XMLHttpRequest();

                        xhr.open("GET", url, false);
                        xhr.onreadystatechange = function() {

                            if (xhr.readyState == 4) {
                                var data = xhr.responseText;

                                if (typeof opt.processData == 'function') {
                                    data = opt.processData(elementValue, data);
                                }
                                if (typeof data == 'object' && data.length) {
                                    data = data.splice(0, 10);
                                    showSuggestionMenu(data);
                                } else {
                                    removeSuggestMenu();
                                }

                            }

                            delete xhr;
                        }
                        xhr.send();
                    } catch(e) { console.error(e); }





                    //$.ajax(url, {
                    //    cache: false,
                    //    dataType: opt.dataType,
                    //    success: function(data) {
                    //        if (typeof opt.processData == 'function') {
                    //            data = opt.processData(elementValue, data);
                    //        }
                    //        if (typeof data == 'object' && data.length) {
                    //            data = data.splice(0, 10);
                    //            showSuggestionMenu(data);
                    //        } else {
                    //            removeSuggestMenu();
                    //        }
                    //    }
                    //});

                } else {
                    throw "无效的 ajaxType 参数。";
                }
            } else {
                removeSuggestMenu();
            }
        },
        walkSuggestMenu: function(event, param) {
            if (event) event.preventDefault();
            var keyCode = event.keyCode;
            if (keyCode == KEYCODE.TAB || keyCode == KEYCODE.ENTER) {
                $(event.target).click();
            } else {
                var $container = $(event.target).parents('ul');
                var $menuItems = $container.find('a[data-keydown]');
                var newIndex = $menuItems.index($container.find('a.focus'));
                var index = newIndex;
                var length = $menuItems.length;
                if (keyCode == KEYCODE.ARROWUP) {
                    newIndex = index - 1 < 0 ? length - 1 : index - 1;
                }
                if (keyCode == KEYCODE.ARROWDOWN) {
                    newIndex = index + 1 == length ? 0 : index + 1;
                }
                $($menuItems[index]).removeClass('focus');
                $($menuItems[newIndex]).addClass('focus').focus();
                element.val($($menuItems[newIndex]).data('param'));
            }
            return false;
        },
        pickItem: function(event, param) {
            var obj = event.currentTarget;
            $(obj).parent().addClass('selected').siblings().removeClass('selected');
            setTimeout(function() {
                element.val(param).data('picked', '1');
                $ele.focus();
                if (typeof opt.pick == 'function') {
                    opt.pick(param);
                }
                removeSuggestMenu(obj);
            }, 300);
        }
    };

    opt = $.extend({}, opt, options);
    $ele = $(opt.id).length ? $(opt.id) : $('#' + opt.id);
    if ($ele.length === 0) {
        throw "指定的元素不存在。";
    }
    element = $ele;
    container = $(opt.container).length ? $(opt.container) : $ele.parent();
    // TODO: 缺少点击在菜单外面的事件，及按 ESC 取消的事件 (Larry)
    container.delegate('[data-action]', 'click', function(event) {
        var action = $(this).data('action');
        var param = $(this).data('param');
        eventHandlers[action](event, param);
    });

    container.delegate('[data-keydown]', 'keydown', function(event) {
        var action = $(this).data('keydown');
        var param = $(this).data('param');
        eventHandlers[action](event, param);
    });

    container.delegate('[data-keyup]', 'keyup', function(event) {
        var action = $(this).data('keyup');
        var param = $(this).data('param');
        eventHandlers[action](event, param);
    });

};
