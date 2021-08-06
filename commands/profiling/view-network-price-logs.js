// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// View the network price logs
function viewNetworkPriceLogs() {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get & print logs
    getContract(web3, 'RocketNetworkPrices').then(rocketNetworkPrices => {
        Promise.all([
            rocketNetworkPrices.getPastEvents('PricesSubmitted', {fromBlock: 0}),
            rocketNetworkPrices.getPastEvents('PricesUpdated', {fromBlock: 0}),
        ]).then(([pricesSubmittedEvents, pricesUpdatedEvents]) => {

            const submitted = pricesSubmittedEvents.map(event => ({
                block: parseInt(event.returnValues.block),
                rplPrice: event.returnValues.rplPrice,
                effectiveRplStake: event.returnValues.effectiveRplStake,
                from: event.returnValues.from,
            }));

            const updated = pricesUpdatedEvents.map(event => ({
                block: parseInt(event.returnValues.block),
                rplPrice: event.returnValues.rplPrice,
                effectiveRplStake: event.returnValues.effectiveRplStake,
        }));

            const events = updated.map(e => ({
                block: e.block,
                updated: {
                    rplPrice: e.rplPrice,
                    effectiveRplStake: e.effectiveRplStake,
                },
                submitted: [],
            })).sort((a, b) => (a.block - b.block));
            submitted.forEach(e => {
                const event = events.find(event => (event.block == e.block));
                if (event === undefined) return;
                event.submitted.push({
                    from: e.from,
                    match: web3.utils.toBN(e.rplPrice).eq(web3.utils.toBN(event.updated.rplPrice)),
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
module.exports = createCommand('view-network-price-logs')
    .description('view the network price logs')
    .action(viewNetworkPriceLogs);

