'use strict';
var mongoose = require( 'mongoose' );

module.exports = {
    create: setPartialIndexes
};

function setPartialIndexes() {
    var sixMonths = new Date();
    var month = sixMonths.getMonth();
    sixMonths.setMonth( month - 6 );

    mongoose.connection.collections.records.dropIndexes();
    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            MobilePhone: 1,
            File: 1,

        }, {
            unique: true,
            partialFilterExpression: {
                MobilePhone: {
                    $exists: true
                },

            }
        } );

    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            HomePhone: 1,
            File: 1,

        }, {
            unique: true,
            partialFilterExpression: {
                HomePhone: {
                    $exists: true
                },

            }
        } );

    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            Email: 1,
            File: 1
        }, {
            unique: true,
            partialFilterExpression: {
                Email: {
                    $exists: true
                },

            }
        } );

    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            MobilePhone: 1,
            Created: 1,
            Campaign: 1
        }, {
            unique: true,
            partialFilterExpression: {
                MobilePhone: {
                    $exists: true
                },
                Created: {
                    $gte: sixMonths
                }
            }
        } );

    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            HomePhone: 1,
            Created: 1,
            Campaign: 1
        }, {
            unique: true,
            partialFilterExpression: {
                HomePhone: {
                    $exists: true
                },
                Created: {
                    $gte: sixMonths
                }
            }
        } );

    mongoose
        .connection
        .collections
        .records
        .ensureIndex( {
            Email: 1,
            Created: 1,
            Campaign: 1
        }, {
            unique: true,
            partialFilterExpression: {
                Email: {
                    $exists: true
                },
                Created: {
                    $gte: sixMonths
                }
            }
        } );

}