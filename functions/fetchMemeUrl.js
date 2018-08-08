module.exports = {
    fetchMemeUrl: function (memeString) {
        const axios = require('axios');
        const querystring = require('querystring');
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
}