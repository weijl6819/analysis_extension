/* Ad Grader JS Library
 * Copyright (c) 2017 ShoutEx Inc. All rights reserved.
 * https://shoutex.com
 */
function pz_getTextPoints($text, $keywords, $synonyms){
    $points = 0;
    $mod = 1;
    $minMod = ((1 - $mod)/2) + $mod;

    /* if keywords/synonyms are string, then split */
    if(typeof($keywords) === "string"){
        $words = $keywords.split(" ");
    } else {
        $words = $keywords;
    }
    if(typeof($synonyms) === "string"){
        $synonyms = $synonyms ? $synonyms.split(",") : [];
    }

    $fullRegex = "("+$words.join(".")+"|"+$words.join("")+")";
    $splitRegex = "("+$words.join("|")+")";
    $initials = [];
    $words.forEach(function($val){
    	$initials.push($val[0]);
    });
    $initialRegex = "( "+$initials.join("\\.")+" | "+$initials.join("")+" )";
    $synonymsRegex = "("+$synonyms.join("|")+")";

    $fullRegex = new RegExp($fullRegex, "ig");
    $splitRegex = new RegExp($splitRegex, "ig");
    $initialRegex = new RegExp($initialRegex, "ig");

    /* 1. check text for full match of keyword
    /*      points = count of matches
    /* 2. check text for partial match of keyword
    /*      points = count of matches
    /* 3. check text for initials from keyword
    /*      points = count of matches, multiplied by minMod
    /* 4. check text for full match of synonyms
    /*      points = count of matches, multiplied by minMod
    /*
    /* Points are calculated as follows:
    /*
     * (full match point or partial match point) + initials point + synonym point
    */

    $matches = $text.match($fullRegex);
    if($matches){
        $points = $matches.length;
    } else {
        $matches = $text.match($splitRegex);
        $points = $matches ? $matches.length : 0;
    }

    $matches = $text.match($initialRegex);
    if($matches){
        $points = $points + ($matches.length*$minMod);
    }

    if($synonyms.length){
        $matches = $text.match($synonymsRegex);
        if($matches){
            $points = $points + ($matches.length*$minMod);
        }
    }

    return $points;
}

function pz_rateAds($getAd, $p){
    $keywords = $p['keywords'];
    $synonyms = $p['synonyms'];

    $totalPoints = 0;
    var $pointsList = {};

    Object.keys($getAd).forEach ( function ($key) {
        $value = $getAd[$key];

        if($key == "HEAD" || $key == "DISP" || $key == "TEXT" || $key == "CALL" || $key == "EXTT"){
            $points = pz_getTextPoints($value, $keywords, $synonyms);
            $points = $points > 0 ? 1 : 0;
        } else {
            $points = 0;
        }

        switch($key){
            case 'HEAD':
            $adjPoints = $points * 4;
            break;
            case 'DISP':
            $adjPoints = $points * 1;
            break;
            case 'TEXT':
            $adjPoints = $points * 2;
            case 'CALL':
            $adjPoints = $points * 2;
            break;
            case 'EXTT':
            $adjPoints = $points * 1;
            break;
            default:
            $adjPoints = $points * 0;
            break;
        }

        $pointsList[$key] = $adjPoints;
        $totalPoints += $adjPoints;
    });

    $aPoints = [$pointsList, $totalPoints];
    return $aPoints;
}

function pz_colorScore($percent){
    if($percent >= 80){
        return "pass";
    } else if ($percent >= 60) {
        return "improve";
    } else {
        return "failed";
    }
}

