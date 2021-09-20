const KeyringController = require("../controllers/Keyring/controller.js");
const Encryptor = require('../controllers/Keyring/symmetricEncryption.js');
const Profile = require('../controllers/Keyring/Profile.js');
const implementjs = require('implement-js');
const implement = implementjs.default;

test("Testing Profile Constructor", async () => {
    let encryptor = implement(Encryptor.SymmetricEncryptorInterface)(new Encryptor.SymmetricEncryptor());
    let profile = await new Profile.Profile("Profile 1", [], encryptor, "1234");
    expect(profile.getName()).toStrictEqual("Profile 1");
    expect(await profile.verifySignature("1234")).toStrictEqual(true);
    expect(await encryptor.decrypt(profile.getData(),"1234")).toBe("");
});