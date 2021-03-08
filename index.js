// Imports
const { program } = require('commander');

// General
const seedEther = require('./commands/general/seed-ether');
const mineBlocks = require('./commands/general/mine-blocks');

// Deposit pool
const userDeposit = require('./commands/deposit/user-deposit');

// Node
const nodeRegister = require('./commands/node/register');
const nodeDeposit = require('./commands/node/deposit');

// Profiling
const viewDepositPoolLogs = require('./commands/profiling/view-deposit-pool-logs');
const viewNetworkBalanceLogs = require('./commands/profiling/view-network-balance-logs');
const profileGasUsage = require('./commands/profiling/profile-gas-usage');

// Settings
const trustedNodeSettings = require('./commands/settings/trustednode');

// Tokens
const mintRpl = require('./commands/tokens/mint-rpl');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program
    .addCommand(seedEther)
    .addCommand(mineBlocks)
    .addCommand(userDeposit)
    .addCommand(nodeRegister)
    .addCommand(nodeDeposit)
    .addCommand(viewDepositPoolLogs)
    .addCommand(viewNetworkBalanceLogs)
    .addCommand(profileGasUsage)
    .addCommand(trustedNodeSettings.bootstrapUint)
    .addCommand(trustedNodeSettings.bootstrapBool)
    .addCommand(mintRpl);

// Run
program.parse(process.argv);
