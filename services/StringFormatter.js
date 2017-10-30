'use strict';

module.exports = {
    capitalize: capitalize
};

// capitalizes a sentence passed to it
function capitalize( string ) {
    if ( string.indexOf( " " ) !== -1 ) {
        var arr = string.split( " " );
        var capitals = arr.map( capitalizeWord );
        return capitals.join( " " );
    }
    else {
        return capitalizeWord( string );
    }
}
// capitalizes a single word
function capitalizeWord( string ) {
    return string
        .charAt( 0 )
        .toUpperCase() + string
        .slice( 1 )
        .toLowerCase();
}