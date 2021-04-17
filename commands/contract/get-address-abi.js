// imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Get a contracts address and ABI easily
function getAddressABI(contractName) {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (contractName.length <= 3) throw new Error('Invalid contract name');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, contractName)
    ]).then(([RocketContract]) => {
        console.log('');
        console.log('Successfully retrieved contract %s Address & ABI', contractName);
        console.log('');

        console.log('ABI:');
        console.log(JSON.stringify(RocketContract.options.jsonInterface, null, 4));
        console.log('');
        console.log('ABI Compact:');
        console.log(JSON.stringify(RocketContract.options.jsonInterface));
        console.log('');
        console.log('Address:');
        console.log(RocketContract.options.address);
    });

}


// Export command
module.exports = createCommand('contract-address-abi')
    .arguments('<contractName>')
    .description('get a contracts address and ABI')
    .action(getAddressABI);

