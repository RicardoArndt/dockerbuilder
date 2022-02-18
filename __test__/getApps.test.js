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
        require("../lib/daos/appDao").findAllAsync = () => Promise.resolve(mockApps);

        const apps = await getApps();

        expect(apps).toEqual(mockApps);
    });
});
