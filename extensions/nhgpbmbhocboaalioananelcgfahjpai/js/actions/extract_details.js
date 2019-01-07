/**
 * ===================================================
 * properties of the CCE.ExtractDetails
 * ===================================================
 */
var CCE = CCE || {};
CCE.ExtractDetails = {
    /**
     * Function trim
     * @desc - trim whitespace
     */
    trim: function(string) {
        if (typeof string != "undefined") {
            return (typeof string != "string") ? string.replace(/^\s+|\s+$/gi,"") : string;
        } else {
            return string;
        }
    },

    /**
     * Function stripTags
     * @desc - remove html tags
     * @param input - the text from which the html tags will be removed
     * @param allowed - exceptions for the html tags
     * @param replaceWith - the string that will replace the tags
     */
    stripTags: function(input, allowed, replaceWith) {
        replaceWith = (replaceWith || "") + "";
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : (replaceWith ? replaceWith : '');
        });
    },

    /**
     * Function hasRules
     * @desc - checks if an object has css_rule and regexp_rule property
     * @return  true if rules contains non-empty values for css_rule and regexp_rule
     */
    hasRules: function(rules) {
        return rules.css_rule && rules.regexp_rule;
    },

    /**
     * Function extract
     * @desc - extracts the information from doc using the given rules
     * @param rules
     * @param fl (@type boolean) - flag
     */
    extract: function(rules, fl) {
        var css_rule = rules.css_rule;
        var regexp_rule = rules.regexp_rule;
        var doc = window.document;

        if (document.getElementById("citelighterEmbedPDFJS")) {
            var _win = document.getElementById("citelighterEmbedPDFJS").shadowRoot;

            if (_win) {
                var iframe_win = _win.getElementById("citelighterPDFJSIframe");

                if (iframe_win) {
                    doc =  iframe_win.contentWindow.document;
                }
            }
        }

        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

        // get element matching css_rule
        var element = doc.querySelector(css_rule);

        if (element == null) {
            return '';
        }

        var withReplace = false;

        // ugly - convert element to something we can search via regex
        var elementStr = new XMLSerializer().serializeToString(element, "application/xhtml+xml");
        var regex = new RegExp(regexp_rule, 'i');

        if (rules.replace.length > 0) {
            var matches = elementStr.replace(regex, rules.replace);
            withReplace = true;
        } else {
            // search element with regexp_rule without replace
            var matches = regex.exec(elementStr);
        }

        if (matches) {
            if (matches.length == 1 || fl == true) {
                var s = CCE.ExtractDetails.trim(CCE.ExtractDetails.stripTags(matches[0].replace(".", ""))); // no group was matched - return whole string
            } else if(matches.length > 1) {
                if (withReplace) {
                    s = CCE.ExtractDetails.trim(matches.replace(".", ""));
                } else {
                    s = CCE.ExtractDetails.trim(CCE.ExtractDetails.stripTags(matches[1].replace(".", ""))); // one or more groups were matched - return the first
                }
            }

            if (s) {
                var d = new Date(s);
                if (d.getMonth()) {
                    return months[d.getMonth()] + "-" + d.getDate() + "-" + d.getFullYear();
                } else {
                    return s;
                }
            }
        }

        // no matches
        return '';
    },

    /**
     * Function formatAuthors
     * @desc - formats the authors array
     * @param a - the authors
     * @param multiple (@type boolean)
     * @return array
     */
    formatAuthors: function(a, multiple) {
        var authors = new Array;

        if (!a || (typeof a != "string")) {
            return authors;
        }

        var originalText = CCE.ExtractDetails.trim(CCE.ExtractDetails.stripTags(a, null, " "));

        if (originalText.length > 100) {
            var toIndex = originalText.indexOf(" ", 100);

            if (toIndex != -1) {
                originalText = originalText.substr(0, toIndex);
            } else {
                originalText = originalText.substr(0, 100);
                toIndex = originalText.lastIndexOf(" ");

                if (toIndex != -1) originalText = originalText.substr(0, toIndex);
            }
        }

        var ofn = ((originalText.toLowerCase().indexOf("by the") === 0) || (originalText.toLowerCase().indexOf("the") === 0)) ? true : false;
        a = CCE.ExtractDetails.trim(originalText.replace(/(written|by the|the |by |byline|dr\. |author|:|(<.[^<>]*>))/igm,''));

        if (a.indexOf(" and ") != -1) {
            if(a.indexOf(" and ") < a.lastIndexOf(",")) {
                a = a.substr(0, a.indexOf(","));
                multiple = true;
            }
        }

        if (a.indexOf(" And ") != -1) {
            if(a.indexOf(" And ") < a.lastIndexOf(",")) {
                a = a.substr(0, a.indexOf(","));
                multiple = true;
            }
        }

        if (a == "") {
            return authors;
        }

        a = a.replace(/(.*?)( and )(.*?)/igm, '$1,$3');

        if (!multiple) {
            var tmp = a.split(/(?:\,|\;|\|)/);
            a = CCE.ExtractDetails.trim(tmp[0]) ? CCE.ExtractDetails.trim(tmp[0]) : (CCE.ExtractDetails.trim(tmp[1]) ? CCE.ExtractDetails.trim(tmp[1]) : a);
            authors[0] =  {};
            var aSplit = a.split(" ", 3);

            if ((ofn == true) && CCE.ExtractDetails.authorNameIsValid(aSplit[0]) && (aSplit[0].charAt(0) == aSplit[0].charAt(0).toUpperCase())) {
                authors[0].first_name = aSplit.join(" ");
                authors[0].middle_name = "";
                authors[0].last_name = "";
            } else if (ofn == false) {
                authors[0] = CCE.ExtractDetails.createAuthorObj(aSplit);
            } else {
                return authors;
            }
        } else {
            //if there is more than one author
            var authorsArr = a.split(/(?:\,|\;|\|)/);

            for (var i in authorsArr) {
                authors[i] =  new Array();
                authorsArr[i]= CCE.ExtractDetails.trim(authorsArr[i]);
                aSplit = authorsArr[i].split(" ");
                authors[i] = CCE.ExtractDetails.createAuthorObj(aSplit);
            }
        }

        return authors;
    },

    /**
     * Function createAuthorObj
     * @desc - formats one author
     * @return array
     */
    createAuthorObj: function(arr) {
        var author = {
            first_name: "",
            middle_name: "",
            last_name: ""
        }

        if (!arr) {
            return author;
        }

        if (arr[0] && CCE.ExtractDetails.trim(arr[0]) && CCE.ExtractDetails.authorNameIsValid(arr[0]) && (arr[0].charAt(0) == arr[0].charAt(0).toUpperCase())) {
            author.first_name = CCE.ExtractDetails.trim(arr[0]);

            if (arr[2] && CCE.ExtractDetails.trim(arr[2]) && CCE.ExtractDetails.authorNameIsValid(arr[2]) && (arr[2].charAt(0) == arr[2].charAt(0).toUpperCase())) {
                if (CCE.ExtractDetails.trim(arr[1]) && CCE.ExtractDetails.authorNameIsValid(arr[1]) && (arr[1].charAt(0) == arr[1].charAt(0).toUpperCase()))
                    author.middle_name = CCE.ExtractDetails.trim(arr[1]);
                else
                    author.middle_name = "";
                author.last_name = CCE.ExtractDetails.trim(arr[2]);
            } else if (arr[1] && CCE.ExtractDetails.trim(arr[1]) && CCE.ExtractDetails.authorNameIsValid(arr[1]) && (arr[1].charAt(0) == arr[1].charAt(0).toUpperCase())) {
                author.middle_name = "";
                author.last_name = CCE.ExtractDetails.trim(arr[1]);
            } else {
                author.middle_name = "";
                author.last_name = "";
            }
        } else if (arr[1] && CCE.ExtractDetails.trim(arr[1]) && CCE.ExtractDetails.authorNameIsValid(arr[1]) && (arr[1].charAt(0) == arr[1].charAt(0).toUpperCase())) {
            author.first_name = CCE.ExtractDetails.trim(arr[1]);
            author.middle_name = "";

            if (arr[2] && CCE.ExtractDetails.trim(arr[2]) && CCE.ExtractDetails.authorNameIsValid(arr[2]) && (arr[2].charAt(0) == arr[2].charAt(0).toUpperCase()))
                author.last_name = CCE.ExtractDetails.trim(arr[2]);
            else
                author.last_name = "";
        } else if (arr[2] && CCE.ExtractDetails.trim(arr[2]) && CCE.ExtractDetails.authorNameIsValid(arr[2]) && (arr[2].charAt(0) == arr[2].charAt(0).toUpperCase())) {
            author.first_name = CCE.ExtractDetails.trim(arr[2]);
            author.middle_name = "";
            author.last_name = "";
        }

        return author;
    },

    /**
     * Function authorNameIsValid
     * @desc - checks if an author name is valid
     * @return boolean
     */
    authorNameIsValid: function(string) {
        string = (string || "") + "";
        return /^[a-zA-Z]+(\.){0,1}[a-zA-Z]*(\.){0,1}$/g.test(string);
    },

    /**
     * Function filterAuthorsArr
     * @desc - filters the authors array
     * @return array
     */
    filterAuthorsArr: function(o) {
        if (!o || !o[0]) return [];
        var filteredAuthors = [];

        for (var i = o.length - 1 ; i >= 0 ; i--) {
            if (!o[i].hasOwnProperty("first_name") && !o[i].hasOwnProperty("last_name")) {
                o.splice(i, 1);
            } else if (o[i].first_name.trim() == "" && o[i].last_name.trim() == "") {
                o.splice(i, 1);
            } else {
                filteredAuthors.push(o[i]);
            }
        }

        return filteredAuthors;
    },

    /**
     * Function extractOrgFromTitle
     * @desc - extracts the organization from the page title
     * @return string
     */
    extractOrgFromTitle: function(title, token) {
        if (!title || !token) return "";

        var organization = "";

        var pageTitleFragments = title.split(/[\|-]/);
        var fragNo = pageTitleFragments.length;

        if (fragNo == 1) {
            if ( title.toLowerCase().indexOf(token.toLowerCase()) != -1 )
                organization = token.substr(0, 1).toUpperCase() + token.substr(1);

            if (!organization && (title.replace(/\s*/igm, "").toLowerCase().indexOf(token.toLowerCase()) != -1))
                organization = title;
        } else if (fragNo > 1) {
            for (var it = 0; it < fragNo; it++) {
                if ( (pageTitleFragments[it].toLowerCase().indexOf(token.toLowerCase()) != -1) ||
                    (pageTitleFragments[it].replace(/\s*/igm, "").toLowerCase().indexOf(token.toLowerCase()) != -1) ) {
                    organization = pageTitleFragments[it];
                    break;
                }
            }
        }

        return organization;
    },

    /**
     * Function getSelectionDetails
     * @desc - gets the current selection details
     * @return object
     */
    getSelectionDetails: function(params, response) {
        var data = response.data;
        var hasDetails = data ? true : false;
        var doc = document;

        var websiteTitle = "";
        var title = "";
        var a = null;
        var publishdate = "";
        var publisher = "";
        var organization = "";
        var trim = CCE.ExtractDetails.trim,
            stripTags = CCE.ExtractDetails.stripTags;

        /*
         * WEBSITE TITLE
         */
        var _titles = doc.getElementsByTagName("title");
        var _title = _titles && _titles[0] && _titles[0].innerHTML;

        var pageTitle = trim(_title);

        if (hasDetails && typeof data.indexedData != "undefined" && data.indexedData.website_title != "undefined" && trim(data.indexedData.website_title) != "") {
            websiteTitle = data.indexedData.website_title;
        } else if (hasDetails && typeof data.rules != "undefined" && CCE.ExtractDetails.hasRules(data.rules.websiteTitle)) {
            websiteTitle = CCE.ExtractDetails.extract(data.rules.websiteTitle);
        } else {
            if (hasDetails && typeof data.details != "undefined" && typeof data.details.website_title != "undefined") {
                websiteTitle = data.details.website_title
            }
        }

        if (websiteTitle == "" || websiteTitle == null) {
            websiteTitle = pageTitle;
        }

        /*
         * ARTICLE TITLE
         */
        if (hasDetails && typeof data.indexedData != "undefined" && data.indexedData.title != "undefined" && trim(data.indexedData.title) != "") {
            title = data.indexedData.title;
        } else if (hasDetails && typeof data.rules != "undefined" && CCE.ExtractDetails.hasRules(data.rules.title)) {
            title = CCE.ExtractDetails.extract(data.rules.title);
        }

        var tt = new Array('h1', 'Headline','rbtitle', 'title');

        if (title == '' || typeof title == "undefined") {
            for (var i in tt) {
                if (!title && (doc.getElementById(tt[i]) != null)) {
                    title = trim(stripTags(doc.getElementById(tt[i]).innerHTML.replace(/&nbsp;/gi,' ')));
                }

                if (!title && (doc.getElementsByTagName(tt[i]).item(0) != null)) {
                    title = trim(stripTags(doc.getElementsByTagName(tt[i]).item(0).innerHTML.replace(/&nbsp;/gi,' ')));
                }
            }
        }

        if (!title && (typeof title == 'string')) {
            title = trim(stripTags(escape(title))).replace(/&nbsp;/gi,' ');
        }

        /*
         * AUTHORS
         */
        if (hasDetails && typeof data.indexedData != "undefined" && typeof data.indexedData.authors != "undefined" && data.indexedData.authors[0]) {
            a = data.indexedData.authors;
        } else {
            var authors;

            if (hasDetails && typeof data.rules != "undefined" && CCE.ExtractDetails.hasRules(data.rules.author)) {
                authors = CCE.ExtractDetails.extract(data.rules.author);
                a = CCE.ExtractDetails.formatAuthors(authors);
                a = a ? CCE.ExtractDetails.filterAuthorsArr(a) : [];

                if (!a[0]) {
                    authors = CCE.ExtractDetails.extract(data.rules.author, true);
                    a = CCE.ExtractDetails.formatAuthors(authors);
                    a = a ? CCE.ExtractDetails.filterAuthorsArr(a) : [];
                }
            }

            if (a == null || !a[0]) {
                var contents = '';
                authors = CCE.ExtractDetails.getMetaContents('author');

                if (!authors) {
                    //get the contents of the current page
                    contents = doc.body.innerHTML.toString().replace(/\s+/ig, " ");

                    var authorElements = new Array('auth', 'byline', 'byl', 'post-author', 'author1', 'author', 'vcard', 'authorHead', 'authorName', 'by', 'Author', 'rbauthors' );
                    var is_multiple = false;

                    for (var i = 0; !authors && i < authorElements.length; i += 1) {
                        var el = authorElements[i];
                        //search authors by tag name
                        if (!authors && doc.getElementsByTagName(el).item(0) != null) {
                            authors = doc.getElementsByTagName(el).item(0).innerHTML;
                        }

                        //search authors by id
                        if (!authors && doc.getElementById(el)!= null) {
                            authors = doc.getElementById(el).innerHTML;
                        }

                        //search authors by class name
                        // if (!authors && doc.getElementsByClassName(el).item(0) != null){
                        // fix: get all authors; query by class might get several authors
                        if (!authors && doc.getElementsByClassName(el).length > 0) {
                            if(doc.getElementsByClassName(el).length > 1) is_multiple = true;
                            //     authors = doc.getElementsByClassName(el).item(0);
                            for (var ai = 0; ai < doc.getElementsByClassName(el).length; ai++) {
                                if (authors.length > 0) authors += "; ";

                                authors += doc.getElementsByClassName(el).item(ai).innerHTML;
                            }
                        }

                        //search authors by id or class containing the keyword of the current iteration
                        if (!authors) {
                            var s = '/(?:id|class)=(?:\'|")[^\<\>\'\"\?\=\/]*' + el + '[^\<\>\'\"\?\=\/]*(?:\'|")[^\<\>]*>/i';
                            var splitContents = contents.split(s);

                            if (splitContents[1]) {
                                var match = trim(stripTags(splitContents[1].toString(), null, " "));
                                if (match) authors = match;
                            }
                        } else if (authors && (typeof authors == "object")) {
                            //extacts the finding content
                            authors = authors.innerHTML.toString();
                        }
                    }// for
                }
                //general case - searching authors using "By" keyword
                if (!authors) {
                    var authRe = new RegExp ('<(\\w+)[^>]*>\\s*(b|B)y(?:(?!</?\\1\\b).)*</\\1>', 'igm');
                    var matchRe = authRe.exec(contents);

                    if ((matchRe != null) && matchRe[0]) authors = matchRe[0];
                }

                //general case - using "by" and "author" keywords
                if (!authors) {
                    s = '/(?:by|author)\<\/.*?>(.[^<>]*)\<\//igm';
                    match = contents.match(s);

                    for (var m in match){
                        if (match[m][0] && (match[m].length < 100)){
                            authors = match[m];
                            break;
                        }
                    }
                }

                if (authors) authors = trim(stripTags(authors, null, " ")).replace(/\s+/ig, " ");

                a = CCE.ExtractDetails.formatAuthors(authors,is_multiple);
            }


        }// authors

        a = a ? CCE.ExtractDetails.filterAuthorsArr(a) : [];

        /*
         * ORGANIZATION
         */
        if (hasDetails && typeof data.indexedData.organization != "undefined" && data.indexedData.organization[0]) {
            organization = data.indexedData.organization;
        } else {
            try {
                var hostname = doc.location.hostname;
                var hostArr = hostname.split(".", 3);
                var hostArrLength = hostArr.length;
                var token = "";

                for (var iter = 0; iter < hostArrLength; iter++) {
                    if (hostArr[iter] != "www") token = hostArr[iter];
                    organization = CCE.ExtractDetails.extractOrgFromTitle(pageTitle, token);
                    if (organization) break;
                }
            } catch(e) {}

            if (organization.length > 0) {
                organization = CCE.ExtractDetails.trim(organization);
            }
        }

        /*
         * PUBLISHER
         */
        if (hasDetails && typeof data.indexedData.publisher != "undefined" && trim(data.indexedData.publisher) != "") {
            publisher = data.indexedData.publisher;
        } else if (hasDetails && typeof data.rules != "undefined" && CCE.ExtractDetails.hasRules(data.rules.publisher)) {
            publisher = CCE.ExtractDetails.extract(data.rules.publisher);
            organization = publisher;
        }

        if (publisher == "") {
            var publisherElements = new Array('publisher', 'copyright', 'cre');

            for (var i in publisherElements) {
                var el = publisherElements[i];

                if (!publisher && (doc.getElementsByTagName(el).item(0) != null)) {
                    publisher = doc.getElementsByTagName(el).item(0).innerHTML;
                }

                if (!publisher && (doc.getElementById(el) != null)) {
                    publisher = doc.getElementById(el).innerHTML;
                }

                if (!publisher && (doc.getElementsByClassName(el).item(0) != null)) {
                    publisher = doc.getElementsByClassName(el).item(0).innerHTMl;
                }
            }

            if (publisher) {
                if (typeof publisher == 'object')
                    publisher = publisher.toString();

                if (typeof publisher == 'string')
                    publisher = publisher.replace(/(<([^>]+)>)/ig,"");
            }

            if (!publisher) publisher = organization;
        }

        if (typeof websiteTitle != "undefined" && websiteTitle !== null && websiteTitle.indexOf("Citelighter Pro") > -1) {
            websiteTitle = websiteTitle.replace("Citelighter Pro", "");
            websiteTitle = websiteTitle.replace(/^\-/, "").replace(/(^\s)|(\s$)/g, "");
        }

        /*
         * DATE
         */
        var begin = '', end = '';

        if (hasDetails && typeof data.indexedData.publication_date != "undefined" && trim(data.indexedData.publication_date) != "") {
            publishdate = data.indexedData.publication_date;
        } else if (hasDetails && typeof data.rules != "undefined" && CCE.ExtractDetails.hasRules(data.rules.date)) {
            publishdate = CCE.ExtractDetails.extract(data.rules.date);
        }

        if (publishdate == '') {
            var dateElements = new Array('date','DC.date','DISPLAYDATE','lastmod','strapBox','timestamp', 'tmstmp','publishdate','published');

            for(var i in dateElements) {
                var el = dateElements[i];

                if ((publishdate == '') && (doc.getElementsByTagName(el).item(0) != null)) {
                    publishdate = doc.getElementsByTagName(el).item(0).innerHTML;
                }

                if ((publishdate == '') && (doc.getElementById(el) != null)) {
                    publishdate = doc.getElementById(el).innerHTML;
                }

                if ((publishdate == '') && (doc.getElementsByClassName(el).length>0)) {
                    publishdate = doc.getElementsByClassName(el);
                }
            }

            if (publishdate == '') {
                var publisherElements = new Array('publisher','copyright','cre');

                for (var i in publisherElements) {
                    var el = publisherElements[i];
                    //tre sa vad cum pun aici valoarea
                    var t = doc.body.innerHTML.toString().split(window.getSelection());
                    var ss = '/(?:id|class)=(?:\'|")[^\<\>\'\"\?\=\/]*' + el + '[^\<\>\'\"\?\=\/]*(?:\'|")[^\<\>]*>/i';
                    var tt = end.split(ss);

                    if (tt[1]) {
                        var match = tt[1].toString().match(/^(.[^<>]*)(?:<\/|$)/);
                        if (match) {
                            publishdate = match[1];
                        }
                    }

                    if (publishdate == '') {
                        var t = doc.body.innerHTML.toString().split(window.getSelection());
                        var tt = begin.split(ss);
                        var match = tt[tt.length-1].toString().match(/^(.[^<>]*)(?:<\/|$)/);

                        if (match) {
                            publishdate = match[1];
                        }
                    }
                }
            }

            if (publishdate && (typeof(publishdate) == "object") && publishdate[0] && publishdate[0].textContent && (publishdate[0].textContent.length > 0)) {
                publishdate = publishdate[0].textContent;
            }

            if (publishdate && (CCE.DateValidator.chkdate(publishdate) == false)) {
                publishdate = '';
            }

            if ((publishdate == '') && hasDetails && typeof data.details != "undefined" && data.details.google_publication_date != "undefined" && CCE.DateValidator.chkdate(data.details.google_publication_date))
                publishdate = data.details.google_publication_date;
        }

        params.details = {
            website_title: websiteTitle,
            title: title,
            authors: a,
            publishdate: publishdate,
            publisher: publisher,
            organization: organization
        }

        return params;
    },

    /**
     * Function getMetaContents
     * @desc - gets the meta contents of the document
     * @return array
     */
    getMetaContents: function(name) {
        var tags = window.document.getElementsByTagName('meta');
        var contents = '';

        for (var i in tags) {
            if(tags[i].name == name) {
                return tags[i].content;
            }
        }

        return contents;
    },

    /**
     * Function initialSetup
     * @desc - sends the extraction details to the background page
     */
    initialSetup: function() {
        chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
            var response = {};

            if (!request.scope || (request.scope == "extract_details")) {
                switch(request.action) {
                    case "getSelectionDetails":
                        var params = CCE.ExtractDetails.getSelectionDetails(request.params, request.response);
                        response = params;
                        break;
                }
            } else {
                return true;
            }

            try {
                if (typeof sendResponse == "function") {
                    sendResponse(response);
                }
            } catch(e) {}
        });
    }
};
