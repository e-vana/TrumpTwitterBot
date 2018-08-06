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
const fs = require('fs');

const twitterDetect = require("./functions/twitterDetect.js");
const spongebobify = require("./functions/spongebobify.js");
const saveTweets = require("./functions/saveTweets.js");

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
    count: 1,
    tweet_mode: 'extended'

  };

  return new Promise(function (resolve, reject) {
    client.get('statuses/user_timeline', params)
      .then(function (tweet) {
        resolve(tweet);
      })
      .catch(function (error) {
        reject(error);
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



function fetchMemeUrl(memeString) {
    var date = new Date();
    var formData = {
        template_id: 145802073,
        username: process.env.IMGFLIP_USERNAME,
        password: process.env.IMGFLIP_PASSWORD,
        // text0: "does this work?",
        // text1: "does this work on the bottom?",
        "boxes[0][y]": 10,
        "boxes[0][text]": memeString,
        "boxes[0][width]": 557,
        "boxes[0][height]": 200


    };

  return new Promise(function (resolve, reject) {
    axios.post('https://api.imgflip.com/caption_image', querystring.stringify(formData)
    ).then(function (response) {

      //response.data.data.url is going to be the generated meme URL
      resolve(response.data.data.url)
      // console.log(response.data.data.url);

    }).catch(function (error) {
      reject(error)
    })
  })
}

async function mainLoop() {
  console.log("Running...")
  var data = await fetchPosts();
  console.log(data);
  var param;

  // This function will generate the memeURL from imgflip, pass in the string you want to put on the meme.  It still needs to be spongebobified


  // Load DB OBJ

  // Test



  // Iterate through data from fetchPosts
    for (i = 0; i < data.length; i++) {
        if (await saveTweets.saveTweets(data[i]) == false) {
            param = data[0].full_text;
            var memeUrlGenerated = await (fetchMemeUrl(spongebobify.spongebobify(param)));
            console.log(memeUrlGenerated);
        }
    // addPost();


  }

}

mainLoop();

// fetchMemeUrl('test string');

// var memeString = spongebobify.spongebobify(testString2)
//Mocking Trump 145802073
//Spongebob 102156234
































