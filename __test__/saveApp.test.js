const saveApp = require("../lib/saveApp");
const pathUtils = require("path");

jest.mock("util");
jest.mock("../lib/daos/appDao");

describe("saveApp", () => {
    test("should dispatch InvalidPathException if file does not exists", async () => {
        try {
            await saveApp("appName", "appPath");
        } catch (err) {
            expect(err.message).toBe("Invalid Path appPath");
        }
    });

    test("should dispatch InvalidPathException if file does not exists", async () => {
        try {
            const appendFile = jest.fn((_) => Promise.resolve());
            require("util").promisify = () => appendFile;
            require("../lib/daos/appDao").findPathByAppNameAsync = () => Promise.resolve("Path");

            await saveApp("TestApp", __dirname);
        } catch (err) {
            expect(err.message).toBe("The app already exists");
        }
    });

    test("should save the app", async () => {
        const appendFile = jest.fn((_) => Promise.resolve());
        require("util").promisify = () => appendFile;
        require("../lib/daos/appDao").findPathByAppNameAsync = () => Promise.resolve("");

        await saveApp("TestApp", __dirname);

        const dirFile = pathUtils.resolve(__dirname, "../", "apps.data");
        
        expect(appendFile).toHaveBeenCalledWith(dirFile, `name=TestApp,path=${__dirname}\n`);
    });
});
