var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/home', function (req, res, next) {
    res.render('dash', { title: 'PM2 Dashboard' });
});

module.exports = router;