function pz_returnIcons($ad){
    $icons = {
        "headIcon" : "<span data-tooltip='Keyword in Header'><i class='glyphicon glyphicon-font'></i></span>",
        "ctaIcon" : "<span data-tooltip='Clear Calls-to-Action'><i class='glyphicon glyphicon-saved'></i></span>",
        "cmtIcon" : "<span data-tooltip='Compelling Text'><i class='glyphicon glyphicon-fire'></i></span>",
        "vanityIcon" : "<span data-tooltip='Vanity URL'><i class='glyphicon glyphicon-heart'></i></span>",
        "homeUIcon" : "<span data-tooltip='Landing Page'><i class='fa fa-file-text'></i></span>",
        "trackIcon" : "<span data-tooltip='Tracking'><i class='glyphicon glyphicon-search'></i></span>",
    };

    if($ad['HEAD']['RATING'] > 0){ $icons["headIcon"] = "<span class='pass'>"+$icons["headIcon"]+"</span>"; }
    if($ad['EXTRA']['CTA'] > 0){ $icons["ctaIcon"] = "<span class='pass'>"+$icons["ctaIcon"]+"</span>"; }
    if($ad['EXTRA']['CMPL'] > 0){ $icons["cmtIcon"] = "<span class='pass'>"+$icons["cmtIcon"]+"</span>"; }
    if($ad['DISP']['RATING'] > 0){ $icons["vanityIcon"] = "<span class='pass'>"+$icons["vanityIcon"]+"</span>"; }

    $urlParts = $ad['URLPARTS'];
    if($urlParts['path'] && $urlParts['path'].length > 1){
        $icons["homeUIcon"] = "<span class='pass'>"+$icons["homeUIcon"]+"</span>";
    }

    if($urlParts['query']){
        $icons["trackIcon"] = "<span class='pass'>"+$icons["trackIcon"]+"</span>";
    }

    $fullString = '';
    Object.keys($icons).forEach (function($key) {
        $icon = $icons[$key];
        $icons[$key] = "<div class='pagezii-icon'>"+$icon+"</div>";
        $fullString += $icons[$key];
    });

    return $fullString;
}

