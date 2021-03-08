// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');
const { parseBool } = require('../../utils/validation');


// Bootstrap a trusted node DAO uint setting
function bootstrapUint(contractName, settingPath, value) {

    // Get config
    const config = getConfig();

    // Validate args
    if (isNaN(parseFloat(value))) throw new Error('Invalid value');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & TN DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAONodeTrusted'),
    ]).then(([coinbase, rocketDAONodeTrusted]) => {
        return rocketDAONodeTrusted.methods.bootstrapSettingUint(contractName, settingPath, value).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set %s:%s to %f', contractName, settingPath, value);
    });

}


// Bootstrap a trusted node DAO bool setting
function bootstrapBool(contractName, settingPath, valueStr) {

    // Get config
    const config = getConfig();

    // Validate args
    value = parseBool(valueStr);

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & TN DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAONodeTrusted'),
    ]).then(([coinbase, rocketDAONodeTrusted]) => {
        return rocketDAONodeTrusted.methods.bootstrapSettingBool(contractName, settingPath, value).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set %s:%s to %s', contractName, settingPath, value);
    });

}


// Export command
module.exports = {
    bootstrapUint: createCommand('bootstrap-tn-dao-uint')
        .arguments('<contract-name> <setting-path> <value>')
        .description('bootstrap a trusted node DAO uint setting')
        .action(bootstrapUint),
    bootstrapBool: createCommand('bootstrap-tn-dao-bool')
        .arguments('<contract-name> <setting-path> <value>')
        .description('bootstrap a trusted node DAO bool setting')
        .action(bootstrapBool)
};

