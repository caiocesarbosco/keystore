/**
 * This function create a Private/Public Keypair 
 * using STC Chain API
 * @returns keyPair
 */

async function generateKeyPair() {

  var keyPair = {
      "publicKey": Math.random(32),
      "privateKey": Math.random(32)
  }
  
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

async function storingEncryptedUserKeyPairs(data, user, password) {

  var derivedKeys = await deriveKey(password);
  var encryptedData = await encryptsKeyPairFile(asciiToUint8Array(JSON.stringify(data)), derivedKeys.encrypt, password);
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