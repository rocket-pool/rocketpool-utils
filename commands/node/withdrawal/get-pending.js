// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../../utils/config');
const { getContract } = require('../../../utils/contract');


// Sets a node withdrawal address
function getPendingNodeWithdrawalAddress(nodeAddress) {

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
        return RocketNodeManager.methods.getNodePendingWithdrawalAddress(nodeAddress).call();
    }).then((pendingAddress) => {
        console.log(pendingAddress);
        console.log('Pending node withdrawal address for %s is %s', nodeAddress, pendingAddress);
    });

}


// Export command
module.exports = createCommand('node-get-pending-withdrawal-address')
    .arguments('<nodeAddress>')
    .description('get a pending withdrawal address for a registered node')
    .action(getPendingNodeWithdrawalAddress);

