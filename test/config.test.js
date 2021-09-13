const config = require('../lib/config/config.js');
const configFile = require('../config.json');

test("Testing Feature Flags Mechanism", () => {
    const settings = new config.Config(configFile["encryptor"]);
    expect(settings.getParameter('encrypt_algoritm')).toBe(configFile["encryptor"].encrypt_algoritm);
});