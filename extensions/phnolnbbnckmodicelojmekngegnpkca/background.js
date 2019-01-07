
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
//nGabe 
(function($) {
	
    var self = $.nGabe = new function(){};
	
    $.extend(self, {
        nCageImgs : [
		'http://gamesforchange.org/festival2011/wp-content/uploads/2011/05/Gabe_01.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/5/59/Gabe_newell.jpg',
		'http://pcgmedia.com/wp-content/uploads/2012/11/valve-ceo-gabe-newell.jpg',
		'https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/tumblr_mbwr97AsJE1r8l821o1_400.gif',
		'http://cache.gawkerassets.com/assets/images/kotaku/2009/01/newell.png',
		'https://pbs.twimg.com/profile_images/1115437775/GabeNewell.png',
		'http://i1.cdnds.net/13/09/618x928/gaming_gabenewell_1.jpg',
		'http://www.geek.com/wp-content/uploads/2013/01/gabenewell-590x380.jpg',
		'http://s.pro-gmedia.com/videogamer/media/images/pub/605x/steam_gabe_newell_christmas.jpg',
		'http://www.6aming.com/wp-content/uploads/2013/02/Gabe-Newell-BAFTA-1.jpg',
		'http://fc09.deviantart.net/fs70/f/2013/153/c/f/pirate_gabe_newell__pi_master__by_firemariofireluigi61-d67iujz.jpg',
		'http://www.edge-online.com/wp-content/uploads/edgeonline/oldfiles/images/feature_article/2011/04/Gabe_Newell.jpg',
		'http://h6.abload.de/img/gabe_newell2v7h6.jpg',
		'http://www.airbornegamer.com/wp-content/uploads/2012/07/Gabe-Newell-Knives.jpg',
		'http://fc09.deviantart.net/fs70/i/2013/140/7/5/gabe_newell_as_a_pumpkin_by_paddleboatonfire-d6605hz.png',
		'http://fc03.deviantart.net/fs71/i/2012/257/c/8/gabe_newell_or_gaben_by_zestydoesthings-d5eoe2a.jpg',
		'https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/tumblr_mddyutPLfI1qzozj1.jpg',
		'http://venturebeat.files.wordpress.com/2012/07/gabe-3.jpg',
		'http://i0.kym-cdn.com/photos/images/original/000/327/833/2a5.jpg',
		'http://i0.kym-cdn.com/photos/images/original/000/291/429/29f.png',
		'https://lh3.ggpht.com/-thto7o7-RL4/T-55sEuwl5I/AAAAAAAAAH4/XptmMYANylE/s1600/ScreenHunter_405+Jun.+29+22.59.jpg',
		'http://assets.vg247.com/current//2009/07/gabenewell1b.jpg',
		'http://www.pcgamesn.com/sites/default/files/gabe-newell_0.jpg',
		'http://s.cghub.com/files/Image/626001-627000/626921/320_max.jpg',
		'http://bulk2.destructoid.com/ul/231974-gabe1.jpg',
		"http://www.tcs.cam.ac.uk/assets/news/thumbs/main/Gabe-Newell.jpg",
		"http://www.steamforlinux.com/sites/default/files/styles/large/public/field/image/Gabe%20Newell.jpg?itok=JGMi3sXi",
		"http://media1.gameinformer.com/imagefeed/featured/valve/gaben/gabenewelllbj610.jpg",
		"http://www.gameranx.com/img/12-Sep/santagabe.jpg",
        ],
        handleImages : function (lstImgs, time)
        {
            $.each($('img'), function(i,item) { 
                //Skip if image is already replaced
                if($.inArray($(item).attr('src'), lstImgs) == -1)
                {
					var h = $(item).height();
					var w = $(item).width();
					
					//If image loaded
					if(h > 0 && w > 0)
					{
						//Replace
						$(item).css('width', w + 'px').css('height', h + 'px');
						$(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]); 
					}
					else
					{
						//Replace when loaded
						$(item).load(function(){
							//Prevent 'infinite' loop
							if($.inArray($(item).attr('src'), lstImgs) == -1)
							{
								var h = $(item).height();
								var w = $(item).width();
								$(item).css('width', w + 'px').css('height', h + 'px');
								$(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]); 
							}
						});
					}
				}
            });
			
            //Keep replacing
            if (time > 0) {
                setTimeout(function () { self.handleImages(lstImgs, time); }, time);
            }
        }
    });

    //Run on jQuery ready
    $(function(){
        self.handleImages(self.nCageImgs, 3000);
    });
})(jQuery);

 