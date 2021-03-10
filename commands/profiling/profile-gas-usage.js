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
        getContractEventTxReceipts(web3, 'RocketMinipoolStatus', 'MinipoolWithdrawableSubmitted', {fromBlock: 0}),
    ]).then(([
        userDepositTxReceipts,
        rethBurnTxReceipts,
        nodeRegistrationTxReceipts,
        nodeDepositTxReceipts,
        minipoolCloseTxReceipts,
        networkBalanceSubmissionTxReceipts,
        minipoolStatusSubmissionTxReceipts,
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
        const minipoolStatusSubmissionData = getGasUsage(minipoolStatusSubmissionTxReceipts);

        // Print
        console.log('--------------------');
        console.log(`User deposits (${userDepositData.sampleSize} events):`);
        console.log(`Min gas cost: ${userDepositData.minCost} (${gasToEth(userDepositData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${userDepositData.maxCost} (${gasToEth(userDepositData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${userDepositData.avgCost} (${gasToEth(userDepositData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`rETH burns (${rethBurnData.sampleSize} events):`);
        console.log(`Min gas cost: ${rethBurnData.minCost} (${gasToEth(rethBurnData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${rethBurnData.maxCost} (${gasToEth(rethBurnData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${rethBurnData.avgCost} (${gasToEth(rethBurnData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`Node registrations (${nodeRegistrationData.sampleSize} events):`);
        console.log(`Min gas cost: ${nodeRegistrationData.minCost} (${gasToEth(nodeRegistrationData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${nodeRegistrationData.maxCost} (${gasToEth(nodeRegistrationData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${nodeRegistrationData.avgCost} (${gasToEth(nodeRegistrationData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`Node deposits (${nodeDepositData.sampleSize} events):`);
        console.log(`Min gas cost: ${nodeDepositData.minCost} (${gasToEth(nodeDepositData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${nodeDepositData.maxCost} (${gasToEth(nodeDepositData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${nodeDepositData.avgCost} (${gasToEth(nodeDepositData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`Minipool closures (${minipoolCloseData.sampleSize} events):`);
        console.log(`Min gas cost: ${minipoolCloseData.minCost} (${gasToEth(minipoolCloseData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${minipoolCloseData.maxCost} (${gasToEth(minipoolCloseData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${minipoolCloseData.avgCost} (${gasToEth(minipoolCloseData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`Network balance submissions (${networkBalanceSubmissionData.sampleSize} events):`);
        console.log(`Min gas cost: ${networkBalanceSubmissionData.minCost} (${gasToEth(networkBalanceSubmissionData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${networkBalanceSubmissionData.maxCost} (${gasToEth(networkBalanceSubmissionData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${networkBalanceSubmissionData.avgCost} (${gasToEth(networkBalanceSubmissionData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');
        console.log(`Minipool status submissions (${minipoolStatusSubmissionData.sampleSize} events):`);
        console.log(`Min gas cost: ${minipoolStatusSubmissionData.minCost} (${gasToEth(minipoolStatusSubmissionData.minCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Max gas cost: ${minipoolStatusSubmissionData.maxCost} (${gasToEth(minipoolStatusSubmissionData.maxCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log(`Avg gas cost: ${minipoolStatusSubmissionData.avgCost} (${gasToEth(minipoolStatusSubmissionData.avgCost, gasPrice)} ETH @ ${gasPrice} gwei)`);
        console.log('--------------------');

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

