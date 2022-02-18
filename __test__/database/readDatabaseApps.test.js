"use strict";

const pathUtils = require("path");

jest.mock("util");
jest.mock("fs");

describe("appDao", () => {
    test("should return FileNotFoundException", async () => {
        require("fs").existsSync = (_) => false;

        const database = require("../../lib/database/readDatabaseApps");

        try {
            await database.readDatabaseAsync();
        } catch (ex) {
            expect(ex.message).toBe("Database file not found, save one app first");
        }
    });

    test("should call fake fnReadFileAsync function", async () => {
        require("fs").existsSync = (_) => true;

        const readFileAsync = jest.fn((_) => Promise.resolve());
        require("util").promisify = () => readFileAsync;
        
        const database = require("../../lib/database/readDatabaseApps");

        await database.readDatabaseAsync();

        expect(readFileAsync).toHaveBeenCalledWith(pathUtils.resolve(__dirname, "../../", "apps.data"));
    });

    test("should return", async () => {
        require("fs").existsSync = (_) => true;

        const readFileAsync = jest.fn((_) => Promise.resolve(
            "name=TestApp1,path=TestPath1\n" + 
            "name=TestApp2,path=TestPath2\n" +
            "name=TestApp3,path=TestPath3\n"));
        require("util").promisify = () => readFileAsync;
        
        const database = require("../../lib/database/readDatabaseApps");

        const result = await database.readDatabaseAsync();

        expect(result).toBe(
            "name=TestApp1,path=TestPath1\n" + 
            "name=TestApp2,path=TestPath2\n" +
            "name=TestApp3,path=TestPath3\n");
    });
});
