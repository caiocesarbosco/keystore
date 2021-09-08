const KeyringController = require("../controllers/Keyring/controller.js");

test("Testing Keyring Controller Sign", async () => {
    
    var params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };

    var keyringController = new KeyringController.KeyringController(params);

    const data = "My Keyring Test Signed Data";
    const derivedKey = await keyringController.encryptor.deriveKey("1234");
    const signedData = await keyringController.encryptor.sign(data, derivedKey.sign);
    const isValidSignature = await keyringController.encryptor.verify(derivedKey.sign, signedData, data);
    expect(isValidSignature).toBe(true);
});