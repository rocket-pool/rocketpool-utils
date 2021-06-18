// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../../utils/config');
const { getContract } = require('../../../utils/contract');


// confirms a pending node withdrawal address
function confirmNodeWithdrawalAddress(nodeAddress, pendingAddress) {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (!Web3.utils.isAddress(nodeAddress)) throw new Error('Invalid address');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, 'RocketNodeManager'),
    ]).then(([RocketNodeManager]) => {
        return RocketNodeManager.methods.confirmWithdrawalAddress(nodeAddress).send({from: pendingAddress});
    }).then((transaction) => {
        console.log(transaction);
        console.log('Confirmed node withdrawal address for %s is %s', nodeAddress, pendingAddress);
    });

}


// Export command
module.exports = createCommand('node-confirm-pending-withdrawal-address')
    .arguments('<nodeAddress> <pendingAddress>')
    .description('confirm a pending withdrawal address for a registered node')
    .action(confirmNodeWithdrawalAddress);

