Polymer({
  is: 'scorebox-grid',
  properties: {
    isTable: {
      type: Boolean,
      value: false
    },
    favoriteTeam: String,
    games: String
  },
  gridLoaded: function(data){
    console.log(data);
  },
  isFavorite: function(homeTeam, awayTeam, favoriteTeam){
    if(homeTeam === favoriteTeam || awayTeam === favoriteTeam)
      return "isFavorite";
    else {
      return "";
    }
  },
  showOnlyFavorite: function(homeTeam, awayTeam, favoriteTeam){
    if(homeTeam === favoriteTeam || awayTeam === favoriteTeam)
      return "";

    return "isFavorite";
  },
  getCurrentDay:  function(){
    var currentDate = new Date();

    var month = currentDate.getMonth() + 1;

    if(month < 10)
      month = "0" + month;

    var year = currentDate.getFullYear();

    var day = currentDate.getDate();

    if(day < 10)
      day = "0" + day;

    return "year_" + year + "/month_" + month + "/day_" + day;

    //"year_2015/month_03/day_28"
  },
  isInProgressTop: function(status){
    if(status === "In Progress")
      return ""
    else return "hide";
  },
  isInProgressDown: function(status){
    if(status === "In Progress")
      return "hide"
    else return "";
  }
});
