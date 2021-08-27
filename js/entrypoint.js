//window.localStorage.clear();
resetCurrentUser();
const main = document.getElementById("main");
var users = getUsers();

if(users.length != 0) {
    var orTextDiv = document.createElement("div");
    orTextDiv.setAttribute("class", "simple-text");
    var orTextDivString = document.createElement('p');
    orTextDivString.innerHTML = "Or";
    orTextDiv.appendChild(orTextDivString); 
    main.appendChild(orTextDiv);
}

var idx = 0;
users.forEach(userKeyring => {
    var user = document.createElement("button");
    user.id = userKeyring.user;
    user.setAttribute("class", "generic-button");
    user.textContent = "Use [" + userKeyring.user + "]";
    user.onclick = redirectUserAuth;
    main.appendChild(user);
})

/*var recover = document.createElement("button");
recover.id = "recover-account-id";
recover.setAttribute("class", "generic-button");
recover.textContent = "Recover Account";
main.appendChild(recover);*/

document.getElementById("create-account-submit").onclick = redirectCreateAccount;
document.getElementById("import-account-submit").onclick = redirectImportAccount;
//document.getElementById("import-file-submit").onclick = redirectImportFile;

function redirectCreateAccount() {
    window.location.href = 'create-wallet.html';
}

function redirectImportAccount() {
    window.location.href = 'import-account.html';
}

function redirectImportFile() {
}

function redirectUserAuth(event) {
    setCurrentUser(event.target.id);
    window.location.href = 'user-auth.html';
}