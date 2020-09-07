// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../utils/config');
const { getContract } = require('../utils/contract');
const { parseBool } = require('../utils/validation');


// Set a node's trusted status
function setNodeTrusted(nodeAddress, trusted) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(nodeAddress)) throw new Error('Invalid address');
    trusted = parseBool(trusted);

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get owner account & node manager contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketNodeManager'),
    ]).then(([owner, rocketNodeManager]) => {
        return rocketNodeManager.methods.setNodeTrusted(nodeAddress, trusted).send({
            from: owner,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully set trusted status for node %s to %s', nodeAddress, trusted);
    });

}


// Export command
module.exports = createCommand('set-node-trusted')
    .arguments('<node-address> <trusted>')
    .description('make a user deposit from the coinbase account')
    .action(setNodeTrusted);

