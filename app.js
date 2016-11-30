var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var http = require('http');
var twilio = require('twilio');

var port = 1337;

var fs = require('fs');
var formidable = require("formidable");

var accountSid = 'AC7eac04ec9af1ffd6f1293cede570c8c0';
var token = process.env.TWILIO_AUTH_TOKEN
var client = twilio(accountSid, token);

var mysql = require("mysql");

//this must be set to the appropriate password and root for it to work. also install the database that was provided.
var con = mysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hackillinois",
  database: "LendUpChallenge"
});

//connect to database
con.connect(function(err){
  if(err){
    console.log('Error connecting');
    return;
  }
  console.log('Connected');
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//global variable for delay to store in database
var delay = 0;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//rout that services our fizzbuzz application
app.post('/voice', twilio.webhook(), function(req, res) {
  var twiml = new twilio.TwimlResponse();

  twiml.say("Enter a number and then press *");

  twiml.gather({
    action: '/fizzbuzz',
    finishOnKey: '*'
  });

  // If the user doesn't enter input, loop
  twiml.redirect('/voice');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

//the actual fizzbuzz application and database insertion
app.post('/fizzbuzz', twilio.webhook(), function(req, res) {
  var twiml = new twilio.TwimlResponse();

  if (req.body.Digits) {
    var digitsString = req.body.Digits.toString();
    twiml.say("You put in the number ");
    twiml.say(digitsString);
    twiml.say("Here is the fizzbuzz string for that number:");
    for (var i = 1; i <= req.body.Digits; i++) {
      //if it divides 3 and 5 say fizzbuzz
      if ((i % 3 == 0) && (i % 5 == 0)) {
        twiml.say('Fizzbuzz');
      } else if (i % 5 == 0) {
        //if divides 5 say buzz
        twiml.say('buzz');
      } else if (i % 3 == 0) {
        //if divides 3 say fizz
        twiml.say('Fizz');
      } else {
        var numString = i.toString();
        twiml.say(numString);
      }
    }

    //create the dictionary and insert to the database we are connected to.
    var fizzBuzzInformationArray = {delay : delay, number : req.body.Digits, timeMade : Date.now()};
    con.query('INSERT INTO FizzBuzzInformation SET ?', fizzBuzzInformationArray, function(err, res) {
      if (err) {
        console.log("Problem");
        throw err;
      }
    });
    delay = 0;
  } else {
    twiml.say("Couldn't find a number.");
  }

  twiml.say("Goodbye");

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

function scheduleCall(url, phoneNumber, fromNumber) {

  //this phone number should be set to our number.
  client.calls.create({
    url: url,
    to: phoneNumber.toString(),
    from: fromNumber
  }, function(err, call) {
    console.log(err);
  });

}

app.get('/form', function(req, res) {
  //since it is a get request get the url, etc. from the query string.
  var phoneNumber = req.query.name;
  var url = req.query.url;
  var time = req.query.time;
  var fromNumber = req.query.fromNumber;

  if (time) {
    delay = time;
    setTimeout(scheduleCall, time * 1000, url, phoneNumber, fromNumber);
  } else {
    scheduleCall(url, phoneNumber, fromNumber);
  }

  res.send('You sent the phone number "' + req.query.name + '".');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
con.end(function(err) {

});
*/


app.listen(port);

console.log('TwiML servin\' server running at http://127.0.0.1:1337/');
