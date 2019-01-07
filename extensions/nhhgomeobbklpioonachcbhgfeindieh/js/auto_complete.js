
var cid = 0;
var searchurl = "http://apps.searchalgo.com/search/index.php?category=###param0###&s=sdnt&q=###param1###";
var _typeSearch = "web";

if (!(!localStorage['searchurl'] || localStorage['searchurl'] == undefined))
{
	searchurl = localStorage["searchurl"];	
}

function changeType(typeSearch){

    _typeSearch = typeSearch;
}

if (localStorage["cid"]) { 
   cid = localStorage["cid"];
}

 function showAutoComplate() {

    $("input.searchInput").bind("autocompleteselect", function (event, ui) {
        //console.log(ui.item.value.length);
        gotosearchpage();


    }).autocomplete({
        appendTo: "#list",
        source: function (request, response) {
            if (request.term.length < 2) {
                return;
            }

            var u ="http://sug.searchalgo.com/search/index_sg.php?q="+ request.term ;
            $.ajax({
                url: u,
                dataType: "json",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 5,
                    name_startsWith: request.term
                },

                success: function (data) {

                    response($.map(data[1], function (item) {
                        return {

                            label: item
                        }
                    }));
                },
            });
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {

        //debugger;
        return $("<li />")
   .data("ui-autocomplete-item", item)
   .append("<a>" + item.label + "</a>")
   .appendTo(ul);
    };

}



function gotosearchpage() {
    var qry = encodeURIComponent($('.searchInput').val());
    
    if (qry) {
        searchurl = searchurl.replace("###param0###", _typeSearch);
        searchurl = searchurl.replace("###param1###", qry);
        
        window.open(searchurl + "&cid=" + cid,"_self");
        
    }
    else {
        $('.searchInput').attr("placeholder", 'Search Something...');
    }
}

$( document ).ready(function() {
    showAutoComplate();

     $(".searchBtn").click(function () {
        gotosearchpage();
    });
     
     $(".searchInput").keydown(function (e) {
         if (e.which == 13)
             gotosearchpage()
     });

});
