# FizzBuzzChallenge

This application is written in node.js. First do `npm install` so you get all the dependencies. 

The application will crash if you do not set the database password correctly for MYSQL.

First set your TWILIO_AUTH_TOKEN as an environment variable like so `export TWILIO_AUTH_TOKEN=`. Also, change the accountSid variable to your accountSid. 

To run this application, first link port 1337 on your computer to ngrok by running `ngrok http 1337`. Then, in your twilio account, go to the phone number and put in the ngrok url there under the field `A Call Comes In` at webhook, and append /voice to it. So, for example it could be `http://b2989291.ngrok.io/voice`. 

Then, if you run the application with `node app.js` and call your number, you should start fizzbuzz and hear instructions on how to run it.

To get step 2 and 3 to work, load up the page on your computer, with the application running like before. Then, enter your phone number with country and area code (both your number and the one you want to call from), the ngrok url like before (for example `http://b2989291.ngrok.io/voice`), and the time in seconds you want to wait. Press submit and you should get a phone call at the number you entered after the specified amount of time. 

For step 4, you must edit the app.js file. You must set the host, user, and password to that of your mysql database. You must also install the database using the .sql file provided. Then, you can run the application and you will view in our database the delay, number, and timeMade information of each call. 

I did not have a chance to finish the UI part of part 4 in the time that was allowed. 
