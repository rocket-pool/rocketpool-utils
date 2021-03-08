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

// Settings
const protocolSettings = require('./commands/settings/protocol');
const trustedNodeSettings = require('./commands/settings/trusted-node');

// Tokens
const mintRpl = require('./commands/tokens/mint-rpl');

// Profiling
const viewDepositPoolLogs = require('./commands/profiling/view-deposit-pool-logs');
const viewNetworkBalanceLogs = require('./commands/profiling/view-network-balance-logs');
const profileGasUsage = require('./commands/profiling/profile-gas-usage');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program

    // General
    .addCommand(seedEther)
    .addCommand(mineBlocks)

    // Deposit pool
    .addCommand(userDeposit)

    // Node
    .addCommand(nodeRegister)
    .addCommand(nodeDeposit)

    // Settings
    .addCommand(protocolSettings.bootstrapAddress)
    .addCommand(protocolSettings.bootstrapBool)
    .addCommand(protocolSettings.bootstrapUint)
    .addCommand(trustedNodeSettings.bootstrapBool)
    .addCommand(trustedNodeSettings.bootstrapUint)

    // Tokens
    .addCommand(mintRpl)

    // Profiling
    .addCommand(viewDepositPoolLogs)
    .addCommand(viewNetworkBalanceLogs)
    .addCommand(profileGasUsage);

// Run
program.parse(process.argv);
