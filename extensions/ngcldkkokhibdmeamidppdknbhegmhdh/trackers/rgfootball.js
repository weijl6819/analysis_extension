// ==UserScript==
// @name rgFootball
// @trackerURL http://rgfootball.net/
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AkIAyUadlurrgAAA19JREFUOMt9U19sk3UUPb+v29rC9nXDCbIwNxodWZlLs1EIQzDSCaFOVkVgE//MUJEawoYx+ILExAeZDwNnukEcuC2GRSVTOhoU6IiFOcUh0Hb9Q5kjtGtpWtzasa/tpN/1gTBHMJ6ne09ybu45NxeYBZOpY3aLnYZd0vr1+qzZXG9vH/4TJtOXM3V//88Gt9tzrv+81WE+2XvN5fb0WSw/1QIAEaHlYNvD4jb9dgBA97cnltgdTvuI9zp5r9pFc3WdaF5XL454PBQIBMjhdJ06P3T5cQBornkDAMA+rzeisacdlmUblb5F2QPK7XVP+FqOkvZPgR6LJhmTSOhuQS5+WCyBuukd7o+jXzuf8gtrNt7LHJf9/s2/W/Tt3mfzut0UCoXEO3cnxQM1W0Vf9irxRs6zYnPd22IkNiGGw2HRaRsg85Z3Dz7QcQDQV/zcuoJVFauFVErkOEYJQYDc4aNLe3SwvaahvJExkstkNBmPIbNgPi1aoW766unq+QAgAYDlxoZ9C5aWqCGRgGMcrl2+wiQryrC+YRsrWbsGV+JhJuN5yKRSlhAERCcnWUCRMfrj4MUhDgC27jYqr7pcVFJaSslkEol4DLpaPZx2By7abGjY00QXLKcwVz4HxUolknnZ0BkNKgDIAIA00b2FoQlmazFB+M2Owrc2IRgMss7OTigUCrayqgqlUgUGP/sCc4sKkWYErqz875kB49E7DtUG7Vqp4ROaw/P4FWm2QCalTdpqlimXEwEIp6bw8sAoC/U7ITvejEAgdGkmxFha7Djb1gHh1hiTBaIsa9enOPbe+4z4HMQEgXW9uYNVdFnZtM+PVPQv5r/lT7xUu60XANiDc5xoPXJEDnGH4qPDYqBxC1tY8QzFOTAxmSKEIgidvQCVO4jbm5/nbk4njXtbDhwevem/b8Hn8WDYe2Nvuaai0joWrFSqy+hJdTkikQjy8/PB5+ay9jNW8G37WVFpiTlj+Poxw0Qci4sL71s4aTkHfW1N7BfboLZI90KrKzTGxkO3ubx58xgxxtmsVraycWd6Kif7g57j329+ZYN2WrV0CR6ycOhQO6pWL8PySg0+bjUVs67vXle8qlNNDXvTiWRqKEuj6d7/YeN4d3cPeJ6HXv/iox95+vQZ/B+I6BHuH9zfeibCOpt1AAAAAElFTkSuQmCC
// @description Спортивный торрент трекер.
// @downloadURL https://github.com/Feverqwe/tSearch/raw/master/src/trackers/rgfootball.js
// @connect *://rgfootball.net/*
// @require exKit
// @version 1.0.1
// ==/UserScript==

