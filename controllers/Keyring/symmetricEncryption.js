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
     * @param {string} password Username's Password 
     * @param {string} data serialized Raw Keyring Data
     */
    encrypt(password, data) {
        return this.encrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     * @param {string} data serialized Encrypted Keyring Data
     */
    decrypt(data, password) {
        return this.decrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     */
    deriveKey(password) {
        return this.deriveKey(password);
    }

    /**
     * @param data
     * @param password
     */
     sign(data, password) {
        return this.sign(data, password);
     }

     /**
      * @param password
      * @param signedData
      * @param data
      */
     verify(password, signedData, data) {
        return this.verify(password, signedData, data);
     }
}

module.exports = {
    SymmetricEncryptor: SymmetricEncryptor,
    SymmetricEncryptorInterface: SymmetricEncryptorInterface
}