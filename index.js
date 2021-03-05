// Imports
const { program } = require('commander');

// General
const seedEther = require('./commands/seed-ether');

// Deposit pool
const userDeposit = require('./commands/deposit/user-deposit');

// Node
const nodeRegister = require('./commands/node/register');
const nodeDeposit = require('./commands/node/deposit');

// Profiling
const viewDepositPoolLogs = require('./commands/profiling/view-deposit-pool-logs');
const viewNetworkBalanceLogs = require('./commands/profiling/view-network-balance-logs');
const profileGasUsage = require('./commands/profiling/profile-gas-usage');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program
    .addCommand(seedEther)
    .addCommand(userDeposit)
    .addCommand(nodeRegister)
    .addCommand(nodeDeposit)
    .addCommand(viewDepositPoolLogs)
    .addCommand(viewNetworkBalanceLogs)
    .addCommand(profileGasUsage);

// Run
program.parse(process.argv);
