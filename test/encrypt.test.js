const encryptor = require("../lib/encrypt/encrypt.js");

test("Testing Sign", async () => {
    const data = "My Test Signed Data";
    const derivedKey = await encryptor.deriveKey("1234");
    const signedData = await encryptor.signKeyPairFile(data, derivedKey.sign);
    const isValidSignature = await encryptor.verifyHmac(derivedKey.sign, signedData, data);
    expect(isValidSignature).toBe(true);
});

