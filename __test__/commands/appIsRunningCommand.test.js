'use strict';

const appIsRunningCommand = require("../../lib/commands/appIsRunningCommand");
const mockSpawn = require('mock-spawn');

jest.mock("child_process");

describe("appIsRunningCommand", () => {
    test("should return false and true", async () => {
        var mySpawn = mockSpawn();
        require('child_process').spawn = mySpawn;

        mySpawn.setDefault(mySpawn.simple(1, 'CONTAINER ID   IMAGE                              COMMAND                  CREATED        STATUS                       PORTS                              NAMES'
        + '5bc31075ceb1   docker/contacorrenteapp            "/docker-entrypoint.…"   2 weeks ago    Exited (255) 2 minutes ago   0.0.0.0:4000->80/tcp               ContaCorrenteAppContainer'
        + '4064e9f2e95e   docker/retaguardaapp               "/docker-entrypoint.…"   4 weeks ago    Exited (255) 3 weeks ago     0.0.0.0:4001->80/tcp               RetaguardaAppContainer'
        + 'f5253a5ae0ad   mcr.microsoft.com/azure-sql-edge   "/opt/mssql/bin/perm…"   3 months ago   Exited (255) 2 minutes ago   1401/tcp, 0.0.0.0:1433->1433/tcp   SQLServer'));

        const result = await appIsRunningCommand.executeAsync(["docker/MyApp", "docker/contacorrenteapp"]);

        expect(result).toEqual([
            {
                name: "docker/MyApp",
                isRunning: false
            },
            {
                name: "docker/contacorrenteapp",
                isRunning: true
            }
        ]);
        expect(mySpawn.calls[0].command).toBe("docker ps");
        expect(mySpawn.calls[0].args).toEqual({ shell: true });
    });
});