function pz_gradeAds($inData, $keywords, $synonyms){
    var $synopsis = {"keyword" : null, "synonym" : null,"frequency" : null,"freqFilter" : null,"average" : null,"averageLetter" : null,"min" : null,"max" : null};
    var $totalAdsScore = [];
    var $profileCount;
    var $frequency;
    var $gradeCount;
    var $allScores;
    var $CompText = ["improve","save","increase","reduce","most","best","easy","simple","effective","high","low"];
    var $dictionary = {
        "lead" : {
            "trial" : 10,
            "demo" : 10,
            "buy" : 10,
            "sale" : 5,
            "save" : 4,
            "savings" : 4,
            "shop" : 5,
            "register" : 4,
            "signup" : 4,
            "start" : 4,
            "get" : 4,
            "price" : 4,
            '$' : 4,
            "registerforaccess" : 10,
            "tryfree": 10,
            "trynow": 10
        },

        "demand" : {
            "whitepaper" : 10,
            "webinar" : 4,
            "seminar" : 4,
            "PDF" : 4,
            "registration" : 3,
            "register" : 4,
            "report" : 3,
            "research" : 3,
            "video" : 3,
            "download" : 10,
            "signup" : 3,
            "get" : 3
        },

        "brand" : {
            "brand" : 3,
            "best" : 2,
            "top" : 2,
            "first" : 2,
            "customer" : 2,
            "satisfaction" : 2,
            "learnmore" : 2,
            "readmore" : 2,
            "readnow" : 2,
            "watchnow" : 2,
            "service" : 1,
            "clickhere" : 1
        },
    };

    $returnAds = [];
    $adsData = $inData;
    $adsNumber = $inData.length;

    $keywords = $keywords.split(" ");
    $synonymList = $synonyms ? $synonyms.split(",") : [];

    if($keywords[0] != ""){

        $displayKeyword = "";
        $displaySyn = "";

        $keywords.forEach (function($word) {
            $displayKeyword = $displayKeyword + $word + " ";
        });

        if($synonymList[0] != ""){
            $synonymList.forEach ( function($syn) {
                $displaySyn = $displaySyn + $syn + " ";
            });
        }

        $synopsis["keyword"] = $displayKeyword;
        $synopsis["synonym"] = $displaySyn;
    }

    $gradeCount = [];
    $profileCount = [];

    $profileCount = {'lead': 0, 'demand': 0, 'brand': 0};

    if(!$adsData || !$adsData.length){
        return null;
    }

    $adsData.forEach ( function($ad) {
        $soloCTAs = $dictionary;

        $host = $ad['URLPARTS']['host'];
        $host = $host.replace('www.','');
        $domain = $host.split(".");
        if($domain.length === 2){
            $domain = $domain[0];
        } else if($domain.length > 2 && $domain[$domain.length-1].match("/uk/i")){
            $domain = $domain[$domain.length-3];
        } else if($domain.length > 2){
            $domain = $domain[$domain.length-2];
        } else if($domain.length < 2){
            $domain = 'NA';
        }

        $soloCTAs["brand"][$domain] = 1;

        $ctaPs = {"lead": 0, "demand": 0,"brand": 0};
        $ctaPT = 0;
        $compTR = 0;

        Object.keys($ad).forEach ( function ($key) {
            $section = $ad[$key];
            if(!$section){
                return;
            }
            if($key == "HEAD" || $key == "DISP" || $key == "TEXT" || $key == "CALL" || $key == "EXTT"){
                Object.keys($soloCTAs).forEach ( function($prof) {
                    $cta = $soloCTAs[$prof];
                    Object.keys($cta).forEach ( function($word) {
                        $point = $cta[$word];

                        if($prof == "brand" && $key != "DISP" || $prof != "brand"){
                            if($word == '$'){
                                regex = new RegExp("\\$", "ig");
                            } else {
                                regex = new RegExp(chunk_split($word, 1, "\\s*"), "ig");
                            }
                            $matches = $section.match(regex);

                            if($matches){
                                $ctaPs[$prof] += $point * $matches[0].length;
                                $ctaPT += $point * $matches[0].length;
                            }
                        }
                    });
                });
                $CompText.forEach (function($cmpT) {
                    $compTR += substr_count($section.toLowerCase(), $cmpT.toLowerCase());
                });
            }
        });

        if($compTR > 2){
            $compTR = 2;
        }

        $ctaR = Math.sqrt($ctaPT);

        if($ctaR > 4.5){
            $ctaR = 4.5;
        }

        $totalRating = {};

        $p = {"keywords": $keywords, "synonyms": $synonymList};
        $rating = pz_rateAds($ad, $p);
        $totalRating["score"] = $rating[1] + $ctaR + $compTR;
        $totalRating["percent"] = 100 * ($totalRating["score"] / 14.5);
        if($totalRating["percent"] > 100){
            $totalRating["percent"] = 100;
        }

        $totalRating["color"] = pz_colorScore($totalRating["percent"]);

        $totalAdsScore.push($totalRating["score"]);
        $totalAdsScore["total"] += $totalRating["score"];

        // RETURN ASSUMED PROFILE OF THE AD
        $maxText = "";
        $ad['PROFILES'] = [];

        $max = array_keys($ctaPs,max($ctaPs));
        if($max.length > 1){
            for($i = 0; $i < $max.length; $i++){
                if($ctaPs[$max[$i]] > 0){
                    $ad["PROFILES"].push($max[$i]);
                    $profileCount[$max[$i]] ++;
                }
            }
        } else {
            if($ctaPs[$max[0]]> 0){
                $ad["PROFILES"].push($max[0]);
                $profileCount[$max[0]] ++;
            }
        }

        if($ad['PROFILES'].length == 0){
            $ad['PROFILES'] = ["lead"];
        }

        $searchTerms = {
            'KEYS' : $keywords,
            'SYNS' : $synonymList,
        };

        $adTerms = {
            'TITLE' : {'INDEX' : $ad['INDEX'] , 'HOST' : $host, 'HOME' : $domain},
            'HEAD' : {'DATA' : $ad['HEAD'], 'URL' :  $ad['HEADU'], 'RATING' :  $rating[0]['HEAD']},
            'DISP' : {'DATA' : $ad['DISP'], 'RATING' : $rating[0]['DISP']},
            'TEXT' : {'DATA' : $ad['TEXT'], 'RATING' : $rating[0]['TEXT']},
            'CALL' : {'DATA' : $ad['CALL'], 'RATING' : $rating[0]['CALL']},
            'EXT' : {'DATA' : $ad['EXT'], 'RATING' : $rating[0]['EXTT']},
            'CTAs' : {'LEAD' : $ctaPs['lead'], 'DEMAND' :$ctaPs['demand'], 'BRAND' : $ctaPs['brand']},
            'EXTRA' : {'CTA' : $ctaR,'CMPL' : $compTR},
            'PROFILE' : $ad['PROFILES'],
            'RATING' : $totalRating,
            'URLPARTS': $ad['URLPARTS']
        };

        $adTerms['ICONS'] = pz_returnIcons($adTerms);

        $returnAds.push($adTerms);
        return;
    });

    return $returnAds;
}

