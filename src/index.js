"use strict";

var _ = require('underscore');

/**
 * Middleware для отрисовки страниц ProStore.
 * Заменяет `res.render`, сохраняя оригинальный метод от Express
 * в `res._render`.
 */
module.exports = function() {

  return function(req, res, next) {
    res._render = res.render;
    res.render = function(file, data, done) {
      // data is optional
      if (typeof data == 'function') {
        done = data;
        data = {};
      }
      // callback is optional
      done = done || function(err, str) {
        /* istanbul ignore if */
        if (err) return next(err);
        res.send(str);
      };
      // store compiler is used
      var store = res.locals.store;
      store.compile(file, function(err, fn) {
        /* istanbul ignore if */
        if (err) return done(err);
        var locals = _.extend({}, res.locals, data);
        done(null, fn(locals));
      });
    };
    next();
  };

};
