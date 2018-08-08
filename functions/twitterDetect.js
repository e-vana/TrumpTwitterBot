//@ These functions detect a MENTION or HASH in a tweet

module.exports = {
  hash: function (str) {
    var splitArr = str.split(" ");
    var tagList = [];

    var hash = new RegExp("#");

    for (i = 0; i < splitArr.length; i++) {
      if (hash.test(splitArr[i]) == true) {
        tagList.push(splitArr[i])
      }
    }

      return tagList.join(' ');
  },
  mention: function (str) {
    var splitArr = str.split(" ");
    var mentionList = [];

    var mention = new RegExp("@");

    for (i = 0; i < splitArr.length; i++) {
      if (mention.test(splitArr[i]) == true) {
        mentionList.push(splitArr[i])
      }
    }

      return mentionList.join(' ');

  }
}