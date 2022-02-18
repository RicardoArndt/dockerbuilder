const appDao = require("./daos/appDao");

const getApps = async () => {
    const apps = await appDao.findAllAsync();

    return apps;
}

module.exports = getApps;
