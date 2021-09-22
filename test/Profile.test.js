const KeyringController = require("../controllers/Keyring/controller.js");
const SimpleKeyring = require("../controllers/Keyring/SimpleKeyring.js");
const Encryptor = require('../controllers/Keyring/symmetricEncryption.js');
const Profile = require('../controllers/Keyring/Profile.js');
const implementjs = require('implement-js');
const implement = implementjs.default;

test("Testing Profile Constructor with New Profile", async () => {
    let encryptor = implement(Encryptor.SymmetricEncryptorInterface)(new Encryptor.SymmetricEncryptor());
    let profile = await new Profile.Profile("Profile 1", [], encryptor, "1234", true);
    expect(profile.getName()).toStrictEqual("Profile 1");
    expect(await profile.verifySignature("1234")).toStrictEqual(true);
    expect(await encryptor.decrypt(profile.getData(),"1234")).toBe("[]");
});

test("Testing Profile Constructor with existed Profile", async () => {
    let keyring = new SimpleKeyring.SimpleKeyring("User1", "MasterKey", "", false);
    let encryptor = implement(Encryptor.SymmetricEncryptorInterface)(new Encryptor.SymmetricEncryptor());
    let profile = await new Profile.Profile("Profile 1", keyring.getKeyring(), encryptor, "1234", false);
    expect(profile.getName()).toStrictEqual("Profile 1");
    expect(profile.getData()).toBe(mock["data"]);
    expect(profile.getSignature()).toBe(mock["signature"]);
});