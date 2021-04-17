// imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const {  decompressABI } = require('../../utils/contract');


// Decompress a contracts  compressed ABI
function abiDecompress(compressedABI) {

    // Get config
    const config = getConfig();

    // Validate args
    if (compressedABI.length <= 3) throw new Error('Invalid compressed ABI');

    // Use the passed account to register as a node
    console.log('');
    console.log('Successfully decompressed contract %s ABI');
    console.log(decompressABI(compressedABI));

}


// Export command
module.exports = createCommand('upgrade-abi-decompress')
    .arguments('<compressedABI>')
    .description('decompress a contracts ABI')
    .action(abiDecompress);
