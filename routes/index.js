var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'PM2 Dash : Login' });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'PM2 Dash : Signup' });
});

/* GET reset page. */
router.get('/reset', function (req, res, next) {
  res.render('reset', { title: 'PM2 Dash : Reset' });
});

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
  res.render('dash', { title: 'PM2 Dashboard' });
});

module.exports = router;
