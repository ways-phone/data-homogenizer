var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  RecordValidator = require("./services/validate-record.server.model.service");

var DupeRecordSchema = new Schema(
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
      set: RecordValidator.validatePhone,
      index: true
    },
    HomePhone: {
      type: String,
      set: RecordValidator.validatePhone,
      index: true
    },
    DOB: {
      type: String,
      set: RecordValidator.formatDateString
    },
    Gender: {
      type: String,
      set: RecordValidator.setGender
    },
    Title: {
      type: String,
      set: RecordValidator.capitalize
    },
    FirstName: {
      type: String
      // set: RecordValidator.markInvalidIfNoVowels
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
      type: String,
      set: RecordValidator.formatDateString
    },
    Suburb: {
      type: String,
      set: RecordValidator.toUpper
    },
    State: {
      type: String
    },
    Postcode: {
      type: String
    },
    Email: {
      type: String,
      index: true
    },
    OriginalCost: {
      type: Number
    },
    SiteLabel: {
      type: String
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

DupeRecordSchema.pre("validate", RecordValidator.preSaveValidator);

DupeRecordSchema.post("validate", RecordValidator.postSaveValidator);

mongoose.exports = mongoose.model("DupeRecord", DupeRecordSchema, "dupes");
