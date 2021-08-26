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
    return isValid;
}

async function signKeyPairFile(data, key) {
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

async function encryptsKeyPairFile(data, key, password) {
   
    var iv = asciiToUint8Array("AnyRandomData012");
    var derivedKey = await deriveKey(password);
    var cipher = await crypto.subtle.encrypt({name: 'AES-CTR', counter: iv, length: 32}, key, data);
    return cipher;
}

async function decryptsKeyPairFile(data, key) {
   
    var iv = asciiToUint8Array("AnyRandomData012");
    var plainText = await crypto.subtle.decrypt({name: 'AES-CTR', counter: iv, length: 32}, key, data);
    return plainText;
}

async function storingEncryptedUserKeyPairs(user, password) {

    var mockedContent = {
        "public": "01234",
        "private": "56789"
    }

    var derivedKeys = await deriveKey(password);
    var encryptedData = await encryptsKeyPairFile(asciiToUint8Array(JSON.stringify(mockedContent)), derivedKeys.encrypt, password);
    var signedData = await signKeyPairFile(encryptedData, derivedKeys.sign);
    var jsonEncriptedUserKeyPair = {
        "user": user,
        "encrypted": bytesToHexString(encryptedData),
        "signed": bytesToHexString(signedData)
    }
    appendUserKeyStore(jsonEncriptedUserKeyPair); 

}

async function decryptUserKeyPairs(user, password) {
    var encriptedUserKeyPairObj = getUserKeyRing(user);
    var derivedKeys = await deriveKey(password);
    var plainObj = await decryptsKeyPairFile(hexStringToUint8Array(encriptedUserKeyPairObj.encrypted), derivedKeys.encrypt);
    var plainText = bytesToASCIIString(plainObj);
    return plainText;
}

async function checkEncryptedUserKeyPair(user, password) {

    var derivedKeys = await deriveKey(password);

    var encriptedUserKeyPair = getUserKeyRing(user);

    var isVerified = await verifyHmac(derivedKeys.sign, hexStringToUint8Array(encriptedUserKeyPair.signed), hexStringToUint8Array(encriptedUserKeyPair.encrypted));

    return isVerified;

}