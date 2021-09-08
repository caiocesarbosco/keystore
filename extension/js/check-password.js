let message = document.getElementById("check-password-feedback-text");

var confirmButton = document.getElementById("check-password-confirm-button");
confirmButton.onclick = checkPassword;
document.getElementById("check-password-cancel-button").onclick = cancelCheckPassword;

var userDiv = document.getElementById("check-password-address-text");
var userString = document.createElement('p');
let user = getCurrentUser();
userString.innerHTML = "User: " + user;
userDiv.appendChild(userString); 

var pubKeyString = document.createElement('p');
let pubKey = getCurrentPubKey();
pubKeyString.innerHTML = "Address: 0x"+ pubKey;
userDiv.appendChild(pubKeyString); 

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

        var validPassword = await checkEncryptedUserKeyPair(user, password);

        if(validPassword == false) {
            message.innerHTML = "Confirmation does not match"
        } 
        
        else {
            var plainText = await decryptUserKeyPairs(user, password); 
            var jsonObj = JSON.parse(plainText);
            document.getElementById("check-password-main-text").innerHTML = "Private Key: 0x" + jsonObj.private.slice(0,31);
            confirmButton.disabled = true;
            passwordInput.disabled = true;
            confirmButton.style.display = "none";
            passwordInput.style.display = "none";
            message.style.display = "none";
        }
        
    }
}