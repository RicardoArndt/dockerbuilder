const appDao = require("./daos/appDao");
const appIsRunningCommand = require("./commands/appIsRunningCommand");

const getApps = async () => {
    const apps = await appDao.findAllAsync();
    const appsRunning = await appIsRunningCommand.executeAsync(apps.map(app => app.name));
    return apps.map(app => {
        return {
            name: app.name,
            path: app.path,
            isRunning: appsRunning.find(appRunning => appRunning.name === app.name).isRunning
        }; 
    });
}

module.exports = getApps;
