//@ spongebobify takes a string and turns it into a string with alternating capitalization. 
//@ This function also ignores all twitter tags, urls, mentions
//@ Example Input str: "Why the fuck is donald trump the president?"
//@ Example Output str: "WhY tHe FuCk iS DoNaLd TrUmP tHe PrEsIdEnT?"

const isAlpha = require("./isAlpha");
const isLink = require("./isLink");
const twitterDetect = require("./twitterDetect.js");
const emoji = require("node-emoji");

module.exports = {
    spongebobify: function (str) {
        
        str = emoji.strip(str);
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
            if (twitterDetect.hash(origtweetarray[i]) != '') {
                newtweetarray.splice(i, 1);
                origtweetarray.splice(i, 1);
                i--;
            }
            else if (isLink.isLink(origtweetarray[i])) {
                newtweetarray.splice(i, 1);
                origtweetarray.splice(i, 1);
                i--;
            }
            //twitter returns & < > as &amp; &lt; &gt;
            else if (origtweetarray[i] == "&amp;") {
                newtweetarray[i] = "&";
            }
            else if (origtweetarray[i] == "&lt;") {
                newtweetarray[i] = "<";
            }
            else if (origtweetarray[i] == "&gt;") {
                newtweetarray[i] = ">";
            }
        }
        newstr = newtweetarray.join(" ");
        return newstr;
    }
}
