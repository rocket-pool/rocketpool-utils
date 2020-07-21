// Imports
const { program } = require('commander');
const seedEther = require('./commands/seed-ether');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program
    .addCommand(seedEther);

// Run
program.parse(process.argv);
