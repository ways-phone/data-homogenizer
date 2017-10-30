'use strict';

module.exports = {
    createTimestamp: createTimestamp,
    setTimestamp: setTimestamp,
    formatDate: formatDate,
    fileDate: fileDate,
    createDateObjectFromString: createDateObjectFromString

};

function createDateObjectFromString(datestring) {
    var split = datestring.split("/");
    var date = new Date();
    date.setDate(split[0]);
    date.setMonth(split[1] - 1);
    date.setFullYear(split[2]);
    return date;
}

function setTimestamp(obj) {
    obj.timestamp = {
        created: createTimestamp(obj.Created),
        updated: createTimestamp(obj.Updated)
    };
    return obj;
}

function fileDate(datestring) {
    var date = createDate(datestring);
    var formatted = getDay(date) + getMonth(date) + getYear(date, 2);
    return formatted;
}

function formatDate(datestring) {
    var date = createDate(datestring);
    var formatted = getDay(date) + "/" + getMonth(date) + "/" + getYear(date, 4);
    return formatted;
}

function createTimestamp(dateString) {
    var date = createDate(dateString);
    return getDay(date) + "/" + getMonth(date) + "/" + getYear(date, 4) + " " + getHours(date) + ":" + getMinutes(date);
}

function createDate(string) {
    try {
        return new Date(string);
    } catch (e) {
        return new Error("not a date");
    }
}

function getDay(date) {
    return addZero(date.getDate());
}

function getMonth(date) {
    return addZero(date.getMonth() + 1);
}

function getYear(date, digits) {
    return date
        .getFullYear()
        .toString()
        .slice(-digits);
}

function getHours(date) {
    return addZero(date.getHours());
}

function getMinutes(date) {
    return addZero(date.getMinutes());
}

function addZero(number) {
    return ("0" + number).slice(-2);
}