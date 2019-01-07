Polymer({
  is: 'scorebox-griditem',
  properties: {
    homeName: {
      type: String,
      value: "Home Team"
    },
    awayName: {
      type: String,
      value: "Away Team"
    },
    homeScore: {
      type: Number,
      value: 0
    },
    awayScore: {
      type: Number,
      value: 0
    },
    status: String,
    homeAbrev: String,
    awayAbrev: String,
    favoriteTeam: {
      type: String,
      value: "None"
    },
    time: String,
    tz: String,
    inningNum: Number,
    topInning: String,
    strikes: Number,
    balls: Number
  },
  homeAbbrevCalc: function(homeAbrev){
    return "bb-" + homeAbrev;
  },
  awayAbbrevCalc: function(awayAbrev){
    return "bb-" + awayAbrev;
  },
  determineSuccess: function(teamOneScore, teamTwoScore, status){
    if(status === "Final"){
      if(parseInt(teamOneScore) > parseInt(teamTwoScore))
        return "success";
      else {
        return "danger";
      }
    }
    return "";
  },
  getGameInfo: function(status){
    if(status === "Preview" || status === "Pre-Game")
      return this.time + " " + "ET";
    if(status === "In Progress"){
      return this.inningNum;
    }
    if(status === "Final")
      return "Final";
  },
  showTop: function(status){
    if(status === "In Progress" && this.topInning === "Y"){
      return "";
    }
    else{
      return "hide";
    }
  },
  showBottom: function(status){
    if(status === "In Progress" && this.topInning === "N")
      return "";
    else return "hide";
  }

});
