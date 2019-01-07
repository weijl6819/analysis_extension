chrome.storage.local.get(['screenshot-data','search-volume'], function (data) {
    $(document).ready(function () {
        console.log(data['screenshot-data'])
        console.log(data['search-volume'])
        $('#search-volume').text(data['search-volume'])
        var tableData = data['screenshot-data']
        var headerData = tableData.shift()
        headerData.forEach(function (cell) {
            $('thead tr').append('<td>'+cell + '</td>')
        })
        tableData.forEach(function (row) {
            $('tbody').append('<tr></tr>')
            var counter = 0
            row.rowData.forEach(function (cell) {
                counter++
                var $cell
                if(isDataURL(cell)){
                    $('tbody tr:last').append('<td style="text-align: center;"><img src="' + cell + '" /></td>')
                } else {
                    if (counter == 2 && row.isSponsored){
                        $cell = $('<td> <span>' + cell + '</span> <img src="images/svg/sp.png"></td>')

                    }  else {
                        $cell = $('<td> <span>' + cell + '</span> </td>')
                    }
                    if (cell =='[blur]'){
                        $cell.find('span').addClass('blur').text(Math.random().toString(36).substring(7).toUpperCase())

                    }
                    $('tbody tr:last').append($cell)

                }

            })
        });
        setTimeout(function () {
            var node = document.getElementById('table-wrapper')
            $('#table-wrapper').css('margin',0)
           domtoimage.toPng(node)
                .then(function (dataUrl) {
                //    $('#black-box-table').css('margin-left', '10%')
                    var img = new Image();
                    img.id = 'bb-screenshot'
                    img.src = dataUrl;
                    $('div.screenshot-info').after(img)
                    $('#table-wrapper').remove()
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
            $('.action-screenshot').click(function () {
                console.log($('#bb-screenshot'))
                var link = document.createElement("a");
                link.download = 'helium10-xray-data.png';
                link.href =  $('#bb-screenshot').attr('src')
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            })
        },50)
    })
})

function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
