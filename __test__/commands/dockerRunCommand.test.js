"use strict";

const dockerRunCommand = require("../../lib/commands/dockerRunCommand");

describe("dockerRunCommand", () => {
    test("should execute right run command", async () => {
        const onStdout = jest.fn((_) => Promise.resolve());
        const onStderr = jest.fn((_) => Promise.resolve());
        const onMain = jest.fn((_) => Promise.resolve());
        const execResult = {
            stdout: {
                on: onStdout
            },
            stderr: {
                on: onStderr
            },
            on: onMain
        };
        const execAsync = jest.fn((_) => execResult);
        require("child_process").spawn = execAsync;

        const socket = {
            emit: jest.fn()
        };
        await dockerRunCommand.executeAsync(4001, "MyApp", socket);

        expect(execAsync).toHaveBeenCalledWith(
            "docker run", 
            ["-d -p 4001:80 --name MyAppContainer docker/myapp"], 
            {
                shell: true
            });
        expect(onStdout).toHaveBeenCalledWith("data", expect.anything());
        expect(onStderr).toHaveBeenCalledWith("data", expect.anything());
        expect(onMain).toHaveBeenCalledWith("close", expect.anything());
    });
});
