let submitButton = document.getElementById("create-wallet-submit-button");
let message = document.getElementById("create-wallet-feedback-text");

submitButton.onclick = submitCreateWallet;
document.getElementById("create-wallet-cancel-button").onclick = cancelCreateWallet;

function cancelCreateWallet() {
    window.location.href = 'entrypoint.html';
}

async function submitCreateWallet() {
    const user = document.getElementById("create-user").value;
    const password = document.getElementById("create-password").value;
    const confirm = document.getElementById("confirm-password").value;

    if(!user || user.lenght == 0) {
        message.innerHTML = "Please insert a Valid Username"
    }
    else {
        if(!password || password.lenght == 0) {
            message.innerHTML = "Please insert a Valid Password"
        } else if (!confirm || confirm.lenght == 0) {
            message.innerHTML = "Please confirm the Password"
        } else if (password != confirm) {
            message.innerHTML = "Confirmation does not match"
        } else {
            await storingEncryptedUserKeyPairs(user, password);
            window.location.href = 'secret-phrase.html';
        }
    }    
}