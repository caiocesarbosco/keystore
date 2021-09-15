const jsstc = require('../../lib/jsstc/index.js');

const keyGenerator = jsstc.keypair;

/**
 * @classdesc A Simple Keyring Class. This Keyring can just hold keypairs that can't generate any other keypairs.
 */

class SimpleKeyring {
    
    /**
     * Constructor
     * @constructor
     */
    constructor(account) {
        /**
         * Account's Username
         * @type {String}
         */
        this.account = account;
        /**
         * A simple wallet holding Public and Private Keys
         * @type {Obj}
         */
        this.wallet = keyGenerator();
    }

    /**
     * account getter
     * @returns Return Keyring's Account Username
     */
    getAccount() {
        return this.account;
    }

    /**
     * public key getter
     * @returns Return Keyring's public key
     */
    getPublicKey() {
        return this.wallet.pub;
    }

    /**
     * private key getter
     * @returns Return Keyring's private key
     */
    getPrivateKey() {
        return this.wallet.priv;
    }

    /**
     * Decrypt Message
     * @param {string} account Username's Account
     */
    decryptMessage(account) {

    }

    /**
     * Export Account
     * @param {string} account Username's Account
     */
    exportAccount(account) {

    }

    /**
     * Remove Account
     * @param {string} account Username's Account
     */
     removeAccount(account) {

    }

}


module.exports = {
    SimpleKeyring:SimpleKeyring
};