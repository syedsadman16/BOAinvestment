var messages = document.getElementById("messages");
var textbox = document.getElementById("textbox");
var sendbutton = document.getElementById("sendbutton");
var recipient = document.getElementById("sendto");
// THIS IS THE MESSAGING CLASS, TO SEND MESSAGES AND ATTACHMENTS
var commHandler = function( )
{
    // THE AGORA APPID & CERTIFICATE FOR MESSAGING
    var APPID_MSG = "48bc64a23f6149b88f84624692640347";
    var APPCERTIFICATE_MSG = "c407a178afb94117bd860d1f045b3a28";

    // THE AGORA APPID & CERTIFICATE FOR ATTACHMENTS
    var APPID_ATTACH = "dd3789b534f14f479bdafafdeab56a0f";
    var APPCERTIFICATE_ATTACH = "bb22d04f37f34a288a6de172a104eedf";

    // THE AGORA APPID & CERTIFICATE FOR SIGNALS: VIDEO CALL REQUESTS
    var APPID_SIG = "7c78b97f65e746acac7322a6563b4cea";
    var APPCERTIFICATE_SIG = "cccdcd912f484aa99b96aae98e5105d5";

    // TEMPORARY APPID FOR VIDEO CALLING
    var videoAPPID = "41c860e5c1c847b996a2b8efd8274a2c";

    // MUTE AGORA API LOG ON CONSOLE
    AgoraRTC.Logger.setLogLevel( AgoraRTC.Logger.NONE );

    // THE USER CURRENTLY LOGGED IN
    var user = null;
    var uid = null;

    // THE AGORA SIGNALING OBJECTS
    var signal_msg = Signal( APPID_MSG );
    var signal_attach = Signal( APPID_ATTACH );
    var signal_sig = Signal( APPID_SIG );

    // THE MESSAGING, ATTACHMENTS, AND SIGNAL SESSIONS
    var session_msg = null;
    var session_attach = null;
    var session_sig = null;

	// BOOLEAN TO KNOW IF WEB SDK IS SUPPORTED
	var webSDKSupport = false;

    // THE VIDEO CLIENT OBJECT OF THE USER
    var client = null;

    // THE CHANNEL NAME OF THE CURRENT VIDEO CALL
    var channel = null;

    // THE LOCAL VIDEO STREAM OF THE USER
    var userStream = null;

    // VIDEO QUALITY OF CURRENT VIDEO CALL
    var localVideoProfile = "720P_3";

    // USER LOGIN FUNCTION
    // USER NEEDS TO LOG IN TO USE THE MESSAGING FUNCTIONS
    // user: USERNAME
    this.login = function( username )
    {
		// CHECK IF BROWSER SUPPORTS THE WEB SDK
		webSDKSupport = this.checkBrowser( );

		// OUTPUT A WARNING IF THE BROWSER DOES NOT SUPPORT THE WEB SDK
		if( !webSDKSupport )
		{
            console.log( "WARNING: Agora Web SDK not supported." );
        }

        // STORE USERNAME BEING LOGGED IN (BASE64)
        user = btoa( username );

        // LOG USER IN WITH TOKEN, CREATE MESSAGING OBJECT
        session_msg = signal_msg.login( user, getOneDayToken( APPID_MSG, APPCERTIFICATE_MSG, user ) );
        session_attach = signal_attach.login( user, getOneDayToken( APPID_ATTACH, APPCERTIFICATE_ATTACH, user ) );
        session_sig = signal_sig.login( user, getOneDayToken( APPID_SIG, APPCERTIFICATE_SIG, user ) );

        // LOGIN SUCCESS CALLBACK
        session_msg.onLoginSuccess = function( uid )
        {
            console.log( "USER: " + atob( user ) + " | LOGGED IN!" );
            console.log( "MSG UID: " + uid );
        };

        // LOGIN FAILURE CALLBACK
        session_msg.onLoginFailed = function( ecode )
        {
            console.log( "MSG LOGIN ERROR: " + ecode );
        };

        // LOGIN SUCCESS CALLBACK
        session_attach.onLoginSuccess = function( uid )
        {
            console.log( "USER: " + atob( user ) + " | LOGGED IN!" );
            console.log( "ATTACH UID: " + uid );
        };

        // LOGIN FAILURE CALLBACK
        session_attach.onLoginFailed = function( ecode )
        {
            console.log( "ATTACH LOGIN ERROR: " + ecode );
        };

        // LOGIN SUCCESS CALLBACK
        session_sig.onLoginSuccess = function( uid )
        {
            console.log( "USER: " + atob( user ) + " | LOGGED IN!" );
            console.log( "SIGNAL UID: " + uid );
        };

        // LOGIN FAILURE CALLBACK
        session_sig.onLoginFailed = function( ecode )
        {
            console.log( "SIGNAL LOGIN ERROR: " + ecode );
        };

        // chattingWith: AN ARRAY THAT STORES THE USERNAMES
        // OF USERS, THIS SESSION, HAS RECEIVED OR SENT MESSAGES TO
        // THE IDEA IS THAT EACH OF THESE USERNAMES MATCH THE
        // NAME OF A HTML ELEMENT WHERE THE CHAT IS BEING PRINTED
        session_msg.chattingWith = [];

        // CALLBACK FOR RECEIVING TEXT MESSAGES IS RECEIVED
        session_msg.onMessageInstantReceive = function( from, uid, msg )
        {
            // STORES THE HTML ELEMENT WHERE THE MESSAGE RECEIVED
            // WILL BE PRINTED ON
            var chat = null;

            // IF THE USERNAME OF THE MESSAGE RECEIVED DOES NOT
            // HAVE AN HTML ELEMENT — IS NOT IN THE ARRAY
            if( this.chattingWith.indexOf( from ) == -1 )
            {
                // PLACE THE NAME OF THE USER BEING SPOKEN TO INTO THE ARRAY
                this.chattingWith.push( from );

                // CREATE A NEW HTML ELEMENT DEDICATED TO THIS USER
                // chat = document.createElement('div');
                //
                // // IMPORTANT: MAKE THE ID OF THE HTML ELEMENT
                // // THE SAME AS THE USERNAME OF THE USER BEING SPOKEN TO.
                // // EVERY TIME A MESSAGE IS SENT OR RECEIVED, THE MESSAGES
                // // WILL BE PRINTED ON THIS HTML ELEMENT
                // chat.id = from;
                //
                // // THE NAME OF THE USER BEING SPOKEN TO, GIVE THE
                // // HTML ELEMENT A BORDER, & ATTACH THE CHAT TITLE
                // var title = document.createTextNode( "CHAT: " + atob( from ) );
                // chat.setAttribute("style", "background-color: lightblue; border-style: double; text-align: center;" );
                // chat.appendChild( title );
                //
                // // ATTACH THE NEW CHAT ELEMENT TO THE HTML BODY
                // document.body.appendChild( chat );
            }

            // CREATE AN HTML ELEMENT FOR THE MESSAGE
            // var message = document.createElement('div');
            // var text = document.createTextNode( atob( from ) + ": " + msg );
            // message.setAttribute( "style", "text-align: left;" );
            //
            // // ATTACH THE TEXT TO THE ELEMENT
            // message.appendChild( text );
            //
            // // IMPORTANT: OBTAIN THE RESPECTIVE HTML ELEMENT WITH THE ID,
            // // IT WILL MATCH THE NAME OF A USER BEING SPOKEN TO AND
            // // PLACE THE MESSAGE THERE
            // document.getElementById( from ).appendChild( message );

            // IF IT IS A REGULAR MESSAGE
            console.log( "FROM: " + atob( from ) + " | MESSAGE: " + msg );
            var newMessage = document.createElement("p");
            var chatbubble = document.createElement("div");
            chatbubble.style = 'margin-left:110px; width:13em; background: gray; border-radius:10px;';
            newMessage.innerHTML = msg;
            newMessage.style = 'margin:10px; padding:6px; color:white;';
            chatbubble.appendChild(newMessage);
            messages.appendChild(chatbubble);
        };

        // attachData: IS A STRING THAT IS UPDATED WHEN
        // AN ATTACHMENT CHUNK IS RECEIVED
        session_attach.attachData = null;

        // CALLBACK FOR RECEIVING ATTACHMENT CHUNKS
        session_attach.onMessageInstantReceive = function( from, uid, msg )
        {
            if( checkIfAttachment( msg ) )
            {
                // IF IT IS AN ATTACHMENT CHUNK, ADD TO THE CURRENT DATA,
                // OR CONVERT FROM BASE64 AND DOWNLOAD
                this.attachData = receiveInChunks( this.attachData, msg );
            }
        };

        // CALLBACK FOR SENDING SIGNALS: VIDEO CALL PROCESS
        session_sig.onMessageInstantReceive = function( from, uid, msg )
        {
            // WHEN RECEIVING A VIDEO CALL REQUEST
            if( msg.substring( 0, 13 ) == "CALL_REQUEST:" )
            {
                console.log( "VIDEO CALL REQUEST FROM: " + atob( from ) );

                // CREATE ACCEPT BUTTON
                var accept = document.createElement( 'button' );
                accept.id = "acceptVideoCall";
                accept.innerHTML = "Accept";
                document.body.appendChild( accept );

                // CREATE DECLINE BUTTON
                var decline = document.createElement( 'button' );
                decline.id = "declineVideoCall";
                decline.innerHTML = "Decline";
                document.body.appendChild( decline );

                // UPON PRESSING EITHER REMOVE BUTTONS
                function removeButtons( )
                {
                    accept.parentNode.removeChild( accept );
                    decline.parentNode.removeChild( decline );
                };

                // WHEN PRESSING THE ACCEPT BUTTON
                accept.onclick = function( )
                {
                    console.log( "VIDEO CALL ACCEPTED!" );
                    removeButtons( );

                    // SEND RESPONSE BACK TO SENDER
                    session_sig.messageInstantSend( from, "CALL_REQUEST_ACCEPTED" );

                    // JOIN THE VIDEO CHANNEL USING CHANNEL NAME + PASSWORD
                    joinVideoCall( msg.substring( 13, 141 ), msg.substring( 142 ) );
                };

                // WHEN PRESSING THE DECLINE BUTTON
                decline.onclick = function( )
                {
                    console.log( "VIDEO CALL DECLINED!" );
                    removeButtons( );

                    // SEND RESPONSE BACK TO SENDER
                    session_sig.messageInstantSend( from, "CALL_REQUEST_DECLINED" );
                };
            }
            // IF A CALL REQUEST WAS ACCEPTED
            else if( msg == "CALL_REQUEST_ACCEPTED" )
            {
                console.log( "VIDEO CALL ACCEPTED BY: " + atob( from ) );
            }
            // IF A CALL REQUEST WAS DECLINED
            else if( msg == "CALL_REQUEST_DECLINED" )
            {
                console.log( "VIDEO CALL DECLINED BY: " + atob( from ) );
            }
        };
    };

    // SAMPLE FUNCTION THAT ILLUSTRATES ACCESS TO THE NAMES OF
    // USERS BEING MESSAGED BY THE USER
    this.showChattingWith = function( )
    {
        // IF USER HAS LOGGED IN
        if( session_msg )
        {
            // TRAVERSE THE chattingWith ARRAY OF NAMES
            console.log( atob( user ) + " IS CHATTING WITH:" );
            for( var index = 0; index < session_msg.chattingWith.length; index++ )
            {
                console.log( session_msg.chattingWith[ index ] );
            }
        }
    };

    // FUNCTION TO SEND MESSAGES ( ONCE LOGGED IN )
    //  to: USER RECEIVING THE MESSAGE
    // msg: MESSAGE
    this.sendMessage = function( to, msg )
    {
        // IF USER HAS LOGGED IN
        if( session_msg )
        {
            // IF THE NAME OF THE USER WHOM THIS MESSAGE IS
            // DIRECTED TO DOES NOT HAVE AN HTML ELEMENT — IS NOT IN THE ARRAY
            if( session_msg.chattingWith.indexOf( btoa( to ) ) == -1 )
            {
                // PLACE THE NAME OF THE USER BEING SPOKEN TO INTO THE ARRAY
                session_msg.chattingWith.push( btoa( to ) );

                // CREATE A NEW HTML ELEMENT DEDICATED TO THIS USER
                // chat = document.createElement('div');
                //
                // // IMPORTANT: MAKE THE ID OF THE HTML ELEMENT
                // // THE SAME AS THE USERNAME OF THE USER BEING SPOKEN TO.
                // // EVERY TIME A MESSAGE IS SENT OR RECEIVED, THE MESSAGES
                // // WILL BE PRINTED ON THIS HTML ELEMENT
                // chat.id = btoa( to );
                //
                // // THE NAME OF THE USER BEING SPOKEN TO, GIVE THE
                // // HTML ELEMENT A BORDER, & ATTACH THE CHAT TITLE
                // var title = document.createTextNode( "CHAT: " + to );
                // chat.setAttribute( "style", "background-color: lightblue; border-style: double; text-align: center;" );
                // chat.appendChild( title );
                //
                // // ATTACH THE NEW CHAT ELEMENT TO THE HTML BODY
                // document.body.appendChild( chat );
            }

            // CREATE AN HTML ELEMENT FOR THE MESSAGE
            // var message = document.createElement('div');
            // var text = document.createTextNode( atob( user ) + ": " + msg );
            // message.setAttribute( "style", "text-align: right;" );
            //
            // // ATTACH THE TEXT TO THE ELEMENT
            // message.appendChild( text );
            //
            // // IMPORTANT: OBTAIN THE RESPECTIVE HTML ELEMENT WITH THE ID,
            // // IT WILL MATCH THE NAME OF A USER BEING SPOKEN TO AND
            // // PLACE THE MESSAGE THERE
            //document.getElementById( btoa( to ) ).appendChild( message );

            // CALL THE MESSAGING OBJECT
            session_msg.messageInstantSend( btoa( to ), msg );
            console.log("Msg Sent!");
        }
    };

    // FUNCTION TO SEND A SINGLE MESSAGE TO MULTIPLE USERS
    // recipients: AN ARRAY OF USERNAMES
    //        msg: THE MESSAGE BEING SENT
    this.sendMessageToMultiple = function( recipients, msg )
    {
        // IF THE LIST OF RECIPIENTS IS AN ARRAY
        if( recipients.constructor === Array )
        {
            // TRAVERSE THE RECIPIENTS ARRAY
            for( var index = 0; index < recipients.length; index++ )
            {
                // CHECK IF THE OBJECT WITHIN THE ARRAY IS A STRING
                // SEND THE MESSAGE TO THAT USER
                if( recipients[ index ].constructor === String )
                {
                    this.sendMessage( recipients[ index ], msg );
                }
            }
        }
    };

    // FUNCTION TO RETURN THE SELECTED FILE
    // THIS FUNCTION CAN BE CHANGED AS LONG AS
    // return: File OBJECT
    function uploadAttachment( )
    {
        return document.getElementById('attachment').files[ 0 ];
    };

    // FUNCTION TO SEND ATTACHMENTS ( ONCE LOGGED IN )
    // to: USER RECEIVING THE MESSAGE
    this.sendAttachment = function( to )
    {
        // THE FILE IS RETRIEVED
        var attachment = uploadAttachment( );

        // IF USER IS LOGGED IN AND A FILE IS RETRIEVED
        if( session_attach && attachment )
        {
            // DECLARE FILE READER
            var reader = new FileReader( );

            // OBTAIN FILENAME
            var fileName = attachment.name;

            // READ FILE AS A STRING OF BYTES
            reader.readAsBinaryString( attachment );

            // PASS THE MESSAGING OBJECT TO SEND THE FILE
            reader.session_attach = session_attach;

            // ONCE THE FILE READER AS READ THE ENTIRE FILE
            reader.onload = function( )
            {
                // CONVERT THE FILE TO BASE64, SEND IT IN CHUNKS
                sendInChunks( this.session_attach, btoa( to ), fileName, reader.result );
            };
        }
    };

    // FUNCTION TO SET THE LOCAL VIDEO QUALITY
    // profile: STRING REPRESENTING AN AGORA QUALITY IDENTIFIER
    this.setLocalVideoProfile = function( profile )
    {
        localVideoProfile = profile;
    };

    // FUNCTION TO SEND A VIDEO CALL REQUEST TO MULTIPLE USERS
    // recipients: AN ARRAY OF USERNAMES
    this.requestVideoCall = function( recipients )
    {
        // IF THE LIST OF RECIPIENTS IS AN ARRAY
        if( session_sig && recipients.constructor === Array )
        {
            // CREATE 64 BYTE CHANNEL NAME AND 256 BIT PASSWORD
            var channel = new Uint8Array( 64 );
            var password = new Uint8Array( 32 );

            // GENERATE CHANNEL NAME AND PASSWORD
            window,crypto.getRandomValues( channel );
            window.crypto.getRandomValues( password );

            // SETUP CALL REQUEST SIGNAL
            var MARKER = "CALL_REQUEST:";

            // APPEND THE CHANNEL NAME TO THE SIGNAL TAG IN HEX
            for( var index = 0; index < channel.length; index++ )
            {
                MARKER = MARKER.concat( ( ( channel[ index ] & 0xF0 ) >> 4 ).toString( 16 ) );
                MARKER = MARKER.concat( ( ( channel[ index ] & 0x0F ) >> 0 ).toString( 16 ) );
            }

            // APPEND SEPARATOR
            MARKER = MARKER + ":";

            // APPEND THE PASSWORD TO THE SIGNAL TAG IN HEX
            for( var index = 0; index < password.length; index++ )
            {
                MARKER = MARKER.concat( ( ( password[ index ] & 0xF0 ) >> 4 ).toString( 16 ) );
                MARKER = MARKER.concat( ( ( password[ index ] & 0x0F ) >> 0 ).toString( 16 ) );
            }

            // JOIN THE CHANNEL FOR THE VIDEO CALL
            joinVideoCall( MARKER.substring( 13, 141 ), MARKER.substring( 142 ) );

            // TRAVERSE THE RECIPIENTS ARRAY
            for( var index = 0; index < recipients.length; index++ )
            {
                // CHECK IF THE OBJECT WITHIN THE ARRAY IS A STRING
                if( recipients[ index ].constructor === String )
                {
                    // SEND CALL REQUEST SIGNAL TO RECEPIENTS
                    // FORMAT: "CALL_REQUEST:<CHANNEL_NAME>:<PASSWORD>"
                    session_sig.messageInstantSend( btoa( recipients[ index ] ), MARKER );
                }
            }
        }
    };

    // FUNCTION TO JOIN A CHANNEL FOR VIDEO CALLING
    // channelName: THE NAME OF THE CHANNEL ATTEMPTING TO JOIN
    //    password: THE PASSWORD FOR THE CHANNEL BEING JOINED
    function joinVideoCall( channelName, password )
    {
        // OBTAIN CLIENT INSTANCE FROM AGORA
        client = AgoraRTC.createClient( { mode: "h264_interop" } );

        // FUNCTION FOR CLIENT INITIALIZATION FAILURE
        function onInitializeFail( ecode )
        {
            console.log( "CLIENT ERROR: " + ecode );
        };

        // INITIALIZE CLIENT OBJECT
        client.init( videoAPPID, null, onInitializeFail );

        // IF THE BROWSER HAS VIDEO SDK SUPPORT
        // IF THE CLIENT WAS INITIALIZED SUCCESFULLY
        // IF A USER IS CURRENTLY LOGGED IN
        if( webSDKSupport && client && user )
        {
            // FUNCTION FOR SUCCESS IN JOINING CHANNEL
            function onJoinSuccess( uid )
            {
                // OUTPUT THE NAME OF CHANNEL JOINED, OUTPUT ITS UID
                console.log( "CHANNEL: " + channel + " | JOINED!");
                console.log( "UID: " + uid );

                // CREATE THE USER LOCAL VIDEO/AUDIO STREAM
                userStream = AgoraRTC.createStream( { streamID: uid, audio: true, video: true, screen: false } );

                // FUNCTION FOR SUCCESSFUL LOCAL VIDEO/AUDIO STREAM INITIALIZATION
                function onCreationSuccess( )
                {
                    // OUTPUT MESSAGE, OUTPUT THE STREAM UID
                    console.log( "LOCAL STREAM CREATION SUCCESSFUL!" );
                    console.log( "LOCAL STREAM ID: " + userStream.getId( ) );

                    // OBTAIN HTML ELEMENT FOR DISPLAYING THE LOCAL VIDEO STREAM
                    var video = document.getElementById( "Local_Display" );

                    // DISPLAY LOCAL VIDEO STREAM
                    userStream.play( video.id );

                    // FUNCTION FOR SUCCESSFULLY PUBLISHING THE LOCAL
                    // VIDEO STREAM ON THE CHANNEL
                    function onPublicSuccess( event )
                    {
                        console.log( "LOCAL STREAM PUBLISHED!" );
                    };

                    // FUNCTION FOR FAILURE IN PUBLISHING THE LOCAL
                    // VIDEO STREAM ON THE CHANNEL
                    function onPublishFail( ecode )
                    {
                        console.log( "LOCAL STREAM PUBLISH ERROR: " + ecode );
                    };

                    // DESIGNATE CALLBACK FUNCTION ON SUCCESS
                    client.on( 'stream-published', onPublicSuccess );

                    // PUBLISH LOCAL VIDEO STREAM ON CHANNEL
                    // DESIGNATE CALLBACK FOR FAILURE
                    client.publish( userStream, onPublishFail );
                };

                // FUNCTION FOR FAILURE IN LOCAL VIDEO/AUDIO STREAM INITIALIZATION
                function onCreationFail( ecode )
                {
                    console.log( "STREAM ERROR: " + ecode );
                };

                // INITIALIZE LOCAL VIDEO STREAM
                // DESIGNATE CALLBACKS FOR SUCCESS AND FAILURE
                userStream.init( onCreationSuccess, onCreationFail );
            };

            // FUNCTION FOR FAILURE IN JOINING CHANNEL
            function onJoinFailed( ecode )
            {
                console.log( "JOIN CHANNEL ERROR: " + ecode );
            };

            // STORE CHANNEL NAME
            channel = channelName;

            // SET ENCRYPTION LEVEL FOR SENDING VIDEO DATA TO AGORA
            client.setEncryptionMode( "aes-256-xts" );

            // SET CHANNEL PASSWORD
            client.setEncryptionSecret( password );

            // JOIN CHANNEL & DESIGNATE CALLBACKS FOR SUCCESS AND FAILURE
            client.join( null, channelName, null, onJoinSuccess, onJoinFailed );

            // FUNCTION FOR RECEIVING REMOTE VIDEO/AUDIO STREAMS
            function incomingStream( event )
            {
                // RETRIEVE THE REMOTE VIDEO/AUDIO STREAM
                var remoteStream = event.stream;

                // OUTPUT ONCE STREAM IS RECEIVED AND ITS UID
                console.log( "INCOMING REMOTE STREAM!" );
                console.log( "REMOTE STREAM ID: " + remoteStream.getId( ) );

                // FUNCTION FOR FAILURE IN SUBSCRIBING TO REMOTE STREAM
                function onSubscriptionFailed( ecode )
                {
                    console.log( "REMOTE STREAM SUBSCRIPTION ERROR: " + ecode );
                };

                // SUBSCRIBE TO REMOTE AUDIO/VIDEO STREAM IN ORDER TO VIEW IT
                // AND DESIGNATE CALLBACK FOR FAILURE
                client.subscribe( remoteStream, onSubscriptionFailed );
            };

            // DESIGNATE CALLBACK FOR INCOMING VIDEO/AUDIO STREAM
            client.on( 'stream-added', incomingStream );

            // FUNCTION FOR SUCESSFUL SUBSCRIPTION TO REMOTE
            // AUDIO/VIDEO STREAM
            function onSubscriptionSuccess( event )
            {
                // RETRIEVE THE REMOTE VIDEO/AUDIO STREAM
                var remoteStream = event.stream;

                // OUTPUT ONCE STREAM IS SUBSCRIBED TO
                console.log( "REMOTE STREAM SUBSCRIBED!" );

                // CREATE NEW HTML ELEMENT TO DISPLAY
                // TO DISPLAY REMOTE VIDEO STREAM
                var video = document.createElement( 'div' );
                video.id = "Remote_Display" + remoteStream.getId( );
                video.style.width = "640px";
                video.style.height = "480px";
                video.style.display = "inline-block";
                video.style.float = "left";

                // ATTACH THE NEW HTML ELEMENT TO THE HTML BODY
                document.body.appendChild( video );

                // DISPLAY REMOTE VIDEO STREAM
                remoteStream.play( video.id );
            };

            // DESIGNATE CALLBACK FOR SUCCESSFUL SUBSCRIPTION TO
            // REMOTE AUDIO/VIDEO STREAM
            client.on( 'stream-subscribed', onSubscriptionSuccess );
        }
    };

    // FUNCTION TO TERMINATE CURRENT VIDEO CALL ON THE USER END
    this.endVideoCall = function( )
    {
        // IF CLIENT HAS BEEN INITIALIZED
        // IF CHANNEL HAS BEEN JOINED
        if( client && channel )
        {
            // FUNCTION FOR SUCCESSFULLY LEAVING A CHANNEL
            function onLeaveSuccess( )
            {
                console.log( "CHANNEL: " + channel + " | CLOSED!" );

                // STOP & CLOSE LOCAL VIDEO STREAM
                userStream.stop( );
                userStream.close( );

                // RESET CHANNEL NAME, CLIENT, LOCAL VIDEO/AUDIO STREAM
                channel = null;
                client = null;
                userStream = null;
            };

            // FUNCTION FOR FAILURE IN LEAVING A CHANNEL
            function onLeaveFailed( ecode )
            {
                console.log( "ERROR CHANNEL CLOSING: " + ecode );
            };

            // LEAVE CURRENT CHANNEL & DESIGNATE
            // CALLBACKS FOR SUCCESS AND FAILURE
            client.leave( onLeaveSuccess, onLeaveFailed );
        }
    };

    // FUNCTION TO PUBLISH THE LOCAL VIDEO/AUDIO STREAM
    this.publishLocalStream = function( )
    {
        // IF CLIENT IS INITIALIZED
        // IF THE LOCAL STREAM IS INITIALIZED
        if( client && userStream )
        {
            client.publish( userStream );
        }
    };

    // FUNCTION TO UNPUBLISH THE LOCAL VIDEO/AUDIO STREAM
    this.unpublishLocalStream = function( )
    {
        // IF CLIENT IS INITIALIZED
        // IF THE LOCAL STREAM IS INITIALIZED
        if( client && userStream )
        {
            client.unpublish( userStream );
        }
    };

    // FUNCTION TO PLAY LOCAL VIDEO/AUDIO STREAM
    // HTML_ElementID: ID TAG OF HTML ELEMENT TO DISPLAY LOCAL VIDEO/AUDIO STREAM
    this.playLocalStream = function( HTML_ElementID )
    {
        if( userStream )
        {
            userStream.play( HTML_ElementID );
        }
    };

    // FUNCTION TO STOP LOCAL VIDEO/AUDIO STREAM
    this.stopLocalStream = function( )
    {
        if( userStream )
        {
            userStream.stop( );
        }
    };

    // FUNCTION TO PAUSE LOCAL VIDEO STREAM
    this.pauseLocalVideoStream = function( )
    {
        if( userStream )
        {
            userStream.disableVideo( );
        }
    };

    // FUNCTION TO RESUME LOCAL VIDEO STREAM
    this.resumeLocalVideoStream = function( )
    {
        if( userStream )
        {
            userStream.enableVideo( );
        }
    };

    // FUNCTION TO PAUSE LOCAL AUDIO STREAM
    this.pauseLocalAudioStream = function( )
    {
        if( userStream )
        {
            userStream.disableAudio( );
        }
    };

    // FUNCTION TO RESUME LOCAL AUDIO STREAM
    this.resumeLocalAudioStream = function( )
    {
        if( userStream )
        {
            userStream.enableAudio( );
        }
    };

    // FUNCTION TO CLOSE LOCAL VIDEO/AUDIO STREAM
    this.closeLocalStream = function( )
    {
        if( userStream )
        {
            userStream.close( );
        }
    };

    // LOGOUT FUNCTION
    this.logout = function( )
    {
        // IF USER IS LOGGED IN
        if( session_msg && session_attach && session_sig )
        {
            console.log( "USER: " + atob( user ) + " | LOGGED OUT!" );

            // RELEASE THE MESSAGING OBJECT, AND LOGOUT USER
            session_msg.logout( );
            session_attach.logout( );
            session_sig.logout( );

            session_msg = null;
            session_attach = null;
            session_sig = null;
            user = null;
        }

        // IF A VIDEO CALL IS CURRENTLY ONGOING
        if( client )
        {
            // RELEASE CLIENT ELEMENTS, AND CLOSE LOCAL VIDEO STREAM
            client.leave( );
            userStream.close( );

            client = null;
            userStream = null;
        }
    };

    // FUNCTION TO CHECK FOR BROWSER VIDEO SDK SUPPORT
	this.checkBrowser = function( )
	{
		return AgoraRTC.checkSystemRequirements( );
	};
};


sendbutton.addEventListener("click", function(){
  var newMessage = document.createElement("p");
  var chatbubble = document.createElement("div");
  chatbubble.style = 'max-width:13em; background: #1aa3ff; border-radius:10px;';
  if(textbox.value != ""){
    newMessage.innerHTML = textbox.value;
    newMessage.style = 'margin:10px; padding:6px; color:white;';
    chatbubble.appendChild(newMessage);
    messages.appendChild(chatbubble);
    API.sendMessage(recipient,textbox.value);
    textbox.value = "";
  }
});
