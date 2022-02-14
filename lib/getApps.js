const { findAllAsync } = require("./daos/appDao");

const getApps = async () => await findAllAsync();

module.exports = getApps;
