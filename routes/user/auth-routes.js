const router = require('express').Router();
const passport = require('passport');
// const passport = require('./../../config/passport');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.set('views', __dirname+'../views');
app.set('view engine' , 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('/views'));

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

// auth login
router.get('/login', (req, res) => {
	if(req.user){
		res.redirect('/auth/profile');
	}
    res.render('./user/login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/'); 
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/auth/profile');
});

router.post('/local',urlencodedParser,
  passport.authenticate('local', { successRedirect: '/auth/profile',
                                   failureRedirect: '/auth/login'
                                 })
);

router.get('/profile', authCheck, (req, res) => {
  //console.log(req.user.thumbnail);
    res.render('user/profile', { user: req.user });
});

module.exports = router;