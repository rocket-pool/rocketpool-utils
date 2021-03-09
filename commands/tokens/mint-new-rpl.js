// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Mint an amount of new RPL to an account
function mintNewRpl(address, rplAmount) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(address)) throw new Error('Invalid address');
    if (isNaN(parseFloat(rplAmount))) throw new Error('Invalid RPL amount');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & RPL contracts, send transactions
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketTokenDummyRPL'),
        getContract(web3, 'RocketTokenRPL'),
    ]).then(([coinbase, rocketTokenDummyRpl, rocketTokenRpl]) => {
        return rocketTokenDummyRpl.methods.mint(address, web3.utils.toWei(rplAmount, 'ether')).send({
            from: coinbase,
            gas: config.gasLimit,
        }).then(rocketTokenDummyRpl.methods.approve(rocketTokenRpl._address, web3.utils.toWei(rplAmount, 'ether')).send({
            from: address,
            gas: config.gasLimit,
        }).then(rocketTokenRpl.methods.swapTokens(web3.utils.toWei(rplAmount, 'ether')).send({
            from: address,
            gas: config.gasLimit,
        })));
    }).then((receipt) => {
        console.log('Successfully minted %f new RPL to %s', rplAmount, address);
    });

}


// Export command
module.exports = createCommand('mint-new-rpl')
    .arguments('<address> <rpl-amount>')
    .description('mint an amount of new RPL to an account')
    .action(mintNewRpl);

