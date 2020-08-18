// Imports
const { program } = require('commander');
const seedEther = require('./commands/seed-ether');
const userDeposit = require('./commands/user-deposit');
const nodeRegister = require('./commands/node/register');
const nodeDeposit = require('./commands/node/deposit');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program
    .addCommand(seedEther)
    .addCommand(userDeposit)
    .addCommand(nodeRegister)
    .addCommand(nodeDeposit);

// Run
program.parse(process.argv);
