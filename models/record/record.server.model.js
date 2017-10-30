"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  DupeRecord = mongoose.model("DupeRecord"),
  RecordValidator = require("./services/validate-record.server.model.service");

var RecordSchema = new Schema(
  {
    File: {
      type: Schema.ObjectId,
      ref: "File"
    },
    Client: {
      type: Schema.ObjectId,
      ref: "Client"
    },
    Campaign: {
      type: Schema.ObjectId,
      ref: "Campaign"
    },
    Source: {
      type: Schema.ObjectId,
      ref: "Source"
    },
    Header: {
      type: Schema.ObjectId,
      ref: "Header"
    },
    List: {
      type: Schema.ObjectId,
      ref: "List"
    },
    Created: {
      type: Date,
      default: Date.now
    },
    Updated: {
      type: Date,
      default: Date.now
    },
    CustKey: {
      type: String,
      set: RecordValidator.useMongoIdAsCustkey
    },
    MobilePhone: {
      type: String,
      set: RecordValidator.validatePhone
    },
    HomePhone: {
      type: String,
      set: RecordValidator.validatePhone
    },
    DOB: {
      type: String,
      set: RecordValidator.formatDateString,
      default: ""
    },
    Gender: {
      type: String,
      set: RecordValidator.setGender,
      default: ""
    },
    Title: {
      type: String,
      set: RecordValidator.capitalize,
      default: ""
    },
    FirstName: {
      type: String,
      // set: RecordValidator.markInvalidIfNoVowels,
      default: ""
    },
    LastName: {
      type: String,
      // set: RecordValidator.markInvalidIfNoVowels,
      default: ""
    },
    Address1: {
      type: String,
      default: ""
    },
    Address2: {
      type: String,
      default: ""
    },
    Timestamp: {
      type: String,
      set: RecordValidator.formatDateString,
      default: ""
    },
    Suburb: {
      type: String,
      set: RecordValidator.toUpper,
      default: ""
    },
    State: {
      type: String,
      default: ""
    },
    Postcode: {
      type: String,
      default: ""
    },
    Email: {
      type: String
    },
    OriginalCost: {
      type: Number
    },
    SiteLabel: {
      type: String,
      default: ""
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isDuplicateWithinFile: {
      type: Boolean,
      default: false
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isExcluded: {
      type: Boolean,
      default: false
    },
    isExported: {
      type: Boolean,
      default: false
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
    },
    Phone1: {
      type: String,
      default: ""
    },
    Phone2: {
      type: String,
      default: ""
    }
  },
  {
    strict: false,
    id: false
  }
);

RecordSchema.index({
  File: 1,
  List: 1,
  Source: 1,
  Campaign: 1,
  Client: 1,
  Header: 1,
  Phone1: 1,
  CustKey: 1
});

RecordSchema.pre("validate", RecordValidator.preSaveValidator);

RecordSchema.post("validate", RecordValidator.postSaveValidator);

RecordSchema.post("save", function(error, doc, next) {
  if (error) {
    console.log(error.errmsg);
    var d = new DupeRecord(doc);
    if (error.errmsg.match(/.*_File_1.*/g)) {
      d.isDuplicateWithinFile = true;
      // console.log(error);
      d.save().then(function() {
        next();
      });
    } else {
      d.isDuplicate = true;
      d.save().then(function() {
        next();
      });
    }
  } else {
    next();
  }
});

RecordSchema.set("toJSON", {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model("Record", RecordSchema);
