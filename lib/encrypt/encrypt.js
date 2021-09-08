const config = require('./enums.js');
const utils = require('../utils/utils.js')
const { subtle } = require('crypto').webcrypto;

console.log(subtle);

/**Here we'll use feature flags to ready All those config parameters from a Config File */
const encrypt_algorithm = config.SYMMETRIC_ENCRYPT_ALGORITHM.AES_CTR;
const sign_algorithm = config.SIGN_ALGORITHM.HMAC;
const hash_algorithm = config.HASH_ALGORITHM.SHA_256;
const derive_key_algorithm = config.DERIVE_KEY_ALGORITHM.PBKDF2;
const iterations = config.ITERATIONS.STRONG;
const derived_key_size = config.KEYSIZE.SIZE_OF_128;
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

  let isValid = await subtle.verify({name: sign_algorithm}, key, signData, data);
  return isValid;
}

async function signKeyPairFile(data, key) {
  let signed = await subtle.sign({name: sign_algorithm}, key, data);
  return signed;
}

async function deriveKey(password) {

  let salt = utils.asciiToUint8Array("MySalt123456789");
  let encoder = new TextEncoder(32);
  let passwordKey = await subtle.importKey("raw", encoder.encode(password), derive_key_algorithm, false, config.KEY_USAGE.DERIVE);

  var kdfParams = {
      name: derive_key_algorithm,
      salt: salt,
      iterations: iterations,
      hash: hash_algorithm
  };

  var encriptAlgorithm = {name: encrypt_algorithm, length: derived_key_size};
  var signAlgorithm = {name: sign_algorithm, hash: hash_algorithm, length: derived_key_size};

  var signDerivedKey = await subtle.deriveKey(kdfParams, passwordKey, signAlgorithm, true, config.KEY_USAGE.SIGN_VERIFY);
  var encryptDerivedKey = await subtle.deriveKey(kdfParams, passwordKey, encriptAlgorithm, true, config.KEY_USAGE.ENCRYPT_DECRYPT);

  var derivedKey = {
      sign: signDerivedKey,
      encrypt: encryptDerivedKey
  }
  return derivedKey;
}

async function encryptsKeyPairFile(data, key, password) {
 
  var iv = utils.asciiToUint8Array("AnyRandomData012");
  var derivedKey = await deriveKey(password);
  var cipher = await subtle.encrypt({name: encrypt_algorithm, counter: iv, length: 32}, key, data);
  return cipher;
}

async function decryptsKeyPairFile(data, key) {
 
  var iv = utils.asciiToUint8Array("AnyRandomData012");
  var plainText = await subtle.decrypt({name: encrypt_algorithm, counter: iv, length: 32}, key, data);
  return plainText;
}

async function storingEncryptedUserKeyPairs(data, user, password) {

  var derivedKeys = await deriveKey(password);
  var encryptedData = await encryptsKeyPairFile(utils.asciiToUint8Array(JSON.stringify(data)), derivedKeys.encrypt, password);
  var signedData = await signKeyPairFile(encryptedData, derivedKeys.sign);
  var jsonEncriptedUserKeyPair = {
      "user": user,
      "encrypted": utils.bytesToHexString(encryptedData),
      "signed": utils.bytesToHexString(signedData)
  }
  appendUserKeyStore(jsonEncriptedUserKeyPair); 

}

async function decryptUserKeyPairs(user, password) {
  var encriptedUserKeyPairObj = getUserKeyRing(user);
  var derivedKeys = await deriveKey(password);
  var plainObj = await decryptsKeyPairFile(utils.hexStringToUint8Array(encriptedUserKeyPairObj.encrypted), derivedKeys.encrypt);
  var plainText = utils.bytesToASCIIString(plainObj);
  return plainText;
}

async function checkEncryptedUserKeyPair(user, password) {

  var derivedKeys = await deriveKey(password);

  var encriptedUserKeyPair = getUserKeyRing(user);

  var isVerified = await verifyHmac(derivedKeys.sign, utils.hexStringToUint8Array(encriptedUserKeyPair.signed), utils.hexStringToUint8Array(encriptedUserKeyPair.encrypted));

  return isVerified;

}

module.exports = {
  deriveKey: deriveKey,
  verifyHmac: verifyHmac,
  signKeyPairFile: signKeyPairFile
};