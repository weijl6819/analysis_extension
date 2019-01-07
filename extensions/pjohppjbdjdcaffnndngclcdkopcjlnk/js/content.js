function insertContent(content, browserClick=false) {

    var $parent = $('<div/>', {
            'id':'frostty-wrapper'
        });

    // If content already doesn't exist on page => insert
    if( $("#frostty-wrapper").length === 0 ){
        $parent.html(decodeURIComponent(content));
        $parent.appendTo('body');
    } else {
        if(browserClick=="false") {
            $("#frostty-container").show();
        } else {
            if($("#frostty-container").is(":visible")) {
                $("#frostty-container").hide();
            } else {
                $("#frostty-container").show();
            }
        }
    }

}
