class FileNotFoundException extends Error {
    constructor() {
        super("Database file not found, save one app first");
    }
}

module.exports = FileNotFoundException;
