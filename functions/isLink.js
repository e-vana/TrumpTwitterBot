module.exports = {
  isLink: function (str) {
    return /[a-zA-Z]+\.[a-zA-Z]+\.[a-zA-Z]+\S+/.test(str);
  }
}
