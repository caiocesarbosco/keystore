let message = document.getElementById("check-password-feedback-text");

var confirmButton = document.getElementById("check-password-confirm-button");
confirmButton.onclick = checkPassword;
document.getElementById("check-password-cancel-button").onclick = cancelCheckPassword;

function cancelCheckPassword() {
    window.location.href = 'main.html';
}

async function checkPassword() {
    var passwordInput = document.getElementById("pwd");
    const password = passwordInput.value;

    if(!password || password.lenght == 0) {
        message.innerHTML = "Please insert a Valid Password"
    } 
    
    else {

        var validPassword = await checkEncryptedUserKeyPair(password);

        if(validPassword == false) {
            message.innerHTML = "Confirmation does not match"
        } 
        
        else {
            var plainText = await decryptUserKeyPairs(password); 
            var jsonObj = JSON.parse(plainText);
            document.getElementById("check-password-main-text").innerHTML = "Private Key: " + jsonObj.private;
            confirmButton.disabled = true;
            passwordInput.disabled = true;
            confirmButton.style.display = "none";
            passwordInput.style.display = "none";
            message.style.display = "none";
        }
        
    }
}