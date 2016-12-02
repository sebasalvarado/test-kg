var http= require('http-request');
// Global variable to hold the data
var data = {}
/** Middleware function that queries the MLB API and stores the results locally
 */
exports.allGames = function(req,res,next){
  //Parse the body
  var date = req.body.date
  // Check if date is present
  if(typeof date != 'undefined'){
    //Split the string on the hyphen
    var splitted = date.split("-");
    var day = splitted[2];
    var month = splitted[1];
    var year = splitted[0];
    //Prepare the query
    var query = "http://gd2.mlb.com/components/game/mlb/year_"
    + year + "/month_" + month +  "/day_" + day + "/master_scoreboard.json";
    //Create the Get request to the API
    http.get(query, function(err,res){
      if(err){
        // There is no games on this specific date
        data = {"data":"No Games on this Specific Date"};
        return;
      }
      // Set response into our global data
      data = JSON.parse(res.buffer.toString());
    });

    console.log(data);
    return res.sendStatus(200);
  }
}

/**
 *
 */
exports.getGames = function(req,res,next){
return res.json(data);
}
