// FUNCTION CALLED FOR GENERATING TOKEN
//          APPID: PROVIDED BY AGORA
// APPCERTIFICATE: PROVIDED BY AGORA
//           user: NAME OF USER LOGGING IN
//  timeInSeconds: TIME THAT THE TOKEN SHOULD LAST FOR
function makeToken( APPID, APPCERTIFICATE, user, timeInSeconds )
{
    // OBTAIN UNIVERSAL TIME & ADD THE TIME THE TOKEN LASTS FOR
    var lastsUntil = parseInt( new Date( ).getTime( ) / 1000 ) + timeInSeconds;
    
    // ARRAY TO STORE TOKEN COMPONENTS
    var tokenItems = [];
    
    // PUSH SDK VERSION, ALWAYS "1"
    tokenItems.push( "1" );
    
    // PUSH APPID
    tokenItems.push( APPID );
    
    // PUSH TIME OF EXPIRATION
    tokenItems.push( lastsUntil );
    
    // PUSH MD5 HASH OF NEEDED COMPONENTS
    tokenItems.push( md5( user + APPID + APPCERTIFICATE + lastsUntil ) );
    
    // RETURN A STRING OF THE TOKEN ITEMS SEPARATED BY ":"
    return tokenItems.join( ":" );
}

// CONVENIENT FUNCTION THAT PRODUCES A TOEKN THAT LASTS ONE DAY
//          APPID: PROVIDED BY AGORA
// APPCERTIFICATE: PROVIDED BY AGORA
//           user: NAME OF USER BEING LOGGED IN
function getOneDayToken( APPID, APPCERTIFICATE, user )
{
    // RETURNS TOKEN THAT LASTS 1 DAY
    return makeToken( APPID, APPCERTIFICATE, user, 3600 * 24 );
}
