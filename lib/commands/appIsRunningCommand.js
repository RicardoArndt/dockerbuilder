const executeAsync = async (appsNames) => {
    const child = require('child_process');

    const build = child.spawn("docker ps", {
        shell: true
    });

    return new Promise((resolve, _) => {
        build.stdout.on("data", (data) => {
            const apps = data.toString();

            const result = appsNames.map(appName => {
                return {
                    name: appName,
                    isRunning: apps.includes(appName)
                }
            });
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
};
