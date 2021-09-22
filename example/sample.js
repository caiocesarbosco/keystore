const KeyringController = require('../controllers/Keyring/controller.js');

const myProfile = "MyProfileName";
const myStcAccountName = "MyStcAccountName";
const myStcMasterkey = "MyStcMasterkey";
const myStcAccountName2 = "MyStcAccountName2";
const myStcMasterkey2 = "MyStcMasterkey2";
const rightProfilePassword = "MyRightProfilePassword";
const wrongProfilePassword = "MyWrongProfilePassword";

let keyringController = new KeyringController.KeyringController();

function listingProfiles() {
    console.log(keyringController.getProfilesName());
}

async function createProfile(profileName, stcAccountName, stcAccountMasterKey, password) {
    await keyringController.createProfile(profileName, stcAccountName, stcAccountMasterKey, password);
}

async function addAccount(profileName, stcAccountName, stcAccountMasterKey, password) {
    await keyringController.addNewAccount(profileName, stcAccountName, stcAccountMasterKey, password);
}

async function removeAccount(profileName, stcAccountName, password) {
    await keyringController.removeAccount(profileName, stcAccountName, password);
}

async function checkProfilePassword(profileName, password) {
    return await keyringController.store.verifyVaultSignature(profileName, password);
}

function getProfileAccounts(profileName, password) {
    return keyringController.getAccounts(profileName);
}

function getProfilePublicInfo() {
    return keyringController.ramStore.getPubKeyringData();
}

async function getProfilePrivateInfo(profileName, stcAccountName, password) {
    return await keyringController.store.getPrivateInfo(profileName, stcAccountName, password);
}

function lock() {
    keyringController.setLocked();
}

async function unlock(profileName, password) {
    await keyringController.setUnlocked(profileName, password);
}

async function main() {

    console.log("Initial Extension State...");
    keyringController.clearKeyrings();
    listingProfiles();
    console.log("");

    console.log("Checking Create Profile...");
    await createProfile(myProfile, myStcAccountName, myStcMasterkey, rightProfilePassword);
    listingProfiles();
    console.log("Profile Accounts: " + getProfileAccounts(myProfile));
    console.log("Profile Public Info: " + JSON.stringify(getProfilePublicInfo()));
    console.log("Profile Private " +  myStcAccountName + " Info: " + JSON.stringify(await getProfilePrivateInfo(myProfile, myStcAccountName, rightProfilePassword)));
    console.log("");

    console.log("Checking Profile Password Verify...");
    console.log("Checking Profile Password Using Right Password: " + await checkProfilePassword(myProfile, rightProfilePassword));
    console.log("Checking Profile Password Using Wrong Password: " + await checkProfilePassword(myProfile, wrongProfilePassword));
    console.log("");

    console.log("Checking Adding STC Account on Selected Profile...");
    await addAccount(myProfile, myStcAccountName2, myStcMasterkey2, rightProfilePassword);
    console.log("Profile Accounts: " + getProfileAccounts(myProfile));
    console.log("Profile Public Info: " + JSON.stringify(getProfilePublicInfo()));
    console.log("Profile Private " +  myStcAccountName2 + " Info: " + JSON.stringify(await getProfilePrivateInfo(myProfile, myStcAccountName2, rightProfilePassword)));
    console.log("");

    console.log("Checking Removing STC Account from Selected Profile...");
    await removeAccount(myProfile, myStcAccountName, rightProfilePassword);
    console.log("Profile Accounts: " + getProfileAccounts(myProfile));
    console.log("Profile Public Info: " + JSON.stringify(getProfilePublicInfo()));
    console.log("Profile Private " +  myStcAccountName2 + " Info: " + JSON.stringify(await getProfilePrivateInfo(myProfile, myStcAccountName2, rightProfilePassword)));
    console.log("");

    console.log("Testing Locking Extension...");
    lock();
    console.log("Profile Accounts: " + getProfileAccounts(myProfile));
    console.log("Profile Public Info: " + JSON.stringify(getProfilePublicInfo()));
    console.log("Profile Private " +  myStcAccountName2 + " Info: " + JSON.stringify(await getProfilePrivateInfo(myProfile, myStcAccountName2, rightProfilePassword)));
    console.log("");

    console.log("Testing unlocking Extension...");
    await unlock(myProfile, rightProfilePassword);
    console.log("Profile Accounts: " + getProfileAccounts(myProfile));
    console.log("Profile Public Info: " + JSON.stringify(getProfilePublicInfo()));
    console.log("Profile Private " +  myStcAccountName2 + " Info: " + JSON.stringify(await getProfilePrivateInfo(myProfile, myStcAccountName2, rightProfilePassword)));
    console.log("");
}

main();