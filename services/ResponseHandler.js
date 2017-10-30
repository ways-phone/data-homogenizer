 'use strict';

 module.exports = {
     sendData: sendData,
     sendError: sendError
 };

 function sendData(res) {
     return function(data) {
         res.json({
             data: data
         });
     };
 }

 function sendError(res) {
     return function(error) {
         res.json({
             error: error
         });
     };
 }