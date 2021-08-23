var keystoreFounded = false;

if(keystoreFounded === true) {
    window.location.href = 'user-auth.html';
}

document.getElementById("create-wallet-submit").onclick = redirectCreateWallet;

function redirectCreateWallet() {
    window.location.href = 'create-wallet.html';
}