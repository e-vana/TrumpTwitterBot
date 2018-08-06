// returns the entire tweet db as an object
// if this gets bad for performance later we can have it return the most recent 10 tweets or something idk. They'll always be stored chronologically
module.exports = {
    loadTweets: function () {
        var tweets;
        var fs = require("fs");
        return new Promise(function (resolve, reject) {
            try {
                fs.readFile("db.json", function(err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        tweets = JSON.parse(data);
                        resolve(tweets);
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
