"use strict";var bgSearch={init:function(){var i={current:infinity.i18nTranslate({name:"yandex | i18n",seId:"f33155f8c51a36fb76dad667dec7e44f",logo:"https://infinity-permanent.infinitynewtab.com/infinity/search-add/russia-yandex.png?imageView2/0/format/webp/q/100",desc:"yandex_desc | i18n",types:[{name:"web | i18n",url:"https://yandex.ru/search/?clid=2324058-2&isource=infinity&itype=web&iname=yandex&text="},{name:"images | i18n",url:"https://yandex.ru/images/search?clid=2324058-2&isource=infinity&itype=images&iname=yandex&text="},{name:"news | i18n",url:"https://news.yandex.ru/yandsearch?clid=2324058-2&rpt=nnews2&isource=infinity&itype=news&iname=yandex&text="},{name:"videos | i18n",url:"https://yandex.ru/video/search?clid=2324058-2&isource=infinity&itype=videos&iname=yandex&text="}]}),all:infinity.i18nTranslate([{name:"yandex | i18n",seId:"f33155f8c51a36fb76dad667dec7e44f",logo:"https://infinity-permanent.infinitynewtab.com/infinity/search-add/russia-yandex.png?imageView2/0/format/webp/q/100",desc:"yandex_desc | i18n",types:[{name:"web | i18n",url:"https://yandex.ru/search/?clid=2324058-2&isource=infinity&itype=web&iname=yandex&text="},{name:"images | i18n",url:"https://yandex.ru/images/search?clid=2324058-2&isource=infinity&itype=images&iname=yandex&text="},{name:"news | i18n",url:"https://news.yandex.ru/yandsearch?clid=2324058-2&rpt=nnews2&isource=infinity&itype=news&iname=yandex&text="},{name:"videos | i18n",url:"https://yandex.ru/video/search?clid=2324058-2&isource=infinity&itype=videos&iname=yandex&text="}]}]),customEngines:[]};infinity.init("infinity-searchs",i);var n=infinity.get("infinity-searchs");localStorage.seLogo=n.current.logo,infinity.init("infinity-search-language",{lang:infinity.lang}),infinity.onBroadcast("searchUpdate",function(i){infinity.doSyncData()})}};