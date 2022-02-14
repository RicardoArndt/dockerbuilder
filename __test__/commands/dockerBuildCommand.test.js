'use strict';

const dockerBuildCommand = require("../../lib/commands/dockerBuildCommand");

jest.mock("child_process");

describe("dockerBuildCommand", () => {
    test("should execute right build command", async () => {
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
        await dockerBuildCommand.executeAsync("path", "MyApp", socket);

        expect(execAsync).toHaveBeenCalledWith(
            "docker build .", 
            ["-t docker/myapp"], 
            { 
                cwd: "path",
                shell: true
            });
        expect(onStdout).toHaveBeenCalledWith("data", expect.anything());
        expect(onStderr).toHaveBeenCalledWith("data", expect.anything());
        expect(onMain).toHaveBeenCalledWith("close", expect.anything());
    });
});
