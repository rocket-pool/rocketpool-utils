// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../utils/config');
const { getContract } = require('../utils/contract');


// Make a user deposit from the coinbase account
function userDeposit(ethAmount) {

    // Get config
    const config = getConfig();

    // Validate args
    if (isNaN(parseFloat(ethAmount))) throw new Error('Invalid ether amount');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & deposit contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDepositPool'),
    ]).then(([coinbase, rocketDepositPool]) => {
        return rocketDepositPool.methods.deposit().send({
            from: coinbase,
            value: web3.utils.toWei(ethAmount, 'ether'),
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully deposited %f ether', ethAmount);
    });

}


// Export command
module.exports = createCommand('user-deposit')
    .arguments('<eth-amount>')
    .description('make a user deposit from the coinbase account')
    .action(userDeposit);

