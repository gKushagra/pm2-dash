require('dotenv').config();
var express = require('express');
var router = express.Router();
var { MongoClient } = require('mongodb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var nanoid = require('nanoid');
var nodemailer = require('nodemailer');

const mongodbUri = process.env.MONGODB_URI;
const client = new MongoClient(mongodbUri);

/* Login user */
router.post('/login', async function (req, res, next) {
    console.log(req.body);
    var userFound = false;
    try {
        await client.connect();
        var db = client.db('pm2dash');
        var coll = db.collection('users');
        var query = {
            email: req.body.email
        }
        var user = await coll.findOne(query);
        if (user) {
            userFound = true;
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.close();
        if (userFound) {
            const token = jwt.sign({ user: req.body.email }, process.env.TOKEN_SECRET);
            res.status(200).json({ message: "Account not found", token: null });
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ user: req.body.email }, process.env.TOKEN_SECRET);
                res.status(200).json({ message: "Login Successful", token });
            } else {
                res.status(200).json({ message: "Incorrect Email or Password", token: null });
            }
        }
    }
});

/* Signup user */
router.post('/signup', async function (req, res, next) {
    console.log(req.body);
    var accountExists = false;
    try {
        await client.connect();
        var db = client.db('pm2dash');
        var coll = db.collection('users');
        var query = {
            email: req.body.email,
        }
        var emailExists = await coll.findOne(query);

        if (emailExists) {
            accountExists = true;
        } else {
            const hash = bcrypt.hashSync(req.body.password, 10);
            var doc = {
                id: nanoid(),
                email: req.body.email,
                password: hash,
                created_on: new Date().toISOString()
            }
            var result = await coll.insertOne(doc);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.close();
        if (accountExists)
            res.status(200).json({ message: "An account with this email already exists" });
        else
            res.status(200).json({ message: "Account Created" });
    }
});

/* Reset account password */
router.post('/reset', function (req, res, next) {

});

module.exports = router;
