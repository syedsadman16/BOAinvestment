var express = require('express'),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var fs = require('fs');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');


 var Chatbot = function (){
   var assistant = new AssistantV1({
     version: '2018-09-20',
     iam_apikey: '0Cj8Uhwr7l9nAZz9XxP7jS7nfLpdcJWpBu14UAe5jGyn',
     url: 'https://gateway.watsonplatform.net/assistant/api'
   });

   var workspace_id = 'bff1a124-a94a-4082-a762-4a38e7f6d4b7';

   this.sendMessage = function(msg) {
        assistant.message({
          workspace_id: workspace_id,
          input: {'text': msg}
        },  function(err, response) {
          if (err)
            console.log('error:', err);
          else
            console.log(JSON.stringify(response, null, 2));
        });
     };
};


const _port = 3000;
var app = express();
var investo = new Chatbot();

// app.use(express.static(path.join(__dirname, "../agora.css")));
// app.use(express.static(path.join(__dirname, "../agora.js")));
// app.get("/",function(req,res){
//      res.sendFile(path.join(__dirname, "../agora.html"));
// });

app.listen(_port, function() { console.log('listening port '+_port+"\n__dirname : "+__dirname)});
