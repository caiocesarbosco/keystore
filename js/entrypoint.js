const userButtonsParent = document.getElementById("user-buttons");
var users = getUsers();

if(users.length === 0) {
    document.getElementById("or-text").style.display = "none";
}

var idx = 0;
users.forEach(userKeyring => {
    var user = document.createElement("button");
    user.setAttribute("class", "generic-button");
    user.textContent = "Use [" + userKeyring.user + "]";
    user.onclick = redirectUserAuth;
    userButtonsParent.appendChild(user);
})


document.getElementById("create-account-submit").onclick = redirectCreateAccount;
document.getElementById("import-account-submit").onclick = redirectImportAccount;
document.getElementById("import-file-submit").onclick = redirectImportFile;

function redirectCreateAccount() {
    window.location.href = 'create-wallet.html';
}

function redirectImportAccount() {
}

function redirectImportFile() {
}

function redirectUserAuth() {
    window.location.href = 'user-auth.html';
}