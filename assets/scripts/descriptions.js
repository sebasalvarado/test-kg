// Object that will represent our application's page
// Data for details of a game
var descApp = {};
var data = {};

/** Helper function that produces the `table` to be displayed and appends it to the DOM
* @param headers is a mapping for each column to its corresponding object key
*
* post-condition:
*/
// function produceTable(innings,data){
// var table = "<table>";
// // Produce the headers
// table += "<tr class='heading'>";
// //Each header gets populated
// // Add the pivot
// table += "<th> --</th>";
// for(i = 0; i < innings; i++){
//   table += "<th>" + i + "</th>"
// }
// //Closing header
// table += "</tr>";
//
// // Loop invariant: every row will be created after executing Loop
// for(i = 0; i < data.length; i++ ){
//   table += "<tr>";
//   for(j = 0; j < headers.length; j++){
//     // For each value append it to the table
//     table += "<td>" + data[i][headToKey[headers[j]]] + "</td>";
//   }
//   table += "</tr>";
// }
//
// // Close the table tag
// table += "</table>"
// //Append it to the div
// $(".information").append(table);
// $(".information").find("table").addClass("info-table");
// }

/**
 *
 */
descApp.populateDescription = function(data){
  // Get the array of linescore by innings
  var linescore = data.linescore.inning_line_score;

}
/**
 */
descApp.getResults = function(url){
  $.get(url,function(response){
    // Data successfully gathered
    data = response;
    //Empty the previous list
    $("#content").find(".list-group").empty();
    $("#content").find("#headerDate").empty();
    // Send it to populate list
    console.log(data);
    gamesApp.populateDescription(data);
  });
}
/**
 *
 */
descApp.handleClick = function() {
  // Get the URL that is in value of the attribute
  var url =  this.attr("value");
  console.log(url);
  //
  descApp.getResults(url);
}


descApp.init = function(){
  // Add an onClick listener to each list item
  $("#content").find("#list").on('click', this.operation);
  console.log($("#content").find("#list"));
  // Delete everything from list
  //
}
$(document).ready(function() {
  // Add on change or click listener to the date picker
  descApp.init();
});
