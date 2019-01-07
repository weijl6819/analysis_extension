/**
 * @desc DOM HIGHLIGHTER
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-11-25
 */

$(function(){

    var background = chrome.extension.getBackgroundPage();

    background.init(function(data){

        var template = '<li class="item">' +
            '<span class="s">{{selector}}</span>' +
            '<span class="c" style="background-color:{{color}};"></span>' +
            '<span class="btn btn_del">DEL</span>' +
            '</li>';

        var item;
        var item_list = data.item_list;

        if(item_list.length != 0){
            for(var i = 0, j=item_list.length; i<j; i++){
                item = template.replace('{{selector}}', item_list[i].selector).replace('{{color}}', item_list[i].color);
                $(item).appendTo('#dom_list');
            }
        }

        function add(){
            var $selector = $('#selector');
            var selector = $.trim($selector.val());
            var color = $('#color').val();

            if(selector !== ''){
                item = template.replace('{{selector}}', selector).replace('{{color}}', color);
                $(item).appendTo('#dom_list');
                $selector.val('');

                background.add({
                    selector: selector,
                    color: color
                });
            }
        }


        $('#selector').keyup(function(e){
            if(e.keyCode == 13){
                add();
            }
        });
        $('#dom_list').click(function(e){
            var $target = $(e.target);

            // add item
            if($target.hasClass('btn_add')){
                add();
            }

            // remove item
            if($target.hasClass('btn_del')){
                var remove = $target.siblings('.s').html();

                if(remove !== ''){
                    $target.parent().remove();

                    background.remove({
                        selector: remove
                    });
                }
            }
        });
    });

});



