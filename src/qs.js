'use strict';

var url = require('url')
  , querystring = require('querystring');

module.exports = exports = function (req) {

  var qs = querystring.parse(url.parse(req.originalUrl).query);

  return {
    get: function (key) {
      return qs[key];
    },
    create: function (obj) {
      var r = {};
      Object.keys(qs).forEach(function (key) {
        r[key] = qs[key];
      });
      Object.keys(obj).forEach(function (key) {
        r[key] = obj[key];
      });
      return querystring.stringify(r);
    },
    is: function () {
      var argv = [].slice.apply(arguments);
      var name = argv[0]
        , values = argv.slice(1);
      return values.some(function (val) {
        return this.get(name) == val;
      }, this);
    }
  };

};
