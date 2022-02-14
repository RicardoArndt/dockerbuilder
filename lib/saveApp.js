const fs = require("fs");
const pathUtils = require("path");
const util = require("util");
const InvalidPathException = require("./exceptions/invalidPathException");
const appDao = require("./daos/appDao");
const InvalidAppException = require("./exceptions/invalidAppException");

const saveAppAsync = async (name, path) => {
    if (!fs.existsSync(path)) {
        throw new InvalidPathException(path);
    }

    if (await appDao.findPathByAppNameAsync(name)) {
        throw new InvalidAppException("The app already exists");
    }

    const appendFileAsync = util.promisify(fs.appendFile);
    const dirFile = pathUtils.resolve(__dirname, "../", "apps.data");
    await appendFileAsync(dirFile, `name=${name},path=${path}\n`);
};

module.exports = saveAppAsync;
