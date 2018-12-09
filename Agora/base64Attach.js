// FUNCTION THAT CONVERTS FILE DATA INTO BASE64,
// BREAKS IT UP INTO CHUNKS AND SENDS IT AS MESSAGES
//  session: THE MESSAGING OBJECT
//       to: THE USER TO SEND THE ATTACHMENT TO
// fileName: THE NAME OF THE ATTACHMENT BEING SENT
//  content: THE ATTACHMENT DATA AS A BINARY STRING
function sendInChunks( session, to, fileName, content )
{
    // THIS CONSTANT IS THE MAX NUMBER OF BYTES SENT PER CHUNK
    var max_msg = 16000;
    
    // SEQUENCE REPRESENTING MESSAGES THAT ARE PART OF AN ATTACHMENT, IN BASE64
    var header = "CHUNK";
    
    console.log( "FILENAME: " + fileName );
    console.log( "FILESIZE: " + content.length );
    
    // CONVERTS FILE DATA INTO BASE64
    content = btoa( content );
    
    // CALCULATES THE NUMBER OF CHUNKS
    // AND THE SIZE OF THE LAST CHUNK
    var chunks = Math.floor( content.length / max_msg );
    var remainder = content.length % max_msg;
    
    // VARIABLE TO STORE THE CHUNK AND THE START
    // INDEX OF THE FILE DATA WE ARE SENDING
    var msg = "";
    var index = 0;
    
    // VARIABLE THAT DESIGNATES CHUNK TYPE:
    // 'A' = FIRST CHUNK
    // 'B' = INTERMEDIATE CHUNK ( NOT FIRST OR LAST )
    // 'C' = LAST CHUNK
    // 'D' = FIRST AND ONLY CHUNK
    var type = 'A';
    
    // CONVERT THE SIZE OF THE FILENAME INTO PRINTABLE CHARACTERS
    var nameSize = new Array( 2 );
    nameSize[ 0 ] = String.fromCharCode( ( ( fileName.length & 0xF0) >> 4 ) + 32 );
    nameSize[ 1 ] = String.fromCharCode( ( fileName.length & 0x0F ) + 32 );
    
    // PAD THE START OF THE FILENAME WITH '0' CHARACTERS
    fileName = fileName.padStart( 128, '0' );
    
    // PROCESS CHUNKS AND SEND AS MESSAGES
    while( chunks )
    {
        // ATTACH HEADER, TYPE, FILENAME SIZE, AND FILE DATA CHUNK
        msg = header + type + nameSize[ 0 ] + nameSize[ 1 ] + fileName;
        msg = msg + content.substring( index, index + max_msg );
        
        // SEND ATTACHMENT CHUNK
        session.messageInstantSend( to, msg );
        
        // INCREMENT INDEX TO THE START OF NEXT CHUNK
        index = index + max_msg;
        
        // IF WE ARE AT THE LAST CHUNK AND THERE IS NO REMAINDER
        if( chunks == 1 && remainder == 0 )
        {
            // CHANGE TYPE TO LAST CHUNK
            type = 'C';
        }
        else
        {
            // CHANGE TYPE TO INTERMEDIATE CHUNK
            type = 'B';
        }
        
        // DECREMENT THE NUMBER OF CHUNKS
        chunks--;
    }
    
    // IF THERE IS A LAST CHUNK THAT IS LESS THAN msg_max BYTES
    if( remainder )
    {
        // IF chunks WAS ORGINALLY ZERO, IT NEVER ENTERED THE WHILE LOOP
        // TYPE IS STILL 'A', AND IT MEANS THE THE LAST CHUNK IS THE ONLY CHUNK
        if( type == 'A' )
        {
            // CHANGE TYPE TO FIRST AND ONLY CHUNK
            type = 'D';
        }
        else
        {
            // CHANGE TYPE TO LAST CHUNK
            type = 'C';
        }
        
        // ATTACH HEADER, TYPE, FILENAME SIZE, AND FILE DATA CHUNK
        msg = header + type + nameSize[ 0 ] + nameSize[ 1 ] + fileName;
        msg = msg + content.substr( index );
        
        // SEND ATTACHMENT CHUNK
        session.messageInstantSend( to, msg );
    }
}

// FUNCTION TO CHECK IF A MESSAGE IS PART OF AN ATTACHMENT
// msg: THE MESSAGE RECEIVED
function checkIfAttachment( msg )
{
    // THE TOTAL SIZE OF THE HEADER
    var headerSize = 136;
    
    // SINCE THE REMAINING CHARS OF THE 128 CHARS DEDICATED TO
    // THE FILENAME ARE PADDED WITH '0's, WE TAKE A SUBSTRING OF
    // THIS STRING TO VERIFY THAT THE FILENAME IS PADDED CORRECTLY
    var pad = "00000000000000000000000000000000000000000000000000000000000000000000"
            + "000000000000000000000000000000000000000000000000000000000000";
    
    // THE HEADER SIGNATURE
    var header = "CHUNK";
    
    //  THE SIZE OF THE FILENAME
    var nameSize = 0;
    
    // IF HEADER SIGNATURE DOES NOT MATCH, RETURN FALSE
    if( msg.substring( 0, 5 ) != header ){ return 0; }
    
    // IF TYPE IS NOT (A,B,C,D), RETURN FALSE
    if( msg[ 5 ] != 'A' && msg[ 5 ] != 'B' && msg[ 5 ] != 'C' && msg[ 5 ] != 'D' ){ return 0; }
    
    // OBTAIN THE SIZE OF THE FILENAME
    nameSize = ( ( msg.charCodeAt( 6 ) - 32 ) << 4 ) | ( msg.charCodeAt( 7 ) - 32 );
    
    // IF FILENAME IS NOT CORRECTLY PADDED WITH '0's, RETURN FALSE
    if( msg.substring( 8, headerSize - nameSize ) != pad.substring( 0, 128 - nameSize ) ){ return 0; }
        
    // OTHERWISE, RETURN TRUE
    return 1;
}

