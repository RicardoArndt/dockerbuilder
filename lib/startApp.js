const dockerBuildCommand = require("./commands/dockerBuildCommand");
const dockerRunCommand = require("./commands/dockerRunCommand");
const util = require("util");
const fp = require("find-free-port");
const { findPathByAppNameAsync } = require("./daos/appDao");
const InvalidAppException = require("./exceptions/invalidAppException");

const startAppAsync = async (name, socket) => {
    const path = await findPathByAppNameAsync(name);
    
    if (!path) {
        throw new InvalidAppException("", name);
    }

    await dockerBuildCommand.executeAsync(path, name, socket);
    
    const findPortAsync = util.promisify(fp);
    const port = await findPortAsync(4000);
    
    await dockerRunCommand.executeAsync(port, name, socket);
};

module.exports = startAppAsync;
