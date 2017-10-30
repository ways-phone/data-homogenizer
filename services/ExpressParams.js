'use strict';
var mongoose = require( 'mongoose' ),
    Client = mongoose.model( 'Client' ),
    Header = mongoose.model( 'Header' ),
    Campaign = mongoose.model( 'Campaign' );

module.exports = {
    clientByAcronym: clientByAcronym,
    campaignByPath: campaignByPath,
    headerById: headerById
};

function clientByAcronym( req, res, next, acronym ) {

    if ( acronym === "search-records" ) return;

    Client
        .findOne( {
            Acronym: acronym
        } )
        .deepPopulate( 'Creator Campaigns Campaigns.Creator' )
        .then( function ( client ) {
            req.currentClient = client;
            next();
        } )
        .catch( function ( err ) {
            return next( new Error( 'Failed to load Charity ' + acronym ) );
        } );

}

function campaignByPath( req, res, next, path ) {

    Campaign
        .findOne( {
            Path: path,
            Client: req.currentClient._id
        } )
        .populate( 'Sources Files Lists' )
        .then( function ( campaign ) {
            req.campaign = campaign;
            next();
        } )
        .catch( function ( err ) {
            return next( new Error( "Failed to load Charity " + name ) );
        } );
};

function headerById( req, res, next, header_id ) {
    Header
        .findById( header_id )
        .then( function ( header ) {
            req.header = header;
            next();
        } )
        .catch( function ( error ) {
            return next( new Error( 'Failed to load Header: ' + header_id ) );
        } );
};