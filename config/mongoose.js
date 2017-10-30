/**
 * Created by miles on 19/12/16.
 */

'use strict';

var config = require( './config' ),
    mongoose = require( 'bluebird' ).promisifyAll( require( 'mongoose' ) );
var indexer = require( '../services/CreateIndexes' );

module.exports = function ( isTest ) {
    var db;
    if ( isTest ) {
        db = mongoose.connect( config.test );
    }
    else {
        db = mongoose.connect( config.db );
    }

    require( '../models/user/user.server.model' );
    require( '../models/source/source-map.server.model' );
    require( '../models/source/source.server.model' );
    require( '../models/file/file.server.model' );
    require( '../models/list/list.server.model' );
    require( '../models/campaign/campaign.server.model' );
    require( '../models/client/client.server.model' );
    require( '../models/header/header.server.model' );
    require( '../models/record/dupe-record.server.model' );
    require( '../models/record/record.server.model' );
    require( '../models/exclusion/exclusion.server.model' );

    require( '../models/csDataSet/cs-dataset.server.model' );

    indexer.create();

    return db;
};