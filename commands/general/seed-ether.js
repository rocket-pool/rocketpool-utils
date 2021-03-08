// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');


// Seed an account with ether from the coinbase account
function seedEther(address, ethAmount) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(address)) throw new Error('Invalid address');
    if (isNaN(parseFloat(ethAmount))) throw new Error('Invalid ether amount');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account, send transaction
    web3.eth.getAccounts().then((accounts) => {
        return accounts[0];
    }).then((coinbase) => {
        return web3.eth.sendTransaction({
            from: coinbase,
            to: address,
            value: web3.utils.toWei(ethAmount, 'ether'),
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully sent %f ether to %s', ethAmount, address);
    });

}


// Export command
module.exports = createCommand('seed-ether')
    .arguments('<address> <eth-amount>')
    .description('seed an account with ether from the coinbase account')
    .action(seedEther);

