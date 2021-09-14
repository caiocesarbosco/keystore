const KeyringController = require("../controllers/Keyring/controller.js");

test("Testing Keyring Controller Sign", async () => {
    
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };

    let keyringController = new KeyringController.KeyringController(params);

    const data = "My Keyring Test Signed Data";
    const derivedKey = await keyringController.encryptor.deriveKey("1234");
    const signedData = await keyringController.encryptor.sign(data, derivedKey.sign);
    const isValidSignature = await keyringController.encryptor.verify(derivedKey.sign, signedData, data);
    expect(isValidSignature).toBe(true);
});

test("Test get keyring by type", () => {

    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    let keyring = keyringController.getKeyringByType(keyringController.type);
    expect(keyring).not.toBe(undefined);
});

test("Test add Keyring", () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    let keyring = keyringController.getKeyringByType(keyringController.type);
    keyringController.addNewKeyring(keyring);
    expect(keyringController.ramStore.getKeyrings().length).not.toBe(0);
});

test("Test default locking Keyring Controller", () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.getKeyrings().length).toBe(0);
    expect(keyringController.store.isEmpty()).toBe(true);
})

test("Test locking Keyring Controller", async () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    await keyringController.setLocked();
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.getKeyrings().length).toBe(0);
    expect(keyringController.store.isEmpty()).toBe(false);
});

test("Test unlocking Keyring Controller", async () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    await keyringController.setUnlocked("1234");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
});

test("Testing Lock followed by Unlock using right password", async () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    let keyring = keyringController.getKeyringByType(keyringController.type);
    keyringController.addNewKeyring(keyring);
    keyringController.ramStore.setPassword("1234");
    await keyringController.setLocked();
    await keyringController.setUnlocked("1234");
    let keyrings = keyringController.ramStore.keyrings;
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
    let refreshedKeyrings = keyringController.ramStore.getKeyrings();
    expect(refreshedKeyrings[0]).toEqual(keyring);
    expect(keyringController.store.isEmpty()).toBe(false);

});

test("Test Keyring's Encryption", async () => {
    let params = {
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController(params);
    let keyring = keyringController.getKeyringByType(keyringController.type);
    keyringController.addNewKeyring(keyring);
    await keyringController.submitPassword("1234");
    expect(keyringController.store.isEmpty()).toBe(false);
});


