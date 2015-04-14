# ProStore render middleware

Express middleware для отрисовки страниц.

Middleware переопределяет метод `res.render`, делегируя отрисовку
страницы объекту `res.locals.store`.
