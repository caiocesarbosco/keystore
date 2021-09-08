/**
 * Enum for Symmetric Encryption
 * @enum SymmetricEncrypt
 */
const SYMMETRIC_ENCRYPT_ALGORITHM = {
    RSA_OAEP: 'RSA-OAEP',
    AES_CTR: 'AES-CTR',
    AES_CBC: 'AES-CBC',
    AES_GCM: 'AES-GCM'
}

/**
 * Enum for Sign/Verify Algorithm Options
 * @enum SigningAlgo
 */
const SIGN_ALGORITHM = {
    RSASSA_PKCS1_v1_5: 'RSASSA-PKCS1-v1_5',
    RSA_PSS: 'RSA-PSS',
    ECDSA: 'ECDSA',
    HMAC: 'HMAC',
    NODE_DSA: 'NODE-DSA',
    NODE_ED25519: 'NODE-ED25519',
    NODE_ED448: 'NODE-ED448'
};

/**
 * Enum for Derive Key Algorithm Options
 * @enum DeriveKeyAlgo
 */
 const DERIVE_KEY_ALGORITHM = {
    ECDH: 'ECDH',
    HKDF: 'HKDF',
    PBKDF2: 'PBKDF2',
    NODE_DH: 'NODE-DH',
    NODE_SCRYPT = 'NODE-SCRYPT'
};

/**
 * Enum for hash algorithm
 * @enum HashAlgo
 */
const HASH_ALGORITHM = {
    SHA_1: 'SHA-1',
    SHA_256: 'SHA-256',
    SHA_384: 'SHA-384',
    SHA_512: 'SHA-512'
}


/**
 * Enum for Key Size Options
 * @enum KeySize
 */
const KEYSIZE = {
    SIZE_OF_16: 16,
    SIZE_OF_32: 32,
    SIZE_OF_64: 64,
    SIZE_OF_128: 128,
    SIZE_OF_256: 256,
    SIZE_OF_512: 512
};

/**
 * Enum for Iterations Options
 * @enum Iterations
 */
 const ITERATIONS = {
    WEAK: 100000,
    STRONG: 262144
};

/**
 * Enum for Key Usage
 * @enum KeyUsage
 */
const KEY_USAGE = {
    SIGN_VERIFY: ['sign', 'verify'],
    ENCRYPT_DECRYPT: ['encrypt', 'decrypt'],
    DERIVE: ["deriveBits", "deriveKey"]
}

Object.freeze(SYMMETRIC_ENCRYPT_ALGORITHM);
Object.freeze(SIGN_ALGORITHM);
Object.freeze(DERIVE_KEY_ALGORITHM);
Object.freeze(HASH_ALGORITHM);
Object.freeze(KEYSIZE);
Object.freeze(ITERATIONS);
Object.freeze(KEY_USAGE);

module.exports = SYMMETRIC_ENCRYPT_ALGORITHM, SIGN_ALGORITHM, DERIVE_KEY_ALGORITHM, HASH_ALGORITHM, KEYSIZE, ITERATIONS, KEY_USAGE;