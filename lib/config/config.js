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

module.exports = {
    Config: Config
};