//this writes the string passed to it as a new line to the "Log.txt" file
//just be gentle and pass it what you need, okay?
module.exports = {
    writeLog: function (str) {
        var fs = require('fs');
        fs.appendFile('Log.txt', str + "\r\n", function (err) {
            if (err) throw err;
            console.log('complete');
        });
    }
}
