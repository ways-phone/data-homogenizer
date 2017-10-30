"use strict";

var mongoose = require("mongoose"),
  Crypto = require("crypto"),
  jwt = require("jsonwebtoken"),
  Secret = require("../../config/secret"),
  Formatter = require("../../services/Formatters"),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
    set: function(first) {
      return Formatter.string.capitalize(first);
    }
  },
  LastName: {
    type: String,
    required: true,
    set: function(last) {
      return Formatter.string.capitalize(last);
    }
  },
  FullName: {
    type: String
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Department: {
    type: String,
    enum: ["Data", "Operations", "Client Services"],
    required: true
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  }
});

UserSchema.set("toJSON", {
  getters: true,
  setters: true
});

UserSchema.pre("save", function(next) {
  this.FullName = this.FirstName + " " + this.LastName;
  next();
});

UserSchema.methods.setPassword = function(password) {
  this.salt = Crypto.randomBytes(16).toString("hex");
  this.hash = Crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
};

UserSchema.methods.validPassword = function(password) {
  var hash = Crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate());
  expiry.setMinutes(expiry.getMinutes() + 60);

  return jwt.sign(
    {
      _id: this._id,
      email: this.Email,
      name: this.FullName,
      exp: parseInt(expiry.getTime() / 1000)
    },
    Secret.secret
  );
};

module.exports = mongoose.model("User", UserSchema);
