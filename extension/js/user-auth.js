let message = document.getElementById("user-auth-feedback-text");
let userObj = document.getElementById("user-auth-id");
let user = getCurrentUser();
userObj.innerHTML = user;

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

        var validPassword = await checkEncryptedUserKeyPair(user, password);

        if(validPassword == false) {
            message.innerHTML = "Confirmation does not match"
        } 
        
        else {
            var plainText = await decryptUserKeyPairs(user, password); 
            var jsonObj = JSON.parse(plainText);
            window.localStorage.setItem("Session-PublicKey", jsonObj.public.slice(0,31));
            window.location.href = 'main.html';
        }
        
    }
}