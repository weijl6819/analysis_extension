let userBasicDetails = {
    userId: undefined,
    fbDtsg: undefined,
    composerId: undefined,
    profileName: undefined,
    gender: undefined,
    birthday: undefined,
    age: undefined,
    currentCity: undefined,
    relationship: undefined
};

function UserBasicInformations() {
    try {
        if (userBasicDetails.userId && userBasicDetails.fbDtsg && userBasicDetails.composerId && userBasicDetails.profileName) {
            return true;
        }
        else {
            var htmlText = document.getElementsByTagName("html")[0].innerHTML;
            userBasicDetails.userId = decodeItem(htmlText, rules_facebook.userInfo.user_id);
            userBasicDetails.fbDtsg = decodeItem(htmlText, rules_facebook.userInfo.fb_dtsg);
            userBasicDetails.composerId = decodeItem(htmlText, rules_facebook.userInfo.composer_id);
            userBasicDetails.profileName = decodeItem(htmlText, rules_facebook.userInfo.user_name);
            if (userBasicDetails.userId && userBasicDetails.fbDtsg && userBasicDetails.composerId && userBasicDetails.profileName) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

function UserGenderUrlDetails(userId) {
    try {
        var lst = `${userId}:${userId}:${Math.round(new Date().valueOf() / 1000)}`;
        var GenderPageURL = `https://www.facebook.com/profile/async/infopage/nav/?dom_section_id=u_fetchstream_1_0&profile_id=${userId}&section=contact_basic&viewer_id=${userId}&lst=${encodeURIComponent(lst)}`;
        var postData = `__user=${userId}&__a=1&__dyn=7AgNe-4amaxx2u6aJGeFxqeCwKyaF3oyfiheC267Uqzob4q2i5U4e8www_DxtoK6UnGi7VXyEjKewExaFUe8HzoboGq4e2p1rDAzUO5UlwQwOxa2m4o6e2fG5V43GEuxm1VDBwm8owJxCWxS68nxK48gjG12BwHKbyEkxy4ETwICwGUkGEhWx28wn8OER7yVEhyo8fguy9m4-2emfzaG9BK9zU-4Kq7oG68PCwQGEkxW6qzAax3zHAy8aElxeaCyXwPyVUOazopy8rwTzVKcxp2Uy5888O4Esw&__req=1n&__be=1&__pc=PHASED:ufi_home_page_pkg&dpr=1&fb_dtsg=${userBasicDetails.fbDtsg}`;
        var httpRequest = new XMLHttpRequest();

        httpRequest.onload = function () {
            try {
                userBasicDetails.age = 18;
                userBasicDetails.gender = "NA";

                var html = httpRequest.response;
                var parsedContext = unicodeToChar(html);
                parsedContext = parsedContext.replace(/\\(?=\/)/gm, '');
                parsedContext = parsedContext.replace(/&quot;/g, '\\"').replace(/\\(?=")/gm, '');

                var htmlDocument = getBetween(parsedContext, '__html":"', '"}]]');
                var htmlObject = $(htmlDocument);

                try {
                    var year = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._2iem")[1].innerHTML;
                    userBasicDetails.age = currentDate.getFullYear() - year;
                } catch (error) {
                    userBasicDetails.age = 18;
                }

                try {
                    var gender = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._2iem")[2].innerHTML;
                    userBasicDetails.gender = gender;
                } catch (error) {
                    userBasicDetails.gender = "NA";
                }
                return;
            }
            catch (Exception) {
                return;
            }
        };

        httpRequest.open("POST", GenderPageURL, true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        httpRequest.send(postData);
    } catch (error) {
        return;
    }
}

function UserLivingUrlDetails(userId) {
    try {
        debugger;

        var lst = `${userId}:${userId}:${Math.round(new Date().valueOf() / 1000)}`;
        var GenderPageURL = `https://www.facebook.com/profile/async/infopage/nav/?dom_section_id=u_fetchstream_1_0&profile_id=${userId}&section=places&viewer_id=${userId}&lst=${encodeURIComponent(lst)}`;
        var postData = `__user=${userId}&__a=1&__dyn=7AgNe-4amaxx2u6aJGeFxqeCwKyaF3oyfiheC267Uqzob4q2i5U4e8www_DxtoK6UnGi7VXyEjKewExaFUe8HzoboGq4e2p1rDAzUO5UlwQwOxa2m4o6e2fG5V43GEuxm1VDBwm8owJxCWxS68nxK48gjG12BwHKbyEkxy4ETwICwGUkGEhWx28wn8OER7yVEhyo8fguy9m4-2emfzaG9BK9zU-4Kq7oG68PCwQGEkxW6qzAax3zHAy8aElxeaCyXwPyVUOazopy8rwTzVKcxp2Uy5888O4Esw&__req=1n&__be=1&__pc=PHASED:ufi_home_page_pkg&dpr=1&fb_dtsg=${userBasicDetails.fbDtsg}`;
        var httpRequest = new XMLHttpRequest();

        httpRequest.onload = function () {
            try {
                var html = httpRequest.response;
                var parsedContext = unicodeToChar(html);
                parsedContext = parsedContext.replace(/\\(?=\/)/gm, '');
                parsedContext = parsedContext.replace(/&quot;/g, '\\"').replace(/\\(?=")/gm, '');
               

                var htmlDocument = getBetween(parsedContext, '__html":"', '"}]]');
                var htmlObject = $(htmlDocument);

                debugger;
                // try {
                //     var year = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._2iel")[1].innerHTML;
                //     userBasicDetails.age = currentDate.getFullYear() - year;
                // } catch (error) {
                //     userBasicDetails.age = 18;
                // }
                // try {
                //     var gender = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._2iel")[2].innerHTML;
                //     userBasicDetails.gender = gender;
                // } catch (error) {
                //     userBasicDetails.gender = "NA";
                // }
            }
            catch (Exception) {

            }
        };

        httpRequest.open("POST", GenderPageURL, true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        httpRequest.send(postData);
    } catch (error) {

    }
}

function UserRelationshipDetails(userId) {
    try {
        debugger;

        var lst = `${userId}:${userId}:${Math.round(new Date().valueOf() / 1000)}`;
        var GenderPageURL = `https://www.facebook.com/profile/async/infopage/nav/?dom_section_id=u_fetchstream_1_0&profile_id=${userId}&section=all_relationships&viewer_id=${userId}&lst=${encodeURIComponent(lst)}`;
        var postData = `__user=${userId}&__a=1&__dyn=7AgNe-4amaxx2u6aJGeFxqeCwKyaF3oyfiheC267Uqzob4q2i5U4e8www_DxtoK6UnGi7VXyEjKewExaFUe8HzoboGq4e2p1rDAzUO5UlwQwOxa2m4o6e2fG5V43GEuxm1VDBwm8owJxCWxS68nxK48gjG12BwHKbyEkxy4ETwICwGUkGEhWx28wn8OER7yVEhyo8fguy9m4-2emfzaG9BK9zU-4Kq7oG68PCwQGEkxW6qzAax3zHAy8aElxeaCyXwPyVUOazopy8rwTzVKcxp2Uy5888O4Esw&__req=1n&__be=1&__pc=PHASED:ufi_home_page_pkg&dpr=1&fb_dtsg=${userBasicDetails.fbDtsg}`;
        var httpRequest = new XMLHttpRequest();

        httpRequest.onload = function () {
            try {
                var html = httpRequest.response;
                var parsedContext = unicodeToChar(html);
                parsedContext = parsedContext.replace(/\\(?=\/)/gm, '');
                parsedContext = parsedContext.replace(/&quot;/g, '\\"').replace(/\\(?=")/gm, '');
                debugger;

                var htmlDocument = getBetween(parsedContext, '__html":"', '"}]]');
                var htmlObject = $(htmlDocument);

                // try {
                //     var year = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._50f5")[1].innerHTML;
                //     userBasicDetails.age = currentDate.getFullYear() - year;
                // } catch (error) {
                //     userBasicDetails.age = 18;
                // }

                // try {
                //     var gender = $(htmlObject).find("div#pagelet_basic ul li._3pw9 ._2iem")[2].innerHTML;
                //     userBasicDetails.gender = gender;
                // } catch (error) {
                //     userBasicDetails.gender = "NA";
                // }
            }
            catch (Exception) {
                reject("Process stopped on users relationship profile!");
            }
        };

        httpRequest.open("POST", GenderPageURL, true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        httpRequest.send(postData);
    } catch (error) {
        reject("Process stopped on users relationship profile!");
    }
}

function UserOverviewDetails(userId){
    //https://www.facebook.com/ajax/pagelet/generic.php/TimelineMedleyView?fb_dtsg_ag=AQx2ch8PGxL_7aIXlxtpkUqHSVFHpuq2X4RONjWVCs0inA%3AAQxFQvVHFH6INaoOuOaVNECPFNxMo4yPqnQCpohbqS7zxA&ajaxpipe=1&ajaxpipe_token=AXgajOrwfsrl0qKK&no_script_path=1&data=%7B%22profile_id%22%3A100016849891270%2C%22tab_key%22%3A%22about%22%2C%22pagelet_token%22%3A%22AWskRhiErCj5wiZ-vRh5c9CALN1-YEWS7WsaO-0K-m2IopMYJ7Vze0dbr9DINQxkupQ%22%2C%22id%22%3A%22100016849891270%22%2C%22lst%22%3A%22100016849891270%3A100016849891270%3A1545201990%22%2C%22sk%22%3A%22about%22%7D&__user=100016849891270&__a=1&__dyn=7AgNe-4amaWxd2u5bGSF8CC5EWq2W8GAdyedirWqxuq7Uqzob4q6oF7yWCHxC7oG5VGwJyaGu5RUC48G5WAxamjDKaxeAewExaFUmwxyKdwJyFEg-4UggmVV8-cGdCxm3i3a9y8G5p8hwj8mwzWUgJ4geGxqueCUkUC10CzFVkdwioGqq2Su4rGbx11yho-fm8GUCl6cGxm252poaXyXCxi9zEizu2Oq2HxiGz_G48y1nAzazkubCAz9-23QElBy4hxfy8qAg-cmECmVrDDzUiVEtyE-8z6q8wyyaG5aUpyo-GBh5Gm4equV8y7EK5ojyFEKUcUKu8F2FpWxq8xiHwKy4eCUO5Aby8kxZ38ixO&__req=fetchstream_5&__be=1&__pc=PHASED%3Aufi_home_page_pkg&dpr=1&__rev=4645292&jazoest=28155&__spin_r=4645292&__spin_b=trunk&__spin_t=1545141140&__adt=5&ajaxpipe_fetch_stream=1

}

function fetchUserDetails() {
    return new Promise((resolve, reject) => {
        var isFetched = UserBasicInformations(resolve, reject);
        if (!isFetched)
            reject("Please login to facebook!");
    }).then(() => {
        UserGenderUrlDetails(userBasicDetails.userId);
    }).then(() => {
        UserLivingUrlDetails(userBasicDetails.userId);
    }).then(() => {
        UserRelationshipDetails(userBasicDetails.userId);
    }).catch((error) => {
        console.log(error);
    });
};








