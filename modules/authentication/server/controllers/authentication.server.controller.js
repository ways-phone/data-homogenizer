"use strict";

var mongoose = require("mongoose"),
  passport = require("passport"),
  User = mongoose.model("User");

exports.register = function(req, res) {
  var user = new User({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Department: req.body.Department
  });

  user.setPassword(req.body.Password);

  user
    .save()
    .then(function() {
      var token = user.generateJwt();

      res.status(200);

      res.json({ data: token });
    })
    .catch(function(error) {
      res.json({ error: error });
    });
};

exports.login = function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    var token;

    if (err) {
      res.status(404).json(err);

      return;
    }

    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({ data: token });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
