// takes a json object (a new tweet), stringifies it, and adds it to the tweet db
module.exports = {
    saveTweets: function (obj) {
        var fs = require('fs');
        var exists = false;
        return new Promise(function (resolve, reject) {
            fs.readFile("db.json", function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    var tweets = JSON.parse(data);
                    tweets.Tweets.forEach(function (element) {
                        if (element != null && element == obj.id_str) {
                            exists = true;
                        }
                        else {
                            exists = false;
                        }
                    });
                    if (exists === false) {
                        tweets.Tweets.push(obj.id_str);
                        var json = JSON.stringify(tweets);
                        fs.writeFile('db.json', json, function (err) {
                            if (err) reject(err);
                            else resolve(false);
                        });
                    }
                    else resolve(true);
                }
              });
        });
    }
}