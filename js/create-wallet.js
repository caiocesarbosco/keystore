const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}

const storageKey = () => {
    const key = 'publicKeys';
    const value = { name: '0x0123456789'};

    const promise = toPromise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);

            resolve(value);
        });
    });
} 

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
        storageKey();
        window.location.href = 'secret-phrase.html';
    }
}

