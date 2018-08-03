//@ Trump Twitter Bot Entry Point
//@
//@ 

// Required for an EXPRESS app
const express = require('express');

// Required for parsing FORM input, might need for Twitter API response
const bodyParser = require('body-parser');

// Used for making HTTP requests
const axios = require('axios');

// Used for converting payload to a URL string for imgflip
const querystring = require('querystring');

// Required for using .env files where private keys are stored (API, Usernames, Passwords)
const dotenv = require('dotenv');


// Twitter for NodeJs
const Twitter = require('twitter');
const fs = require('fs')

const twitterDetect = require("./functions/twitterDetect.js");
const spongebobify = require("./functions/spongebobify.js")

// Required to use .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});


function fetchPosts() {
  var client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: '',
    access_token_secret: ''
  });

  var params = {
    screen_name: 'realDonaldTrump',
    trim_user: 1,
    count: 10,
    tweet_mode: 'extended'

  };

  return new Promise(function (resolve, reject) {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
      if (!error) {
        resolve(tweets);
      }
      else {
        throw error;
      }
    })
  })
}

// Check this function over and be ready to delete a tweet.
function addPost(tweetText, replyTo) {
  // DOCS FOR THIS ENDPOINT
  // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

  var client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token_key: '',
    access_token_secret: ''
  });

  var params = {
    status: tweetText,
    in_reply_to_status_id: replyTo

  };

  return new Promise(function (resolve, reject) {
    client.get('statuses/update', params, function (error, tweet, response) {
      if (!error) {
        resolve(tweet);
      }
      else {
        throw error;
      }
    })
  })
}

async function mainLoop() {
  console.log("Running...")
  var data = await fetchPosts();

  // Load DB OBJ

  // Iterate through data from fetchPosts
  for (i = 0; i < data.length; i++) {
    // data[i].id_str is tweet ID string

    // if data[i].id_str IS NOT IN DATABASE, THEN WRITE && generate new meme

    // writeDb(data[i].id_str);

    // some async function generates meme from IMGFLIP
    // Get URL from IMGFLIP API, Post Tweet
    // addPost();


  }

}

mainLoop();
























// testing function imports and stuff
var testString = "Thank you Georgia! They say that my endorsement last week of Brian Kemp, in the Republican Primary for Governor against a very worthy opponent, lifted him from 5 points down to a 70% to 30% victory! Two very good and talented men in a great race, but congratulations to Brian! @test #maga #Twatter  pic.twitter.com/fakeurl CHINA NUMBA ONE";

var testString2 = "America is OPEN FOR BUSINESS and U.S. Steel is back!";


// console.log(twitterDetect.mention(testString));
// console.log(twitterDetect.hash(testString));
// console.log(spongebobify.spongebobify(testString2))

function fetchPost() {
  //Fetch post from Trump's Twitter using API

  //Test Timer
  var date = new Date();
  console.log(date);

  var memeString = spongebobify.spongebobify(testString2)


  //Mocking Trump 145802073
  //Spongebob 102156234


  // Create payload for the POST response to imgflip endpoint
  var formData = {
    template_id: 145802073,
    username: process.env.IMGFLIP_USERNAME,
    password: process.env.IMGFLIP_PASSWORD,

    // text0 and text1 will be overwritten if there is anything in the boxes[0][text] or boxes[1][text]
    text0: "does this work?",
    text1: "does this work on the bottom?",

    // whatever this fuckery is it actually works, this overwrites text0 & text1 so you can use different capitalization
    "boxes[0][text]": memeString

    // "boxes[0][text]": "Thank you Georgia! They say that my endorsement last week of Brian Kemp, in the Republican Primary for Governor against a very worthy opponent, lifted him from 5 points down to a 70% to 30% victory! Two very good and talented men in a great race, but congratulations to Brian!"
  };

  // Axios Request using formData from tweet & config
  axios.post('https://api.imgflip.com/caption_image', querystring.stringify(formData)
  ).then(function (response) {

    //response.data.data.url is going to be the generated meme URL
    console.log(response.data.data.url)

  }).catch(function (error) {
    console.log(error)
  })
}


// Fetches post every X ms, 1000ms = 1s, 10000ms = 1m
// setInterval(fetchPost, 5000);

// fetchPost();


