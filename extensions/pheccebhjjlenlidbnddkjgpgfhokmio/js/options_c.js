function loadOptions(func,p1){
  var def={
    updateInterval:5,
    alertSound:true,
    customSound:false,
    soundUrl:"",
    showNotification:true,
    host:{},
    acc:{}
  }
  chrome.storage.sync.get(def, function(items) {
    for(var i in def){
      if(!(i in items))items[i]=def[i];
    }
    for(var i in items){
      if(!(i in def))delete items[i];
    }
    func(items,p1);
  });
}

