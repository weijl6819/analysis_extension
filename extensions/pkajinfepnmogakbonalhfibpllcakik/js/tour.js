
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
var tourWrapper,
	tourSteps,
	stepsNumber,
	coverLayer,
	tourStepInfo;
function initTour() {
var tourWrapper = $('.cd-tour-wrapper'),
	tourSteps = tourWrapper.children('li'),
	stepsNumber = tourSteps.length,
	coverLayer = $('.cd-cover-layer'),
	tourStepInfo = $('.cd-more-info');
	$('body').addClass('disable-scroll')
	//create the navigation for each step of the tour
	createNavigation(tourSteps, stepsNumber);
	
	//start tour
	if(!tourWrapper.hasClass('active')) {
		//in that case, the tour has not been started yet
		tourWrapper.addClass('active');
		showStep(tourSteps.eq(0), coverLayer);
	}

	//change visible step
	tourStepInfo.on('click', '.cd-prev', function(event){
		//go to prev step - if available
		( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'prev');
	});
	tourStepInfo.on('click', '.cd-next', function(event){
		//go to next step - if available
		( !$(event.target).hasClass('inactive') ) && changeStep(tourSteps, coverLayer, 'next');
	});

	//close tour
	tourStepInfo.on('click', '.cd-close', function(event){
		closeTour(tourSteps, tourWrapper, coverLayer);
	});

	//detect swipe event on mobile - change visible step
	tourStepInfo.on('swiperight', function(event){
		//go to prev step - if available
		if( !$(this).find('.cd-prev').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'prev');
	});
	tourStepInfo.on('swipeleft', function(event){
		//go to next step - if available
		if( !$(this).find('.cd-next').hasClass('inactive') && viewportSize() == 'mobile' ) changeStep(tourSteps, coverLayer, 'next');
	});

	//keyboard navigation
	$(document).keyup(function(event){
		if( event.which=='37' && !tourSteps.filter('.is-selected').find('.cd-prev').hasClass('inactive') ) {
			changeStep(tourSteps, coverLayer, 'prev');
		} else if( event.which=='39' && !tourSteps.filter('.is-selected').find('.cd-next').hasClass('inactive') ) {
			changeStep(tourSteps, coverLayer, 'next');
		} else if( event.which=='27' ) {
			closeTour(tourSteps, tourWrapper, coverLayer);
		}
	});
	
	$(document).on('click','.cd-tour-wrapper.active',function(e){
		if($(e.target).hasClass('cd-tour-wrapper')) $('.cd-next:first').trigger('click');
	});
}

function createNavigation(steps, n) {
	var tourNavigationHtml = '<div class="cd-nav"><span><b class="cd-actual-step">1</b> of '+n+'</span><ul class="cd-tour-nav"><li><a href="#0" class="cd-prev">&#171; Previous</a></li><li><a href="#0" class="cd-next"></a></li></ul></div><a href="#0" class="cd-close">Close</a>';

	steps.each(function(index){
		var step = $(this),
			stepNumber = index + 1,
			next_text = ( stepNumber < n ) ? 'Next' : 'Finish',
			prevClass = ( stepNumber == 1 ) ? 'inactive' : '';
		var nav = $(tourNavigationHtml).find('.cd-next').html(next_text+' &#187;').end().find('.cd-prev').addClass(prevClass).end().find('.cd-actual-step').html(stepNumber).end().appendTo(step.children('.cd-more-info'));
	});
}

function showStep(step, layer) {
	step.addClass('is-selected').removeClass('move-left');
	smoothScroll(step.children('.cd-more-info'));
	showLayer(layer);
}

function smoothScroll(element) {
	(element.offset().top < $(window).scrollTop()) && $('body,html').animate({'scrollTop': element.offset().top}, 100);
	(element.offset().top + element.height() > $(window).scrollTop() + $(window).height() ) && $('body,html').animate({'scrollTop': element.offset().top + element.height() - $(window).height()}, 100); 
}

function showLayer(layer) {
	layer.addClass('is-visible').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
		layer.removeClass('is-visible');
	});
}

function changeStep(steps, layer, bool) {
	var visibleStep = steps.filter('.is-selected'),
		delay = (viewportSize() == 'desktop') ? 300: 0; 
	visibleStep.removeClass('is-selected');

	(bool == 'next') && visibleStep.addClass('move-left');

	setTimeout(function(){
		if( bool == 'next' ){
			if(visibleStep.next().length == 0){
				closeTour(tourSteps, tourWrapper, coverLayer);
			}else{
				/* if(visibleStep.next().index() == 2) $('.cd-panel').addClass('is-visible'); */
				showStep(visibleStep.next(), layer);
			}
		}else{
			/* if($('.cd-panel').hasClass('is-visible')){
				$('.cd-panel').removeClass('is-visible');
			} */
			showStep(visibleStep.prev(), layer);
		}
	}, delay);
}

function closeTour(steps, wrapper, layer) {
	if($('.cd-panel').hasClass('is-visible')){
		$('.cd-panel').removeClass('is-visible');
	}
	$('body').removeClass('disable-scroll');
	$('#tour_container').remove();
	chrome.storage.sync.set({'tour_shown': true});
	return false;
}

function viewportSize() {
	/* retrieve the content value of .cd-main::before to check the actua mq */
	return window.getComputedStyle(document.querySelector('.cd-tour-wrapper'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
}
