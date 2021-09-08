function resetCurrentUser() {
    window.localStorage.removeItem("Session-User");
    window.localStorage.removeItem("Session-PublicKey");
}

function setCurrentUser(user) {
    window.localStorage.setItem("Session-User", user);
} 

function getCurrentUser() {
    let sessionUser = window.localStorage.getItem("Session-User");
    return sessionUser;
}

function setCurrentPubKey(pubKey) {
    window.localStorage.setItem("Session-PublicKey", pubKey);
} 

function getCurrentPubKey() {
    let sessionPubKey = window.localStorage.getItem("Session-PublicKey");
    return sessionPubKey;
} 

function createKeyStoreFile(userKeyPair) {

    var userKeyStoreObj = {
        "users": new Array()
    }
    
    window.localStorage.setItem("keyStore", JSON.stringify(userKeyStoreObj));

    return userKeyStoreObj;

}

function getKeyStoreFile() {

    var userKeyStoreObj = JSON.parse(window.localStorage.getItem("keyStore"));
    if(userKeyStoreObj == null) {
        userKeyStoreObj = createKeyStoreFile();
    }
    return userKeyStoreObj;

}

function existKeyring(keyring) {

    var exist = false;
    var keyStore = getKeyStoreFile();
    keyStore.users.forEach(elem => {
        if(elem.user.toString() === keyring.user.toString() && elem.encrypted.toString() === keyring.encrypted.toString() && elem.signed.toString() === keyring.signed.toString()) {
            exist=true;
        } 
    })
    
    return exist;

}

function getUsers() {

    var users = new Array();
    var keyStore = getKeyStoreFile();
    keyStore.users.forEach(user => {
        users.push(user);
    })

    return users;
}

function importKeypair(public, private) {
    var keyPairObj = {
        "public": public,
        "private": private
    }
    return keyPairObj;
}

async function createKeyRing() {
    var keyPair = await generateKeyPair();
    var keyPairObj = {
        "public": keyPair.publicKey.toString().slice(2,32),
        "private": keyPair.privateKey.toString().slice(2,32)
    }
    return keyPairObj;
}

function getUserKeyRing(user) {

    var keyStore = getKeyStoreFile();
    let userStoredKeyring = keyStore.users.filter(userKeyring => userKeyring.user === user);
    return userStoredKeyring[0];

}

function getPrivateKey(user) {

}

function appendUserKeyStore(userkeyRing) {

    var keyStore = getKeyStoreFile();
    keyStore.users.push(userkeyRing);
    window.localStorage.setItem("keyStore", JSON.stringify(keyStore));

}

function isValidedImportKeyStore(file) {

    try {
        jsonObj = JSON.parse(file);
    } catch (e) {
        return false;
    }
    
    var isValid = true;
    if(jsonObj) {
        if(jsonObj.users) {
            jsonObj.users.forEach(user => {
                if(user["user"] === undefined || user["encrypted"] === undefined || user["signed"] === undefined) {
                    isValid = false;
                } 
            })
        } else {
            isValid = false;
        }

    } else {
        isValid = false;      
    }

    return isValid;

}

function importKeyStore(file) {

    jsonObj = JSON.parse(file);

    jsonObj.users.forEach(elem => {
        if(existKeyring(elem) === false) {
            appendUserKeyStore(elem);
        }
    })
 
}