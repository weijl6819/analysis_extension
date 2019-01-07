function pz_stringCount(string, num){
  if (!string) {
    return "";
  }
  let count = string.length;
  if (count < num) {
    return `<span class="pass">${count} Characters (${num-count} left)</span>`;
  } else {
    return `<span class="failed">${count} Characters (${-(num-count)} over)</span>`;
  }
}

function pz_countKeywords(word, string){
  let re = new RegExp(word, "ig");
  let count = (string.match(re) || []).length;
  if (count == 0 || count > 1){
    return `${count} mentions`;
  } else {
    return `1 mention`;
  }
}

function pz_keywords_html(keywords, pageStrings){
  let description = pageStrings['description'];
  let slug = pageStrings['slug'];
  let mainHeader = pageStrings['mainHeader'];
  let subHeaders = pageStrings['subHeaders'];
  let body = pageStrings['body'];
  let images = pageStrings['images'];

  let html = ''
  let words = [];
  var countWords = 0;
  let ignoreWords = ['the', 'for', 'and', 'are', 'but', 'you', 'all', 'any', 'was', 'did', 'let', 'too', 'our'];
  for (var word of keywords) {
    word = word.replace( /[,~`!@#$%^&*()|:;]/g, '' );
    word = word.replace( /\.$/, '');
    if (!word || word.length < 3 | ignoreWords.indexOf(word.toLowerCase()) >= 0 | word in words) {
      continue;
    }
    if (countWords >= 5) {
      break;
    }
    countWords++;
    words[word] = countWords;
    html += `
    <div class="mb-4">
      <h3 class="mb-3">Optimized for: ${word}</h3>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-text-bubble"></i></span>
            Page Description: ${pz_countKeywords(word, description)}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-link"></i></span>
            Slug: ${pz_countKeywords(word, slug)}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-header-main-2"></i></span>
            Main Header: ${pz_countKeywords(word, mainHeader)}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-header-sub-2"></i></span>
            Sub Headers: ${pz_countKeywords(word, subHeaders)}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-code-1"></i></span>
            Body: ${pz_countKeywords(word, body)}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>
            <span class="pass keyword-icon"><i class="pzi-image"></i></span>
            Images: ${pz_countKeywords(word, images)}
          </p>
        </div>
      </div>
    </div>`;
  }
  return html;
}

function pz_gradePage(){
  let oParser = new DOMParser();
  let websiteTitle = document.title;
  let headXml = oParser.parseFromString(document.head.innerHTML, "text/html").head;
  let bodyXml = oParser.parseFromString(document.body.innerHTML, "text/html").body;

  let metaTags = headXml.getElementsByTagName('meta');
  let mainHeaderTags = bodyXml.getElementsByTagName('h1');
  let subHeaderTags = [
    bodyXml.getElementsByTagName('h2'),
    bodyXml.getElementsByTagName('h3'),
    bodyXml.getElementsByTagName('h4'),
    bodyXml.getElementsByTagName('h5'),
    bodyXml.getElementsByTagName('h6'),
  ];
  let imagesTags = bodyXml.getElementsByTagName('img');

  let meta = {
    'description': '',
    'keywords': ''
  };
  let keywords = websiteTitle.split(" ");
  let metaName = '';
  for (var i = 0; i < metaTags.length; i++) {
    if (metaTags[i].hasAttribute('name')) {
      metaName = metaTags[i].getAttribute('name').toLowerCase();
      if (metaName === 'description') {
        meta['description'] = metaTags[i].getAttribute('content');
      } else if (metaName === 'keywords') {
        meta['keywords'] = metaTags[i].getAttribute('content');
      }
    }
  }
  let mainHeaderText = '';
  for (var i = 0; i < mainHeaderTags.length; i++) {
    mainHeaderText += mainHeaderTags[i].innerHTML;
  }
  let subHeadersText = '';
  for (var j = 0; j < subHeaderTags.length; j++) {
    for (var i = 0; i < subHeaderTags[j].length; i++) {
      subHeadersText += subHeaderTags[j][i].innerHTML;
    }
  }

  let pageStrings = {
    'description': meta['description'],
    'slug': window.location.pathname,
    'mainHeader': mainHeaderText,
    'subHeaders': subHeadersText,
    'body': bodyXml.innerHTML,
    'images': ''
  };
  for (var i = 0; i < imagesTags.length; i++) {
    if (imagesTags[i].hasAttribute('alt')) {
      pageStrings['images'] += imagesTags[i].getAttribute('alt').toLowerCase();
    }
  }


  let resultString =
    `<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <link href="https://pagezii.com/css/pzi-icons.css?version=2.1" rel="stylesheet">
    <link href="pagegrader.css" rel="stylesheet">
    <div id='page-result' style="min-width:780px;padding:20px;font-size:14px">
      <div class='card'>
        <div class='card-body'>
          <div id='page-details' class="d-block" style="margin-bottom: 50px;">
            <h1 class='mb-4'>Meta Attributes</h1>
            <div class='row mb-4'>
              <div class='col-sm-2 col-xl-2'>
                <p>Page Title</p>
              </div>
              <div class='col-sm-6 col-xl-7'>
                ${websiteTitle}
              </div>
              <div class='col-sm-4 col-xl-3'>
                ${pz_stringCount(websiteTitle,60)}
              </div>
            </div>
            <div class='row mb-4'>
              <div class='col-sm-2 col-xl-2'>
                Description
              </div>
              <div class='col-sm-6 col-xl-7'>
                ${meta['description']}
              </div>
              <div class='col-sm-4 col-xl-3'>
                ${pz_stringCount(meta['description'],140)}
              </div>
            </div>
            <div class='row mb-4'>
              <div class='col-sm-2 col-xl-2'>
                Keywords
              </div>
              <div class='col-sm-6 col-xl-7'>
                ${meta['keywords']}
              </div>
              <div class='col-sm-4 col-xl-3'>
                ${pz_stringCount(meta['keywords'],140)}
              </div>
            </div>
          </div>
          <div id='keywords-details' class="d-block">
            <div class='row'>
              <div class='col-12'>
                ${pz_keywords_html(keywords, pageStrings)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  return resultString;
}

pz_gradePage();