function pz_getSearchQuery(href) {
    var q = href.match(/.*(\&|\?)q=(.*?)\&/);
    if(q && q.length >= 2){
        q = q[2];
        q = decodeURIComponent(q);
        q = q.replace(/\+/g," ");
        return q;
    } else {
        return null;
    }
}

function pz_parseUrl($href) {
    if($href.match(/^\//)){
        console.log($href);
        console.log("NOT VALID URL");
        $parts = {
            'scheme': '',
            'host': '',
            'path': '',
            'query': ''
        };
        return $parts;
    } else if ($href.match(/^http[s]*/i) == undefined){
        $href = 'https:' + $href;
    }

    $scheme = $href.match(/(http[s]*).*/)[1];
    $host = $href.match(/http[s]*\:\/\/(.*?)\//);
    $host = $host ? $host[1] : $href.match(/http[s]*\:\/\/(.*)/)[1];
    $path = $href.match(/http[s]*\:\/\/(.*?)(\/.*?)(\?)/);
    $path = $path ? $path : $href.match(/http[s]*\:\/\/(.*?)(\/.*)/);
    $query = $href.match(/.*(\?.+)/);
    if($path){ $path = $path[2]; }
    if($query){ $query = $query[1]; }
    $parts = {
        'scheme': $scheme,
        'host': $host,
        'path': $path,
        'query': $query
    };
    return $parts;
}

function pz_getAds() {
    var adsList = document.body.getElementsByClassName("ads-ad");
    var firstAd = adsList[0];
    var newList = [];
    var oParser = new DOMParser();
    var url = window.location.href;
    var searchQuery = pz_getSearchQuery(url);

    for (var i = 0; i < adsList.length; i++) {
        adHtml = adsList[i].innerHTML;
        adXml = oParser.parseFromString(adHtml, "text/html");

        callouts = adXml.body.getElementsByClassName('ellip');
        extensions = adXml.body.getElementsByTagName('ul');

        calloutText = '';
        extensionsText = '';
        megaCalloutText = '';
        megaCalloutFull = '';
        extensionClassName = '';

        if(extensions.length > 0){
            extensionClassName = extensions[0].getAttribute('class');
            extensionsItems = oParser.parseFromString(extensions[0].innerHTML, "text/html");
            extensionsItems = extensionsItems.body.getElementsByTagName('li');
            extensionsText = '';
            for (var key = 0; key < extensionsItems.length; key++) {
                extensionsItemsLi = oParser.parseFromString(extensionsItems[key].innerHTML, "text/html");
                extensionsText = extensionsText ? (extensionsText+'\n') : '';
                if(extensionsItemsLi.body.getElementsByTagName('a').length){
                  extensionsText += extensionsItemsLi.body.getElementsByTagName('a')[0].lastChild.textContent;
                } else {
                  extensionsText += extensionsItems[key].innerText;
                }
            }
        }

        if(callouts.length > 1){

            for( var key = 1; key < callouts.length; key++) {
                // get class name of call out and check if mega call out
                className = callouts[key].getAttribute("class");
                newText = '';
                if(className.match(/\_Mgt/i)){
                    calloutSubTextList = oParser.parseFromString(callouts[key].innerHTML, "text/html");
                    if(calloutSubTextList.getElementsByClassName('_Dft').length){
                        megaCalloutText = calloutSubTextList.getElementsByClassName('_Dft')[0].innerText + " · More";
                    } else {
                        newText = callouts[key].innerText;
                    }
                    megaCalloutFull = callouts[key].innerText;
                } else if (className.match(/\_J9s/i)) {
                    // ignore these
                    newText = '';
                } else {
                    newText = callouts[key].innerText;
                }
                if(newText.length){
                    // add new lines
                    calloutText = calloutText ? (calloutText+'<br>') : '';
                    calloutText += newText;
                }
            }
        }

        inData = {
            'HEAD': adXml.body.getElementsByTagName('h3')[0].innerText,
            'HEADU': adXml.body.getElementsByTagName('a')[1].getAttribute('href'),
            'DISP': adXml.body.getElementsByTagName('cite')[0].innerText,
            'TEXT': adXml.body.getElementsByClassName('ellip')[0].innerText,
            'EXT': extensionsText,
            'EXTT': extensionsText,
            'CALL': calloutText,
            'MEGACALLOUT': megaCalloutText,
            'MEGACALLOUTFULL': megaCalloutFull,
            'EXTCLASSNAME': extensionClassName,
            'INDEX': 1
        };

        /* fix urls that start with /aclk */
        if(inData['HEADU'].match(/^\/aclk/i)){
            inData['HEADU'] = 'https://www.google.com'+inData['HEADU'];
        }

        inData['URLPARTS'] = pz_parseUrl(inData['HEADU']);

        gradeResponse = pz_gradeAds([inData], searchQuery,'');
        //console.log(inData['HEAD']+": "+Math.round(gradeResponse[0]['RATING']['percent'], -1)+"%");

        newList[i] = {
            'h3': inData.HEAD,
            'displayUrl': inData.DISP,
            'desc': inData.TEXT,
            'url': inData.HEADU,
            'callouts': inData.CALL,
            'megacallout': inData.MEGACALLOUT,
            'extensions': inData.EXTT,
            'extensionsclass': inData.EXTCLASSNAME,
            'color': gradeResponse[0]['RATING']['color'],
            'icons': gradeResponse[0]['ICONS'],
            'profile': gradeResponse[0]['PROFILE'][0]
        };
    }

    var resultString = "<div id='ad-result'>";
    //resultString += "<h3>"+searchQuery+"</h3>";

    for (var i = 0; i < newList.length; i++) {
        resultString += "<div class='ad-wrapper'><div class='ad-details'>";
        resultString += "<div class='ad-grade'><span class='"+newList[i].color+"'>&#8226;</span></div>";
        resultString += "<p>"+newList[i].h3+"</p>";
        resultString += "<p>"+newList[i].displayUrl+"</p>";
        resultString += "<p>"+newList[i].desc+"</p>";
        if(newList[i].callouts.length){
            resultString += "<p class='ad-callouts'>"+newList[i].callouts+"</p>";
        }
        if(newList[i].extensions.length){
            resultString += "<p class='ad-extensions "+newList[i].extensionsclass+"'>";
            extensionsList = newList[i].extensions.split("\n");
            if(extensionsList.length){
                extensionsList.forEach(function(value){
                    resultString += "<span>"+value+"</span>";
                });
            }
            resultString += "<p>";
        }
        if(newList[i].megacallout.length){
            resultString += "<p class='ad-callouts'>"+newList[i].megacallout+"</p>";
        }
        resultString += newList[i].icons;
        resultString += "<div class='pagezii-icon'><span class='ad-type'>"+newList[i].profile+"</span></div>";
        resultString += "</div></div>";
    }
    if(newList.length < 1){
        resultString += "<p class='large-text'>No Ads found</p>";
    }
    resultString += "</div>";

    return resultString;
}

pz_getAds();
