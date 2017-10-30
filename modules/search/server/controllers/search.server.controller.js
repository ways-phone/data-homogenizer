"use strict";

var mongoose = require("mongoose"),
  Record = mongoose.model("Record");

module.exports = {
  searchRecord: searchRecord,
  updateRecord: updateRecord
};

function searchRecord(req, res) {
  if (req.payload._id) {
    var query = JSON.parse(req.query.query);
    Record.find(query)
      .populate("Campaign Source Client List")
      .then(function(record) {
        res.json({ data: record });
      })
      .catch(function(error) {
        res.json({ error: error });
      });
  }
}

function updateRecord(req, res) {
  Record.findByIdAndUpdate(req.body._id, req.body, { new: true })
    .populate("Client Campaign Source")
    .then(function(updated) {
      res.json({ data: updated });
    })
    .catch(function(error) {
      res.json({ error: error });
    });
}
