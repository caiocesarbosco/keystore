const encryptor = require('./symmetricEncryption.js');
const implementjs = require('implement-js');
const implement = implementjs.default;
const simpleKeyring = require('./SimpleKeyring.js');
const hdKeyring = require('./HdKeyring.js');
const utils = require('../../lib/utils/utils.js');


/**
 * Enum for Keyring Types
 *      @enum Enums Keyrings Type
 */
const KeyringType = {
    /**
     * A ring which holds simple independent's Keypairs.
     * @type {number} 
     */
    SIMPLE_KEYRING: 0,
    /**
     * A ring which holds Hierarchical Deterministics Keypairs.
     * @type {number}
     */
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
 * @classdesc A Controller's Class to abstract all highlevel operations performed on Keyrings.
 */

class KeyringController {

    constructor() {
        /**
         *  Encryption Module for: Derive, Encrypt & Decrypt with AES Algorithm using User's Password
         *  @type {module}
         **/
        this.encryptor = implement(encryptor.SymmetricEncryptorInterface)(new encryptor.SymmetricEncryptor());
        /**
         * Store Class which will persist Keyrings on Local Storage
         * @type {LocalStore}
         **/
        this.store = new LocalStore(this.encryptor);
        /**
         * Ram Store Class which will temporary holds keyrings on an Local Array of Keyrings
         * @type {RamStore}
         **/
        this.ramStore = new RamStore();
    }

    /**
     *  Assert null on local password;
     *  Encrypt and persists encrypted keyrings on Local Store Vault.
     *  Sign's Vault's Data and persist's it.
     *  Erase keyrings elements from Volatile's Memory;
     *  @async
     */
    async setLocked() {
        await this.store.encrypt(JSON.stringify(this.ramStore.getKeyrings()), this.ramStore.getPassword());
        await this.store.signVault(this.ramStore.getPassword());
        this.ramStore.setLocked();
    }

    /**
     * Verifies if User's Password is Right by Vault's Signature. If it is ok so:    
     * Restore on RamStore the Persisted User Keyrings;
     * Enables User's Password on Volatile Memory;
     * @param {String} password User's Password 
     * @async
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
     * Submit User's password to encrypt all Keyring Array as a Vault into Local Store;
     * @param {string} password User's Password
     * @async
     */
    async submitPassword(password) {
        let keyrings = this.ramStore.getKeyrings();
        await this.store.encrypt(JSON.stringify(keyrings), password);
        await this.store.signVault(password);
        this.ramStore.setPassword(password);
    }

    /**
     * 
     * Verify User's password checking signature of encrypted data on Local Store;
     * @param {string} password User's Password
     * @async
     */
    async verifyPassword(password) {
        return await this.store.verifyVaultSignature(password);
    }

    /**
     * Add a new Keyring on volatile memory. Duplicated Data is discarded.
     * @param {Obj} keyring Keyring 
     */
    addNewKeyring(keyring) {

        if(this.checkForDuplicates(keyring) == false) {
            this.ramStore.addKeyring(keyring);
        }

    }

    /**
     * Check if keyring exists on volatile memory.
     * @param {Obj} keyring Keyring
     * @returns {boolen} return true if keyring is duplicated on RAM Memory. Otherwise it must return false.
     */
    checkForDuplicates(keyring) {

        return this.ramStore.getKeyrings().includes(keyring);

    }

    /**
     * Add New Account on Volatile Memory.
     * @param {String} account Account's Username
     * @param {KeyringType} type Keyring's Type
     */
    addNewAccount(account, type) {
        let keyringClass = this.getKeyringByType(type);
        let keyring = new keyringClass(account);
        this.addNewKeyring(keyring);
    }

    /**
     * Export Keyring by Account's Username
     * @param {String} account Account's Username
     * @returns {Obj} returns Keyring Object
     */
    exportAccount(account) {

        return this.getKeyringByAccount(account);

    }

    /**
     * Remove Account's Keyring from Volatile and Persistent Memory by Account's Username.
     * @param {String} account Account's Username
     * @async
     */
    async removeAccount(account) {
        this.ramStore.removeKeyring(account);
        await this.persistsAllKeyrings();
    }

    /**
     * get Encryption Public Keys by Account's Username
     * @param {String} account Account's Username
     * @returns {String} returns Public Key
     */
    getEncryptPublicKey(account) {
        return this.getKeyringByAccount(account)["wallet"]["pub"];
    }

    /**
     * Encrypt data using Public Key from Account's Keyring
     * @param {String} account Account's Username
     * @param {String} data data to be encrypted
     */
    encryptMessage(account, data) {

    }

    /**
     * Decrypt data using Private Key from Account's Keyring
     * @param {string} account Account's Username
     * @param {string} data data to be decrypted
     */
    decryptMessage(account, data) {

    }

    /**
     * Get Keyring Class by Type
     * @param {KeyringType} type Keyring Type
     * @returns {Class} return a Keyring Type Class
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
     * get a array of all Account's Username.
     * @returns {Array} returns a Array containing all Account's Username Name Extracted by Volatile Memory's Keyrings 
     */
    getAccounts() {
        return this.ramStore.getKeyrings().map(elem => elem["account"]);
    }

    /**
     * Get Keyring by Account
     * @param {String} account Account's Username
     * @returns {Obj} returns a Keyring Obj from volatile memory filtered by Account's Username
     */
    getKeyringByAccount(account) {
        return this.ramStore.getKeyrings().filter(elem => elem["account"] === account);
    }

    /**
     * Persists All Keyrings from volatile memory to persistent memory (Vault) encrypting it with
     * symmetric key derived from User's Password. This method is similar as submitPassword method.
     * Meanwhile submitPassword receives a password as a parameter, persistsAllKeyrings uses password
     * charged on volatile memory. submitPassword must be used to submit User's Password entry, meanwhile
     * persistsAllKeyrings is used to persists all volatile data to Vault.
     * @async
     */
    async persistsAllKeyrings() {
        let keyrings = this.ramStore.getKeyrings();
        await this.store.encrypt(JSON.stringify(keyrings), this.ramStore.getPassword());
        await this.store.signVault(this.ramStore.getPassword());
    }

    /**
     * Purges all Keyrings Data either from volatile and persistent memory
     */
    clearKeyrings() {
        this.store.cleanVault();
        this.ramStore.clearKeyrings();
    }

    /**
     * Create New Vault
     */
    createNewVault() {

    }

    /**
     * Create New Vault, Restoring Keyrings by a Import Method
     */
    createNewVaultAndRestore() {

    }

    /**
     * Create a Root Key for a HD Keyring
     */
    createFirstKeyTree() {

    }


}

module.exports = {
    KeyringController: KeyringController,
    KeyringType: KeyringType
};

