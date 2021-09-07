const SimpleKeyring = require('SimpleKeyring');

/**
 * HD Keyring
 * @class HdKeyring 
 */
class HdKeyring extends SimpleKeyring {

    /**
     * Constructor
     * @constructor
     */
    constructor(config) {
        this.seed = null;
        this.mnemonic = null;
        this.rootKey = null;
    }

    /**
     * Serialize
     */
    serialize() {

    }

    /**
     * deserialize
     */
     deserialize() {

    }

    /**
     * Add Account
     * @param {string} account Username's Account
     */
    addAccount(account) {

    }

    /**
     * Get Accounts
     */
    getAccounts() {

    }

    /**
     * initFromMnemonics
     * @param {string} mnemonic Mnemonic
     */ 
    initFromMnemonics(mnemonic) {
        
    }

}