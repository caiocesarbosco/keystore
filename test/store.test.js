const storage = require('../lib/store/store.js');

test("Testing Updating Profile List", () => {
    storage.purge();
    storage.updateProfileList("Profile 1");
    storage.updateProfileList("Profile 2");
    expect(storage.getProfileList()).toStrictEqual(["Profile 1", "Profile 2"]);
});

test("Testing no Duplicate Profile List", () => {
    storage.purge();
    storage.updateProfileList("Profile 1");
    storage.updateProfileList("Profile 1");
    expect(storage.getProfileList()).toStrictEqual(["Profile 1"]);
});

test("Testing get Exist Profile Data", () => {
    storage.purge();
    storage.saveProfile("Profile 1", "Profile1Data");
    expect(storage.getProfile("Profile 1")).toStrictEqual("Profile1Data");
});

test("Testing get unexist Profile Data", () => {
    storage.purge();
    expect(storage.getProfile("Profile 1")).toStrictEqual({});
});

test("Testing purge storage", () => {
    storage.saveProfile("Profile 1", "Profile1Data");
    storage.updateProfileList("Profile 1");
    storage.purge();
    expect(storage.getProfileList()).toStrictEqual([]);
    expect(storage.getProfile("Profile 1")).toStrictEqual({});
});

test("Testing drop Profile Data", () => {
    storage.saveProfile("Profile 1", "Profile1Data");
    storage.purge();
    expect(storage.getProfile("Profile 1")).toStrictEqual({});
});