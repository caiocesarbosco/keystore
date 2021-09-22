const encryptor = require('./symmetricEncryption.js');
const implementjs = require('implement-js');
const implement = implementjs.default;
const simpleKeyring = require('./SimpleKeyring.js');
const hdKeyring = require('./HdKeyring.js');
const utils = require('../../lib/utils/utils.js');
const localStore = require('../../lib/store/store.js');
const Profile = require('./Profile.js');


/**
 * Enum for Keyring Types
 *      @enum Enums Keyrings Type
 */
const KeyringType = {
    /**
     * Simple Keyring (supported)
     * @type {number} 
     */
    SIMPLE_KEYRING: 0,
    /**
     * Hierarchical Deterministics Keyring (unsupported). In future version it should be supported or not.
     * @type {number}
     */
    HD_KEYRING:1
};

Object.freeze(KeyringType);

/**
 * @classdesc A Persitent Local Store Class to safely save Encrypted Profile Data
 */
class LocalStore {

    constructor(encryptor) {

        /**
         * External encryptor module to handle symmetric encryption operations.
         * @type {module}
         */
        this.encryptor = encryptor;
    }

    /**
     * get Persisted Profiles Names
     * @returns returns a array of profile's name strings.
     */
    getProfiles() {
        return localStore.getProfileList();
    }

    /**
     * Create a Profile
     * @param {String} profileName Profile Name 
     * @param {Obj} keyring Keyring
     * @param {String} password Profile's Password
     * @async
     */
    async createProfile(profileName, keyring, password) {
        let profile = await new Profile.Profile(profileName, keyring, this.encryptor, password, true);
        localStore.saveProfile(profileName, profile.serialize());
        localStore.updateProfileList(profileName);
    }

    /**
     * Drop all Profile Data. Password is checked first
     * @param {String} profileName 
     * @param {Password} password
     * @async
     */
    async removeProfile(profileName, password) {
        let verified = await this.verifyVaultSignature(profileName, password);
        if(verified === true) {
            localStore.dropProfile(profileName);
        }
    }

    /**
     * a Getter for Vault Object
     * @param {String} profileName Profile Name
     * @returns {Obj} returns Vault containg {encryptedData, signature}
     */
    getVault(profileName) {
        return localStore.getProfile(profileName);
    }

    /**
     * Checks Profile's Password by Signature's Verification
     * @param {String} profileName Profile Name
     * @param {String} password Profile Password
     * @returns {boolean} returns true if Vault's Signature Verification is performed correct. Return flase otherwise.
     * @async
     */
    async verifyVaultSignature(profileName, password) {
        let profileVault = this.getVault(profileName);
        let profile = await new Profile.Profile(profileName, profileVault, this.encryptor, null, false);
        return await profile.verifySignature(password);
    }

    /**
     * Get Decrypted Keyring Profile
     * This private method should be used to get public or private Keyring Info
     * @param {String} profileName Profile Name 
     * @param {String} password Profile Password
     * @returns {Obj} returns Decrypted Keyring
     * @private
     * @async
     */
    async #getKeyring(profileName, password) {
        let vault = this.getVault(profileName);
        let verified = await this.verifyVaultSignature(profileName, password);
        if(verified === true) {
            let keyring = await this.encryptor["decrypt"](utils.asciiToUint8Array(JSON.parse(vault).data), password);
            return new simpleKeyring.SimpleKeyring("", "", JSON.parse(keyring), true);
        }
        return null;
    }

    /**
     * Checks if Profile List is empty
     * @returns {boolean} Returns true if Profile List is empty. Otherwise it must return false. 
     */
    isEmpty() {
        return this.getProfiles().length === 0;
    }

    /**
     * Flushes all persisted profiles data.
     */
    cleanVault() {
        localStore.purge();
    }

    /**
     * Remove a account from a Profile
     * @param {String} profileName Profile Name
     * @param {String} account STC Account Username
     * @param {String} password Profile Password
     * @async
     */
    async removeAccount(profileName, account, password) {
        let keyring = await this.#getKeyring(profileName, password);
        if(keyring != null) {
            keyring.removeAccount(account);
            localStore.dropProfile(profileName);
            await this.createProfile(profileName, keyring.getKeyring(), password);
        }
    }

    /**
     * Add new STC Account into selected profile
     * @param {String} profileName Profile Name 
     * @param {String} account STC Account Username
     * @param {String} masterKey STC Account Masterkey
     * @param {String} password Profile Password
     * @async 
     */
    async addNewAccount(profileName, account, masterKey, password) {
        let keyring = await this.#getKeyring(profileName, password);
        if(keyring != null) {
            if(keyring.addAccount(account, masterKey) === true) {
                localStore.dropProfile(profileName);
                await this.createProfile(profileName, keyring.getKeyring(), password);
            }
        }
    }

    /**
     * Get Public Profile Data: an Array of Accounts Info containing: STC Account Username, Account Type.
     * TODO: We must return Public Keys with it on next version.
     * @param {String} profileName Profile Name 
     * @param {String} password Profile Password
     * @returns {Array} returns an Array of Accounts Info containing: STC Account Username, Account Type
     * @async
     */
    async getPublicInfo(profileName, password) {
        let keyring = await this.#getKeyring(profileName, password);
        return keyring === null ? [] : keyring.getPublicInfo(); 
    }

    /**
     * Get Private Account Data from a selected profile.
     * TODO: We must return Private Keys with it on next version, instead just the masterkey.
     * @param {String} profileName Profile Name 
     * @param {String} account STC Account Username
     * @param {String} password Profile Password
     * @returns {String} returns Account's Masterkey of Selected Profile 
     * @async
     */
    async getPrivateInfo(profileName, account, password) {
        let keyring = await this.#getKeyring(profileName, password);
        return keyring === null ? [] : keyring.getPrivateInfo(account); 
    }

}


