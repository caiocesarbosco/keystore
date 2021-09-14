const encryptor = require("../lib/encrypt/encrypt.js");

test("Testing Sign with Right Password", async () => {
    const data = "My Test Signed Data";
    const signedData = await encryptor.signKeyPairFile(data, "1234");
    const isValidSignature = await encryptor.verifyHmac("1234", signedData, data);
    expect(isValidSignature).toBe(true);
});

test("Testing Sign with Wrong Password", async () => {
    const data = "My Test Signed Data";
    const signedData = await encryptor.signKeyPairFile(data, "1234");
    const isValidSignature = await encryptor.verifyHmac("4321", signedData, data);
    expect(isValidSignature).toBe(false);
});

test("Testing Encryption", async () => {
    const data = "My Test Signed Data";
    let encryptedData = await encryptor.encryptsKeyPairFile(data, "1234");
    let decryptedData = await encryptor.decryptsKeyPairFile(encryptedData, "1234");
    expect(decryptedData).toBe(data);
});

