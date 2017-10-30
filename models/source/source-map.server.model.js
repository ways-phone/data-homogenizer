"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var SourceMapSchema = new Schema(
  {
    Name: {
      type: String,
      required: true
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign",
      required: true
    },
    Source: {
      type: Schema.ObjectId,
      ref: "Source",
      required: true
    },
    Created: {
      type: Date,
      default: Date.now
    },
    Updated: {
      type: Date,
      default: Date.now
    }
  },
  { strict: true }
);

mongoose.model("SourceMap", SourceMapSchema);
