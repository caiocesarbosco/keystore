function resetCurrentUser() {
    window.localStorage.removeItem("Session-User");
}

function setCurrentUser(user) {
    window.localStorage.setItem("Session-User", user);
} 

function getCurrentUser() {
    let sessionUser = window.localStorage.getItem("Session-User");
    return sessionUser;
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

function getUsers() {

    var users = new Array();
    var keyStore = getKeyStoreFile();
    keyStore.users.forEach(user => {
        users.push(user);
    })

    return users;
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