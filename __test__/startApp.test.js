"use strict";

const startAppAsync = require("../lib/startApp");

jest.mock("child_process");
jest.mock("../lib/daos/appDao");
jest.mock("../lib/commands/dockerBuildCommand");
jest.mock("../lib/commands/dockerRunCommand");
jest.mock("find-free-port");
jest.mock("util");

describe("startAppAsync", () => {
    test("should throw new InvalidAppException", async () => {
        const findPortAsync = jest.fn((_) => Promise.resolve(4000));
        require("util").promisify = () => findPortAsync;

        const { findPathByAppNameAsync } = require("../lib/daos/appDao");
        findPathByAppNameAsync.mockImplementation((_) => Promise.resolve(""));

        const buildExecuteAsync = jest.fn();
        const dockerBuildCommand = require("../lib/commands/dockerBuildCommand");
        dockerBuildCommand.executeAsync = buildExecuteAsync;

        const commandExecuteAsync = jest.fn();
        const dockerRunCommand = require("../lib/commands/dockerRunCommand");
        dockerRunCommand.executeAsync = commandExecuteAsync;

        try {
            await startAppAsync("name");
        } catch (err) {
            expect(buildExecuteAsync).not.toHaveBeenCalledWith("path", "name");
            expect(commandExecuteAsync).not.toHaveBeenCalledWith(4000, "name");
            expect(err.message).toBe("Invalid AppName name");
        }
    });
    
    test("should run command with right app", async () => {
        const findPortAsync = jest.fn((_) => Promise.resolve(4000));
        require("util").promisify = () => findPortAsync;

        const { findPathByAppNameAsync } = require("../lib/daos/appDao");
        findPathByAppNameAsync.mockImplementation((_) => Promise.resolve("path"));

        const buildExecuteAsync = jest.fn();
        const dockerBuildCommand = require("../lib/commands/dockerBuildCommand");
        dockerBuildCommand.executeAsync = buildExecuteAsync;

        const commandExecuteAsync = jest.fn();
        const dockerRunCommand = require("../lib/commands/dockerRunCommand");
        dockerRunCommand.executeAsync = commandExecuteAsync;

        const socket = {
            emit: jest.fn()
        };
        await startAppAsync("name", socket);

        expect(buildExecuteAsync).toHaveBeenCalledWith("path", "name", socket);
        expect(commandExecuteAsync).toHaveBeenCalledWith(4000, "name", socket);
    });
});
