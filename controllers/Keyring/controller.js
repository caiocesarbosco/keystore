const encryptor = require('./symmetricEncryption.js');
const implementjs = require('implement-js');
const implement = implementjs.default;
const simpleKeyring = require('./SimpleKeyring.js');
const hdKeyring = require('./HdKeyring.js');
const utils = require('../../lib/utils/utils.js');


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
 * @classdesc A Persitent Local Store Class to safely save Encrypted Keyrings
 */
class LocalStore {
    #vault;
    #signature;

    constructor(encryptor) {
        /**
         * Hold's all serialized keyrings encrypted with Symmetric Key Derived by User's Password. 
         * @type {Array}
         */
        this.#vault = [];
        /** 
         * Vault's signature to quick check of User's password is right or even if vault has been corrupted.
         * @type {Array}
         */
        this.#signature = null;
        /**
         * External encryptor module to handle symmetric encryption operations.
         * @type {module}
         */
        this.encryptor = encryptor;
    }

    /**
     * a Getter for Vault Object
     * @returns {Array} Vault containg encrypted serialized keyrings data
     */
    getVault() {
        return this.#vault;
    }

    /**
     * a Getter for Vault's Signature
     * @returns {Array} returns Vault's Signature.
     */
    getSignature() {
        return this.#signature;
    }

    /**
     * Checks if Vault Object is empty
     * @returns {boolean} Returns true if Vault is empty. Otherwise it must return false. 
     */
    isEmpty() {
        return this.#vault.length === 0;
    }

    /**
     * Flushes all persisted encrypted keyrings
     */
    cleanVault() {
        this.#vault = [];
    }

    /** 
     * Encrypts a String Data using a symmetric encryption method provided by encryptor module
     * See config.json and lib/encrypt/encrypt.js for more details.
     * @async
     * @param {String} data A String Data to be Encrypted
     * @param {String} password User's Password 
     */
    async encrypt(data, password) {
        this.#vault = await this.encryptor["encrypt"](data, password);
    }

    /**
     * Decrypts a Array Data using a symmetric decryption method provided by encryptor module
     * See config.json and lib/encrypt/encrypt.js for more details.
     * @param {Array} encryptedData Uint8 Array Buffer containing encrypted data
     * @param {String} password User's Password 
     * @returns {String} Decrypted Data as a String
     */
    async decrypt(encryptedData, password) {
        let decryptedData = await this.encryptor["decrypt"](encryptedData, password);
        return decryptedData;
    }

    /**
     * Sign entire Vault (Encrypted Serialized Keyrings) using Signature method provided by encryptor module. 
     * See config.json and lib/encrypt/encrypt.js for more details.
     * @param {String} password User's Password 
     */
    async signVault(password) {
        this.#signature = await this.encryptor["sign"](utils.bytesToASCIIString(this.getVault()), password);
    }

    /**
     * Verify Vault's Signature using Signature's Verification method provided by encryptor module. 
     * See config.json and lib/encrypt/encrypt.js for more details.
     * @param {String} password User's Password 
     * @returns {boolean} Returns true if Vault's signature verifications has been succeed. Otherwise returns false. 
     */
    async verifyVaultSignature(password) {
        return await this.encryptor["verify"](password, this.getSignature(), utils.bytesToASCIIString(this.getVault()));
    }
}



/**
 * @classdesc A Keyring class to handle Keyring's Operations just inside RAM Memory
 */

class RamStore {

    #password;
    #isLocked;
    #keyrings;

    constructor() {
        /**
         * A flag to locking keyrings access on RAM memory.
         * @type {boolean}
         */
        this.#isLocked = true;
        /**
         * A array of Keyrings loaded on volatile memory. It can holds Simple Keyrings or Hd Keyrings together.
         * @type {Array}
         */
        this.#keyrings = [];
        /**
         * Verified User's Password loaded on volatile memory. 
         * @type {String}
         */
        this.#password = null;
    }

    /**
     * Locks Volatile Store: set isLocked to true, drops all elements from keyrings, drop password from volatile memory.
     */
    setLocked() {
        this.#isLocked = true;
        this.#keyrings = [];
        this.#password = null;
    }

    /**
     * Unlocks volatile Store: enables keyrings and User's password into volatile memory, set isLocked flag to false.
     * @param {Array} keyrings Fresh keyrings Array decrypted from Persistent Memory (Vault)
     * @param {String} password  User's Password
     */

    setUnlocked(keyrings, password) {
        keyrings.forEach(keyring => {
            this.#keyrings.push(keyring);
        });
        this.#password = password;
        this.#isLocked = false;
    }

    /**
     * Checks if Volatile Store is Locked.
     * @returns {boolean} return true if RamStore is locked. Otherwise it must return false.
     */
    isRamStoreLocked() {
        return this.#isLocked;
    }

    /**
     * Add a Simple Keyring or Hd Keyring into volatile memory
     * @param {Object} keyring Keyring Object 
     */
    addKeyring(keyring) {
        this.#keyrings.push(keyring);
    }

    /**
     * Remove a Keyring from volatile memory by Username's Account
     * @param {String} account Username's Account String 
     */
    removeKeyring(account) {
        this.#keyrings = this.#keyrings.filter(elem => elem["account"] != account);
    }

    /**
     * Return All keyrings loaded into volatile memory as a Array of Keyring Objects.
     * @returns {Array} return a Array of Keyring's Objects. It can have Simple and Hd Keyrings mixed.
     */
    getKeyrings() {
        return this.#keyrings;
    }

    /**
     * Drop Keyrings from Volatile Memory.
     */
    clearKeyrings() {
        this.#keyrings = [];
    }