// FUNCTION THAT HANDLES THE ATTACHMENT CHUNK BASED ON ITS TYPE
// attachData: THE DATA OF THE ATTACHMENT FROM PREVIOUS CHUNKS
//    content: THE ATTACHMENT CHUNK RECEIVED
function receiveInChunks( attachData, content )
{
    // THIS CONSTANT CONTAINS THE TOTAL SIZE OF THE CHUNK HEADER
    var headerSize = 136;
    
    if( content[ 5 ] == 'A' )
    {
        // IF TYPE 'A' CHUNK, FIRST CHUNK, WE STORE THE CHUNK CONTENT
        // AND IGNORE THE CONTENT THAT CAME BEFORE IT, STARTING FRESH
        attachData = content.substring( headerSize );
    }
    else if( content[ 5 ] == 'B' )
    {
        // IF TYPE 'B' CHUNK, INTERMEDIATE CHUNK, WE STORE THE CHUNK
        // CONTENT WITH THE DATA THAT CAME BEFORE IT
        attachData = attachData + content.substring( headerSize );
    }
    else if( content[ 5 ] == 'C' )
    {
        // IF TYPE 'C' CHUNK, LAST CHUNK, WE STORE THE CHUNK CONTENT
        // AND GRANT ACCESS FOR DOWNLOADING, AS THE FILE IS COMPLETE
        
        // STORE THE SIZE OF THE FILENAME
        var nameSize = ( ( content.charCodeAt( 6 ) - 32 ) << 4 ) | ( content.charCodeAt( 7 ) - 32 );
        
        // EXTRACT THE FILENAME FROM THE CHUNK
        var fileName = content.substring( headerSize - nameSize, headerSize );
        
        // STORE THE DATA FROM THE LAST CHUNK
        attachData = attachData + content.substring( headerSize );
        
        // SUBMIT FILENAME AND COMPLETE FILE DATA FOR DOWNLOAD
        readyToDownload( fileName, attachData );
        
        // RESET STORAGE AS THE FILE IS COMPLETE
        attachData = null;
    }
    else if( content[ 5 ] == 'D' )
    {
        // IF TYPE 'D' CHUNK, FIRST AND ONLY CHUNK, WE STORE THE CHUNK
        // CONTENT AND GRANT ACCESS FOR DOWNLOADING, AS THE FILE IS COMPLETE
        
        // STORE THE SIZE OF THE FILENAME
        var nameSize = ( ( content.charCodeAt( 6 ) - 32 ) << 4 ) | ( content.charCodeAt( 7 ) - 32 );
        
        // EXTRACT THE FILENAME FROM THE CHUNK
        var fileName = content.substring( headerSize - nameSize, headerSize );
        
        // STORE THE DATA FROM CHUNK
        attachData = content.substring( headerSize );
        
        // SUBMIT FILENAME AND FILE DATA FOR DOWNLOAD
        readyToDownload( fileName, attachData );
        
        // RESET STORAGE AS THE FILE IS COMPLETE
        attachData = null;
    }
    
    // RETURN THE NEW DATA + OLD DATA, OR null.
    return attachData;
}

// FUNCTION THAT CREATES THE DOWNLOAD HREF ELEMENT
//   filename: NAME OF FILE
// attachData: FILE DATA IN BASE64
function readyToDownload( fileName, attachData )
{
    // CONVERT FILE DATA FROM BASE64
    attachData = atob( attachData );
    
    console.log( "ATTACHMENT RECEIVED!" );
    console.log( "FILENAME: " + fileName );
    console.log( "FILESIZE: " + attachData.length );
    
    // STORES THE FILE DATA IN THE FORM OF 8 BIT NUMBERS ( 0 - 255 )
    var attachInBytes = new Uint8Array( attachData.length );
    
    // CONVERTS THE FILE DATA FROM CHAR TO 8 BIT NUMBERS
    for( var index = 0; index < attachData.length; index++ )
    {
        attachInBytes[ index ] = attachData.charCodeAt( index );
    }
    
    // CREATES BLOB TO SUBMIT FILE DATA AS A URL
    var downloadBlob = new Blob( [ attachInBytes ] );
    
    // CREATES HREF ELEMENT & LINKS IT TO THE HTML PAGE
    var link = document.createElement('a');
    document.body.appendChild( link );

    // CREATES DOWNLOAD URL OF FILE DATA & SETS THE FILENAME
    link.href = URL.createObjectURL( downloadBlob );
    link.download = fileName;
    
    // HANDLER FUNCTION NEED TO APPEND "click( )" ACTION TO BUTTON
    var handler = function( ){ downloadClick( link, handler ); };
    
    // ATTACH HANDLER TO BUTTON
    document.getElementById('downButton').addEventListener( "click", handler );
}

// FUNCTION THAT IS CALLED WHEN BUTTON IS CLICKED
function downloadClick( link, handler )
{
    // DETACH ACTION FROM BUTTON, BUTTON WILL ONLY ALLOW FILE TO BE DOWNLOADED ONCE
    document.getElementById('downButton').removeEventListener( "click", handler );
    
    // ACTIVATES DOWNLOAD ACTION
    link.click( );
}
