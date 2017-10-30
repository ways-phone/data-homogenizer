'use strict';

module.exports = {
    validateDecimal: validateDecimal,
    roundTowo: roundTowo
};

function validateDecimal(number) {
    var match = number
        .toString()
        .match(/^\d+(\.\d{1,3})?$/);
    return match;
}

function roundTowo(num) {
    var formatted = +(Math.round(num + "e+3") + "e-3");
    return formatted;
}