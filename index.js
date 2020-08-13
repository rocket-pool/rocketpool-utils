// Imports
const { program } = require('commander');
const seedEther = require('./commands/seed-ether');
const userDeposit = require('./commands/user-deposit');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program
    .addCommand(seedEther)
    .addCommand(userDeposit);

// Run
program.parse(process.argv);
