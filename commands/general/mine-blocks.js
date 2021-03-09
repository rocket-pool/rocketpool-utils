// Imports
const { createCommand } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');


// Mine a number of blocks
function mineBlocks(numBlocks) {

    // Get config
    const config = getConfig();

    // Validate args
    if (isNaN(parseInt(numBlocks))) throw new Error('Invalid block count');

    // Initialize web3
    const web3 = new Web3(config.web3Provider);

    // Make RPC calls
    let p = Promise.resolve();
    for (let i = 0; i < parseInt(numBlocks); ++i) {
        p.then(new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: (new Date()).getTime(),
            }, function(err, response) {
                if (err) { reject(err); }
                else { resolve(); }
            });
        }));
    }

    // Wait for calls to resolve
    p.then(() => {
        console.log('Successfully mined %f blocks', numBlocks);
    });

}


// Export command
module.exports = createCommand('mine-blocks')
    .arguments('<num-blocks>')
    .description('mine a number of blocks')
    .action(mineBlocks);

