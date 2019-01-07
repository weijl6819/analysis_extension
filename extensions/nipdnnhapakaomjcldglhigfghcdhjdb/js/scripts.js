window.addEventListener('click', function(event) {
    if(event.target.href !== undefined) {
        chrome.tabs.create({
            url : event.target.href
        });
    }
});


function search() {
    event.preventDefault();

    var term = document.getElementById('search_term').value;
    var target = 'http://www.blogprofitnetwork.com/powersearch.php?s=';

    var url = target + term;
    window.open(url);
}

window.addEventListener('load', function(event) {
    document.getElementById('searchForm').addEventListener('submit', search);
});