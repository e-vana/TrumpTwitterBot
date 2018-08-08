module.exports = {
    imgToBase: function (url) {
        const image2base64 = require('image-to-base64');
        return new Promise(function (resolve, reject) {
            image2base64(url)
                .then(
                    (response) => {
                        resolve(response); //cGF0aC90by9maWxlLmpwZw==
                    }
                )
                .catch(
                    (error) => {
                        throw (error); //Exepection error....
                    }
                )
        })
    }
}