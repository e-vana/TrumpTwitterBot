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

// Firebase Configuration
const firebase = require('firebase/app');
require('firebase/firestore')

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings);


var db = firebase.firestore();



const app = express();
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});


function readDb() {
  var theseTweets = [];
  return new Promise(function (resolve, reject) {
    db.collection("Tweets").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        theseTweets.push(doc.data());
        // resolve(doc.data());
        resolve(theseTweets);
      })
    })
  })
}

// function readDb() {
//   var theseTweets = [];
//   return new Promise(function (resolve, reject) {
//     db.collection("Tweets").get().then((querySnapshot) => {
//       console.log(querySnapshot.docs[0].data());
//     }
//     ).catch(function (error) {
//       console.log(error);
//     })
//   })
// }




// readDb();


function writeDb(Tweet_ID, Tweet_Text) {
  return new Promise(function (resolve, reject) {
    db.collection("Tweets").add({
      id: Tweet_ID,
      text: Tweet_Text,
    })
      .then(function (docRef) {
        // console.log("Document Written with ID: ", docRef.id);
        resolve(console.log("Document Written with ID: ", docRef.id))
      })
      .catch(function (error) {
        reject(console.error("Error Adding Document: ", error));
      });
  })
}

async function mainLoop() {
  var date = new Date();
  // console.log(date);
  console.log("Checking for new Tweet... " + "@" + ' ' + date)
  var data = await fetchPosts.fetchPosts();
  var dataId = data[0].id;
  var dataText = data[0].full_text;

  // console.log(dataId);

  var storedTweets = await readDb();
  // console.log(storedTweets);

  var matches = false;
  var needToWrite = false;

  for (i = 0; i < storedTweets.length; i++) {
    if (storedTweets[i].id === dataId) {
      matches = true;
      break;
    }
    //  else {
    //   needToWrite = true;
    // }
  }

  // console.log("Does it match? : " + matches);

  if (matches == false) {
    console.log("Writing Tweet to DB... " + "@" + ' ' + date);
    await writeDb(dataId, dataText);
    var param;
    param = data[0].full_text;
    // console.log(param);

    var memeUrlGenerated = await (fetchMemeUrl.fetchMemeUrl(spongebobify.spongebobify(param)));
    // console.log(memeUrlGenerated);
    console.log("Generating Meme URL... " + "@" + ' ' + date);
    var encodedData = await imgToBase.imgToBase(memeUrlGenerated);
    console.log("Converting URL to base64..." + "@" + ' ' + date);


    var twitterImgUploadResponse = await uploadImage.uploadImage(encodedData);
    console.log("Uploading to Twitter... " + "@" + ' ' + date);
    var idStr = JSON.parse(twitterImgUploadResponse);
    var idStrValue = idStr.media_id_string;

    var thisHash = twitterDetect.hash(param);
    // console.log(thisHash);

    var flag = emoji.get(':us:');
    var postText = flag + flag + ' ' + '#Trump #Politics' + ' ' + thisHash + ' ' + flag + flag;
    // console.log(postText);
    var post = await addPost.addPost(postText, idStrValue);
    console.log("Posting " + data[0].id_str + ' ' + "to Twitter... " + "@" + ' ' + date);

    // console.log(post);
  }
}

setInterval(mainLoop, 15000);

//Mocking Trump 145802073
//Spongebob 102156234
























