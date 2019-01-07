document.addEventListener('DOMContentLoaded', function() {

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const tbody = document.getElementById('tbody');
    const url = 'https://www.quandl.com/api/v3/datasets/WGC/GOLD_DAILY_USD.json?api_key=HvkdbodeAwhtKhwezF9T';
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) { 
        var rawdata = data.dataset['data']; 
        let pricedata = rawdata.slice(0, 5);
        return pricedata.map(function(pricedata) {
              tr = createNode('tr');
              tr.innerHTML = `<td>${pricedata[0]}</td><td>${formatter.format(pricedata[1])}</td>`; 
          append(tbody, tr);
        })

        }); 
}, false);


function createNode(element) {
      return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }
