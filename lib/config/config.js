class Config {
    
    static isCreated = false;

    constructor(config) {
        if(!this.isCreated) {
            this.settings = config;
        }
    }

    getParameter(key) {
        return this.settings[key];
    }
    
    setParameter(key, value) {
        this.settings.key = value;
    } 
    
}

/*var Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

var settings = {};

function loadDefaultConfig() {
    settings = config;
}

function getParameter(key) {
    return settings[key];
}

function setParameter(key, value) {
    settings.key = value;
}*/

//export default loadDefaultConfig;
//export default getParameter;
//export default setParameter;

module.exports = {
    Config: Config
};