var user = document.getElementById("username");
var send = document.getElementById("sendbutton");
var to = document.getElementById("to");
var textfield = document.getElementById("txt");
var op = document.getElementById("b");
var log = document.getElementById("login");
var grow = document.getElementById("c");
var clickCount = 2;

log.addEventListener("click", function() {  
    if(user.value != ""){
  
    op.style.backgroundColor = "green";
    grow.style.height = "600px";  
    clickCount++;
    } 
    else {
        alert("Please log in");
    }
});

op.addEventListener("click", function() {  
    
    op.style.backgroundColor = "green";
    grow.style.height = "600px";   
    clickCount++;
    
    if( (clickCount%2==0)) {
        grow.style.height = "0px";
        op.style.backgroundColor = "blue";
    }
       
});

/*
send.addEventListener("click", function() {
    if(to.value != ""){
      if(textfield.value != ""){
        localStorage.setItem("texts",textfield.value);
        localStorage.setItem("to",to.value);
        textfield.value="";
      } 
    }
    
    
});
*/
