"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var mongoose = require("mongoose");
var Dupe = mongoose.model("DupeRecord");
var Record = require("../record/record.server.model");
var File = require("../file/file.server.model");
var Campaign = require("../campaign/campaign.server.model");

describe("Record Model", function() {
  describe("Validation", function() {
    describe("Phone", function() {
      it("Should set blank HomePhone to undefined rather than '' on save", function() {
        var record = new Record();

        return expect(record.save()).to.eventually.have.property(
          "HomePhone",
          undefined
        );
      });

      it("Should set blank MobilePhone to undefined rather than '' on save", function() {
        var record = new Record();

        return expect(record.save()).to.eventually.have.property(
          "MobilePhone",
          undefined
        );
      });

      describe("Phone Number Formatting", function() {
        it("should remove any non digits from a number on save", function() {
          var record = new Record();
          record.HomePhone = "2995_0//9+7 86";
          return expect(record.save()).to.eventually.have.property(
            "HomePhone",
            "299509786"
          );
        });

        it("should remove any leading 61 from a number on save", function() {
          var record = new Record();
          record.HomePhone = "61299614755";

          return expect(record.save()).to.eventually.have.property(
            "HomePhone",
            "299614755"
          );
        });

        it("should remove any leading 0 from a number on save", function() {
          var record = new Record();
          record.HomePhone = "061 ++299614754";
          return expect(record.save()).to.eventually.have.property(
            "HomePhone",
            "299614754"
          );
        });

        it("should remove any leading 0 and 61 from a number on save", function() {
          var record = new Record();
          record.HomePhone = "61 +0+299614757";
          return expect(record.save()).to.eventually.have.property(
            "HomePhone",
            "299614757"
          );
        });
      });
      describe("Invalid Phone Number", function() {
        it("Should set a record with no phone numbers as invalid", function() {
          var record = new Record();

          return expect(record.save()).to.eventually.have.property(
            "isInvalid",
            true
          );
        });

        it("should set a record as invalid if there is a non 9 digit phone number", function() {
          var record = new Record();
          record.HomePhone = "29950978";
          return expect(record.save()).to.eventually.have.property(
            "isInvalid",
            true
          );
        });
      });

      describe("Switching Phones", function() {
        it("Should switch mobile and home phones if they both exist and are set incorrectly", function() {
          var record = new Record();
          record.HomePhone = "499509787";
          record.MobilePhone = "299509787";

          var save = record.save();

          return Promise.all([
            expect(save).to.eventually.have.property("HomePhone", "299509787"),
            expect(save).to.eventually.have.property("MobilePhone", "499509787")
          ]);
        });

        it("Should switch mobile and home phones if only Home is Set incorrectly", function() {
          var record = new Record();
          record.HomePhone = "499509786";

          var save = record.save();

          return Promise.all([
            expect(save).to.eventually.have.property("HomePhone", undefined),
            expect(save).to.eventually.have.property("MobilePhone", "499509786")
          ]);
        });

        it("Should switch mobile and home phones if only Mobile is Set incorrectly", function() {
          var record = new Record();
          record.MobilePhone = "299509785";

          var save = record.save();

          return Promise.all([
            expect(save).to.eventually.have.property("HomePhone", "299509785"),
            expect(save).to.eventually.have.property("MobilePhone", undefined)
          ]);
        });

        it("Should remove a duplicate phone and set the correct phone field on save", function() {
          var record = new Record();

          record.MobilePhone = "299509289";
          record.HomePhone = "299509289";
          var r2 = new Record();
          r2.MobilePhone = "499509182";
          r2.HomePhone = "499509182";

          var save = record.save();
          var save2 = r2.save();

          return Promise.all([
            expect(save).to.eventually.have.property("HomePhone", "299509289"),
            expect(save).to.eventually.have.property("MobilePhone", undefined),
            expect(save2).to.eventually.have.property("HomePhone", undefined),
            expect(save2).to.eventually.have.property(
              "MobilePhone",
              "499509182"
            )
          ]);
        });
      });

      describe("Virtual Phones", function() {
        it("Should set a record with Phone1 for single phone record on save", function() {
          var record = new Record();
          record.HomePhone = "299209787";
          var save = record.save();
          return Promise.all([
            expect(save).to.eventually.have.property("Phone1", "61299209787"),
            expect(save).to.eventually.have.property("Phone2", "")
          ]);
        });

        it("Should set a record with Phone1 and Phone 2 and prioritise mobile on save", function() {
          var record = new Record();
          record.HomePhone = "298509787";
          record.MobilePhone = "498509787";
          var save = record.save();
          return Promise.all([
            expect(save).to.eventually.have.property("Phone1", "61498509787"),
            expect(save).to.eventually.have.property("Phone2", "61298509787")
          ]);
        });
      });
    });

    describe("General", function() {
      it("Should set CustKey as Id on save", function() {
        var record = new Record();

        return expect(record.save()).to.eventually.have.property("CustKey");
      });

      it("Should Capitalize Title on save", function() {
        var record = new Record();
        record.Title = "mr";
        return expect(record.save()).to.eventually.have.property("Title", "Mr");
      });
    });

    describe("Date formatting", function() {
      it("Should remove slashes from DOB", function() {
        var record = new Record();
        record.DOB = "12/05/1991";
        record.Timestamp = "12/04/2017";
        var save = record.save();
        return Promise.all([
          expect(save).to.eventually.have.property("DOB", "12.05.1991"),
          expect(save).to.eventually.have.property("Timestamp", "12.04.2017")
        ]);
      });
      it("Should remove dashes from DOB", function() {
        var record = new Record();
        record.DOB = "12-05-1991";
        record.Timestamp = "12-04-2017";
        var save = record.save();
        return Promise.all([
          expect(save).to.eventually.have.property("DOB", "12.05.1991"),
          expect(save).to.eventually.have.property("Timestamp", "12.04.2017")
        ]);
      });
    });

    describe("Gender", function() {
      it("Should set gender as male if only title of mr exists", function() {
        var record = new Record();
        record.Title = "mr";
        return expect(record.save()).to.eventually.have.property(
          "Gender",
          "Male"
        );
      });

      it("Should set gender as Female if only title of mrs exists", function() {
        var record = new Record();
        record.Title = "Mrs";
        return expect(record.save()).to.eventually.have.property(
          "Gender",
          "Female"
        );
      });

      it("Should set gender as Female if only title of ms exists", function() {
        var record = new Record();
        record.Title = "ms";
        return expect(record.save()).to.eventually.have.property(
          "Gender",
          "Female"
        );
      });

      it("Should set gender as Female if only title of miss exists", function() {
        var record = new Record();
        record.Title = "miss";
        return expect(record.save()).to.eventually.have.property(
          "Gender",
          "Female"
        );
      });
    });

    describe("Address", function() {
      it("Should Set Title as Uppercase on save", function() {
        var record = new Record();
        record.Suburb = "camden";
        return expect(record.save()).to.eventually.have.property(
          "Suburb",
          "CAMDEN"
        );
      });
    });

    describe("Name Invalid", function() {
      it("Should set a Record invalid if both first and last name have no vowels", function() {
        var record = new Record();
        record.HomePhone = "399584757";
        record.FirstName = "sdfsfd";
        record.LastName = "sdfsdfsfd";
        return expect(record.save()).to.eventually.have.property(
          "isInvalid",
          true
        );
      });

      it("Should set a Record valid if first name has vowels, and last name have no vowels", function() {
        var record = new Record();
        record.HomePhone = "599584757";
        record.FirstName = "Jhon";
        record.LastName = "sdfsdfsfd";
        return expect(record.save()).to.eventually.have.property(
          "isInvalid",
          false
        );
      });

      it("Should set a Record valid if first name has no vowels, and last name has vowels", function() {
        var record = new Record();
        record.HomePhone = "699584757";
        record.FirstName = "Mr M J";
        record.LastName = "Richards";
        return expect(record.save()).to.eventually.have.property(
          "isInvalid",
          false
        );
      });
    });
  });
  describe("Duplicates", function() {
    after(function(done) {
      mongoose.connection.collections.records.drop(function() {
        done();
      });
    });
    describe("Campaign Duplicates", function() {
      it("should throw a unique index error if the same mobile exists in the same Campaign", function() {
        var record1 = new Record();
        record1.MobilePhone = "04090070515";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.MobilePhone = "04090070515";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejected;
        });
      });

      it("on dupe Mobile Error save a dupeRecord n the same Campaign", function() {
        var record1 = new Record();
        record1.MobilePhone = "04090070515";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.MobilePhone = "04090070515";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicate",
            true
          );
        });
      });

      it("should throw a unique index error when same Home Phone exists for same Campaign", function() {
        var record1 = new Record();
        record1.HomePhone = "249070515";
        record1.FirstName = "John";
        record1.File = new File();

        var record2 = new Record();
        record2.HomePhone = "249070515";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejected;
        });
      });

      it("on dupe Home Error save a dupeRecord n the same Campaign", function() {
        var record1 = new Record();
        record1.HomePhone = "249070515";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.HomePhone = "249070515";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicate",
            true
          );
        });
      });

      it("should throw a unique index error if the same Email exists n the same Campaign", function() {
        var record1 = new Record();
        record1.Email = "test@test.com";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.Email = "test@test.com";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejected;
        });
      });

      it("on dupe Email Error save a dupeRecord in the same Campaign", function() {
        var record1 = new Record();
        record1.Email = "test@test.com";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.Email = "test@test.com";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicate",
            true
          );
        });
      });

      it("should not throw if campaigns are different yet emails and phones are the same", function() {
        var record1 = new Record();
        record1.Email = "test@test.com";
        record1.MobilePhone = "411112222";
        record1.HomePhone = "311112222";
        record1.FirstName = "John";
        record1.Campaign = new Campaign();
        var record2 = new Record();
        record2.Email = "test@test.com";
        record2.MobilePhone = "411112222";
        record2.HomePhone = "311112222";
        record2.FirstName = "Tom";
        record2.Campaign = new Campaign();

        return record1.save().catch(function() {
          return expect(record2.save()).to.eventually.be.fulfilled;
        });
      });
    });
    describe("File Duplicates", function() {
      var file = new File();
      file.Name = "test";
      file._id = "2";

      it("should throw a unique index error if the same mobile exists in the same File", function() {
        var record1 = new Record();
        record1.MobilePhone = "04080070515";
        record1.FirstName = "John";

        var record2 = new Record();
        record2.MobilePhone = "04080070515";
        record2.FirstName = "Tom";

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejectedWith(
            "E11000 duplicate key error collection: test.records index: MobilePhone_1_File_1 " +
              'dup key: { : "4080070515", : null }'
          );
        });
      });

      it("on dupe Mobile Error save a dupeRecord n the same File", function() {
        var record1 = new Record();
        record1.MobilePhone = "04060070515";
        record1.FirstName = "John";

        var record2 = new Record();
        record2.MobilePhone = "04060070515";
        record2.FirstName = "Tom";

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicateWithinFile",
            true
          );
        });
      });

      it("should throw a unique index error when same Home Phone exists for same File", function() {
        var record1 = new Record();
        record1.HomePhone = "359070515";
        record1.FirstName = "John";
        var record2 = new Record();
        record2.HomePhone = "359070515";
        record2.FirstName = "Tom";

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejectedWith(
            "E11000 duplicate key error collection: test.records index: HomePhone_1_File_1 du" +
              'p key: { : "359070515", : null }'
          );
        });
      });

      it("on dupe Home Error save a dupeRecord n the same File", function() {
        var record1 = new Record();
        record1.HomePhone = "269070515";
        record1.FirstName = "John";
        var record2 = new Record();
        record2.HomePhone = "269070515";
        record2.FirstName = "Tom";

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicateWithinFile",
            true
          );
        });
      });

      it("should throw a unique index error if the same Email exists n the same File", function() {
        var record1 = new Record();
        record1.Email = "tes@test.com";
        record1.FirstName = "John";
        var record2 = new Record();
        record2.Email = "tes@test.com";
        record2.FirstName = "Tom";

        return record1.save().then(function(r1) {
          return expect(record2.save()).to.eventually.be.rejectedWith(
            "E11000 duplicate key error collection: test.records index: Email_1_File_1 dup ke" +
              'y: { : "tes@test.com", : null }'
          );
        });
      });

      it("on dupe Email Error save a dupeRecord in the same File", function() {
        var record1 = new Record();
        record1.Email = "tet@test.com";
        record1.FirstName = "John";
        var record2 = new Record();
        record2.Email = "tet@test.com";
        record2.FirstName = "Tom";

        return record1.save().catch(function() {
          return expect(Dupe.findOne({})).to.eventually.have.property(
            "isDuplicateWithinFile",
            true
          );
        });
      });

      it("should not throw if files are different yet emails and phones are the same", function() {
        var record1 = new Record();
        record1.Email = "tst@test.com";
        record1.MobilePhone = "411112223";
        record1.HomePhone = "311112223";
        record1.FirstName = "John";
        record1.File = new File();
        var record2 = new Record();
        record2.Email = "tst@test.com";
        record2.MobilePhone = "411112223";
        record2.HomePhone = "311112223";
        record2.FirstName = "Tom";
        record2.File = new File();

        return record1.save().catch(function() {
          return expect(record2.save()).to.eventually.be.fulfilled;
        });
      });
    });
  });
});