    /**
     * Checks if Volatile Memory holds some Keyring.
     * @returns {boolean} return true if no keyring is loaded. Otherwise it must return false.
     */
    isEmpty() {
        return !this.#keyrings.length;
    }

    /**
     * User's Password Getter from Volatile Memory.
     * @returns {String} return User's Password as a String or null if any password has been charged on volatile memory.
     */
    getPassword() {
        return this.#password;
    }

    /**
     * Charges User's Password on Volatile's Memory
     * @param {String} password 
     */
    setPassword(password) {
        this.#password = password;
    }

}

/**
 * @class Keyrings Controller
 */

class KeyringController {

    constructor() {
        /** Encryption Module for: Derive, Encrypt & Decrypt with AES Algorithm using User's Password*/
        this.encryptor = implement(encryptor.SymmetricEncryptorInterface)(new encryptor.SymmetricEncryptor());
        /** Store Class which will persist Keyrings on Local Storage*/
        this.store = new LocalStore(this.encryptor);
        /** Ram Store Class which will temporary holds keyrings on an Local Array of Keyrings*/
        this.ramStore = new RamStore();
    }

    /**
     *      assert null on local password;
     *      erase keyrings Array values;
     *      emit a "lock" event for all listeners;
     *      update any internal state;
     * @emits lock event
     */
    async setLocked() {
        await this.store.encrypt(JSON.stringify(this.ramStore.getKeyrings()), this.ramStore.getPassword());
        await this.store.signVault(this.ramStore.getPassword());
        this.ramStore.setLocked();
    }

    /**
     *      
     *      emit "unlock" event for all listeners;
     *      update any internal state;
     *      restore on RamStore the Persisted User Keyrings;
     * @emits unlock event
     * @param password
     */
    async setUnlocked(password) {

        if (this.store.isEmpty()) {
            this.ramStore.setUnlocked([], password);
            return;
        }

        let rightPassword = await this.store.verifyVaultSignature(password);
        if (rightPassword === true ) {
            let keyrings = JSON.parse(await this.store.decrypt(this.store.getVault(), password));
            this.ramStore.clearKeyrings();
            this.ramStore.setUnlocked(keyrings, password);
        }

    }

    /**
     * 
     *      submit User's password to encrypt all Keyring Array as a Vault into Local Store;
     *      @param {string} password User's Password
     */
    async submitPassword(password) {
        let keyrings = this.ramStore.getKeyrings();
        await this.store.encrypt(JSON.stringify(keyrings), password);
        await this.store.signVault(password);
        this.ramStore.setPassword(password);
    }

    /**
     * 
     *      verify User's password checking signature of encrypted data on Local Store;
     *      @param {string} password User's Password
     */
    async verifyPassword(password) {
        return await this.store.verifyVaultSignature(password);
    }

    /**
     *      Add a new Keyring
     *      @param {Obj} keyring 
     */
    addNewKeyring(keyring) {

        if(this.checkForDuplicates(keyring) == false) {
            this.ramStore.addKeyring(keyring);
        }

    }

    /**
     * Check for Duplicate Keyrings
     */
    checkForDuplicates(keyring) {

        return this.ramStore.getKeyrings().includes(keyring);

    }

    /**
     * Add New Account
     * @param {string} account A Username Account
     * @param {KeyringType} type Keyring's Type
     */
    addNewAccount(account, type) {
        let keyringClass = this.getKeyringByType(type);
        let keyring = new keyringClass(account);
        this.addNewKeyring(keyring);
    }

    /**
     * Export Account
     * @param {string} account A Username Account
     */
    exportAccount(account) {

        return this.getKeyringByAccount(account);

    }

    /**
     * Remove Account
     * @param {string} account A Username Account
     */
    async removeAccount(account) {
        this.ramStore.removeKeyring(account);
        await this.persistsAllKeyrings();
    }

    /**
     * get Encryption Public Keys
     * @param {string} account A Username Account
     */
    getEncryptPublicKey(account) {
        return this.getKeyringByAccount(account)["wallet"]["pub"];
    }

    /**
     * Encrypt Message
     * @param {string} account A Username Account
     * @param {string} data data to be encrypted
     */
    encryptMessage(account, data) {

    }

    /**
     * Decrypt Message
     * @param {string} account A Username 
     * @param {string} data data to be decrypted
     */
    decryptMessage(account, data) {

    }

    /**
     * Get Keyring Class by Type
     * @param {KeyringType} type Keyring Type
     */
    getKeyringByType(type) {
        let keyring;
        switch(type) {
            case KeyringType.SIMPLE_KEYRING:
                keyring = simpleKeyring.SimpleKeyring;
                break;
            case KeyringType.HD_KEYRING:
                keyring = hdKeyring.HdKeyring;
                break;
            default:
                keyring = simpleKeyring.SimpleKeyring;
                break;
        }

        return keyring;

    }

    /**
     * get Accounts
     */
    getAccounts() {
        return this.ramStore.getKeyrings().map(elem => elem["account"]);
    }

    /**
     * Get Keyring by Account
     * @param {string} account A Username Account
     */
    getKeyringByAccount(account) {
        return this.ramStore.getKeyrings().filter(elem => elem["account"] === account);
    }

    /**
     * Persist Keyrings
     */
    async persistsAllKeyrings() {
        let keyrings = this.ramStore.getKeyrings();
        await this.store.encrypt(JSON.stringify(keyrings), this.ramStore.getPassword());
        await this.store.signVault(this.ramStore.getPassword());
    }

    /**
     * Clear All Keyrings
     */
    clearKeyrings() {
        this.store.cleanVault();
        this.ramStore.clearKeyrings();
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

module.exports = {
    KeyringController: KeyringController,
    KeyringType: KeyringType
};

