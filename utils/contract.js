// imports
const fs = require('fs');
const pako = require('pako');
const { getConfig } = require('../utils/config');


// Get a web3 contract instance
function getContract(web3, name) {

    // Get config
    const config = getConfig();

    // Load contract artifact
    const contractArtifact = JSON.parse(fs.readFileSync(config.contractArtifactPath + name + '.json'));

    // Return promise resolving to contract instance
    return web3.eth.net.getId().then((networkId) => {
        if (!contractArtifact.networks[networkId]) throw new Error('Contract "' + name + '" not deployed to network');
        return new web3.eth.Contract(contractArtifact.abi, contractArtifact.networks[networkId].address);
    });

}

// Compress / decompress contract ABIs
function compressABI(abi) {
    return Buffer.from(pako.deflate(JSON.stringify(abi))).toString('base64');
}

function decompressABI(abi) {
    return JSON.parse(pako.inflate(Buffer.from(abi, 'base64'), {to: 'string'}));
}

// Exports
module.exports = { getContract, compressABI, decompressABI };
