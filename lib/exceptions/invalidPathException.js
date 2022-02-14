class InvalidPathException extends Error {
    constructor(path) {
        super(`Invalid Path ${path}`);
    }
}

module.exports = InvalidPathException;
