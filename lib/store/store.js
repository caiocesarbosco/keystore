const LocalStorage = require('node-localstorage').LocalStorage;

let localStore = new LocalStorage('./vaultFile');

/**
 * Update Profile List with a new Profile Name.
 * It creates a new Profile Array if Profile List is Empty.
 * All Data is Persisted on Local Storage.
 * @param {String} profile Profile Name
 */
function updateProfileList(profile) {
    let profileNames = localStore.getItem("ProfileNames");
    if(profileNames == null) {
        profileNames = JSON.stringify(new Array(profile));
    } else {
        let arrayNames = JSON.parse(profileNames);
        if(arrayNames.find(elem => elem == profile) === undefined) {
            arrayNames.push(profile);
            profileNames = JSON.stringify(arrayNames);
        }
    }
    localStore.setItem("ProfileNames", profileNames);
}

/**
 * Get Profile List at Local Storage.
 * @returns {Obj} returns a Array containing registered Profile Names.
 */
function getProfileList() {
    let list = localStore.getItem("ProfileNames");
    return list == null ? [] : JSON.parse(list);
}

/**
 * Save Profile Data into Local Storage
 * @param {String} name Profile Name 
 * @param {String} profileData Serialized Profile Data
 */
function saveProfile(name, profileData) {
    localStore.setItem(name, profileData);
}

/**
 * Drops Profile Data of Local Storage.
 * Updates Profile List Name.
 * @param {String} name Profile Name 
 */
function dropProfile(name) {
    let profileNames = localStore.getItem("ProfileNames");
    if(profileNames != null) {
        let arrayNames = JSON.parse(profileNames);
        arrayNames = arrayNames.filter(elem => elem != name);
        profileNames = JSON.stringify(arrayNames);
        localStore.setItem("ProfileNames", profileNames);
        localStore.removeItem(name);
    }
}

/**
 * Get Profile Data by Profile Name
 * @param {String} name Profile Name 
 * @returns {Obj} returns a Profile Data Object
 */
function getProfile(name) {
    let profile = localStore.getItem(name);
    return profile == null ? {} : profile;
}

/**
 * Erase all Local Storage Information
 */
function purge() {
    localStore.clear();
}

module.exports = {
    updateProfileList: updateProfileList,
    getProfileList: getProfileList,
    saveProfile: saveProfile,
    getProfile: getProfile,
    dropProfile: dropProfile,
    purge: purge

};