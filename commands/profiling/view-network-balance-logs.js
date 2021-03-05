// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// View the network balance logs
function viewNetworkBalanceLogs() {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get & print logs
    getContract(web3, 'RocketNetworkBalances').then(rocketNetworkBalances => {
        Promise.all([
            rocketNetworkBalances.getPastEvents('BalancesSubmitted', {fromBlock: 0}),
            rocketNetworkBalances.getPastEvents('BalancesUpdated', {fromBlock: 0}),
        ]).then(([balancesSubmittedEvents, balancesUpdatedEvents]) => {

            const submitted = balancesSubmittedEvents.map(event => ({
                block: parseInt(event.returnValues.block),
                totalEth:   event.returnValues.totalEth,
                stakingEth: event.returnValues.stakingEth,
                rethSupply: event.returnValues.rethSupply,
                from: event.returnValues.from,
            }));

            const updated = balancesUpdatedEvents.map(event => ({
                block: parseInt(event.returnValues.block),
                totalEth:   event.returnValues.totalEth,
                stakingEth: event.returnValues.stakingEth,
                rethSupply: event.returnValues.rethSupply,
            }));

            const events = updated.map(e => ({
                block: e.block,
                updated: {
                    totalEth: e.totalEth,
                    stakingEth: e.stakingEth,
                    rethSupply: e.rethSupply,
                },
                submitted: [],
            })).sort((a, b) => (a.block - b.block));
            submitted.forEach(e => {
                const event = events.find(event => (event.block == e.block));
                if (event === undefined) return;
                event.submitted.push({
                    from: e.from,
                    match: (
                        web3.utils.toBN(e.totalEth  ).eq(web3.utils.toBN(event.updated.totalEth  )) &&
                        web3.utils.toBN(e.stakingEth).eq(web3.utils.toBN(event.updated.stakingEth)) &&
                        web3.utils.toBN(e.rethSupply).eq(web3.utils.toBN(event.updated.rethSupply))
                    ),
                });
            });

            console.log('----------');
            submitted.forEach(event => {
                console.log(event);
            });
            console.log('----------');
            events.forEach(event => {
                console.log(event);
            });
            console.log('----------');

        });
    });

}


// Export command
module.exports = createCommand('view-network-balance-logs')
    .description('view the network balance logs')
    .action(viewNetworkBalanceLogs);

