const fs = require("fs");
const util = require("util");
const pathUtils = require("path");
const FileNotFoundException = require("../exceptions/fileNotFoundException");

const readDatabaseAsync = async () => {
    const readFileAsync = util.promisify(fs.readFile);

    const dirPath = pathUtils.resolve(__dirname, "../../", "apps.data");
    if (!fs.existsSync(dirPath)) {
        throw new FileNotFoundException();
    }

    return await readFileAsync(dirPath);
}

module.exports = {
    readDatabaseAsync
}
