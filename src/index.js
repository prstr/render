'use strict';

var assign = require('lodash.assign')
  , debug = require('debug')('prostore:render');

/**
 * Middleware для отрисовки страниц ProStore.
 * Заменяет `res.render`, сохраняя оригинальный метод от Express
 * в `res._render`.
 *
 * Важно: в шаблонизатор попадает объект `data`, объединенный с `res.templateData`.
 * Содержимое `res.locals` используется для внутреннего обмена данными между маршрутами,
 * поэтому оно недоступно в шаблонизаторе.
 * Это позволяет точно знать, какие данные доступны в каждом конкрентном маршруте.
 *
 * В `res.locals.compiler` должен находиться компилятор шаблонов Nanotemplates.
 */
module.exports = exports = function () {

  return function (req, res, next) {
    res.templateData = assign({
      price: function (value, settings) {
        settings = assign({}, res.locals.settings, settings);
        return require('prostore.currency')(value, settings);
      },
      pluralize: require('prostore.pluralize')
    }, res.templateData);
    res._render = res.render;
    res.render = function (file, data, done) {
      // data is optional
      if (typeof data == 'function') {
        done = data;
        data = {};
      }
      // callback is optional
      done = done || function (err, str) {
        /* istanbul ignore if */
        if (err) return next(err);
        res.send(str);
      };
      // delegate to compiler
      res.locals.compiler.compile(file, function (err, fn) {
        /* istanbul ignore if */
        if (err) return done(err);
        var locals = assign({}, data, res.templateData);
        debug('%s (%s)', file, Object.keys(locals));
        done(null, fn(locals));
      });
    };
    next();
  };

};
