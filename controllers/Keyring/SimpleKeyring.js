const jsstc = require('../../lib/jsstc/index.js');

const keyGenerator = jsstc.keypair;

function isValid(param) {
    if(param != null && param != undefined)
        return true;
    else
        return false;
}

/**
 * @classdesc A Simple Keyring Class.
 */

class SimpleKeyring {

    #wallet;
    
    /**
     * Constructor
     * @constructor
     */
    constructor(userName, masterKey) {

        let account = {
            account: userName,
            type: "master",
            masterKey: masterKey
        };

        /**
         * Array of Account Dictionaries
         * @type {Obj}
         */
        this.#wallet = [
            {
                "account": account
            }
        ];
    }

    /**
     * accounts getter
     * @returns Return Keyring's Account's Usernames
     */
    getAccounts() {
        return this.#wallet.map((elem) => elem["account"].account);
    }

    /**
     * add New Account into Keyring
     * @param {Obj} account New account
     */
    addAccount(userName, data, type) {

        if(isValid(userName) && isValid(data)) {

            let account = {};

            switch(type) {
                default:
                    account = {
                        account: userName,
                        type: "subaccount",
                        masterKey: data
                    };
            }

            this.#wallet.push({
                "account": account
            });
            console.log("Added Account: " + account);
            console.log("Keyring: " + this.#wallet);

        }

        else {
            console.log("Invalid Account Data");
        }
        
    }

    /**
     * public key getter
     * @returns Return Keyring's public key
     */
    getPublicKey() {
        //return this.wallet.pub;
    }

    /**
     * private key getter
     * @returns Return Keyring's private key
     */
    getPrivateKey() {
        //return this.wallet.priv;
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