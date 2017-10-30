/**
 * Created by miles on 19/12/16.
 */
"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HeaderSchema = new Schema(
  {
    Client: {
      type: Schema.ObjectId,
      ref: "Client"
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign"
    },
    OriginalFile: {
      type: Schema.ObjectId,
      ref: "File"
    },
    CustKey: {
      type: String
    },
    HomePhone: {
      type: String
    },
    MobilePhone: {
      type: String
    },
    DOB: {
      type: String
    },
    Gender: {
      type: String
    },
    Title: {
      type: String
    },
    FirstName: {
      type: String
    },
    LastName: {
      type: String
    },
    Address1: {
      type: String
    },
    Address2: {
      type: String
    },
    Timestamp: {
      type: String
    },
    Suburb: {
      type: String
    },
    State: {
      type: String
    },
    Postcode: {
      type: String
    },
    Email: {
      type: String
    },
    Source: {
      type: String
    },
    SiteLabel: {
      type: String
    },
    Extra1: {
      type: String
    },
    Extra2: {
      type: String
    },
    Extra3: {
      type: String
    },
    Extra4: {
      type: String
    }
  },
  {
    strict: true
  }
);

mongoose.model("Header", HeaderSchema);
