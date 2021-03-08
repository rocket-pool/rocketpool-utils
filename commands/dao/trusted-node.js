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


// Export command
module.exports = {
    bootstrapMember: createCommand('bootstrap-tn-dao-member')
        .arguments('<id> <email> <nodeAddress>')
        .description('bootstrap a trusted node DAO member')
        .action(bootstrapMember),
};

