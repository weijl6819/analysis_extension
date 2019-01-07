window.addEventListener( "load", function(){

	coinFeed.Locale.localizeCurrentPage();

    $(document).on("click", "#feedBackConfirm", feedBackStartValidation);
    $(document).on("click", "#feedback-close-btn", feedBackClose);

    $(document).on("keyup", "#exampleInputEmail", function(e) {
        var $el = $(this);
        feedBackClearInput($el);
        feedBackEmailValidation($el);
    });

    $(document).on("keyup", "#exampleInputSubject", function(e) {
        var $el = $(this);
        feedBackClearInput($el);
        feedBackSubjectValidation($(this));
    });
	
});


/**
 * Feed back close handler
 */
function feedBackClose(e) {

}

/**
 * Feed back start validation
 */
function feedBackStartValidation(e) {
    e.preventDefault();

    var $form = $("#feedback-form");
    var $isValid = feedBackFormValidation($form);
    if ($isValid)  feedBackFormSubmit($form);
}



function feedBackClearInput($input) {
    var $el = $input.parent();
    if($el.hasClass("has-error"))
        $el.removeClass("has-error");
    if($el.hasClass("has-success"))
        $el.removeClass("has-success");
    $el.find(".form-error-text").text("").hide();
}

/**
 * Feedback form submit
 *
 * @param $form jQuery element
 */
function feedBackFormSubmit($form) {
    $("#feedBackConfirm").off("click", feedBackStartValidation);
    var email = $form.find("#exampleInputEmail").val().trim(),
        subject = $form.find("#exampleInputSubject").val().trim(),
        description = $form.find("#exampleTextArea").val().trim();
    
        description += "\n CoinFeed Version: "+coinFeed.Prefs.get( "last_run_version" )+"; ";

        var feedBackData = {email : email, subject : subject, description : description};

        BRW_post(getFeedBackUrl(), feedBackData, function(data) {
            $("#feedback-form").slideUp(500, function() {
                $("#feedback-success").slideDown();
            });
        });

}

/**
 * Feedback form validation
 */
function feedBackFormClear() {
    var $form = $("#feedback-form");
    var $email = $form.find("#exampleInputEmail").val(''),
        $subject = $form.find("#exampleInputSubject").val(''),
        $description = $form.find("#exampleTextArea").val('');
    feedBackClearInput($email);
    feedBackClearInput($subject);
    feedBackClearInput($description);
}


/**
 * Feedback form validation
 *
 * @param $form jQuery element
 * @return Bool
 */
function feedBackFormValidation($form) {
    var $email = $form.find("#exampleInputEmail"),
        $subject = $form.find("#exampleInputSubject"),
        $description = $form.find("#exampleTextArea");
    $isValidEmail = feedBackEmailValidation($email, true);
    $isValidSubject =  feedBackSubjectValidation($subject, true);
    $isValidDescription = feedBackDescriptionValidation($description, true);
    return $isValidEmail && $isValidSubject && $isValidDescription;
}

/**
 * Feedback form email validation
 *
 * @param $email jQuery element
 * @param showError Number
 * @return Bool
 */
function feedBackEmailValidation($email, showError) {
    var $isValid = true;
    var email = $email.val().trim();
    var $el = $email.parent();
    if(!email) {
        $isValid = false;
        if(showError) {
            if(!$el.hasClass("has-error"))
                $el.addClass("has-error");
            $el.find(".form-error-text").text(_("feedback_dialog_field_error_required_email_text")).show();
        }
    } else if(!validateEmail(email)) {
        $isValid = false;
        if(showError) {
            if(!$el.hasClass("has-error"))
                $el.addClass("has-error");
            $el.find(".form-error-text").text(_("feedback_dialog_field_error_format_email_text")).show();
        }
    } else {
        if($el.hasClass("has-error"))
            $el.removeClass("has-error");
        if(!$el.hasClass("has-success"))
            $el.addClass("has-success");
        $el.find(".form-error-text").text("").hide();
    }
    return $isValid;
}

/**
 * Feedback form subject validation
 *
 * @param $subject jQuery element
 * @param showError Number
 * @return Bool
 */
function feedBackSubjectValidation($subject, showError) {
    var $isValid = true;
    var subject = $subject.val().trim();
    var $el = $subject.parent();
    if(!subject) {
        $isValid = false;
        if(showError) {
            if(!$el.hasClass("has-error"))
                $el.addClass("has-error");
            $el.find(".form-error-text").text(_("feedback_dialog_field_error_required_subject_text")).show();
        }
    } else if(subject.length < 6) {
        $isValid = false;
        if(showError) {
            if(!$el.hasClass("has-error"))
                $el.addClass("has-error");
            $el.find(".form-error-text").text(_("feedback_dialog_field_error_too_low_subject_text")).show();
        }
    } else {
        if($el.hasClass("has-error"))
            $el.removeClass("has-error");
        if(!$el.hasClass("has-success"))
            $el.addClass("has-success");
        $el.find(".form-error-text").text("").hide();
    }
    return $isValid;
}

/**
 * Feedback form description validation
 *
 * @param $description jQuery element
 * @param showError Number
 * @return Bool
 */
function feedBackDescriptionValidation($description, showError) {
    var $isValid = true;
    var description = $description.val().trim();
    var $el = $description.parent();
    if(description) {
        if($el.hasClass("has-error"))
            $el.removeClass("has-error");
        if(!$el.hasClass("has-success"))
            $el.addClass("has-success");
        $el.find(".form-error-text").text("").hide();
    }
    return $isValid;
}

/**
 * Validate email format
 *
 * @param email String
 * @returns {boolean}
 */
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

//Universal POST function
function BRW_post(url, data, successFunction, errorFunction){
    $.post(url, data, successFunction)
        .fail(function(e) {
            if(errorFunction) errorFunction(e);
        })
    ;
}//BRW_ajax

/**
 * Get feed back url
 *
 * @returns {string}
 */
function getFeedBackUrl() {
	return "http://fvdmedia.com/coin-feed-feedback/";
}
