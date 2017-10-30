/**
 * Created by miles on 11/12/16.
 */
"use strict";

var express = require( "express" ),
    morgan = require( "morgan" ),
    passport = require( 'passport' ),
    helmet = require( 'helmet' ),
    compression = require( 'compression' ),
    minify = require( 'express-minify' ),
    bodyParser = require( "body-parser" ),
    cron = require( 'node-cron' ),
    Indexer = require( '../services/CreateIndexes' );


module.exports = function () {
    var app = express();

    app.use( compression() );
    // app.use(minify());

    app.use( helmet() );

    app.use( express.static( "./modules" ) );
    app.use( express.static( "./public" ) );

    app.use( morgan( "dev" ) );

    app.use( bodyParser.urlencoded( {
        extended: false
    } ) );
    app.use( bodyParser.json( {
        limit: "50mb"
    } ) );
    app.use( bodyParser.urlencoded( {
        limit: "50mb",
        extended: true,
        parameterLimit: 50000
    } ) );

    app.set( "views", "./public/view/" );
    app.set( "view engine", "ejs" );

    // updates the indexes on the records collection every day to ensure the 6 month index is updated
    cron.schedule( '* * * * Monday,Tuesday,Wednesday,Thursday,Friday', function () {
        Indexer.create();
    } );

    require( './passport' );

    app.use( passport.initialize() );

    require( "../modules/core/server/routes/core.server.routes" )( app );
    require( "../modules/campaigns/server/routes/campaigns.server.routes" )( app );
    require( "../modules/campaign/server/routes/campaign.server.routes" )( app );
    require( "../modules/upload/server/routes/upload.server.routes" )( app );
    require( "../modules/sources/server/routes/sources.server.routes" )( app );
    require( "../modules/download/server/routes/download.server.routes" )( app );
    require( "../modules/header/server/routes/header.server.routes" )( app );
    require( "../modules/lists/server/routes/lists.server.routes" )( app );
    require( "../modules/export/server/routes/export.server.routes" )( app );
    require( "../modules/authentication/server/routes/authentication.server.routes" )( app );
    require( "../modules/search/server/routes/search.server.routes" )( app );
    require( "../modules/files/server/routes/files.server.routes" )( app );
    require( "../modules/sources/server/routes/sourcemaps.server.routes" )( app );
    require( "../modules/searchrecords/server/routes/search-records.server.routes" )( app );

    app.use( function ( err, req, res, next ) {
        if ( err.name === 'UnauthorizedError' ) {
            res
                .status( 401 )
                .redirect( '/login' );
        }
    } );

    return app;
};