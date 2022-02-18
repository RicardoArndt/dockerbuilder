const executeAsync = async (pathDockerfile, imageName, socket) => {
    socket.emit(
        "message", 
        Buffer.from(`Running command: docker build --no-cache -t docker/${imageName.toLowerCase()} .`, "utf8"));

    const child = require('child_process');

    const build = child.spawn("docker build", [`--no-cache -t docker/${imageName.toLowerCase()} .`], { 
        cwd: pathDockerfile,
        shell: true
    });

    build.stdout.on("data", (data) => {
        socket.emit("message", data);
    });

    build.stderr.on("data", (data) => {
        socket.emit("message", data);
    });

    return new Promise((resolve, _) => {
        build.on('close', (code) => {
            socket.emit("message", Buffer.from(`Exit code: ${code}`));

            resolve(true);
        });
    });
}

module.exports = {
    executeAsync
};
