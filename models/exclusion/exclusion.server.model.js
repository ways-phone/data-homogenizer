"use strict";

var mongoose = require("mongoose"),
  Promise = require("bluebird"),
  Schema = mongoose.Schema;

var ExclusionRecord = new Schema(
  {
    Exclusion: {
      type: Schema.ObjectId,
      ref: "Exclusion",
      required: true
    },
    Phone1: {
      type: String,
      unique: true
    },
    Phone2: {
      type: String
    },
    Phone3: {
      type: String
    },
    Email: {
      type: String,
      unique: true
    }
  },
  {
    strict: false
  }
);

var Exclusion = new Schema({
  Campaign: {
    type: Schema.ObjectId,
    ref: "Campaign",
    required: true
  },
  Records: [ExclusionRecord]
});

Exclusion.index(
  {
    Campaign: 1
  },
  {
    unique: true
  }
);
mongoose.model("Exclusion", Exclusion);
