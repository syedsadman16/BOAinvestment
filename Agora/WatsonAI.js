var messages = document.getElementById("messages");

function updateScroll(){
    messages.scrollTop = messages.scrollHeight;
}

function chatbot(msg) {
var session = {
  "async": true,
  "crossDomain": true,
  "url": "https://gateway.watsonplatform.net/assistant/api/v2/assistants/47464c0c-2752-4103-8dd3-b7d5dbae7484/sessions?version=2018-11-08",
  "method": "POST",
  "headers": {
    "Authorization": "Basic YXBpa2V5OjBDajhVaHdyN2w5bkFaejlYeFA3alM3bmZMcGRjSldwQnUxNFVBZTVqR3lu"
  },
  "data": {}
}
$.ajax(session).done(function (response) {
  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://gateway.watsonplatform.net/assistant/api/v2/assistants/47464c0c-2752-4103-8dd3-b7d5dbae7484/sessions/"+response.session_id+"/message?version=2018-11-08",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Basic YXBpa2V5OjBDajhVaHdyN2w5bkFaejlYeFA3alM3bmZMcGRjSldwQnUxNFVBZTVqR3lu"
  },
  "processData": false,
  "data": "{\"input\": {\"text\": \""+msg+"\"}}"
}

$.ajax(settings).done(function (response) {
  for (var i=0; i<response.output.generic.length; i++) {
    console.log(response.output.generic[0].text);
    var newMessage = document.createElement("p");
    newMessage.innerHTML = response.output.generic[i].text;
    newMessage.style = 'margin-left:auto; width:max-content; max-width:200px; padding:10px; color:white; background:gray; border-radius:15px; word-wrap: break-word';
    messages.appendChild(newMessage);
    updateScroll();
  }
});
});
}
