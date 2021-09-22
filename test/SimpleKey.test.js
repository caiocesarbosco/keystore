const simpleKeyring = require('../controllers/Keyring/SimpleKeyring.js');

test("Testing Simplekeyring Get Keyring", () => {

    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "Myaccount");
    expect(keyring.getKeyring()).toStrictEqual(
        [ 
            {
                account: "Myaccount",
                type: "master",
                masterKey: "Myaccount"
            }
        ]
    );

});

test("Testing Import Object Constructor" , async () => {

    let importObj = [ 
        { 
            account: 'MyAccount1', 
            type: 'master', 
            masterKey: 'MyMasterKey' 
        } 
    ];    
    let keyring = new simpleKeyring.SimpleKeyring("", "", importObj, true);
    expect(keyring.getKeyring()).toStrictEqual(importObj);

});

test("Testing Simplekeyring Account List", () => {

    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    expect(keyring.getAccounts()).toStrictEqual([ 'Myaccount' ]);

});

test("Testing Simplekeyring Adding Account", () => {

    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    keyring.addAccount("Myaccount2","MyMasterKey2");
    expect(keyring.getAccounts()).toStrictEqual([ 'Myaccount', 'Myaccount2' ]);

});

test("Testing get public info", () => {
    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    expect(keyring.getPublicInfo()).toStrictEqual(
        [
            {
                account: "Myaccount",
                type: "master"
            }
        ]
    );
});

test("Testing get priv info", () => {
    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    expect(keyring.getPrivateInfo("Myaccount")).toStrictEqual("MyMasterKey");
});