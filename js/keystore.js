function storageKeyFileExist() {

    test();
    publicKeys = window.localStorage.getItem("keyStorage");

    if(!publicKeys) {
        return false;
    } else {
        return true;
    }
}

async function generateKeyPair() {

    // Algorithm Object
    var algorithmKeyGen = {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),  // Equivalent to 65537
        hash: {
        name: "SHA-256"
        }
    };
    
    var algorithmSign = {
        name: "RSASSA-PKCS1-v1_5"
    };

    var keyPair = await crypto.subtle.generateKey(algorithmKeyGen, true, ["sign"]);
    return keyPair;

}

async function deriveKey(password) {

    let salt = asciiToUint8Array("MySalt");
    let encoder = new TextEncoder();
    let passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

    var kdfParams = {
        name: "PBKDF2",
        salt: salt,
        iterations: 262144,
        hash: "SHA-256"
    };

    var derivedAlgorithm = {name: 'AES-CBC', length: 128};
    var derivedKey = await crypto.subtle.deriveKey(kdfParams, passwordKey, derivedAlgorithm, true, ['encrypt', 'decrypt']);

    return derivedKey;
}

async function encryptsPrivateKeyFile(data, key, password) {
   
    var iv = asciiToUint8Array("AnyRandomData012");
    var derivedKey = await deriveKey(password);
    var cipher = await crypto.subtle.encrypt({name: 'AES-CBC', iv: iv}, key, data);
    return cipher;
}

async function test() {

    var password = "1234";
    let privateData = asciiToUint8Array("MyPrivateData");
    var derivedKey = await deriveKey(password);
    var cipher = await encryptsPrivateKeyFile(privateData, derivedKey, password);
    alert(bytesToHexString(cipher));
    /*var derivedKey = await deriveKey("1234");
    var expKey = await crypto.subtle.exportKey("jwk", derivedKey);
    var stringfiedKey = JSON.stringify(expKey);
    alert(stringfiedKey);*/



    //encryptsPrivateKeyFile();
}