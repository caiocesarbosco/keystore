
var userList = document.getElementById("dynamic-users-list");
    
// Create a form synamically
var form = document.createElement("form");
form.setAttribute("class", "generic-form");

var userNumber = 1;
var account = document.createElement("div");
account.setAttribute("class", "simple-text");
var accountString = document.createElement('p');
accountString.innerHTML = "Account " + userNumber;
account.appendChild(accountString); 

var keyType = document.createElement("div");
keyType.setAttribute("class", "simple-text");
var keyTypeString = document.createElement('p');
keyTypeString.innerHTML = "Transaction Key";
keyType.appendChild(keyTypeString); 

var publicKey = document.createElement("div");
publicKey.setAttribute("class", "simple-text");
var publicKeyString = document.createElement('p');
publicKeyString.innerHTML = "0x0123456789";
publicKey.appendChild(publicKeyString); 

var privateKey = document.createElement("button");
privateKey.setAttribute("class", "generic-button");
privateKey.textContent = "Check Private Key"

userList.appendChild(form); 
form.appendChild(account); 
form.appendChild(keyType); 
form.appendChild(publicKey); 
form.appendChild(privateKey); 