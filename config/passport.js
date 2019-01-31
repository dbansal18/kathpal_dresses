const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const download = require('image-downloader');
var ppath;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

//---------------------------Local Strategy----------------------------------------------------------
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username,password);
    User.findOne({ username: username }, function(err, user) {
        // console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else if (user.password==password) {
        console.log('user logined');
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect password.' });
    });
  }
));

//----------------------------Google Strategy------------------------------------------------------
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        // console.log(profile);
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                options = {
                    url: profile._json.image.url.slice(0, -6),
                    dest: './public/uploads/photo-'+Date.now()+'.jpg'    
                }
                download.image(options)
                    .then(({ filename, image }) => {
                    ppath=filename.slice(17);
                    new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    thumbnail: ppath,
                    email: profile.emails[0].value,
                    gender: profile._json.gender,
                    role: 'user',
                    loginType: 'Google Strategy'
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });

                   //console.log('File saved to', filename);
                   //console.log('ppath=  ', ppath);
                })
                .catch((err) => {
                    console.error(err)
                })
            }
        });
    })
);
