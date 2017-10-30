"use strict";

module.exports = {
  capitalize: capitalize,
  useMongoIdAsCustkey: useMongoIdAsCustkey,
  validatePhone: validatePhone,
  formatDateString: formatDateString,
  setGender: setGender,
  toUpper: toUpper,
  preSaveValidator: preSaveValidator,
  postSaveValidator: postSaveValidator
  // getVirtualPhone1: getVirtualPhone1, getVirtualPhone2: getVirtualPhone2
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function useMongoIdAsCustkey(key) {
  if (isBlank(key)) {
    return this._id;
  } else {
    return key;
  }
}

function validatePhone(number) {
  if (number) {
    number = number.replace(new RegExp(/\D/g), "");
    number = number.replace(new RegExp(/^0/), "");
    number = number.replace(new RegExp(/^61/), "");
    number = number.replace(new RegExp(/^0/), "");

    if (number.length !== 9) {
      this.isInvalid = true;
    }
  }
  return number;
}

function formatDateString(dateString) {
  if (dateString) {
    dateString = dateString.replace(new RegExp(/\//g), ".");
    dateString = dateString.replace(new RegExp(/-/g), ".");
  }
  return dateString;
}

function setGender(gender) {
  var males = ["M", "m", "Male", "male"];
  var females = ["F", "f", "Female", "female"];
  if (males.indexOf(gender) !== -1) {
    gender = "Male";
  } else if (females.indexOf(gender) !== -1) {
    gender = "Female";
  } else {
    gender = "";
  }
  return gender;
}

function markInvalidIfFullNameHasNoVowels(_this) {
  var first = _this.FirstName;
  var last = _this.LastName;
  return !hasVowels(first) && !hasVowels(last);
}

function hasVowels(name) {
  return (
    name &&
    !(
      name.match(/^[^aeiouy]+$/i) &&
      name.replace(new RegExp(/\w/), "").length > 2
    )
  );
}

function toUpper(string) {
  if (string) {
    return string.toUpperCase();
  }
}

function switchMobileAndHomePhone(_this) {
  var mob = _this.MobilePhone;
  var home = _this.HomePhone;

  if (!isBlank(mob) && mob[0] !== "4" && isBlank(home)) {
    _this.HomePhone = mob;
    _this.MobilePhone = undefined;
  }
  if (!isBlank(home) && home[0] === "4" && isBlank(mob)) {
    _this.MobilePhone = home;
    _this.HomePhone = undefined;
  }
  if (!isBlank(home) && home[0] === "4" && !isBlank(mob)) {
    var temp = _this.MobilePhone;
    _this.MobilePhone = home;
    _this.HomePhone = temp;
  }
}

function preSaveValidator(next) {
  isCustKey(this);
  areMobileAndHomeEqual(this);
  removeBlankPhones(this);
  checkGenderAgainstTitle(this);
  switchMobileAndHomePhone(this);
  next();
}

function isCustKey(_this) {
  if (!_this.CustKey) {
    _this.CustKey = _this._id;
  }
}

function areMobileAndHomeEqual(_this) {
  if (_this.MobilePhone === _this.HomePhone) {
    _this.HomePhone = undefined;
  }
}

function removeBlankPhones(_this) {
  if (_this.HomePhone === "") {
    _this.HomePhone = undefined;
  }
  if (_this.MobilePhone === "") {
    _this.MobilePhone = undefined;
  }
}

function checkGenderAgainstTitle(_this) {
  var gender = _this.Gender;
  var title = _this.Title;
  if (isBlank(gender) && !isBlank(title)) {
    if (
      title.match(/^mrs$/i) ||
      title.match(/^miss$/i) ||
      title.match(/^ms$/i)
    ) {
      _this.Gender = "Female";
    } else if (title.match(/^mr$/i)) {
      _this.Gender = "Male";
    }
  } else if (isBlank(gender) && isBlank(title)) {
    _this.Gender = "";
  }
}

function postSaveValidator(next) {
  var _this = this;
  _this.Phone1 = setVirtualPhone1(_this);
  _this.Phone2 = setVirtualPhone2(_this);
  _this.isInvalid = markInvalidIfFullNameHasNoVowels(_this);

  checkAndRemoveInvalid(_this);
}

function checkAndRemoveInvalid(_this) {
  if (isBlank(_this.MobilePhone) && isBlank(_this.HomePhone)) {
    _this.isInvalid = true;
    _this.remove();
  }
}

function setVirtualPhone1(_this) {
  //var _this = this;
  var mob = _this.MobilePhone;
  var hom = _this.HomePhone;
  if (!isBlank(mob)) {
    return "61" + mob;
  } else if (!isBlank(hom)) {
    return "61" + hom;
  }
}

function setVirtualPhone2(_this) {
  //var _this = this;
  var mob = _this.MobilePhone;
  var hom = _this.HomePhone;
  if (!isBlank(mob) && !isBlank(hom)) {
    if (mob !== hom) {
      return "61" + hom;
    }
  }
  return "";
}

function isBlank(field) {
  return (
    field === undefined || field === "" || field === null || field.length === 0
  );
}
