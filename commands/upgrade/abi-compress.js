// imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const { getContract, compressABI } = require('../../utils/contract');


// Compress a contraacts ABI, used to pass to the DAO proposal for upgrading a contract
function abiCompress(contractName) {

    // Get config
    const config = getConfig();


    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (contractName.length <= 3) throw new Error('Invalid contract name');

    // Use the passed account to register as a node
    Promise.all([
        getContract(web3, contractName),
    ]).then(([RocketContract]) => {
        return compressABI(RocketContract.options.jsonInterface)
    }).then((abiCompressed) => {
        console.log('Successfully compressed contract %s ABI', contractName);
        console.log(abiCompressed);
    });

}


// Export command
module.exports = createCommand('upgrade-abi-compress')
    .arguments('<contractName>')
    .description('compress a contracts ABI for upgrade purposes')
    .action(abiCompress);

