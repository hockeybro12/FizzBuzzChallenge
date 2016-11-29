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
var token = '5deb2358a0a589261f79c6fbd2dd1b8a';
var client = twilio(accountSid, token);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/voice', function(req, res) {
  var header = req.headers['x-twilio-signature'];

  /*
  if (twilio.validateRequest(token, header, 'http://twilio-raw.herokuapp.com', POST)) {

  } */

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

app.post('/fizzbuzz', function(req, res) {
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
  } else {
    twiml.say("Couldn't find a number.");
  }

  twiml.say("Goodbye");

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

function scheduleCall(url, phoneNumber) {
  client.calls.create({
    url: url,
    to: phoneNumber.toString(),
    from: "16692543016"
  }, function(err, call) {
    console.log(err);
  });

}

app.get('/form', function(req, res) {
  //since it is a get request get the url, etc. from the query string.
  var phoneNumber = req.query.name;
  var url = req.query.url;
  var time = req.query.time;

  if (time) {
    setTimeout(scheduleCall, time * 1000, url, phoneNumber);
  } else {
    scheduleCall(url, phoneNumber);
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



app.listen(port);

console.log('TwiML servin\' server running at http://127.0.0.1:1337/');
