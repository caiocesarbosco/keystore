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

    let enc = new TextEncoder();
    let passwordKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

    var kdfParams = {
        name: "PBKDF2",
        salt: new Uint8Array(10),
        iterations: 262144,
        hash: "SHA-256"
    };

    var derivedAlgorithm = {name: 'aes-ctr', length: 128};
    var derivedKey = await crypto.subtle.deriveKey(kdfParams, passwordKey, derivedAlgorithm, true, ['encrypt', 'decrypt']);
    return derivedKey;
}

function encryptsPrivateKeyFile() {

    var data = asciiToUint8Array("hello");
    var iv = new Uint8Array(16);    
    var password = "1234";
    var iv = new Uint8Array(16);
    var derivedKey = deriveKey(password);
    crypto.subtle.encrypt({name: 'AES-CTR', iv: iv}, derivedKey, data);


}

async function test() {

    var derivedKey = await deriveKey("1234");
    var expKey = await crypto.subtle.exportKey("jwk", derivedKey);
    var stringfiedKey = JSON.stringify(expKey);
    alert(stringfiedKey);
}