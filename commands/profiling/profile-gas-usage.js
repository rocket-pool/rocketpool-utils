// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Profile network gas usage
function profileGasUsage() {

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get & print gas usage stats
    Promise.all([
        getContractEventTxReceipts(web3, 'RocketDepositPool', 'DepositReceived', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketTokenRETH', 'TokensBurned', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketNodeManager', 'NodeRegistered', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketNodeDeposit', 'DepositReceived', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketMinipoolManager', 'MinipoolDestroyed', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketNetworkBalances', 'BalancesSubmitted', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketNetworkPrices', 'PricesSubmitted', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketMinipoolStatus', 'MinipoolWithdrawableSubmitted', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketDAOProposal', 'ProposalVoted', {fromBlock: 0}),
        getContractEventTxReceipts(web3, 'RocketRewardsPool', 'RPLTokensClaimed', {fromBlock: 0}),
        getDissolveReceipts(web3)
    ]).then(([
        userDepositTxReceipts,
        rethBurnTxReceipts,
        nodeRegistrationTxReceipts,
        nodeDepositTxReceipts,
        minipoolCloseTxReceipts,
        networkBalanceSubmissionTxReceipts,
        networkPricesSubmissionTxReceipts,
        minipoolStatusSubmissionTxReceipts,
        proposalVoteReceipts,
        claimReceipts,
        dissolveReceipts
    ]) => {

        // Config
        const gasPrice = 20;

        // Get gas usage data
        const userDepositData = getGasUsage(userDepositTxReceipts);
        const rethBurnData = getGasUsage(rethBurnTxReceipts);
        const nodeRegistrationData = getGasUsage(nodeRegistrationTxReceipts);
        const nodeDepositData = getGasUsage(nodeDepositTxReceipts);
        const minipoolCloseData = getGasUsage(minipoolCloseTxReceipts);
        const networkBalanceSubmissionData = getGasUsage(networkBalanceSubmissionTxReceipts);
        const networkPricesSubmissionData = getGasUsage(networkPricesSubmissionTxReceipts);
        const minipoolStatusSubmissionData = getGasUsage(minipoolStatusSubmissionTxReceipts);
        const proposalVoteData = getGasUsage(proposalVoteReceipts);
        const claimData = getGasUsage(claimReceipts);
        const dissolveData = getGasUsage(dissolveReceipts);

        function printResults(name, data) {
            console.log(`${name} (${data.sampleSize} events):`);
            console.log(`Min gas cost: ${data.minCost} (${gasToEth(data.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
            console.log(`Max gas cost: ${data.maxCost} (${gasToEth(data.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
            console.log(`Avg gas cost: ${data.avgCost} (${gasToEth(data.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
            console.log('--------------------');
        }

        // Print
        printResults('User Deposits', userDepositData);
        printResults('rETH Burns', rethBurnData);
        printResults('Node Registrations', nodeRegistrationData);
        printResults('Node Deposits', nodeDepositData);
        printResults('Minipool Closures', minipoolCloseData);
        printResults('Minipool Dissolve', dissolveData);
        printResults('Network Balance Submissions', networkBalanceSubmissionData);
        printResults('Network Price Submissions', networkPricesSubmissionData);
        printResults('Minipool Status Submissions', minipoolStatusSubmissionData);
        printResults('Proposal Votes', proposalVoteData);
        printResults('RPL Claiming', claimData);

    });

}


// Get transaction receipts from a contract for an event
function getContractEventTxReceipts(web3, contractName, eventName, options) {
    return getContract(web3, contractName)
        .then(contract => contract.getPastEvents(eventName, options))
        .then(events => getEventTxReceipts(web3, events, contractName, eventName));
}


// Get transaction receipts from events
function getEventTxReceipts(web3, events, contractName, eventName) {
    return new Promise((resolve, reject) => {
        const txs = [];
        function processEvent(index) {
            if (index < events.length) {
                console.log(`Processing '${contractName}.${eventName}' event ${index} of ${events.length}`);
                web3.eth.getTransactionReceipt(events[index].transactionHash).then(tx => {
                    txs.push(tx);
                    processEvent(index + 1);
                });
            } else {
                resolve(txs);
            }
        }
        processEvent(0);
    });
}

async function getDissolveReceipts(web3) {
    const allLogs = await web3.eth.getPastLogs({
        fromBlock: 0,
        toBlock: 'latest',
        topics: [
            ['0x26725881c2a4290b02cd153d6599fd484f0d4e6062c361e740fbbe39e7ad6142'],        // StatusUpdated(uint8,uint256)
            ['0x0000000000000000000000000000000000000000000000000000000000000004'],        // MinipoolStatus.Dissolved
        ]
    });
    const receipts = []
    const rocketMinipoolManager = await getContract(web3, 'RocketMinipoolManager');
    for (const log of allLogs) {
        if (await rocketMinipoolManager.methods.getMinipoolExists(log.address).call()){
            receipts.push(await web3.eth.getTransactionReceipt(log.transactionHash));
        }
    }
    return receipts
}

// Get gas usage data from a collection of tx receipts
function getGasUsage(txReceipts) {
    let minCost;
    let maxCost;
    txReceipts.forEach(receipt => {
        if (minCost === undefined || receipt.gasUsed < minCost) minCost = receipt.gasUsed;
        if (maxCost === undefined || receipt.gasUsed > maxCost) maxCost = receipt.gasUsed;
    });
    let avgCost = Math.round(txReceipts.map(receipt => receipt.gasUsed).reduce((acc, val) => (acc + val), 0) / txReceipts.length);
    return {minCost, maxCost, avgCost, sampleSize: txReceipts.length};
}


// Get the ETH cost of a gas amount, given a gas price in gwei
function gasToEth(gasCost, gasPrice) {
    return gasCost * gasPrice / 1000000000;
}


// Export command
module.exports = createCommand('profile-gas-usage')
    .description('profile network gas usage')
    .action(profileGasUsage);

