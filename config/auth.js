'use strict';
var jwt = require('express-jwt');

module.exports = jwt({
    secret: require('./secret').secret,
    userProperty: 'payload'
});