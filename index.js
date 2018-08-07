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

// Image to Base64
const image2base64 = require('image-to-base64');

// node emoji
const emoji = require('node-emoji');

//custom functions
const twitterDetect = require("./functions/twitterDetect.js");
const spongebobify = require("./functions/spongebobify.js");
const saveTweets = require("./functions/saveTweets.js");
const uploadImage = require("./functions/uploadImage.js");
const fetchPosts = require("./functions/fetchPosts.js");
const addPost = require("./functions/addPost.js");
const fetchMemeUrl = require("./functions/fetchMemeUrl.js");
const imgToBase = require("./functions/imgToBase.js");

// Required to use .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});

async function mainLoop() {
  var date = new Date();
  // console.log(date);
  console.log("Checking for new Tweet... " + "@" + ' ' + date)
  var data = await fetchPosts.fetchPosts();

  var param;
  // Iterate through data from fetchPosts
  for (i = 0; i < data.length; i++) {
    var dupe = await saveTweets.saveTweets(data[i]);
    if (dupe === false) {
      console.log(dupe);

      param = data[i].full_text;

      var memeUrlGenerated = await (fetchMemeUrl.fetchMemeUrl(spongebobify.spongebobify(param)));
      console.log(memeUrlGenerated);
      console.log("running test loop...")
      var encodedData = await imgToBase.imgToBase(memeUrlGenerated);

      var twitterImgUploadResponse = await uploadImage.uploadImage(encodedData);
      var idStr = JSON.parse(twitterImgUploadResponse);
      var idStrValue = idStr.media_id_string;

      var thisHash = twitterDetect.hash(data[i].full_text)

      // var thisHash = ['#testString1', '#testString2', '#testString3']
      var postStr = '';

      for (i = 0; i < thisHash.length; i++) {
        var postStr = thisHash[i] + ' ' + postStr;

      }
      console.log(postStr);

      var flag = emoji.get(':us:');
      var postText = flag + flag + ' ' + '#Trump #Politics' + ' ' + postStr + flag + flag;
      var post = await addPost.addPost(postText, idStrValue);
      console.log(post);
    }
  }
}

setInterval(mainLoop, 60000);

//Mocking Trump 145802073
//Spongebob 102156234
























