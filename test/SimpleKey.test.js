const simpleKeyring = require('../controllers/Keyring/SimpleKeyring.js');

test("Testing Simplekeyring Account List", () => {

    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    expect(keyring.getAccounts()).toStrictEqual([ 'Myaccount' ]);

});

test("Testing Simplekeyring Adding Account", () => {

    let keyring = new simpleKeyring.SimpleKeyring("Myaccount", "MyMasterKey");
    keyring.addAccount("Myaccount2","MyMasterKey2");
    expect(keyring.getAccounts()).toStrictEqual([ 'Myaccount', 'Myaccount2' ]);

});