var userDiv = document.createElement("div");
userDiv.setAttribute("class", "simple-text");
var userString = document.createElement('p');
let user = getCurrentUser();
userString.innerHTML = "User: " + user;
userDiv.appendChild(userString); 

var pubKeyString = document.createElement('p');
let pubKey = getCurrentPubKey();
pubKeyString.innerHTML = "Address: 0x"+ pubKey;
userDiv.appendChild(pubKeyString); 

var privateKey = document.createElement("button");
privateKey.setAttribute("class", "generic-button");
privateKey.textContent = "Check Private Key"
privateKey.onclick = CheckUserPassword;

var home = document.createElement("button");
home.setAttribute("class", "generic-button");
home.textContent = "Return Home"
home.onclick = ReturnHomeScreen;

let main = document.getElementById("main");

main.appendChild(userDiv); 
main.appendChild(privateKey);
main.appendChild(home); 


function CheckUserPassword() {
        window.location.href = 'check-password.html';
}

function ReturnHomeScreen() {
        window.location.href = 'entrypoint.html';
}
