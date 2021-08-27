let submitButton = document.getElementById("import-keytore-submit");
let message = document.getElementById("feed-text");

submitButton.onclick = submitImportAccount;
document.getElementById("import-keytore-cancel").onclick = cancelCreateWallet;

function cancelCreateWallet() {
    window.location.href = 'entrypoint.html';
}

async function submitImportAccount() {
    var file = document.getElementById("inputfile").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            if(isValidedImportKeyStore(evt.target.result)) {
                importKeyStore(evt.target.result);
                window.location.href = 'entrypoint.html';
            } else {
                message.innerHTML = "invalid file format";
            }
        }
        reader.onerror = function (evt) {
            message.innerHTML = "error reading file";
        }
    }
}