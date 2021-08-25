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

async function verifyHmac(key, signData, data) {

    let isValid = await crypto.subtle.verify({name: 'HMAC'}, key, signData, data);
    alert(isValid);
}

async function signPrivateKeyFile(data, key) {
    let signed = await crypto.subtle.sign({name: 'HMAC'}, key, data);
    return signed;
}

async function deriveKey(password) {

    let salt = asciiToUint8Array("MySalt123456789");
    let encoder = new TextEncoder(32);
    let passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

    var kdfParams = {
        name: "PBKDF2",
        salt: salt,
        iterations: 262144,
        hash: "SHA-256"
    };

    var encriptAlgorithm = {name: 'AES-CTR', length: 128};
    var signAlgorithm = {name: 'HMAC', hash:'SHA-256'};

    var signDerivedKey = await crypto.subtle.deriveKey(kdfParams, passwordKey, signAlgorithm, true, ['sign', 'verify']);
    var encryptDerivedKey = await crypto.subtle.deriveKey(kdfParams, passwordKey, encriptAlgorithm, true, ['encrypt', 'decrypt']);

    var derivedKey = {
        sign: signDerivedKey,
        encrypt: encryptDerivedKey
    }
    return derivedKey;
}

async function encryptsPrivateKeyFile(data, key, password) {
   
    var iv = asciiToUint8Array("AnyRandomData012");
    var derivedKey = await deriveKey(password);
    var cipher = await crypto.subtle.encrypt({name: 'AES-CTR', counter: iv, lenght: 32}, key, data);
    return cipher;
}

async function test() {

    let privateData = asciiToUint8Array("MyPrivateData");
    var password = "1234";
    var derivedKey = await deriveKey(password);
    var signedData = await signPrivateKeyFile(privateData, derivedKey.sign);
    let changedPrivateData = asciiToUint8Array("MyChangedPrivateData");
    await verifyHmac(derivedKey.sign, signedData, changedPrivateData);
}