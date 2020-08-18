// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Register a node
function nodeRegister(address, timezone) {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (!Web3.utils.isAddress(address)) throw new Error('Invalid address');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, 'RocketNodeManager'),
    ]).then(([RocketNodeManager]) => {
        return RocketNodeManager.methods.registerNode(timezone).send({
            from: address,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully registered node using account %s', address);
    });

}


// Export command
module.exports = createCommand('node-register')
    .arguments('<address> <timezone>')
    .description('register a node with Rocket Pool')
    .action(nodeRegister);

