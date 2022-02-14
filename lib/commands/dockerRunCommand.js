const executeAsync = async (portExpose, imageName, socket) => {
    socket.emit(
        "message", 
        Buffer.from(`Running command: docker run -d -p ${portExpose}:80 --name ${imageName}Container docker/${imageName.toLowerCase()}`, "utf8"));

    const { spawn } = require('child_process');
    const run = spawn("docker run", [`-d -p ${portExpose}:80 --name ${imageName}Container docker/${imageName.toLowerCase()}`], {
        shell: true
    });

    run.stdout.on("data", (data) => {
        socket.emit("message", data);
    });

    run.stderr.on("data", (data) => {
        socket.emit("message", data);
    });

    run.on('close', (code) => {
        socket.emit("message", Buffer.from(`Exit code: ${code}`));
    });
}

module.exports = {
    executeAsync
};
