//Installed Dependancies
var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var games = require('./routes/routes');

var app = express();

//Setting up the views
app.set('views', './views')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));
//Middleware for receiving on GET or POST HTTP Requests
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

//Middleware that simplifies the process of parsing the received data.
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

//API definition
//Root Path
app.get('/', function(req,res){
    res.render('index',{
      //
      errors: ''
    });
})

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
