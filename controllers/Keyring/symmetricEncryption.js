const encryptor = require('../../lib/encrypt/encrypt.js');
const implementjs = require('implement-js');
const { Interface, type } = implementjs;

/**
 * Interface definition for Encryptor Module used to encrypt/decrypt
 * Keyring saved on Local Store.
 * @interface SymmetricEncryptor
 */
 const SymmetricEncryptorInterface = Interface('SymmetricEncryptorInterface')(
    {
        encrypt: type('function'),
        decrypt: type('function')
    },
    {
        error: false,
        strict: false
    }
);

/**
 * Encryptor Module used to encrypt/decrypt Keyrings saved on Local Store
 * @class SymmetricEncryptor 
 */
class SymmetricEncryptor {
    
    constructor() {
        this.encrypt = encryptor.encryptsKeyPairFile;
        this.decrypt = encryptor.decryptsKeyPairFile;
        this.deriveKey = encryptor.deriveKey;
        this.sign = encryptor.signKeyPairFile;
        this.verify = encryptor.verifyHmac;
    }

    /**
     * @param {String} password Username's Password 
     * @param {String} data serialized Raw Keyring Data
     * @returns {Array} returns buffer containing encrypted data
     */
    encrypt(password, data) {
        return this.encrypt(data, password);
    }

    /**
     * @param {String} password Username's Password 
     * @param {Array} data serialized Encrypted Keyring Data
     * @returns {String} returns decrypted data as a string
     */
    decrypt(data, password) {
        return this.decrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     * @returns {Obj} returns a Object containing Two Symmetric Derived Keys: one for Signature other for Encryption Purposes. 
     */
    deriveKey(password) {
        return this.deriveKey(password);
    }

    /**
     * @param {String} data Data be Signed
     * @param {String} password Username's Password 
     * @returns {Array} returns a buffer containing Signed Data
     */
     sign(data, password) {
        return this.sign(data, password);
     }

     /**
      * @param {String} password Username's Password 
      * @param {Array} signedData buffer containing Signed Data
      * @param {String} data raw data to be compared with signed Data
      * @returns {boolean} return true if verification is right. Otherwise it must return false.
      */
     verify(password, signedData, data) {
        return this.verify(password, signedData, data);
     }
}

module.exports = {
    SymmetricEncryptor: SymmetricEncryptor,
    SymmetricEncryptorInterface: SymmetricEncryptorInterface
}