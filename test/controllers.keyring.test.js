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

test("Test add Account", async () => {
    let params = {
        profile: "MyProfile",
        password: "MyPassword",
        account: "MyAccountUsername",
        masterKey: "MyMasterKey",
        account2: "MyAccountUsername2",
        masterKey2: "MyMasterKey2",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    await keyringController.createProfile(params.profile, params.account, params.masterKey, params.password);
    await keyringController.addNewAccount(params.profile, params.account2, params.masterKey2, params.password);
    expect(keyringController.getAccounts(params.profile)).toStrictEqual(["MyAccountUsername", "MyAccountUsername2"]);
});

test("Test default locking Keyring Controller", () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.isEmpty()).toBe(true);
    expect(keyringController.store.isEmpty()).toBe(true);
})

test("Test locking Keyring Controller", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.setLocked();
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);
    expect(keyringController.ramStore.isEmpty()).toBe(true);
});

test("Test unlocking Keyring Controller", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "Account 1", "Master Key", "1234");
    await keyringController.setUnlocked("Profile 1", "1234");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
});




test("Test Vault Signature Verify with wrong password", async () => {

    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "Account 1", "Master Key", "1234");
    expect(await keyringController.store.verifyVaultSignature("Profile 1", "4321")).toBe(false);
});


test("Testing Lock followed by Unlock using right password", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "Account 1", "Master Key", "1234");
    await keyringController.setLocked();
    await keyringController.setUnlocked("Profile 1", "1234");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(false);
    expect(keyringController.ramStore.getPassword()).toBe("1234");
});


test("Testing Lock followed by Unlock using wrong password", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "Account 1", "Master Key", "1234");
    await keyringController.setLocked();
    await keyringController.setUnlocked("Profile 1", "4321");
    expect(keyringController.ramStore.isRamStoreLocked()).toBe(true);
    expect(keyringController.ramStore.getPassword()).toBe(null);

});

test("Testing if duplicated keyring is not inserted on Keyring Array", async () => {
    let params = {
        profile: "MyProfile",
        password: "MyPassword",
        account: "MyAccountUsername",
        masterKey: "MyMasterKey",
        account2: "MyAccountUsername2",
        masterKey2: "MyMasterKey2",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    await keyringController.createProfile(params.profile, params.account, params.masterKey, params.password);
    await keyringController.addNewAccount(params.profile, params.account, params.masterKey, params.password);
    expect(keyringController.getAccounts(params.profile)).toStrictEqual(["MyAccountUsername"]);

});

test("Clear Keyrings Test", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "Account 1", "Master Key", "1234");
    expect(keyringController.store.isEmpty()).toBe(false);
    expect(keyringController.ramStore.isEmpty()).toBe(false);
    keyringController.clearKeyrings();
    expect(keyringController.store.isEmpty()).toBe(true);
    expect(keyringController.ramStore.isEmpty()).toBe(true);
});

/*

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

test("Testing remove Account", async () => {
    let params = {
        account1: "MyAccountUsername1",
        account2: "MyAccountUsername2",
        type: KeyringController.KeyringType.SIMPLE_KEYRING
    };
    let keyringController = new KeyringController.KeyringController();
    keyringController.addNewAccount(params.account1, params.type);
    keyringController.addNewAccount(params.account2, params.type);
    await keyringController.submitPassword("1234");
    await keyringController.verifyPassword("1234");
    await keyringController.removeAccount(params.account1);
    keyringController.ramStore.clearKeyrings();
    await keyringController.setUnlocked("1234");
    expect(keyringController.getAccounts()).toStrictEqual([params.account2]);
});*/

test("Testing creating profile with keyring account", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "MyAccount1", "MyMasterKey", "MyPassword");
    let publicKeyring = await keyringController.store.getPublicInfo("Profile 1", "MyPassword");
    expect(publicKeyring).toStrictEqual(        
        [ 
            {
                account: "MyAccount1",
                type: "master",
            }
    ]);
});

test("Testing Updating Profile List", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    let profileList = keyringController.store.getProfiles();
    expect(profileList).toStrictEqual([]);
    await keyringController.createProfile("Profile 1", "MyAccount1", "MyMasterKey", "MyPassword");
    profileList = keyringController.store.getProfiles();
    expect(profileList).toStrictEqual(["Profile 1"]);
    await keyringController.createProfile("Profile 2", "MyAccount1", "MyMasterKey", "MyPassword");
    profileList = keyringController.store.getProfiles();
    expect(profileList).toStrictEqual(["Profile 1", "Profile 2"]);
});

test("Testing remove account from a Profile", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "MyAccount1", "MyMasterKey", "MyPassword");
    await keyringController.store.addNewAccount("Profile 1", "MyAccount2", "MyMasterKey2", "MyPassword");
    await keyringController.store.removeAccount("Profile 1", "MyAccount1", "MyPassword");
    let publicKeyring = await keyringController.store.getPublicInfo("Profile 1", "MyPassword");
    expect(publicKeyring).toStrictEqual([ {
        account: "MyAccount2",
        type: "subaccount"
    }]);
});

test("Testing add account from a Profile", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "MyAccount1", "MyMasterKey", "MyPassword");
    await keyringController.store.addNewAccount("Profile 1", "MyAccount2", "MyMasterKey2", "MyPassword");
    let publicKeyring = await keyringController.store.getPublicInfo("Profile 1", "MyPassword");
    expect(publicKeyring).toStrictEqual([{
        account: "MyAccount1",
        type: "master"
    }, 
    {
        account: "MyAccount2",
        type: "subaccount"
    }]);
});

test("Testing Removing Profile Data", async () => {
    let keyringController = new KeyringController.KeyringController();
    keyringController.store.cleanVault();
    await keyringController.createProfile("Profile 1", "MyAccount1", "MyMasterKey", "MyPassword");
    expect(keyringController.store.isEmpty()).toBe(false);
    await keyringController.store.removeProfile("Profile 1", "MyPassword");
    expect(keyringController.store.isEmpty()).toBe(true);
});
