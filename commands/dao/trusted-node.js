// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract } = require('../../utils/contract');


// Bootstrap a trusted node DAO member
function bootstrapMember(id, email, nodeAddress) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(nodeAddress)) throw new Error('Invalid node address');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & TN DAO contract, send transaction
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAONodeTrusted'),
    ]).then(([coinbase, rocketDAONodeTrusted]) => {
        return rocketDAONodeTrusted.methods.bootstrapMember(id, email, nodeAddress).send({
            from: coinbase,
            gas: config.gasLimit,
        });
    }).then((receipt) => {
        console.log('Successfully bootstrapped member %s (%s, %s)', id, email, nodeAddress);
    });

}


// Join the trusted node DAO
function memberJoin(nodeAddress) {

    // Get config
    const config = getConfig();

    // Validate args
    if (!Web3.utils.isAddress(nodeAddress)) throw new Error('Invalid node address');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Get coinbase account & contracts, send transactions
    Promise.all([
        web3.eth.getAccounts().then(accounts => accounts[0]),
        getContract(web3, 'RocketDAONodeTrustedSettingsMembers'),
        getContract(web3, 'RocketTokenRPL'),
        getContract(web3, 'RocketDAONodeTrustedActions'),
    ]).then(([coinbase, rocketDAONodeTrustedSettingsMembers, rocketTokenRpl, rocketDAONodeTrustedActions]) => {
        return rocketDAONodeTrustedSettingsMembers.methods.getRPLBond().call().then((rplBondAmount) => {
            return rocketTokenRpl.methods.approve(rocketDAONodeTrustedActions._address, rplBondAmount).send({
                from: nodeAddress,
                gas: config.gasLimit,
            }).then(rocketDAONodeTrustedActions.methods.actionJoin().send({
                from: nodeAddress,
                gas: config.gasLimit,
            }));
        });
    }).then((receipt) => {
        console.log('%s successfully joined the trusted node DAO', nodeAddress);
    });

}


// Export command
module.exports = {
    bootstrapMember: createCommand('bootstrap-tn-dao-member')
        .arguments('<id> <email> <nodeAddress>')
        .description('bootstrap a trusted node DAO member')
        .action(bootstrapMember),
    memberJoin: createCommand('tn-dao-member-join')
        .arguments('<nodeAddress>')
        .description('join the trusted node DAO')
        .action(memberJoin),
};

