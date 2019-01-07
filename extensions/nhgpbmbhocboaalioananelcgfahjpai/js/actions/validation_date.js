/**
 * ===================================================
 * properties of the CCE.DateValidator
 * ===================================================
 */
var CCE = CCE || {};
CCE.DateValidator = {
    /**
     * Function chkdate
     * @desc check if a date is valid or not when extracting the details
     */
    chkdate: function(strDate) {
        if ((typeof(strDate) != "string"))
            return false;

        var strDatestyle = "US"; //United States date style
        //var strDatestyle = "EU";  //European date style
        var strDateArray;
        var strDay;
        var strMonth;
        var strYear;
        var intday;
        var intMonth;
        var intYear;
        var booFound = false;
        var strSeparatorArray = new Array("-"," ","/",".");
        var intElementNr;
        var err = 0;

        var strMonthArray = new Array(12);
        strMonthArray[0] = "Jan";
        strMonthArray[1] = "Feb";
        strMonthArray[2] = "Mar";
        strMonthArray[3] = "Apr";
        strMonthArray[4] = "May";
        strMonthArray[5] = "Jun";
        strMonthArray[6] = "Jul";
        strMonthArray[7] = "Aug";
        strMonthArray[8] = "Sep";
        strMonthArray[9] = "Oct";
        strMonthArray[10] = "Nov";
        strMonthArray[11] = "Dec";


        for (intElementNr = 0; intElementNr < strSeparatorArray.length; intElementNr++) {
            if (strDate.indexOf(strSeparatorArray[intElementNr]) != -1) {
                strDateArray = strDate.split(strSeparatorArray[intElementNr]);

                if (strDateArray.length != 3) {
                    err = 1;
                    return false;
                } else {
                    strDay = strDateArray[0];
                    strMonth = strDateArray[1];
                    strYear = strDateArray[2];
                }

                booFound = true;
            }
        }

        if (booFound == false) {
            if (strDate.length > 5) {
                strDay = strDate.substr(0, 2);
                strMonth = strDate.substr(2, 2);
                strYear = strDate.substr(4);
            } else if (strDate.length == 4) {
                strYear = parseInt(strDate, 10);
                return true;
            }
        }

        if (strYear && strYear.length == 2) {
            strYear = '20' + strYear;
        }

        // US style
        var strTemp;

        if (strDatestyle == "US") {
            strTemp = strDay;
            strDay = strMonth;
            strMonth = strTemp;
        }

        intday = parseInt(strDay, 10);

        if (isNaN(intday)) {
            err = 2;
            return false;
        }

        intMonth = parseInt(strMonth, 10);

        if (isNaN(intMonth)) {
            for (var i = 0; i < 12 ; i++) {
                if (strMonth.toUpperCase() == strMonthArray[i].toUpperCase()) {
                    intMonth = i+1;
                    strMonth = strMonthArray[i];
                    i = 12;
                }
            }

            if (isNaN(intMonth)) {
                err = 3;
                return false;
            }
        }

        intYear = parseInt(strYear, 10);

        if (isNaN(intYear)) {
            err = 4;
            return false;
        }

        if (intMonth > 12 || intMonth < 1) {
            err = 5;
            return false;
        }

        if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intday > 31 || intday < 1)) {
            err = 6;
            return false;
        }

        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intday > 30 || intday < 1)) {
            err = 7;
            return false;
        }

        if (intMonth == 2) {
            if (intday < 1) {
                err = 8;
                return false;
            }

            if (CCE.DateValidator.LeapYear(intYear) == true) {
                if (intday > 29) {
                    err = 9;
                    return false;
                }
            } else {
                if (intday > 28) {
                    err = 10;
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Function LeapYear
     * @desc check if year is a leap year
     */
    LeapYear: function(intYear) {
        if (intYear % 100 == 0) {
            if (intYear % 400 == 0) {
                return true;
            }
        } else {
            if ((intYear % 4) == 0) {
                return true;
            }
        }

        return false;
    }
};