API_exKit({
    id: 'rgfootball',
    title: 'rgFootball',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AkIAyUadlurrgAAA19JREFUOMt9U19sk3UUPb+v29rC9nXDCbIwNxodWZlLs1EIQzDSCaFOVkVgE//MUJEawoYx+ILExAeZDwNnukEcuC2GRSVTOhoU6IiFOcUh0Hb9Q5kjtGtpWtzasa/tpN/1gTBHMJ6ne09ybu45NxeYBZOpY3aLnYZd0vr1+qzZXG9vH/4TJtOXM3V//88Gt9tzrv+81WE+2XvN5fb0WSw/1QIAEaHlYNvD4jb9dgBA97cnltgdTvuI9zp5r9pFc3WdaF5XL454PBQIBMjhdJ06P3T5cQBornkDAMA+rzeisacdlmUblb5F2QPK7XVP+FqOkvZPgR6LJhmTSOhuQS5+WCyBuukd7o+jXzuf8gtrNt7LHJf9/s2/W/Tt3mfzut0UCoXEO3cnxQM1W0Vf9irxRs6zYnPd22IkNiGGw2HRaRsg85Z3Dz7QcQDQV/zcuoJVFauFVErkOEYJQYDc4aNLe3SwvaahvJExkstkNBmPIbNgPi1aoW766unq+QAgAYDlxoZ9C5aWqCGRgGMcrl2+wiQryrC+YRsrWbsGV+JhJuN5yKRSlhAERCcnWUCRMfrj4MUhDgC27jYqr7pcVFJaSslkEol4DLpaPZx2By7abGjY00QXLKcwVz4HxUolknnZ0BkNKgDIAIA00b2FoQlmazFB+M2Owrc2IRgMss7OTigUCrayqgqlUgUGP/sCc4sKkWYErqz875kB49E7DtUG7Vqp4ROaw/P4FWm2QCalTdpqlimXEwEIp6bw8sAoC/U7ITvejEAgdGkmxFha7Djb1gHh1hiTBaIsa9enOPbe+4z4HMQEgXW9uYNVdFnZtM+PVPQv5r/lT7xUu60XANiDc5xoPXJEDnGH4qPDYqBxC1tY8QzFOTAxmSKEIgidvQCVO4jbm5/nbk4njXtbDhwevem/b8Hn8WDYe2Nvuaai0joWrFSqy+hJdTkikQjy8/PB5+ay9jNW8G37WVFpiTlj+Poxw0Qci4sL71s4aTkHfW1N7BfboLZI90KrKzTGxkO3ubx58xgxxtmsVraycWd6Kif7g57j329+ZYN2WrV0CR6ycOhQO6pWL8PySg0+bjUVs67vXle8qlNNDXvTiWRqKEuj6d7/YeN4d3cPeJ6HXv/iox95+vQZ/B+I6BHuH9zfeibCOpt1AAAAAElFTkSuQmCC',
    desc: 'Спортивный торрент трекер.',
    flags: {
        auth: 1,
        language: 'ru',
        cyrillic: 1
    },
    categoryList: {
        serials: [],
        music: [],
        games: [166, 167],
        films: [],
        cartoon: [],
        books: [],
        soft: [],
        anime: [],
        doc: [],
        sport: [2, 352, 196, 57, 56, 46, 3, 54, 351, 172, 194, 53, 55, 223, 4, 58, 353, 173, 202, 59, 60, 208, 5, 209, 63, 354, 174, 198, 62, 61, 6, 210, 66, 355, 175, 195, 65, 64, 7, 211, 69, 176, 68, 67, 8, 72, 348, 152, 71, 70, 212, 188, 356, 189, 190, 191, 213, 9, 87, 91, 90, 88, 89, 179, 214, 338, 340, 342, 344, 339, 341, 343, 345, 157, 158, 159, 232, 220, 160, 161, 162, 231, 215, 11, 376, 377, 13, 12, 74, 75, 76, 78, 79, 80, 14, 350, 118, 200, 255, 337, 185, 136, 216, 15, 380, 168, 178, 153, 217, 10, 367, 239, 241, 132, 230, 155, 133, 92, 77, 218, 16, 219, 18, 19, 17, 37, 199, 86, 36, 43, 21, 251, 379, 201, 47, 207, 48, 151, 206, 222, 131, 234, 49, 20, 233, 50, 150, 204, 197, 51, 203, 171, 22, 274, 125, 126, 127, 128, 130, 129, 23, 248, 117, 44, 227, 226, 38, 261, 262, 170, 169, 82, 205, 122, 123, 25, 98, 101, 100, 99, 97, 121, 145, 106, 240, 137, 139, 140, 141, 24, 142, 105, 104, 149, 103, 148, 96, 192, 193, 143, 144, 147, 138, 184, 26, 146, 95, 180, 182, 181, 183, 276, 277, 359, 360, 301, 369, 362, 361, 303, 304, 325, 327, 326, 316, 318, 278, 370, 292, 280, 281, 282, 279, 284, 285, 286, 287, 288, 289, 291, 290, 294, 296, 297, 298, 299, 305, 368, 364, 363, 306, 308, 245, 366, 365, 310, 312, 311, 313, 322, 324, 323, 328, 331, 330, 329, 333, 371, 358, 319, 320, 283, 336, 335, 349],
        xxx: [],
        humor: []
    },
    search: {
        searchUrl: 'http://rgfootball.net/tracker.php',
        nextPageSelector: {selector: '.bottom_info div.nav a:eq(-1)', attr: 'href'},
        baseUrl: 'http://rgfootball.net/',
        requestType: 'GET',
        requestData: 'nm=%search%',
        listItemSelector: '#tor-tbl>tbody>tr',
        torrentSelector: {
            categoryTitle: 'td:eq(2)>a',
            categoryUrl: {selector: 'td:eq(2)>a', attr: 'href'},
            categoryId: {selector: 'td:eq(2)>a', attr: 'href'},
            title: 'td.med.tLeft a',
            url: {selector: 'td.med.tLeft a', attr: 'href'},
            size: 'td.small.nowrap:eq(0)>u',
            downloadUrl: {selector: 'td.small.nowrap:eq(0)>a', attr: 'href'},
            seed: 'td.seedmed',
            peer: 'td.leechmed',
            date: 'td.small.nowrap:eq(1)>u'
        },
        onGetValue: {
            categoryId: function (details, value) {
                return exKit.funcList.idInCategoryListInt(details.tracker, value, /f=([0-9]+)/);
            }
        }
    }
});