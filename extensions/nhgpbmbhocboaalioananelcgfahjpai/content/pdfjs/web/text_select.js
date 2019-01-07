/** Workaround for select text in Chrome
 * If you update the library, please don't forget
 * to add this code in the new library **/
var mouseDownFlag = false;
function webViewerSelectStart() {
    var textSegmentsList = document.getElementsByClassName('segment-text');
    var nrTextSegments = textSegmentsList.length;

    for (var i = 0; i < nrTextSegments; i++) {
        textSegmentsList[i].addEventListener('mousedown', function(evt) {
            var _that = this;
            mouseDownFlag = true;
        }, false);

        textSegmentsList[i].addEventListener('mousemove', function(event) {
            if (!mouseDownFlag) {
                return;
            }
            var paddingLeft = event.offsetX;
            var paddingBottom = event.offsetY;
            event.toElement.style.padding = '0 ' + paddingLeft + 'px ' + paddingBottom + 'px 0';

        }, false);

        textSegmentsList[i].addEventListener('mouseleave', function() {
            this.style.padding = '0';
            this.style.margin = '0';
        }, false);

        textSegmentsList[i].addEventListener('mouseup', function(evt) {
            var _that = this;
            for (var j = 0; j < nrTextSegments; j++) {
                textSegmentsList[j].style.padding = '0';
                textSegmentsList[j].style.margin = '0';
            }
            mouseDownFlag = false;
        }, false);
    }
}
/** end of the workaround **/