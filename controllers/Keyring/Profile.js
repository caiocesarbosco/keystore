const utils = require('../../lib/utils/utils.js');

/**
 * @classdesc Profile Data which must be safely persisted on local storage.
 */
 class Profile {

    constructor(name, data, encryptor, password, isNew) {

        return(async () => {
            /**
             * Attributed Profile's Name
             * @type {String}
             */
            this.name = name;

            /**
             * Encryptor Module
             */
            this.encryptor = encryptor;

            if(isNew == false) {
                /**
                 * Hold's all profile data encrypted with Symmetric Key Derived by User's Password. 
                 * @type {Array}
                 */
                this.data = data["data"];
        
                /** 
                 * Profile Data Signature to quick check of User's password is right or even if vault has been corrupted.
                 * @type {Array}
                 */
                this.signature = data["signature"];
            }

            else {
                /**
                 * Hold's all profile data encrypted with Symmetric Key Derived by User's Password. 
                 * @type {Array}
                 */
                this.data = await encryptor["encrypt"](data, password);
                /** 
                 * Profile Data Signature to quick check of User's password is right or even if vault has been corrupted.
                 * @type {Array}
                 */
                this.signature = await encryptor["sign"](this.data, password);
            }

            return this;

        })();
    }

    /**
     * a Getter for Profile Name
     * @returns {String} returns Profile Name as a String
     */
    getName() {
        return this.name;
    }

    /**
     * set Profile's Data with Encrypted Data
     * @param {Array} data Encrypted Data
     */
    setData(data) {
        this.data = data
    }

    /**
     * a Getter for Profile Data
     * @returns {Obj} returns encrypted Profile Data
     */
    getData() {
        return this.data;
    }

    /**
     * set Profile's Signature
     * @param {Array} data Signed Data
     */
    setSignature(sign) {
        this.signature = sign;
    }

    /**
     * a Getter for Profile's Signature
     * @returns {Array} returns Profile Data Signature.
     */
    getSignature() {
        return this.signature;
    }

    /**
     * Verify Signature using Profile Passowrd
     * @returns {boolean} returns true if Password matches. False otherwise.
     */
    async verifySignature(password) {
        return await this.encryptor["verify"](password, this.getSignature(), utils.bytesToASCIIString(this.getData()));
    }

    serialize() {
        let obj = {
            data: this.getData(),
            signature: this.getSignature() 
        };

        return JSON.stringify(obj);
    }
};

module.exports = {
    Profile: Profile
};