var cacheImages = [];
function randomBackground() {
    localStorage.removeItem('background-image-extension');
    pickImageForBackground();
}

function addImagesToSelect(imageList) {

    cacheImages = imageList;

    for(var imgIds in imageList){
        var image = imageList[imgIds];

        var img1 = $('<img>'); //Equivalent: $(document.createElement('img'))
        img1.attr('src', '/images/'+image.name);
        img1.attr('role', 'select-image');
        img1.appendTo('#image-selector');
    }

    $("img[role='select-image']").on('click', function(e) {
        localStorage.setItem('background-image-extension', e.target.src);
        $('body').css({
            'background-image': 'url(' + e.target.src + ')'
        });
    });

}

function pickImageForBackground() {

    if(localStorage.getItem('background-image-extension')){
        return
    }
    var image = cacheImages[Math.floor(Math.random()*cacheImages.length)];

    $('body').css({
        'background-image': 'url(/images/'+image.name + ')'
    });
}

$(document).ready(function () {
    chrome.runtime.getPackageDirectoryEntry(function(s) {

        s.getDirectory('images', {}, function(imagesDirectory){

            var dirReader = imagesDirectory.createReader();
            var buffer = [];
            getEntries = function(callback) {
                dirReader.readEntries(function(results) {
                    if (results.length) {
                        for(var idx in results){
                            buffer.push(results[idx]);
                        }
                        getEntries(callback);
                    }else{
                        callback(buffer);
                    }
                }, function(error) {
                    /* handle error -- error is a FileError object */
                });
            };

            getEntries(function(buffer){
                addImagesToSelect(buffer);
                pickImageForBackground(buffer);
            });
        });

    });

    if(localStorage.getItem('background-image-extension')){
        var image_path = localStorage.getItem('background-image-extension');

        $('body').css({
            'background-image': 'url(' + image_path + ')',
        });
    }

    $(".random-background").on('click', function(){
        randomBackground();
    });



    $("#open-image-selector").on('click', function(){
        $("#image-selector").fadeIn().css('display', 'flex');
    });

    $("#close-image-selector").on('click', function(){
        $("#image-selector").fadeOut();
    });
});