/**
 * @classdesc A Class to handle Public Profile Data Operations using RAM Memory
 */

class RamStore {

    #password;
    #isLocked;
    #publickeyringData;

    constructor() {
        /**
         * A flag to locking Public Profile Data access on RAM memory.
         * @type {boolean}
         */
        this.#isLocked = true;
        /**
         * Public Profile Data loaded on volatile memory.
         * @type {Array}
         */
        this.#publickeyringData = [];
        /**
         * Verified Profile's Password loaded on volatile memory.
         * TODO: We must check if we need hold password or not. If so, next versions 
         * should have a mechanism to timeout password on RAM memory.
         * @type {String}
         */
        this.#password = null;
    }

    /**
     * Locks Volatile Store: set isLocked to true, drops all elements from publickeyringData, drop password from volatile memory.
     */
    setLocked() {
        this.#isLocked = true;
        this.#publickeyringData = [];
        this.#password = null;
    }

    /**
     * Unlocks volatile Store: enables Profile's password into volatile memory, set isLocked flag to false.
     * @param {String} password  Profile's Password
     */
    setUnlocked(password) {
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
     * Refresh Public Info available into volatile memory
     * @param {Array} publicKeyring an Array containing Public Information for each Account Registered at selected Profile
     */
    refreshKeyringPublicInfo(publicKeyring) {
        this.clearKeyrings();
        publicKeyring.forEach(elem => {
            this.#publickeyringData.push(elem);
        });
    }

    /**
     * Return All Public Profile Data loaded into volatile memory as an Array of Pub Account's Data Objects.
     * @returns {Array} returns an Array of Pub Account's Data Objects.
     */
    getPubKeyringData() {
        return this.#publickeyringData;
    }

    /**
     * Drop Pub Profile Data from Volatile Memory.
     */
    clearKeyrings() {
        this.#publickeyringData = [];
    }

    /**
     * Checks if Volatile Memory holds some Info.
     * @returns {boolean} return true if no Data is loaded. Otherwise it must return false.
     */
    isEmpty() {
        return !this.#publickeyringData.length;
    }

    /**
     * Profile's Password Getter from Volatile Memory.
     * @returns {String} return Profile's Password as a String or null if any password has been charged on volatile memory or locked.
     */
    getPassword() {
        return this.#password;
    }

    /**
     * Charges Profile's Password on Volatile's Memory
     * @param {String} password 
     */
    setPassword(password) {
        this.#password = password;
    }

}

/**
 * @classdesc A Controller's Class to abstract all highlevel operations performed with Keyrings.
 */

class KeyringController {

    constructor() {
        /**
         *  Encryption Module for: Derive, Encrypt & Decrypt with AES Algorithm using Profile's Password
         *  @type {module}
         **/
        this.encryptor = implement(encryptor.SymmetricEncryptorInterface)(new encryptor.SymmetricEncryptor());
        /**
         * Store Class which will persist Profile Data on Local Storage
         * @type {LocalStore}
         **/
        this.store = new LocalStore(this.encryptor);
        /**
         * Ram Store Class which will temporary holds Public Profile Data as an Array of Public Account's Data of Selected Profile.
         * @type {RamStore}
         **/
        this.ramStore = new RamStore();
    }

    /**
     * Get All Available Profiles
     * @returns {Array} returns an array of Profiles Name
     */
    getProfilesName() {
        return this.store.getProfiles();
    }

