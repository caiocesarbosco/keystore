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
privateKey.onclick = CheckUserPassword;

let main = document.getElementById("main");

main.appendChild(account); 
main.appendChild(keyType); 
main.appendChild(publicKey); 
main.appendChild(privateKey); 


function CheckUserPassword() {
        window.location.href = 'check-password.html';
}

