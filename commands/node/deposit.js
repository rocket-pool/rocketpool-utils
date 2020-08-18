// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Register a node
function nodeDeposit(address, minNodeFee, ethAmount) {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (!Web3.utils.isAddress(address)) throw new Error('Invalid address');
    if (isNaN(parseFloat(minNodeFee))) throw new Error('Invalid minNodeFee amount');
    if (isNaN(parseFloat(ethAmount))) throw new Error('Invalid ether amount');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, 'RocketNodeDeposit'),
    ]).then(([RocketNodeDeposit]) => {
        return RocketNodeDeposit.methods.deposit(web3.utils.toWei(minNodeFee, 'ether')).send({
            from: address,
            value: web3.utils.toWei(ethAmount, 'ether'),
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully deposited with node account %s', address);
    });

}


// Export command
module.exports = createCommand('node-deposit')
    .arguments('<address> <min-node-fee> <eth-amount>')
    .description('make a node deposit')
    .action(nodeDeposit);

