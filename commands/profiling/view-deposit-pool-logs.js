// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// View the deposit pool logs
function viewDepositLogs() {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get & print logs
    Promise.all([
        getContract(web3, 'RocketDepositPool'),
        getContract(web3, 'RocketMinipoolManager'),
    ]).then(([rocketDepositPool, rocketMinipoolManager]) => {
        rocketDepositPool.getPastEvents('DepositRecycled', {fromBlock: 0})
        .then(depositRecycledEvents => depositRecycledEvents.map(event => event.returnValues.from))
        .then(minipoolAddresses => rocketMinipoolManager.getPastEvents('MinipoolCreated', {fromBlock: 0, filter: {minipool: minipoolAddresses}}))
        .then(minipoolCreatedEvents => minipoolCreatedEvents.map(event => event.returnValues.node))
        .then(nodeAddresses => {
            console.log('----------');
            nodeAddresses.forEach(nodeAddress => {
                console.log(nodeAddress);
            });
            console.log('----------');
        });
    });

}


// Export command
module.exports = createCommand('view-deposit-logs')
    .description('view the deposit pool logs')
    .action(viewDepositLogs);

