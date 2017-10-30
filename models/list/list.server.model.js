"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var ListSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true
    },
    Count: {
      type: Number,
      required: true
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign",
      required: true
    },
    Files: [
      {
        type: Schema.ObjectId,
        ref: "File"
      }
    ],
    Sources: [
      {
        type: Schema.ObjectId,
        ref: "Source"
      }
    ],
    Created: {
      type: Date,
      default: Date.now
    },
    Updated: {
      type: Date,
      default: Date.now
    },
    isExported: {
      type: Boolean,
      default: false
    }
  },
  {
    strict: true
  }
);

ListSchema.index({
  Name: 1
});

mongoose.model("List", ListSchema);
