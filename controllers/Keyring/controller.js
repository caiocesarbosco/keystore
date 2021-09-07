const encryptor = require('encrypt');
/**
 * Enum for Keyring Types:
 * 
 *      SIMPLE_KEYRING: A ring which holds simple independent's Keypairs.
 *      HD_KEYRING: A ring which holds Hierarchical Deterministics Keypairs.
 *      @enum Enums Keyrings Type
 */
const KeyringType = {
    SIMPLE_KEYRING: 0,
    HD_KEYRING:1
};

Object.freeze(KeyringType);

/**
 * A Keyring class to handle Keyring's Operations just inside RAM Memory
 * @class RamStore
 */

class RamStore {
    constructor(params) {
        this.isLocked = true;
        this.keyrings = [];
    }
}

/**
 * @class Keyrings Controller
 */

class KeyringController {

    /**
     * 
     * @param {Obj} params 
     */
    constructor(params) {
        /** Keyring Type Enum: Simple or HD*/
        this.type = params.type;
        /** State Object would be extended from a Emitter or Observable Class in Future*/
        this.state = {};
        /** Store Class which will persist Keyrings on Local Storage*/
        this.store = {};
        /** Ram Store Class which will temporary holds keyrings on an Local Array of Keyrings*/
        this.ramStore = new RamStore(params);
        /** Used to temporary holds User's Extension Password */
        this.password = null;
        /** Encryption Module for: Derive, Encrypt & Decrypt with AES Algorithm using User's Password*/
        this.encryptor = encryptor; 
    }

    /**
     *      emit a update signal for all listeners;
     *      update any interval state;
     *      @emit update event
     */
    fullUpdate() {

    }

    /**
     *      assert null on local password;
     *      erase keyrings Array values;
     *      emit a "lock" event for all listeners;
     *      update any internal state;
     * @emits lock event
     */
    setLocked() {

    }

    /**
     *      
     *      emit "unlock" event for all listeners;
     *      update any internal state;
     *      restore on RamStore the Persisted User Keyrings;
     * @emits unlock event
     */
    setUnlocked() {

    }

    /**
     * 
     *      submit User's password to encrypt all Keyring Array as a Vault into Local Store;
     *      @param {string} password User's Password
     */
    submitPassword(password) {

    }

    /**
     * 
     *      verify User's password checking signature of encrypted data on Local Store;
     *      @param {string} password User's Password
     */
     verifyPassword(password) {

    }

    /**
     *      Add a new Keyring
     *      @param {Obj} keyring 
     */
    addNewKeyring(keyring) {

    }

    /**
     *      Remove Empty Keyrings
     */
    removeEmptyKeyring() {

    }

    /**
     * Check for Duplicate Keyrings
     */
    checkForDuplicates() {

    }

    /**
     * Add New Account
     * @param {string} account A Username Account
     */
    addNewAccount(account) {

    }

    /**
     * Export Account
     * @param {string} account A Username Account
     */
    exportAccount(account) {

    }

    /**
     * Remove Account
     * @param {string} account A Username Account
     */
    removeAccount(account) {

    }

    /**
     * get Encryption Public Keys
     * @param {string} account A Username Account
     */
    getEncryptPublicKey(account) {

    }

    /**
     * Decrypt Message
     * @param {string} account A Username Account
     */
    decryptMessage(account) {

    }

    /**
     * Persist All Keyrings
     */
    persistAllKeyrings() {

    }

    /**
     * Get Keyring by Type
     * @param {KeyringType} type Keyring Type
     */
    getKeyringByType(type) {

    }

    /**
     * get Accounts
     */
    getAccounts() {

    }

    /**
     * Get Keyring by Account
     * @param {string} account A Username Account
     */
    getKeyringByAccount(account) {

    }

    /**
     * Clear All Keyrings
     */
    clearKeyrings() {

    }

    /**
     * Create New Vault and Keychain
     */
    createNewVaultAndKeychain() {

    }

    /**
     * Create New Vault and Restore
     */
    createNewVaultAndRestore() {

    }

    /**
     * Create First Key Tree
     */
    createFirstKeyTree() {

    }




}
