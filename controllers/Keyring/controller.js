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
 * A Persitent Local Store Class to save Encrypted Keyrings
 * @class LocalStore
 */
class LocalStore {
    #vault;
    #signature;

    constructor(encryptor) {
        this.#vault = [];
        this.signature = null;
        this.encryptor = encryptor;
    }

    getVault() {
        return this.#vault;
    }

    getSignature() {
        return this.#signature;
    }

    isEmpty() {
        return this.#vault.length === 0;
    }

    async encrypt(data, password) {
        this.#vault = await this.encryptor["encrypt"](data, password);
    }

    async decrypt(encryptedData, password) {
        let decryptedData = await this.encryptor["decrypt"](encryptedData, password);
        return decryptedData;
    }

    async signVault(password) {
        this.#signature = await this.encryptor["sign"](utils.bytesToASCIIString(this.getVault()), password);
    }

    async verifyVaultSignature(password) {
        return await this.encryptor["verify"](password, this.getSignature(), utils.bytesToASCIIString(this.getVault()));
    }
}



/**
 * A Keyring class to handle Keyring's Operations just inside RAM Memory
 * @class RamStore
 */

class RamStore {

    #password;
    #isLocked;
    #keyrings;

    constructor() {
        this.#isLocked = true;
        this.#keyrings = [];
        this.#password = null;
    }

    setLocked() {
        this.#isLocked = true;
        this.#keyrings = [];
        this.#password = null;
    }

    setUnlocked(keyrings, password) {
        keyrings.forEach(keyring => {
            this.#keyrings.push(keyring);
        });
        this.#password = password;
        this.#isLocked = false;
    }

    isRamStoreLocked() {
        return this.#isLocked;
    }

    addKeyring(keyring) {
        this.#keyrings.push(keyring);
    }

    getKeyrings() {
        return this.#keyrings;
    }

    isEmpty() {
        return !this.#keyrings.length;
    }

    getPassword() {
        return this.#password;
    }

    setPassword(password) {
        this.#password = password;
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

        this.ramStore.addKeyring(keyring);
        //if(this.checkForDuplicates())

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
     * Get Keyring Class by Type
     * @param {KeyringType} type Keyring Type
     */
    getKeyringByType(type) {
        let keyring;
        switch(type) {
            case KeyringType.SIMPLE_KEYRING:
                keyring = new simpleKeyring.SimpleKeyring();
                break;
            case KeyringType.HD_KEYRING:
                keyring = new hdKeyring.HdKeyring();
                break;
            default:
                keyring = new simpleKeyring.SimpleKeyring();
                break;
        }

        return keyring;

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

module.exports = {
    KeyringController: KeyringController,
    KeyringType: KeyringType
};

