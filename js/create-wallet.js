let submitButton = document.getElementById("create-wallet-submit-button");
let message = document.getElementById("create-wallet-feedback-text");

submitButton.onclick = submitCreateWallet;
document.getElementById("create-wallet-cancel-button").onclick = cancelCreateWallet;

function cancelCreateWallet() {
    window.location.href = 'entrypoint.html';
}

function submitCreateWallet() {
    const password = document.getElementById("create-password").value;
    const confirm = document.getElementById("confirm-password").value;

    if(!password || password.lenght == 0) {
        message.innerHTML = "Please insert a Valid Password"
    } else if (!confirm || confirm.lenght == 0) {
        message.innerHTML = "Please confirm the Password"
    }else if (password != confirm) {
        message.innerHTML = "Confirmation does not match"
    } else {
        window.location.href = 'secret-phrase.html';
    }
}