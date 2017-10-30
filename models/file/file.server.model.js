"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var FileSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      index: true
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign",
      required: true
    },
    Header: {
      type: Schema.ObjectId,
      ref: "Header"
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

FileSchema.index({ Name: 1 });
module.exports = mongoose.model("File", FileSchema);
