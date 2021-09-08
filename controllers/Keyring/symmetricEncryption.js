const encryptor = require('../../lib/encrypt.js');

/**
 * Encryptor Module used to encrypt/decrypt Keyrings saved on Local Store
 * @class SymmetricEncryptor 
 */
class SymmetricEncryptor {
    /**
     * @param {string} password Username's Password 
     * @param {string} data serialized Raw Keyring Data
     */
    encrypt(password, data) {
        encryptor.encrypt(data, password);
    }

    /**
     * @param {string} password Username's Password 
     * @param {string} data serialized Encrypted Keyring Data
     */
    decrypt(password, data) {
        encryptor.decrypt(data, password);
    }
}