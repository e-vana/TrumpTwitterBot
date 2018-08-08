module.exports = {
  isLink: function (str) {
    return /(http)\S+/.test(str);
  }
}
