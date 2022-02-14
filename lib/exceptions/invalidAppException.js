class InvalidAppException extends Error {
    constructor(message, name) {
        super(message ? message : `Invalid AppName ${name}`);
    }
}

module.exports = InvalidAppException;
