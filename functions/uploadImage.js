module.exports = {
    uploadImage: function (img64) {
        // DOCS FOR THIS ENDPOINT
        // https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload.html

        const Twitter = require('twitter');
        var client = new Twitter({
            consumer_key: process.env.API_KEY,
            consumer_secret: process.env.API_SECRET_KEY,
            access_token_key: process.env.API_ACCESS_TOKEN,
            access_token_secret: process.env.API_ACCESS_TOKEN_SECRET
        });

        var params = {
            media_data: img64
        };

        return new Promise(function (resolve, reject) {
            client.post('media/upload', params, function (error, media, response) {
                if (!error) {
                    resolve(response.body);
                }
                else {
                    console.log(error);
                }
            })
        })
    }
}