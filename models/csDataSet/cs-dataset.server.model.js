"use strict";

var mongoose = require("mongoose"),
  Promise = require("bluebird"),
  Schema = mongoose.Schema;

var CsDataset = new Schema({
  Name: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true
  },
  Campaign: {
    type: Schema.ObjectId,
    ref: "Campaign",
    required: true
  },
  List: [
    {
      type: Schema.ObjectId,
      ref: "List",
      required: true
    }
  ],
  isExported: {
    type: Boolean,
    default: false
  }
});

CsDataset.index(
  {
    Campaign: 1,
    Name: 1
  },
  {
    unique: true
  }
);
mongoose.model("CsDataset", CsDataset);