    /**
     * Locks Volatile Store: set isLocked to true, drops all elements from publickeyringData, drop profile password from volatile memory.
     */
    setLocked() {
        this.ramStore.setLocked();
    }

    /**
     * Verifies if User's Password is Right by Vault's Signature. If it is ok so:    
     * Restore on RamStore the Persisted Profile Public Account Data;
     * Enables Profile's Password on Volatile Memory;
     * @param {String} profile Profile Name
     * @param {String} password User's Password 
     * @async
     */
    async setUnlocked(profile, password) {

        if (this.store.isEmpty()) {
            this.ramStore.refreshKeyringPublicInfo("");
            await this.ramStore.setUnlocked(profile, password);
            return;
        }

        let rightPassword = await this.store.verifyVaultSignature(profile, password);
        if (rightPassword === true ) {
            let publicKeyring = await this.store.getPublicInfo(profile, password);
            this.ramStore.refreshKeyringPublicInfo(publicKeyring);
            await this.ramStore.setUnlocked(password);
        }

    }

    /**
     * Create New Profile
     * @param {String} profile Profile Name 
     * @param {String} account Account Username
     * @param {String} masterkey Master Key 
     * @param {String} type type
     * @async
     */
    async createProfile(profile, account, masterkey, password) {
        let keyringClass = this.getKeyringByType(KeyringType.SIMPLE_KEYRING);
        let keyring = new keyringClass(account, masterkey);
        await this.store.createProfile(profile, keyring.getKeyring(), password);
        let publicKeyring = await this.store.getPublicInfo(profile, password);
        await this.ramStore.refreshKeyringPublicInfo(publicKeyring);
    }

    /**
     * Add New Account on Profile. Update Public Account in Volatile Memory
     * @param {String} profile Profile Name
     * @param {String} account Account's Username
     * @param {String} masterKey MasterKey
     * @param {String} password Profile Password
     * @async
     */
    async addNewAccount(profile, account, masterkey, password) {
        await this.store.addNewAccount(profile, account, masterkey, password);
        let publicKeyring = await this.store.getPublicInfo(profile, password);
        this.ramStore.refreshKeyringPublicInfo(publicKeyring);
    }

    /**
     * Remove Profile's Account from Volatile and Persistent Memory by STC Account's Username.
     * @param {String} profile Profile Name
     * @param {String} account Account's Username
     * @param {String} password Profile Password
     * @async
     */
     async removeAccount(profile, account, password) {
        await this.store.removeAccount(profile, account, password);
        let publicKeyring = await this.store.getPublicInfo(profile, password);
        this.ramStore.refreshKeyringPublicInfo(publicKeyring);

    }

    /**
     * Export Keyring by Account's Username
     * @param {String} profile Profile Name
     * @param {String} account Account's Username
     * @param {String} password Profile's Password
     * @returns {String} returns STC Account Masterkey from selected Profile
     * TODO: Return all Private Keys not just Masterkey
     * @async
     * 
     */
    async exportAccount(profile, account, password) {

        return this.store.getPrivateInfo(profile, account, password);

    }

    /**
     * get Encryption Public Keys by STC Account's Username from selected Profile
     * @param {String} profile Profile Name
     * @param {String} account Account's Username
     * @param {string} password Profile Password
     * @returns {String} returns Public Key
     */
    getEncryptPublicKey(profile, account, password) {
        //return this.getKeyringByAccount(account)["wallet"]["pub"];
    }

    /**
     * Encrypt data using Public Key from STC Account's Username from slected Profile
     * @param {String} profile Profile Name
     * @param {String} account Account's Username
     * @param {String} data data to be encrypted
     */
    encryptMessage(profile, account, data) {

    }

    /**
     * Decrypt data using Private Key by STC Account's Username from selected Profile
     * @param {String} profile Profile Name
     * @param {string} account Account's Username
     * @param {string} data data to be decrypted
     */
    decryptMessage(profile, account, data) {

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
     * Get Accounts registered on selected profile
     * @returns {Array} returns array contained registered accounts on selected profile.
     */
    getAccounts(profile) {
        let accounts = [];
        this.ramStore.getPubKeyringData().forEach(
            elem => {
                accounts.push(elem.account);
            }
        );
        return accounts;
    }

    /**
     * Purges all Keyrings Data either from volatile and persistent memory
     */
    clearKeyrings() {
        this.store.cleanVault();
        this.ramStore.clearKeyrings();
    }
}

module.exports = {
    KeyringController: KeyringController,
    KeyringType: KeyringType
};

