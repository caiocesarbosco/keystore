const userButton = document.getElementById("user-id");
var user = window.localStorage.getItem("Users");
userButton.value = "Use [" + user + "]";


document.getElementById("create-account-submit").onclick = redirectCreateAccount;
document.getElementById("import-account-submit").onclick = redirectImportAccount;
document.getElementById("import-file-submit").onclick = redirectImportFile;
userButton.onclick = redirectUserAuth;

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