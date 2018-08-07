module.exports = {
    fetchPosts: function () {
        const Twitter = require("twitter");
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
}