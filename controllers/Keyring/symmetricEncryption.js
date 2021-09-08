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

        return {
            encrypt: this.encrypt,
            decrypt: this.decrypt,
            deriveKey: this.deriveKey,
            sign: this.sign,
            verify: this.verify
        }

    }

    /**
     * @param {string} password Username's Password 
     * @param {string} data serialized Raw Keyring Data
     */
    encrypt(password, data) {
        return encryptor.encrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     * @param {string} data serialized Encrypted Keyring Data
     */
    decrypt(password, data) {
        return encryptor.decrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     */
    deriveKey(password) {
        return encryptor.deriveKey(password);
    }

    /**
     * @param data
     * @param derivedKey
     */
     sign(data, derivedKey) {
        return encryptor.signKeyPairFile(data, derivedKey);
     }

     /**
      * @param derivedKey
      * @param signedData
      * @param data
      */
     verify(derivedKey, signedData, data) {
        return encryptor.verifyHmac(derivedKey, signedData, data);
     }
}

module.exports = {
    SymmetricEncryptor: SymmetricEncryptor,
    SymmetricEncryptorInterface: SymmetricEncryptorInterface
}