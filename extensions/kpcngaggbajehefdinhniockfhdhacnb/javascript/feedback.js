function resetForm() {
    $('#subject').val('');
    $('#content').val('');
}

function isEmptyString(str) {
    return str.trim() === '';
}

function validateForm() {
    var $subject = $('#subject'),
        $content = $('#content'),
        subject = $subject.val(),
        content = $content.val();

    if (isEmptyString(subject)) {
        $subject.addClass('warning');
        return false;
    } else {
        $subject.removeClass('warning');
    }

    if (isEmptyString(content)) {
        $content.addClass('warning');
        return false;
    } else {
        $content.removeClass('warning');
    }

    return true;

}


$('#send-btn').on('click', function () {
    var that = this;
    if (validateForm()) {
        var subject = $('#subject').val() + " (Coinbag chrome extension)",
            content = $('#content').val();

        var urlParams = new URLSearchParams(window.location.search);
        var refer = decodeURIComponent(urlParams.get('refer')) || 'Chrome extension';
        var version = chrome.runtime.getManifest().version;



        var msg = content + '<br/><br/><br/>' +
            "<hr size='1'/>" +
            "<span style='font-weight:bold;'>Browser: </span>" + window.navigator.userAgent + '<br/>' +
            "<span style='font-weight:bold;'>Referrer: </span>" + refer + "<br/>" +
            "<span style='font-weight:bold;'>Extension version: </span>" + version + "<br/>";


        var data = {
            subject: subject,
            message: msg,
            from: 'extension'
        };


        $(this).addClass('processing').text('SENDING...');
        $.ajax({
            type: 'POST',
            url: 'https://www.diigo.com/common/contact',
            data: data,
            dataType: 'json',
            success: function (data) {
                $(that).removeClass('processing').text('SEND');
                $('.success-area').addClass('show');
                var email = data.email;
                $('#user-email').text(email);
            },

            error: function (err) {
                $(that).removeClass('processing').text('SEND');
                console.log(err);
            }
        });

    }
});

$('#send-again').on('click', function () {
    $('.success-area').removeClass('show');
    resetForm();
});




