'use strict';

const dockerBuildCommand = require("../../lib/commands/dockerBuildCommand");
const mockSpawn = require('mock-spawn');

jest.mock("child_process");

describe("dockerBuildCommand", () => {
    test("should execute right build command", async () => {
        var mySpawn = mockSpawn();
        require('child_process').spawn = mySpawn;

        mySpawn.setDefault(mySpawn.simple(1, 'hello world'));

        const socket = {
            emit: jest.fn()
        };
        const result = await dockerBuildCommand.executeAsync("path", "MyApp", socket);

        expect(result).toBeTruthy();
        expect(mySpawn.calls[0].command).toBe("docker build .");
        expect(mySpawn.calls[0].args).toEqual(["-t docker/myapp"]);
    });
});
