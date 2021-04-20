const express = require('express');
const router = express.Router();
const userauthcontroller = require('../controller/UserAuthController')
const { forwardAuthenticated } = require('../config/auth');

//web user Routes

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.post('/register', userauthcontroller.register);

router.post('/login', userauthcontroller.login);

router.get('/logout', userauthcontroller.logout);

module.exports = router;
