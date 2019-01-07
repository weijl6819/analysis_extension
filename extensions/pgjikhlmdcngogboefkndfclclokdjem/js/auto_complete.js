var cid = 0;
var searchurl = "http://movie.eanswers.com/search/?s=aaaa&q=";
var searchSiteSrc = "http://www.movixhub.com/search?q=";
var _typeSearch = "web";




function changeType(typeSearch) {

    _typeSearch = typeSearch;
}



if (localStorage["cid"]) {
    cid = localStorage["cid"];
}

function showAutoComplate() {


    $("input.searchInput").bind("autocompleteselect", function(event, ui) {
        //console.log(ui.item.value.length);
        gaReport("autocomplete", "click");
        gotosearchpage();
    }).autocomplete({
        appendTo: "#list",
        source: function(request, response) {
            if (request.term.length < 2) {
                return;
            }

            var u = "http://sug.eanswers.com/search/index_sg.php?q=" + request.term;
            $.ajax({
                url: u,
                dataType: "json",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 5,
                    name_startsWith: request.term
                },

                success: function(data) {

                    response($.map(data[1], function(item) {
                        return {

                            label: item
                        }
                    }));
                },
            });
        },
		
        open: function(e, ui) {
            $('.ui-autocomplete').append('<div class="autocomolete_buttons"><button class="btn btn-primarys searchbtn ">Web Search</button><button class="btn btn-primarys sitebtn">Movie Search</button></div>');
        },
        close: function(event, ui){
            gaReport("autocomplete", "open");
        }
    }).data("ui-autocomplete")._renderItem = function(ul, item) {
        var other = String(item.value).replace(
            new RegExp(this.term, "gi"),
            "");
        if(other != '') {
            var newText = String(item.value).replace(
                new RegExp(other, "gi"),
                "<span class='ui-state-highlight'>$&</span>");
        } else {
            newText = String(item.value);
        }

        //debugger;
        return $("<li />")
            .data("ui-autocomplete-item", item)
            .append("<a>" + newText+ "</a>")
            .appendTo(ul);
    };

}
function gotosearchpage(type,text) {
    if (!(!localStorage['searchurl'] || localStorage['searchurl'] == undefined)) {
        searchurl = localStorage["searchurl"];
    }
    if (type =="site") {
        searchurl = searchSiteSrc;
        if(!(!localStorage['searchLink'] || localStorage['searchLink'] == undefined)){
            searchurl = localStorage["searchLink"];
        }
    }else{
        type = "main";
    }

    if(!(text)){
        text = $('.searchInput').val();
    }
    var qry = encodeURIComponent(text);
     searchurl = searchurl + qry;


    if (qry) {
        gaReport("search",type);

        var s = searchurl + "&cid=" + cid;

        chrome.tabs.update(null,{"url": s, "selected": true});
    } else {
         $('.searchInput').attr("placeholder", 'Search Something...');
    }
}

$(document).ready(function() {
    showAutoComplate();


});
