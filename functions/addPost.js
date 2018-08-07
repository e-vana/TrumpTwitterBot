module.exports = {
    addPost: function (tweetText, imgId) {
        // DOCS FOR THIS ENDPOINT
        // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

        const Twitter = require('twitter');
        var client = new Twitter({
            consumer_key: process.env.API_KEY,
            consumer_secret: process.env.API_SECRET_KEY,
            access_token_key: process.env.API_ACCESS_TOKEN,
            access_token_secret: process.env.API_ACCESS_TOKEN_SECRET
        });

        var params = {
            status: tweetText,
            // in_reply_to_status_id: replyTo,
            media_ids: imgId

        };

        return new Promise(function (resolve, reject) {
            client.post('statuses/update', params, function (error, tweet, response) {
                if (!error) {
                    resolve(tweet);
                }
                else {
                    throw error;
                }
            })
        })
    }
}