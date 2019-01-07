// html rendering from rss feed goes here
$(document).ready(function () {
    var lastReadItemId = 0;

    // On read remove badge text and set read status
    chrome.browserAction.setBadgeText({ text: "" });

    ////$.get('http://192.168.37.26:9002/rss.xml')
    $.get('http://www.naturalnews.com/rss.xml')
  .done(function (data) {

      // list of elements to bind
      var titleText;
      var titleLinkText;
      var descriptionText;
      var languageText;
      var copyrightText;
      var lastbuildDateText;
      var imageText;
      var nowDate = new Date($.now());

      $(data).find("channel").each(function () {
          var rootElement = $(this);
          console.log(rootElement)
          console.log("------------------------");

          // get all children elements
          var children = $(this).children();
          ////console.log(children)

          // get title element
          var title = $(this).children('title');
          titleText = title.text();
          $('#feedTitleText').html(titleText)


          // get link element
          var titleLink = $(this).children('link');
          titleLinkText = titleLink.text();
          $('#feedTitleLink').attr("href", titleLinkText)

          // get description element
          descriptionText = $(this).children('description').text();
          $('#feedSubtitleText').html(descriptionText)

          // get language text
          languageText = $(this).children('language').text();

          // get copy right text
          copyrightText = $(this).children('copyright').text();

          // get last build date text
          lastbuildDateText = $(this).children('lastbuilddate').text();

          // get image text
          imageText = $(this).children('image').children('url').text();
          //$('#feedTitleImage').attr("src", "http://naturalnews.com/images/Logo-April-2014.gif")

          // get item elments and create dynamic div
          var dynamicdiv = ''
          $(this).children('item').each(function () {
              ////alert($(this).children('title').text())

              // get greatest item id in the list as last read
              if (parseInt($(this).children('guid').text().split("http://www.naturalnews.com/")[1].split('_')[0]) > lastReadItemId) {
                  lastReadItemId = parseInt($(this).children('guid').text().split("http://www.naturalnews.com/")[1].split('_')[0])
              }

              dynamicdiv += "<div class='entry'>";
              dynamicdiv += "<h3>"
              dynamicdiv += "<a target='_blank' class='entry-feed-link' href='" + $(this).children('link').text() + "'><span>" + $(this).children('title').text() + "</span></a>"

              // set "new" tag
              if (parseInt($(this).children('guid').text().split("http://www.naturalnews.com/")[1].split('_')[0]) > parseInt(localStorage["LastReadItemId"])) {
                  dynamicdiv += "<br /><div class='news-new-message'>New</div><br />"
              }

              dynamicdiv += "<div class='lastUpdated'>" + $(this).children('pubdate').text() + "</div>"
              dynamicdiv += "</h3><div class='feedEntryContent'>"
              dynamicdiv += $(this).children('description').html().replace("]]>", "")
              dynamicdiv += "</div>"

              dynamicdiv += "<div style='clear: both;'></div>";
              dynamicdiv += "</div>"

              dynamicdiv += "<div style='width:88%;padding:0px; height:0px; margin:auto; margin-top: 8px; margin-bottom:8px; border-bottom:1px solid #787878'></div>";
          })

          // store greatest item id in the list as last read
          localStorage["LastReadItemId"] = lastReadItemId

          $('#feedContent').html(dynamicdiv);

          // custom js to hide image element
          ////$(".feedEntryContent table tbody tr td:first-child").remove();

          // custom js to set class image
          $(".feedEntryContent img").addClass("content-image");
      });
  })
  .fail(function () {
      // this function is executed if the request fails
      alert("Error getting rss feed.")
  });
});

function CompareTwoDates(dateOne, dateTwo) {
    // return number of days
    // dateOne -> actual date, dateTwo -> nowDate
    return Math.floor((dateTwo.getTime() - dateOne.getTime()) / 86400000); // ms per day
}