const getApps = require("../lib/getApps");

jest.mock("../lib/daos/appDao");

describe("getApps", () => {
    test("should return apps", async () => {
        const mockApps = [
            {
                 path: "/Users/ricardoarndt/Documents/Projects/PortalFranqueado/portal-franqueado-contacorrente-retaguarda-app",
                 name: "ContaCorrenteApp"
            },
            {
                path: "/Users/ricardoarndt/Documents/Projects/PortalFranqueado/portal-franqueado-retaguarda-app",
                name: "RetaguardaApp"
            }
        ];

        const expectedApps = [
            {
                 path: "/Users/ricardoarndt/Documents/Projects/PortalFranqueado/portal-franqueado-contacorrente-retaguarda-app",
                 name: "ContaCorrenteApp",
                 isRunning: true
            },
            {
                path: "/Users/ricardoarndt/Documents/Projects/PortalFranqueado/portal-franqueado-retaguarda-app",
                name: "RetaguardaApp",
                isRunning: false
            }
        ];
        require("../lib/daos/appDao").findAllAsync = () => Promise.resolve(mockApps);
        require("../lib/commands/appIsRunningCommand").executeAsync = (_) => Promise.resolve([
            {
                name: "ContaCorrenteApp",
                isRunning: true
            },
            {
                name: "RetaguardaApp",
                isRunning: false
            }
        ]);

        const apps = await getApps();

        expect(apps).toEqual(expectedApps);
    });
});
