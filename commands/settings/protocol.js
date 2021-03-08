// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');
const { parseBool } = require('../../utils/validation');


// Bootstrap a protocol DAO address setting
function bootstrapAddress(contractName, settingPath, value) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(value)) throw new Error('Invalid address');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & protocol DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAOProtocol'),
    ]).then(([coinbase, rocketDAOProtocol]) => {
        return rocketDAOProtocol.methods.bootstrapSettingAddress(contractName, settingPath, value).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set %s:%s to %s', contractName, settingPath, value);
    });

}


// Bootstrap a protocol DAO bool setting
function bootstrapBool(contractName, settingPath, valueStr) {

    // Get config
    const config = getConfig();

    // Validate args
    value = parseBool(valueStr);

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & protocol DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAOProtocol'),
    ]).then(([coinbase, rocketDAOProtocol]) => {
        return rocketDAOProtocol.methods.bootstrapSettingBool(contractName, settingPath, value).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set %s:%s to %s', contractName, settingPath, value);
    });

}


// Bootstrap a protocol DAO uint setting
function bootstrapUint(contractName, settingPath, value) {

    // Get config
    const config = getConfig();

    // Validate args
    if (isNaN(parseFloat(value))) throw new Error('Invalid value');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & protocol DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAOProtocol'),
    ]).then(([coinbase, rocketDAOProtocol]) => {
        return rocketDAOProtocol.methods.bootstrapSettingUint(contractName, settingPath, value).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set %s:%s to %f', contractName, settingPath, value);
    });

}


// Export command
module.exports = {
    bootstrapAddress: createCommand('bootstrap-protocol-dao-address')
        .arguments('<contract-name> <setting-path> <value>')
        .description('bootstrap a protocol DAO address setting')
        .action(bootstrapAddress),
    bootstrapBool: createCommand('bootstrap-protocol-dao-bool')
        .arguments('<contract-name> <setting-path> <value>')
        .description('bootstrap a protocol DAO bool setting')
        .action(bootstrapBool),
    bootstrapUint: createCommand('bootstrap-protocol-dao-uint')
        .arguments('<contract-name> <setting-path> <value>')
        .description('bootstrap a protocol DAO uint setting')
        .action(bootstrapUint),
};

