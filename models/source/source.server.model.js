"use strict";

var mongoose = require("mongoose"),
  Formatter = require("../../services/Formatters"),
  Schema = mongoose.Schema;

var SourceSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      index: true,
      set: function(name) {
        return Formatter.string.capitalize(name);
      }
    },
    Type: {
      type: String,
      enum: ["", "Grid", "Stand Alone", "Phone Leads"],
      required: true
    },
    DisplayName: {
      type: String
    },
    Provider: {
      type: String,
      required: true
    },
    Cost: {
      type: Number,
      required: true
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign",
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

SourceSchema.index(
  {
    Name: 1,
    Type: 1,
    Campaign: 1
  },
  { unique: true }
);

SourceSchema.pre("save", function(next) {
  if (this.Type) {
    this.DisplayName = this.Name + " - " + this.Type;
  } else {
    this.DisplayName = this.Name;
  }
  next();
});

SourceSchema.set("toJSON", {
  getters: true,
  setters: true
});

mongoose.model("Source", SourceSchema);
