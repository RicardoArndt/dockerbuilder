"use strict";

jest.mock("../../lib/database/readDatabaseApps");

describe("appDao", () => {
    beforeEach(() => {
        require("../../lib/database/readDatabaseApps").readDatabaseAsync = () => {
            return Promise.resolve(
                "name=TestApp1,path=TestPath1\n" + 
                "name=TestApp2,path=TestPath2\n" +
                "name=TestApp3,path=TestPath3\n");
        }
    });

    test("should return right path", async () => {
        const appDao = require("../../lib/daos/appDao");

        const result = await appDao.findPathByAppNameAsync("TestApp2");

        expect(result).toBe("TestPath2");
    });

    test("should returns all apps", async () => {
        const appDao = require("../../lib/daos/appDao");

        const result = await appDao.findAllAsync();

        expect(result.length).toBe(3);
        expect(result[0].name).toBe("TestApp1");
        expect(result[0].path).toBe("TestPath1");
        expect(result[1].name).toBe("TestApp2");
        expect(result[1].path).toBe("TestPath2");
        expect(result[2].name).toBe("TestApp3");
        expect(result[2].path).toBe("TestPath3");
    });
});
