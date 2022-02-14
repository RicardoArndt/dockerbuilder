const { readDatabaseAsync } = require("../database/readDatabaseApps");

const findPathByAppNameAsync = async (name) => {
    const database = await readDatabaseAsync();
    const lines = database.toString().split("\n");

    const appLine = lines.find(line => line.includes(name));

    if (!appLine) {
        return "";
    }

    const columns = appLine.split(",");

    const columnPath = columns.find(column => column.startsWith("path="));
    return columnPath.split("=")[1];
}

const findAllAsync = async () => {
    const database = await readDatabaseAsync();
    const lines = database.toString().split("\n");
    return lines.filter(line => line.includes("name=") && line.includes("path=")).map(line => {
        const columns = line.split(",");
        
        const name = columns.find(column => column.startsWith("name=")).split("=")[1];
        const path = columns.find(column => column.startsWith("path=")).split("=")[1];
        
        return {
            name,
            path
        };
    });
}

module.exports = {
    findPathByAppNameAsync,
    findAllAsync
}