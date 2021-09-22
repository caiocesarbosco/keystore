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
    constructor(userName, masterKey, obj, exist) {

        if(exist === true) {

            this.#wallet = [];
            obj.forEach(element => {
                this.#wallet.push({
                    "account": element
                });
            });

        }

        else {

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
        
    }

    /**
     * accounts getter
     * @returns Return Keyring's Account's Usernames
     */
    getAccounts() {
        return this.#wallet.map((elem) => elem["account"].account);
    }

    /**
     * keyring getter
     * @returns Return Keyring
     */
    getKeyring() {
        return this.#wallet.map((elem) => elem["account"]);
    }

    /**
     * add New Account into Keyring
     * @param {Obj} account New account
     */
    addAccount(userName, data, type) {

        if(isValid(userName) && isValid(data)) {

            if(this.getKeyring().find(elem => elem["account"] == userName) === undefined) {

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
                return true;
            }
            else {
                return false;
            }

        }

        else {
            return false;
        }
        
    }

    /**
     * public key getter
     * @returns Return Keyring's public key
     */
    getPublicInfo() {
        let publicInfo = [];
        this.getKeyring().forEach(
            elem => {
                publicInfo.push({
                    "account": elem.account,
                    "type": elem.type
                });
            }
        );
        return publicInfo;
    }

    /**
     * private key getter
     * @param {String} username Account's Username
     * @returns Return Keyring's private key
     */
    getPrivateInfo(userName) {
        let account = this.getKeyring().find(elem => elem["account"] == userName);
        return account === undefined ? [] : account.masterKey;
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
        let keyring = this.getKeyring();
        keyring = keyring.filter(elem => elem["account"] != account);
        this.#wallet = [];
        keyring.forEach(element => {
            this.#wallet.push({
                "account": element
            });
        });
    }

}


module.exports = {
    SimpleKeyring:SimpleKeyring
};