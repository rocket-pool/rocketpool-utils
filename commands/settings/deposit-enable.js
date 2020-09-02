// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Enable or disbale the deposits
function settingsDepositEnable(address, enable) {

    // Get config
    const config = getConfig();

    // Cast enable
    enable = (enable == 'true' || enable === true) ? true : false;

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (!Web3.utils.isAddress(address)) throw new Error('Invalid address');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, 'RocketDepositSettings'),
    ]).then(([RocketDepositSettings]) => {
        return RocketDepositSettings.methods.setDepositEnabled(enable).send({
            from: address,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully changed the deposit setting status to %s', enable ? "true" : "false");
    });

}


// Export command
module.exports = createCommand('settings-deposit-enable')
    .arguments('<address> <enabled>')
    .description('enable/disable the ETH deposits')
    .action(settingsDepositEnable);

