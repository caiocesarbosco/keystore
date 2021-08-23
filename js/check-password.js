let message = document.getElementById("check-password-feedback-text");

document.getElementById("check-password-confirm-button").onclick = checkPassword;
document.getElementById("check-password-cancel-button").onclick = cancelCheckPassword;

function cancelCheckPassword() {
    window.location.href = 'main.html';
}

function checkPassword() {
    const password = document.getElementById("pwd").value;

    if(!password || password.lenght == 0) {
        message.innerHTML = "Please insert a Valid Password"
    } else if (password != "1234") {
        message.innerHTML = "Confirmation does not match"
    } else {
        window.location.href = 'private-key.html';
    }
}