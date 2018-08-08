//@ spongebobify takes a string and turns it into a string with alternating capitalization. 
//@ This function also ignores all twitter tags, urls, mentions
//@ Example Input str: "Why the fuck is donald trump the president?"
//@ Example Output str: "WhY tHe FuCk iS DoNaLd TrUmP tHe PrEsIdEnT?"

const isAlpha = require("./isAlpha");
const isLink = require("./isLink");
const twitterDetect = require("./twitterDetect.js");

module.exports = {
  spongebobify: function (str) {
    var origtweetarray = str.split(" ");
    var newstr = "";
    var upper = true;
    for (var i = 0; i < str.length; i++) {
      if (isAlpha.isAlpha(str[i]) && upper) {
        newstr += str[i].toUpperCase();
        upper = false;
      }
      else if (isAlpha.isAlpha(str[i]) && !upper) {
        newstr += str[i].toLowerCase();
        upper = true;
      }
      else if (!isAlpha.isAlpha(str[i])) {
        newstr += str[i];
      }
    }
    var newtweetarray = newstr.split(" ");
    for (var i = 0; i < origtweetarray.length; i++) {
      if (twitterDetect.hash(origtweetarray[i]) != '' || twitterDetect.mention(origtweetarray[i]) != '') {
        newtweetarray[i] = '';
      }
      else if (isLink.isLink(origtweetarray[i])) {
        newtweetarray[i] = '';
      }
      newstr = newtweetarray.join(" ");
      return newstr;
    }
  }
}
