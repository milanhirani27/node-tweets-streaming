const express = require('express');
const router = express.Router();
const userauthcontroller = require('../controller/UserAuthController');
const { forwardAuthenticated ,ensureAuthenticated} = require('../config/auth')

// web user routes
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, userauthcontroller.dashboard);

router.get('/resetPassword' ,(req, res) => res.render('reqResetPassword'));

router.post('/resetPassword', userauthcontroller.forgetpassword);

router.get('/resetPassword/:token',(req, res) => res.render('resetPassword',{token:req.params.token}));

router.post('/resetPassword/:token', userauthcontroller.requestResetPassword);

module.exports = router;
