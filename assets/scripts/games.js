/** Defining the global variables**/
/** Initialized with a date until the user changes it**/
var month = "";
var day = "";
var year = "";
var gamesApp = {};
var favTeam = "Blue Jays";
//Data gathered from the API
var data = {};

var monToString = {"01":"January", "02":"February", "03": "March",
  "04":"April","05":"May","06":"June","07":"July", "08":"August","09":"September",
"10":"October","11":"November","12":"December"};

/** Helper function that produces the Date String and appends it to the DOM
 *
 */
function produceTitleDate(){
  var monString = monToString[month];
  var result = "<h2>" + monString + " , " + day + ", " + year + "</h2>";
  console.log(result);
  $("#content").find("#headerDate").append(result);
}


/** Helper function that renders one list entry in the list view
 *
 */
gamesApp.renderListEntry = function(game,index){
  // Getting the relevant fields from the data
  var home_team = game.home_team_name;
  var away_team = game.away_team_name;
  var status = game.status.status;
  var score_home = game.linescore.r.home;
  var score_away = game.linescore.r.away;

  //Produce header
  var entry = "<a " + "id=" + index + " href='#' class='list-group-item'>";
  entry += "<h4 id ='home'class='list-group-item-heading listEntryTeam'>" ;
  entry += home_team;
  entry += "</h4>";
  // Adding the scores
  entry += "<h4 class='list-group-item-heading listEntryScore'>";
  entry += score_home;
  entry += "</h4>";
  entry += "<h4 id = 'away'class='list-group-item-heading listEntryTeam'>";
  entry += away_team + "</h4>";
  entry += "<h4 class='list-group-item-heading listEntryScore'>";
  entry += score_away;
  entry += "<h2 class='list-group-item-heading'>";
  entry += status + "</h2>";
  entry += "</a>";

  //Append it to the list
  var list = $(".container").find("#content").find(".list-group");
  list.append(entry);
  // Highlight the winners name
  var winner = (score_home >= score_away? 'home':'away');
  list.find("#" + index).find("#" + winner).effect("highlight", {color:"#FB4D3D"},300000000000);
}
/** Function that calls the API and process the results
 *
 */
gamesApp.getResults = function(query){
  $.get(query,function(response){
    // Data successfully gathered
    data = response;
    // Send it to populate list
    gamesApp.populateList(data);
  });
}

/** Helper function that populates the listview with the received data
 *
 */
gamesApp.populateList = function(data){
  // Check if the data is an object or an array
  var gamesData = data.data.games;
  console.log(data.data.games);
  if(typeof gamesData.game == 'undefined'){
    //Render one list element with no matches
    var entry = "<a href='#' class='list-group-item active'>";
    entry += "<h4 class='list-group-item-heading'>No games in this day</h4></a>";
    $(".container").find("#content").find(".list-group").append(entry);
    return;
  }
  // Check if game is an array or an object
  if(gamesData.game instanceof Array){
    console.log("array");
    // TODO: Order the array having the preferred team first
    var len = gamesData.game.length;
    console.log(gamesData.game);
    for(var i; i < len; i++){
      // Produce one list entry per game
      console.log(i);
      gamesApp.renderListEntry(gamesData.game[i],i);
      return;
    }
  }
  else{
    gamesApp.renderListEntry(gamesData.game,1);
    return;
  }
}

/**
 */
gamesApp.prepareURL = function(date){
  // Split the date
  var splitted = date.split("-");
  day = splitted[2];
  month = splitted[1];
  year = splitted[0];
  // Prepare the Header
  produceTitleDate();
  //Prepare the url
  var url = "http://gd2.mlb.com/components/game/mlb/year_"
  + year + "/month_" + month +  "/day_" + day + "/master_scoreboard.json";
  return url;
}

gamesApp.init = function(){
  //Add listeners so we do repeat when we hit submit button
  $("#newDate").submit(function(event){
    event.preventDefault();
    // Clean the list
    $("#content").find(".list-group").empty();
    $("#content").find("#headerDate").empty();
    // Get the value of the date and prepare the url
    var date = $("#datePicker").find("#newDate").find("#selection").val();
    var url = gamesApp.prepareURL(date);
    // Query the API
    gamesApp.getResults(url);
  });
  // Produce the title view
  // Populate the listview with our default date
}
$(document).ready(function() {
  // Add on change or click listener to the date picker
  gamesApp.init();
  // Populate the results
  // Add onClickListener to every li

});
