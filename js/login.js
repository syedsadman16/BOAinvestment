var loginbutton = document.getElementById("login");
var username = document.getElementById("username");

loginbutton.addEventListener("click", function(){
  if(username.value != ""){
    localStorage.setItem('username', username.value);
    window.open("agora.html");
  }
});
