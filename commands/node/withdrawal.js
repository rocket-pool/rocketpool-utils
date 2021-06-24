// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Gets a pending node withdrawal address
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


// Sets a node withdrawal address
function setNodeWithdrawalAddress(nodeAddress, nodeWithdrawalAddress, confirm) {

    // as this is passed as a param, need to convert it to a boolean
    confirm = (confirm === "true");

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (!Web3.utils.isAddress(nodeAddress)) throw new Error('Invalid address');
    if (!Web3.utils.isAddress(nodeWithdrawalAddress)) throw new Error('Invalid address');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, 'RocketNodeManager'),
    ]).then(([RocketNodeManager]) => {
        return RocketNodeManager.methods.setWithdrawalAddress(nodeAddress, nodeWithdrawalAddress, confirm).send({
            from: nodeAddress,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log(receipt);
        console.log('Successfully set withdrawal address as %s', nodeWithdrawalAddress);
        console.log('Confirm?: %s', confirm);
        console.log(typeof confirm);
    });

}


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
module.exports = {
    getPendingNodeWithdrawalAddress: createCommand('node-get-pending-withdrawal-address')
        .arguments('<nodeAddress>')
        .description('gets a pending withdrawal address for a registered node')
        .action(getPendingNodeWithdrawalAddress),
    setNodeWithdrawalAddress: createCommand('node-set-withdrawal-address')
        .arguments('<nodeAddress> <nodeWithdrawalAddress> <confirm>')
        .description('set a withdrawal address for a registered node')
        .action(setNodeWithdrawalAddress),
    confirmNodeWithdrawalAddress: createCommand('node-confirm-pending-withdrawal-address')
        .arguments('<nodeAddress> <pendingAddress>')
        .description('confirm a pending withdrawal address for a registered node')
        .action(confirmNodeWithdrawalAddress),
};