'use strict';

var mongoose = require('mongoose');
var promise = require('bluebird');

module.exports = {};

function CreateAggregate(match, group, lookup, unwind) {
    var aggregate = {};

    aggregate['$match'] = CreateMatch(match);

    return aggregate;
}

function CreateMatch(match) {
    return {
        Campaign: match.campaign_id,
        isDuplicate: false,
        isDuplicateWithinFile: false,
        isExcluded: false,
        isExported: false,
        isInvalid: false,
        List: undefined
    };
}
