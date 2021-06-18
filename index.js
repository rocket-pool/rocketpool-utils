// Imports
const { program } = require('commander');

// General
const seedEther = require('./commands/general/seed-ether');
const mineBlocks = require('./commands/general/mine-blocks');

// Contracts
const contractAddressABI = require('./commands/contract/get-address-abi');

// DAOs
const trustedNodeDAO = require('./commands/dao/trusted-node');

// Deposit pool
const userDeposit = require('./commands/deposit/user-deposit');

// Minipool
const submitMinipoolWithdrawable = require('./commands/minipool/submit-withdrawable');

// Node
const nodeRegister = require('./commands/node/register');
const nodeDeposit = require('./commands/node/deposit');
const nodeSetWithdrawalAddress = require('./commands/node/withdrawal/set');
const nodeGetPendingWithdrawalAddress = require('./commands/node/withdrawal/get-pending');
const nodeConfirmWithdrawalAddress = require('./commands/node/withdrawal/confirm');

// Settings
const protocolSettings = require('./commands/settings/protocol');
const trustedNodeSettings = require('./commands/settings/trusted-node');

// Tokens
const mintOldRpl = require('./commands/tokens/mint-old-rpl');
const mintNewRpl = require('./commands/tokens/mint-new-rpl');

// Upgrading
const upgradeEncodeCalldata = require('./commands/upgrade/call-encode');
const upgradeABICompress = require('./commands/upgrade/abi-compress');
const upgradeABIDecompress = require('./commands/upgrade/abi-decompress');

// Profiling
const viewDepositPoolLogs = require('./commands/profiling/view-deposit-pool-logs');
const viewNetworkBalanceLogs = require('./commands/profiling/view-network-balance-logs');
const viewNetworkPriceLogs = require('./commands/profiling/view-network-price-logs');
const profileGasUsage = require('./commands/profiling/profile-gas-usage');

// Global options
program
    .option('-n, --network <id>', 'network to operate on', 'local');

// Commands
program

    // General
    .addCommand(seedEther)
    .addCommand(mineBlocks)

    // Contracts
    .addCommand(contractAddressABI)

    // DAOs
    .addCommand(trustedNodeDAO.bootstrapMember)
    .addCommand(trustedNodeDAO.bootstrapMember)
    .addCommand(trustedNodeDAO.memberJoin)
    .addCommand(trustedNodeDAO.voteOnProposal)

    // Deposit pool
    .addCommand(userDeposit)

    // Minipool
    .addCommand(submitMinipoolWithdrawable)

    // Node
    .addCommand(nodeRegister)
    .addCommand(nodeDeposit)
    .addCommand(nodeSetWithdrawalAddress)
    .addCommand(nodeGetPendingWithdrawalAddress)
    .addCommand(nodeConfirmWithdrawalAddress)

    // Settings
    .addCommand(protocolSettings.bootstrapAddress)
    .addCommand(protocolSettings.bootstrapBool)
    .addCommand(protocolSettings.bootstrapUint)
    .addCommand(trustedNodeSettings.bootstrapBool)
    .addCommand(trustedNodeSettings.bootstrapUint)

    // Tokens
    .addCommand(mintOldRpl)
    .addCommand(mintNewRpl)

    // Upgrading
    .addCommand(upgradeEncodeCalldata)
    .addCommand(upgradeABICompress)
    .addCommand(upgradeABIDecompress)

    // Profiling
    .addCommand(viewDepositPoolLogs)
    .addCommand(viewNetworkBalanceLogs)
    .addCommand(viewNetworkPriceLogs)
    .addCommand(profileGasUsage);

// Run
program.parse(process.argv);
