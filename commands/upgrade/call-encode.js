// imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const trimNewlines = require('trim-newlines');


// Encode a call to upgrade a contract via the Oracle DAO
function callEncode(upgradeType, contractName, newContractCompressedABI, newContractAddress) {

    // Helper function
    String.prototype.lowerCaseFirstLetter = function() {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }

    // Get config
    const config = getConfig();

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Validate args
    if (upgradeType.length <= 3) throw new Error('Invalid upgrade type');
    if (contractName.length <= 3) throw new Error('Invalid contract name');
    if (newContractCompressedABI.length <= 3) throw new Error('Invalid contract abi');
    if (!Web3.utils.isAddress(newContractAddress)) throw new Error('Invalid new contract address');

    // Use the passed account to register as a node
    let calldata = web3.eth.abi.encodeFunctionCall(
        {name: 'proposalUpgrade', type: 'function', inputs: [{type: 'string',  name: '_type'},{type: 'string', name: '_name'},{type: 'string', name: '_contractAbi'},{type: 'address', name: '_contractAddress'}]},
        [upgradeType, contractName.lowerCaseFirstLetter(), trimNewlines(newContractCompressedABI.trim()), trimNewlines(newContractAddress.trim())]
    )

    console.log('');
    console.log('Successfully encoded contract %s calldata', contractName);
    console.log('');
    console.log(calldata);

}


// Export command
module.exports = createCommand('upgrade-encode-call')
    .arguments('<upgradeType> <contractName> <newContractCompressedABI> <newContractAddress>')
    .description('encode the calldata needed for a contract upgrade')
    .action(callEncode);

