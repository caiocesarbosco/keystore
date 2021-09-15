/**
 * Enum for Symmetric Encryption Algorithm Options
 * @enum SymmetricEncrypt
 */
const SYMMETRIC_ENCRYPT_ALGORITHM = {
    /**
     * RSA-OAEP Algorithm
     * @type {String} 
     */
    RSA_OAEP: 'RSA-OAEP',
    /**
     * AES-CTR Algorithm (Default)
     * @type {String} 
     */
    AES_CTR: 'AES-CTR',
    /**
     * AES-CBC Algorithm
     * @type {String} 
     */
    AES_CBC: 'AES-CBC',
    /**
     * AES-GCM Algorithm
     * @type {String} 
     */
    AES_GCM: 'AES-GCM'
};

/**
 * Enum for Sign/Verify Algorithm Options
 * @enum SigningAlgo
 */
const SIGN_ALGORITHM = {
     /**
     * RSASSA_PKCS1_v1_5 Algorithm
     * @type {String} 
     */
    RSASSA_PKCS1_v1_5: 'RSASSA-PKCS1-v1_5',
    /**
     * RSA_PSS Algorithm
     * @type {String} 
     */
    RSA_PSS: 'RSA-PSS',
    /**
     * ECDSA Algorithm
     * @type {String} 
     */
    ECDSA: 'ECDSA',
    /**
     * HMAC Algorithm (Default)
     * @type {String} 
     */
    HMAC: 'HMAC',
    /**
     * NODE_DSA Algorithm
     * @type {String} 
     */
    NODE_DSA: 'NODE-DSA',
    /**
     * NODE_ED25519 Algorithm
     * @type {String} 
     */
    NODE_ED25519: 'NODE-ED25519',
    /**
     * NODE_ED448 Algorithm
     * @type {String} 
     */
    NODE_ED448: 'NODE-ED448'
};

/**
 * Enum for Derive Key Algorithm Options
 * @enum DeriveKeyAlgo
 */
 const DERIVE_KEY_ALGORITHM = {
    /**
     * ECDH Algorithm
     * @type {String} 
     */
    ECDH: 'ECDH',
    /**
     * HKDF Algorithm
     * @type {String} 
     */
    HKDF: 'HKDF',
    /**
     * PBKDF2 Algorithm (Default)
     * @type {String} 
     */
    PBKDF2: 'PBKDF2',
    /**
     * NODE-DH Algorithm
     * @type {String} 
     */
    NODE_DH: 'NODE-DH',
    /**
     * NODE-SCRYPT Algorithm
     * @type {String} 
     */
    NODE_SCRYPT: 'NODE-SCRYPT'
};

/**
 * Enum for hash algorithm
 * @enum HashAlgo
 */
const HASH_ALGORITHM = {
    /**
     * SHA-1 Algorithm
     * @type {String} 
     */
    SHA_1: 'SHA-1',
    /**
     * SHA-256 Algorithm (Default)
     * @type {String} 
     */
    SHA_256: 'SHA-256',
    /**
     * SHA-384 Algorithm
     * @type {String} 
     */
    SHA_384: 'SHA-384',
    /**
     * SHA-512 Algorithm
     * @type {String} 
     */
    SHA_512: 'SHA-512'
}


/**
 * Enum for Key Size Options
 * @enum KeySize
 */
const KEYSIZE = {
    /**
     * 16 bytes
     * @type {number} 
     */
    SIZE_OF_16: 16,
    /**
     * 32 bytes
     * @type {number} 
     */
    SIZE_OF_32: 32,
    /**
     * 64 bytes
     * @type {number} 
     */
    SIZE_OF_64: 64,
    /**
     * 128 bytes
     * @type {number} 
     */
    SIZE_OF_128: 128,
    /**
     * 256 bytes
     * @type {number} 
     */
    SIZE_OF_256: 256,
    /**
     * 512 bytes
     * @type {number} 
     */
    SIZE_OF_512: 512
};

/**
 * Enum for Iterations Options
 * @enum Iterations
 */
 const ITERATIONS = {
    /**
     * 100000
     * @type {number} 
     */
    WEAK: 100000,
    /**
     * 262144
     * @type {number} 
     */
    STRONG: 262144
};

/**
 * Enum for Key Usage
 * @enum KeyUsage
 */
const KEY_USAGE = {
    /**
     * Key Usage for Sign/Verify Purposes
     * @type {Array} 
     */
    SIGN_VERIFY: ['sign', 'verify'],
    /**
     * Key Usage for Encrypt/Decrypt Purposes
     * @type {Array} 
     */
    ENCRYPT_DECRYPT: ['encrypt', 'decrypt'],
    /**
     * Derive Key Purpose
     * @type {Array} 
     */
    DERIVE: ["deriveBits", "deriveKey"]
}

Object.freeze(SYMMETRIC_ENCRYPT_ALGORITHM);
Object.freeze(SIGN_ALGORITHM);
Object.freeze(DERIVE_KEY_ALGORITHM);
Object.freeze(HASH_ALGORITHM);
Object.freeze(KEYSIZE);
Object.freeze(ITERATIONS);
Object.freeze(KEY_USAGE);

module.exports = {SYMMETRIC_ENCRYPT_ALGORITHM: SYMMETRIC_ENCRYPT_ALGORITHM,
    SIGN_ALGORITHM: SIGN_ALGORITHM,
    DERIVE_KEY_ALGORITHM: DERIVE_KEY_ALGORITHM, 
    HASH_ALGORITHM: HASH_ALGORITHM, 
    KEYSIZE: KEYSIZE, 
    ITERATIONS: ITERATIONS, 
    KEY_USAGE: KEY_USAGE
};