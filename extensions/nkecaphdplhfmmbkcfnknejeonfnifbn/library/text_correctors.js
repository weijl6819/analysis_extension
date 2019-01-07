function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

function hexcodeToChar(text) {
    var regex = /&#x[\dA-F]{1,5};/gi;
    var regex1 = /&#x[\dA-F]{1,5}d;/gi;
    var regex2 = /&#(?:x([\da-f]+)|(\d+));/gi;
    var matchedRegex;

    if (regex.test(text)) {
        matchedRegex = regex;
    } else {
        if (regex1.test(text)) {
            matchedRegex = regex1;
        }
    }
    if (matchedRegex === undefined) {
        if (regex2.test(text)) {
            return text.replace(regex2, function (_, hex, dec) {
                return String.fromCharCode(dec || +('0x' + hex));
            });
        }
    }
    if (matchedRegex !== undefined || matchedRegex !== null) {
        return text.replace(matchedRegex, function replace(match) {
            return String.fromCharCode(parseInt(match.replace(/&#x/g, '0x').replace(/;/g, ''), 16));
        });
    } else {
        return text;
    }
}