/** Defining the global variables**/
/** Initialized with a date until the user changes it**/
var month = "";
var day = "";
var year = "";
var gamesApp = {};
var favTeam = "Blue Jays";
//Data gathered from the API
var data = {};
var data_desc = {};
// Mapping from date number to String
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
/** Helper function that produces the `table` to be displayed and appends it to the DOM
* @param headers innings is how many innings there are
* @param home_innings Array having the score for that innings
* @param away_innings ''
* post-condition: Table is produced and put into the DOM
*/
function produceTable(innings,home_innings,away_innings,home,away){
  var table = "<table class='table table-hover'>";
  // Getting the number of columns of our table
  var iterations = innings + 3;
  // Produce the headers
  table += "<tr class='heading'>";
  //Each header gets populated
  // Add the pivot
  table += "<th>City</th>";
  for(i = 1; i < innings; i++){
    table += "<th>" + i + "</th>"
  }
  table += "<th>R</th><th>H</th><th>E</th>";
  //Closing header
  table += "</tr>";
// Loop invariant: every row will add a team's score
for(i = 0; i < home_innings.length; i++ ){
  if (i==0){
    // Add the name
    table += "<tr><td>" + home + "</td>";
  }
  else{
    table += "<td>" + home_innings[i] + "</td>";
  }
}

  table += "</tr>";
for(i = 0; i < away_innings.length; i++){
  if (i==0){
    // Add the name
    table += "<tr><td>" + away + "</td>";
  }
  else{
    table += "<td>" + away_innings[i] + "</td>";
  }
}
table += "</tr>";
// Close the table tag
table += "</table>"
//Append it to the div
$(".container").find("#content").find("#description").append(table);
$(".container").find("#headerDate").append("<h2>Details</h2>");
$(".container").find("#headerDate").append("<h4>To go back, click submit button again</h4>");

}

/**
 * Process the data gathered from API to send the correct innings number
 */
gamesApp.populateDescription = function(){
  // Get the array of linescore by innings
  var linescore = data_desc.data.boxscore.linescore.inning_line_score;
  var home_innings = [];
  var away_innings = [];
  // Loop through every inning
  for(i = 0; i < linescore.length; i++){
    home_innings.push(linescore[i].home);
    away_innings.push(linescore[i].away);
  }
  // Pushing the values for R H and E
  var inning_line = data_desc.data.boxscore.linescore;
  home_innings.push(inning_line.home_team_runs);
  home_innings.push(inning_line.home_team_hits);
  home_innings.push(inning_line.home_team_errors);

  away_innings.push(inning_line.away_team_runs);
  away_innings.push(inning_line.away_team_hits);
  away_innings.push(inning_line.away_team_errors);

  // Get the team name
  var home_team = data_desc.data.boxscore.home_sname;
  var away_team = data_desc.data.boxscore.away_fname;
  // Call the table to get populated
  produceTable(linescore.length, home_innings, away_innings,home_team,away_team);
}

/** Performs HTTP Request to the API and calls the corresponding function
 */
gamesApp.getDescResults = function(url){
  $.get(url,function(response){
    // Data successfully gathered
    data_desc = response;
    //Empty the previous list
    $("#content").find(".list-group").empty();
    $("#content").find("#headerDate").empty();
    $("#content").find("#description").empty();
    // Send it to populate Desc
    gamesApp.populateDescription();
  });
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
  // Add an onClick listener
  list.find("#" + index).on('click', function(e){
    // Get the URL that is in value of the attribute
    var url = $(this).attr("value");
    var total_url = "http://gd2.mlb.com/" + url;
    gamesApp.getDescResults(total_url);
  });
  // Highlight the winners name
  var winner = (score_home >= score_away? 'home':'away');
  list.find("#" + index).find("#" + winner).effect("highlight", {color:"#FB4D3D"},300000000000);
  // Add the URL for boxscore.json as value in the tag
  var boxUrl = game.game_data_directory + "/boxscore.json";
  list.find("#" + index).attr("value", boxUrl);
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

/** Helper function that lets us order the results by favourite team first
 *
 */
gamesApp.orderedResults = function(results){
  // Loop over the array
  var favouriteGame;
  for(i = 0; i < results.length;i++){
      // When you find the preferred team delete it from array
      // Get the names fo both teams
      var team_1 = results[i].home_team_name;
      var team_2 = results[i].away_team_name;
      if(favTeam == team_1 || favTeam == team_2){
        favouriteGame = results[i];
        results.splice(i,1);
      }
  }
  // Push it at the beginning
  results.unshift(favouriteGame);
  // Return ot
  return results;
}
/** Helper function that populates the listview with the received data
 *
 */
gamesApp.populateList = function(data){
  // Check if the data is an object or an array
  var gamesData = data.data.games;
  if(typeof gamesData.game == 'undefined'){
    //Render one list element with no matches
    var entry = "<a href='#' class='list-group-item active'>";
    entry += "<h4 class='list-group-item-heading'>No games today</h4></a>";
    $(".container").find("#content").find(".list-group").append(entry);
    return;
  }
  // Check if game is an array or an object
  if(gamesData.game instanceof Array){
    // TODO: Order the array having the preferred team first
    gamesData.game = gamesApp.orderedResults(gamesData.game);
    for(i = 0; i < gamesData.game.length; i++){
      // Produce one list entry per game
      gamesApp.renderListEntry(gamesData.game[i],i);
    }
    return;
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
});
