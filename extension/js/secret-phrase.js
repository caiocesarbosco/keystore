let submitButton = document.getElementById("secret-phrase-ok-button");

submitButton.onclick = secretPhraseConfirm;

function secretPhraseConfirm() {
    window.location.href = 'main.html';
}