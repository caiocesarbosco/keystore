async function storageKeyFileExist() {

    var publicKeys = "";
    publicKeys = await getPublicKeys();
    if(!publicKeys || publicKeys.lenght == 0) {
        return false;
    } else {
        return true;
    }
}

function generateKeyPair() {
    let (publicKey, privateKey) = nacl.box.keyPair;
}

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}

const getPublicKeys = () => {
    return toPromise((resolve, reject) => {
        chrome.storage.local.get(['publicKeys'], (result) => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);

            const researches = result.publicKeys ?? [];
            resolve(researches);
        });
    });
}