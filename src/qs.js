'use strict';

var url = require('url')
  , querystring = require('querystring')
  , _ = require('underscore');

module.exports = exports = function (req) {

  var qs = querystring.parse(url.parse(req.originalUrl).query);

  return {

    get: function (key) {
      return qs[key];
    },

    _parse: function () {
      var r = {};
      Object.keys(qs).forEach(function (key) {
        r[key] = toArray(qs[key]);
      });
      return r;
    },

    replace: function (obj) {
      var r = this._parse();
      Object.keys(obj).forEach(function (key) {
        r[key] = obj[key];
      });
      return querystring.stringify(r);
    },

    add: function (obj) {
      var r = this._parse();
      Object.keys(obj).forEach(function (key) {
        r[key] = _.union(r[key], toArray(obj[key]));
      }, this);
      return querystring.stringify(r);
    },

    remove: function (obj) {
      var r = this._parse();
      Object.keys(obj).forEach(function (key) {
        r[key] = _.difference(r[key], toArray(obj[key]));
      });
      return querystring.stringify(r);
    },

    removeAll: function (keys) {
      var r = this._parse();
      Object.keys(keys).forEach(function (key) {
        delete r[key];
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

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
