const constants = require('./enums.js');
const utils = require('../utils/utils.js');
const { subtle } = require('crypto').webcrypto;
const config = require('../config/config.js');
const configFile = require('../../config.json');
const crypto = subtle;
const settings = new config.Config(configFile["encryptor"]);

const encrypt_algorithm = settings.getParameter('encrypt_algoritm');
const sign_algorithm = settings.getParameter('sign_algorithm');
const hash_algorithm = settings.getParameter('hash_algorithm');
const derive_key_algorithm = settings.getParameter('derive_key_algorithm');
const iterations = settings.getParameter('iterations');
const derived_key_size = settings.getParameter('derived_key_size');

async function verifyHmac(key, signData, data) {

  let isValid = await crypto.verify({name: sign_algorithm}, key, signData, data);
  return isValid;
}

async function signKeyPairFile(data, key) {
  let signed = await crypto.sign({name: sign_algorithm}, key, data);
  return signed;
}

async function deriveKey(password) {

  let salt = utils.asciiToUint8Array("MySalt123456789");
  let encoder = new TextEncoder(32);
  let passwordKey = await crypto.importKey("raw", encoder.encode(password), derive_key_algorithm, false, constants.KEY_USAGE.DERIVE);

  var kdfParams = {
      name: derive_key_algorithm,
      salt: salt,
      iterations: iterations,
      hash: hash_algorithm
  };

  var encriptAlgorithm = {name: encrypt_algorithm, length: derived_key_size};
  var signAlgorithm = {name: sign_algorithm, hash: hash_algorithm, length: derived_key_size};

  var signDerivedKey = await crypto.deriveKey(kdfParams, passwordKey, signAlgorithm, true, constants.KEY_USAGE.SIGN_VERIFY);
  var encryptDerivedKey = await crypto.deriveKey(kdfParams, passwordKey, encriptAlgorithm, true, constants.KEY_USAGE.ENCRYPT_DECRYPT);

  var derivedKey = {
      sign: signDerivedKey,
      encrypt: encryptDerivedKey
  }
  return derivedKey;
}

async function encryptsKeyPairFile(data, password) {
 
  var iv = utils.asciiToUint8Array("AnyRandomData012");
  var derivedKey = await deriveKey(password);
  var cipher = await crypto.encrypt({name: encrypt_algorithm, counter: iv, length: 32}, derivedKey.encrypt, utils.asciiToUint8Array(data));
  return cipher;
}

async function decryptsKeyPairFile(data, password) {
 
  var iv = utils.asciiToUint8Array("AnyRandomData012");
  var derivedKey = await deriveKey(password);
  var plainText = await crypto.decrypt({name: encrypt_algorithm, counter: iv, length: 32}, derivedKey.encrypt, data);
  return utils.bytesToASCIIString(plainText);
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
  encryptsKeyPairFile: encryptsKeyPairFile,
  decryptsKeyPairFile: decryptsKeyPairFile,
  verifyHmac: verifyHmac,
  signKeyPairFile: signKeyPairFile
};