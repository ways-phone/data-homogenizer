'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (username, password, done) {
    User
        .findOne({Email: username})
        .then(function (user) {
            if (!user) {
                return done(null, false, {message: "User Does Not Exist"});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: "Password is wrong!"});
            }
            return done(null, user);
        })
        .catch(function (error) {
            return done(error);
        });
}));