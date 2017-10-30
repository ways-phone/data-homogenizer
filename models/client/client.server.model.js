"use strict";

var mongoose = require("mongoose"),
  Format = require("../../services/Formatters"),
  Promise = require("bluebird"),
  deepPopulate = Promise.promisifyAll(
    require("mongoose-deep-populate")(mongoose)
  ),
  Schema = mongoose.Schema;

var ClientSchema = new Schema({
  Name: {
    type: String,
    unique: true,
    required: true,
    set: function(name) {
      return Format.string.capitalize(name);
    }
  },
  Acronym: {
    type: String,
    unique: true
  },
  Type: {
    type: String,
    required: true
  },
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
  Creator: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
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
  },
  Campaigns: [
    {
      type: Schema.ObjectId,
      ref: "Campaign"
    }
  ]
});

ClientSchema.set("toJSON", {
  getters: true,
  setters: true
});

ClientSchema.plugin(deepPopulate, {
  populate: {
    "Campaigns.Creator": {
      select: "FullName"
    },
    Creator: {
      select: "FullName"
    }
  }
});

module.exports = mongoose.model("Client", ClientSchema);
