// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Submit minipool withdrawable status
function submitMinipoolWithdrawable(fromAddress, minipoolAddress, startBalance, endBalance) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(fromAddress)) throw new Error('Invalid from address');
    if (!Web3.utils.isAddress(minipoolAddress)) throw new Error('Invalid minipool address');
    if (isNaN(parseFloat(startBalance))) throw new Error('Invalid start balance');
    if (isNaN(parseFloat(endBalance))) throw new Error('Invalid end balance');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & minipool status contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketMinipoolStatus'),
    ]).then(([coinbase, rocketMinipoolStatus]) => {
        return rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress, startBalance, endBalance).send({
            from: fromAddress,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully submitted minipool %s withdrawable status', minipoolAddress);
    });

}


// Export command
module.exports = createCommand('submit-minipool-withdrawable')
    .arguments('<from-address> <minipool-address> <start-balance> <end-balance>')
    .description('submit minipool withdrawable status')
    .action(submitMinipoolWithdrawable);

