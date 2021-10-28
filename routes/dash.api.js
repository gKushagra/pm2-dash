require('dotenv').config();
var express = require('express');
var router = express.Router();
var { exec } = require('child_process');

/**
 * GET all pm2 apps running on this server
 */
router.get('/pm2/apps', function (req, res, next) {
    const cmd = "pm2 list";
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        }

        if (stderr) {
            console.log(stderr);
            res.status(200).json(stderr);
        }

        res.status(200).json(stdout);
    });
});

/**
 * POST start/stop/restart app(s) &&
 * remove/logs/show app running on this server
 */
router.get('/pm2/:action/:app', function (req, res, next) {
    const cmd = `pm2 ${req.params.action} ${req.params.app}`;
    exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        }

        if (stderr) {
            console.log(stderr);
            res.status(200).json(stderr);
        }

        res.status(200).json(stdout);
    });
});


module.exports = router;
