let message = document.getElementById("user-auth-feedback-text");

document.getElementById("user-auth-confirm-button").onclick = checkPassword;
document.getElementById("user-auth-cancel-button").onclick = cancelCheckPassword;

function cancelCheckPassword() {
    window.location.href = 'entrypoint.html';
}

async function checkPassword() {
    const password = document.getElementById("user-auth-pwd").value;

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
            window.localStorage.setItem("Users", jsonObj.public);
            window.location.href = 'main.html';
        }
        
    }
}