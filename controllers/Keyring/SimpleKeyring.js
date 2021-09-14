const jsstc = require('../../lib/jsstc/index.js');

const keyGenerator = jsstc.keypair;

/**
 * A Simple Keyring Class
 * @class Simple Keyring
 */

class SimpleKeyring {
    /**
     * Constructor
     * @constructor
     */
    constructor(account) {
        this.account = account;
        this.wallet = keyGenerator();
    }

    /**
     * Get account
     */
    getAccount() {
        return this.account;
    }

    /**
     * Get Public Keys
     */
    getPublicKey() {
        return this.wallet.pub;
    }

    /**
     * Get Private Key
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