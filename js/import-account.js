let submitButton = document.getElementById("import-account-submit-button");
let message = document.getElementById("import-account-feedback-text");

submitButton.onclick = submitImportAccount;
document.getElementById("import-account-cancel-button").onclick = cancelCreateWallet;

function cancelCreateWallet() {
    window.location.href = 'entrypoint.html';
}

async function submitImportAccount() {
    const user = document.getElementById("create-user").value;
    const publicKey = document.getElementById("create-public-key").value;
    const privateKey = document.getElementById("create-private-key").value;
    const password = document.getElementById("create-password").value;
    const confirm = document.getElementById("confirm-password").value;

    if(!user || user.lenght == 0) {
        message.innerHTML = "Please insert a Valid Username"
    } else if (!publicKey || publicKey.lenght == 0){
        message.innerHTML = "Please insert a Valid PublicKey"
    } else if (!privateKey || privateKey.lenght == 0){
        message.innerHTML = "Please insert a Valid PrivateKey"
    } else if (!password || password.lenght == 0) {
        message.innerHTML = "Please insert a Valid Password"
    } else if (!confirm || confirm.lenght == 0) {
        message.innerHTML = "Please confirm the Password"
    } else if (password != confirm) {
        message.innerHTML = "Confirmation does not match"
    } else {
        var keyring = importKeypair(publicKey, privateKey);
        await storingEncryptedUserKeyPairs(keyring, user, password);
        setCurrentUser(user);
        setCurrentPubKey(keyring.public);
        window.location.href = 'main.html';
    }
}