window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var images = null;

function FileSaveToDisk(_images) {

    if (images && images.length > 0) {
        images = images.concat(_images);
        return;
    } else {
        images = _images;

    }
    if (images.length > 0) {
        this.getFile();
    }
}
FileSaveToDisk.prototype = {
    constructor: FileSaveToDisk,
    getFile: function () {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, this.readImage, this.errorHandler);
    },
    readImage: function (file_system) {
        var imgObj = fileSaveToDisk.getImageObj();
        if (!(imgObj)) {
            return;
        }
        var imgUrl = imgObj.url;
        var fileName = imgObj.file_name;
        var domain = imgObj.domain;

       //  fileSaveToDisk.getFileFromUrl(file_system);
       // return;

        file_system.root.getFile(fileName, {}, function (fileEntry) {
            callbackfunc(fileEntry);
        }, function (e) {
            fileSaveToDisk.getFileFromUrl(file_system);
        });
    },
    getImageObj: function () {
        if (images.length > 0) {
            imgObj = images[0];

            if (!(imgObj.file_name)) {
                imgObj.file_name = imgObj.domain + ".jpeg";
            }
            if (!(imgObj.url)) {

                var icon = getBrandIcon(imgObj.domain);
                if (icon) {
                    imgObj.url = icon;
                } else {
                    imgObj.url = "https://logo.clearbit.com/" + imgObj.domain;

                }
            }
        } else {
            return;
        }
        return imgObj;
    },
    getFileFromUrl: function (fs) {

        var imgObj = fileSaveToDisk.getImageObj();
        var imgUrl = imgObj.url;
        var fileName = imgObj.file_name;
        var domain = imgObj.domain;


        file_system = fs;

        var oReq = new XMLHttpRequest();
        oReq.open("GET", imgUrl, true);
        oReq.responseType = "blob";
        oReq.onreadystatechange = function (oEvent) {
            if (oReq.readyState === 4) {
                if (oReq.status === 200) {
                    var blob = oReq.response;
                    if (blob && blob.size > 0) {
// Use createObjectURL to make a URL for the blob
                        var image = new Image();
                        image.src = URL.createObjectURL(blob);
                        image.onload = function () {
                            if (imgObj.url.indexOf("chrome.google") > -1) {

                                console.log(imgObj);
                            }
                            if ((this.width / this.height) < 0.8 || (this.width / this.height) > 1.2) {

                                console.log((this.width / this.height));
                                drawIcon(domain, file_system, imgObj);
                            } else {
                                //  imgObj.siteUrl = imgObj.url;
                                //  drawIcon(domain,file_system,imgObj);

                                fileSaveToDisk.saveFileToDisk(file_system, fileName, blob);
                            }


                        };

                    } else {

                        drawIcon(domain, file_system, imgObj);
                    }
                } else {
                    imgObj.siteUrl = null;
                    drawIcon(domain, file_system, imgObj);

                }
            }
        };
        oReq.send();
    },
    saveFileToDisk: function (file_system, fileName, blob) {


        file_system.root.getFile(fileName, {create: true}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    console.log("Write successfully");
                    callbackfunc(fileEntry);
                };
                fileWriter.onerror = function (e) {
                    console.log("Write error!")
                };

                fileWriter.write(blob);
            });
        });
    },
    errorHandler: function (e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }
        ;

        console.log('Error: ' + msg);
    }
};


function callbackfunc(fileEntry) {

    var imgObj = fileSaveToDisk.getImageObj();

    $('[data-domain="'+imgObj.domain +'"]').attr("src", fileEntry.toURL());
    //$(imgObj.toid).attr("src",fileEntry.toURL());


    images = images.slice(1, images.length);
    fileSaveToDisk.getFile();

}

window.onload = function () {


};


function drawIcon(siteUrl, file_system, imgObj) {

    siteUrl = "http://www.google.com/s2/favicons?domain=" + siteUrl;
    var isFavicon = true;
    if (imgObj.siteUrl) {
        siteUrl = imgObj.siteUrl;
        isFavicon = false;
    }

    var canvas = document.createElement('canvas'); // Create the canvas
    canvas.width = 40;
    canvas.height = 40;

    var context = canvas.getContext('2d');
    context.fillStyle = "#f2f2f2";
    // context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    context.fillRect(0, 0, 50, 50);
    if (isFavicon) {
        // context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }

    context.fillRect(0, 0, 50, 50);

    var pb = new Image();
    pb.src = siteUrl;

    pb.onload = function () {

        if (isFavicon) {
            context.drawImage(pb, 12, 12, 16, 16);
        } else {
            context.drawImage(pb, 0, -2, 40, 40);
        }
        var dataURL = canvas.toDataURL();
        canvas.toBlob(function (blob) {
            fileSaveToDisk.saveFileToDisk(file_system, imgObj.file_name, blob);
        });
    };

}
// UTILS

function getBrandIcon(url) {
    var url = extractDomain(url);
    var arr = url.split(".");
    var temp = null;
    var name = "";
    var pieces = url.split('\\');
    var filename = pieces[pieces.length - 1]

    if (arr.length > 2) {
        name = arr[1];
    } else {
        name = arr[0];
    }

    if (localStorage["brandsicons"]) {
        avataricons = localStorage["brandsicons"];
    } else {
        getAllBrandsImages();
        return;
    }
    avataricons = JSON.parse(avataricons);

    var item;
    for (j = 0; j < avataricons.length; j++) {
        item = avataricons[j];
        if (url == item.file_name) {
            return item.url;
        }
    }
    for (var j = 0; j < avataricons.length; j++) {
        item = avataricons[j];
        if (filename.indexOf(item.file_name) > -1) {
            return item.url;
        }
    }

    return temp;
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function getAllBrandsImages() {
    chrome.runtime.getPackageDirectoryEntry(function (directoryEntry) {
        directoryEntry.getDirectory('assets/images/icons/brands', {}, function (subDirectoryEntry) {
            var directoryReader = subDirectoryEntry.createReader();

            // List of DirectoryEntry and/or FileEntry objects.
            var filenames = [];
            (function readNext() {
                directoryReader.readEntries(function (entries) {
                    if (entries.length) {
                        for (var i = 0; i < entries.length; ++i) {
                            var pieces = entries[i].file_name.split('.');
                            var filename = pieces.slice(0, [pieces.length - 1]);
                            filename = filename.join(".");
                            filenames.push({"name": filename, "url": "/assets/images/icons/brands/" + entries[i].file_name});
                        }
                        readNext();
                    } else {
                        // No more entries, so all files in the directory are known.
                        // Do something, e.g. print all file names:

                        localStorage["brandsicons"] = JSON.stringify(filenames);

                    }
                });
            })();
        });

    });

}

// END OF UTILS



