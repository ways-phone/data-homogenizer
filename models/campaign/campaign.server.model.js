"use strict";

var mongoose = require("mongoose"),
  // Source = mongoose.model('Source'),
  FileSchema = require("../file/file.server.model"),
  Format = require("../../services/Formatters"),
  Schema = mongoose.Schema;

var CampaignSchema = new Schema({
  ContactSpaceID: { type: Number, required: true, unique: true },
  Name: {
    type: String,
    required: true,
    set: function(name) {
      return Format.string.capitalize(name);
    }
  },
  Client: { type: Schema.ObjectId, ref: "Client" },
  Path: { type: String },
  ContactRate: {
    type: Number,
    min: 0,
    max: 1,
    validate: {
      validator: Format.number.validateDecimal,
      message: "{VALUE} is not a valid ContactRate"
    },
    required: [true, "Contact Rate must be a decimal of format X.XX"],
    get: function(contactRate) {
      return Format.number.roundTowo(contactRate * 100);
    },
    set: function(contactRate) {
      return Format.number.roundTowo(contactRate / 100);
    }
  },
  Conversion: {
    type: Number,
    min: 0,
    max: 1,
    validate: {
      validator: Format.number.validateDecimal,
      message: "{VALUE} is not a valid ContactRate"
    },
    required: [true, "Conversion must be a decimal of format X.XX"],
    get: function(conversion) {
      return Format.number.roundTowo(conversion * 100);
    },
    set: function(conversion) {
      return Format.number.roundTowo(conversion / 100);
    }
  },
  Files: [{ type: Schema.ObjectId, ref: "File" }],
  Sources: [{ type: Schema.ObjectId, ref: "Source" }],
  Lists: [{ type: Schema.ObjectId, ref: "List" }],
  Created: {
    type: Date,
    default: Date.now,
    get: function(created) {
      return Format.date.formatDate(created);
    },
    set: function(created) {
      if (created instanceof Date) return created;
      return Format.date.createDateObjectFromString(created);
    }
  },
  Creator: { type: Schema.ObjectId, ref: "User" },
  Updated: {
    type: Date,
    default: Date.now,
    get: function(created) {
      return Format.date.formatDate(created);
    },
    set: function(created) {
      if (created instanceof Date) return created;
      return Format.date.createDateObjectFromString(created);
    }
  }
});

CampaignSchema.index({ Name: 1, Client: 1 }, { unique: true });

CampaignSchema.set("toJSON", { getters: true, setters: true });

CampaignSchema.pre("save", function(next) {
  this.Path = this.Name.replace(" ", "_");
  next();
});

module.exports = mongoose.model("Campaign", CampaignSchema);
