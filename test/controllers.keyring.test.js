const KeyringController = require("../controllers/Keyring/controller.js");
const simpleKeyring = require("../controllers/Keyring/SimpleKeyring");

test("Testing Keyring Controller Sign", async () => {
    
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();

    const data = "My Keyring Test Signed Data";
    const derivedKey = await keyringController.encryptor.deriveKey("1234");
    const signedData = await keyringController.encryptor.sign(data, derivedKey.sign);
    const isValidSignature = await keyringController.encryptor.verify(derivedKey.sign, signedData, data);
    expect(isValidSignature).toBe(true);
});

test("Test get keyring by type", () => {

    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();

    let keyring = keyringController.getKeyringByType(keyringController.type);
    expect(keyring).toBe(simpleKeyring.SimpleKeyring);
});

test("Test add Keyring", () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    expect(keyringController.ramStore.getKeyrings().length).not.toBe(0);
});

test("Test default locking Keyring Controller", () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.getKeyrings().length).toBe(0);
    expect(keyringController.store.isEmpty()).toBe(true);
})

test("Test locking Keyring Controller", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    await keyringController.setLocked();
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.getKeyrings().length).toBe(0);
    expect(keyringController.store.isEmpty()).toBe(false);
});

test("Test unlocking Keyring Controller", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    await keyringController.setUnlocked("1234");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
});

test("Test Keyring's Encryption", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    await keyringController.submitPassword("1234");
    expect(keyringController.store.isEmpty()).toBe(false);
});

test("Test Vault Signature Verify with right password", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    await keyringController.submitPassword("1234");
    expect(await keyringController.verifyPassword("1234")).toBe(true);
});

test("Test Vault Signature Verify with wrong password", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    await keyringController.submitPassword("1234");
    expect(await keyringController.verifyPassword("4321")).toBe(false);
});

test("Testing Lock followed by Unlock using right password", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    keyringController.ramStore.setPassword("1234");
    await keyringController.setLocked();
    await keyringController.setUnlocked("1234");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
    let refreshedKeyrings = keyringController.ramStore.getKeyrings();
    expect(refreshedKeyrings[0]["account"]).toEqual(params.account);
    expect(refreshedKeyrings[0]["wallet"]["pub"].length).not.toEqual(0);
    expect(refreshedKeyrings[0]["wallet"]["priv"].length).not.toEqual(0);
    expect(keyringController.store.isEmpty()).toBe(false);

});

test("Testing Lock followed by Unlock using wrong password", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    keyringController.ramStore.setPassword("1234");
    await keyringController.setLocked();
    await keyringController.setUnlocked("4321");
    let keyrings = keyringController.ramStore.keyrings;
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    let refreshedKeyrings = keyringController.ramStore.getKeyrings();
    expect(refreshedKeyrings).toEqual([]);
    expect(keyringController.store.isEmpty()).toBe(false);
    expect(keyringController.ramStore.isEmpty()).toBe(true);

});
/*
test("Testing Duplicate Keyring", () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    expect(keyringController.checkForDuplicates(keyring)).toBe(false);
    keyringController.addNewAccount(params.account, params.type);
    expect(keyringController.checkForDuplicates(keyring)).toBe(true);
});

test("Testing if duplicated keyring is not inserted on Keyring Array", () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    keyringController.addNewAccount(params.account, params.type);
    expect(keyringController.ramStore.getKeyrings().length).toBe(1);

});*/

test("Clear Keyrings Test", async () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    await keyringController.submitPassword("1234");
    expect(keyringController.store.getVault().length).not.toBe(0);
    expect(keyringController.ramStore.getKeyrings().length).not.toBe(0);
    keyringController.clearKeyrings();
    expect(keyringController.store.getVault().length).toBe(0);
    expect(keyringController.ramStore.getKeyrings().length).toBe(0);
});

test("Testing get Keyring by account", () => {
    let params = {
        account: "MyAccountUsername",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account, params.type);
    expect(keyringController.getKeyringByAccount(params.account)[0]["account"]).toBe(params.account);
});

test("Testing Get Accounts", () => {
    let params = {
        account1: "MyAccountUsername1",
        account2: "MyAccountUsername2",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account1, params.type);
    keyringController.addNewAccount(params.account2, params.type);
    expect(keyringController.getAccounts()).toStrictEqual([params.account1, params.account2]);
});