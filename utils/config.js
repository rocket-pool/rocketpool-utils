// Imports
const { program } = require('commander');
const config = require('../config');


// Get network config
function getConfig() {
    let cfg = config.networks[program.network];
    if (cfg === undefined) throw new Error('Invalid network specified');
    return cfg;
}


// Exports
module.exports = { getConfig };
