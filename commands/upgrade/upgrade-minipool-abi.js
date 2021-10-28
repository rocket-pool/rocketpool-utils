// imports
const { createCommand, program } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const trimNewlines = require('trim-newlines');
const { compressABI, getContract } = require('../../utils/contract');
const fs = require('fs');
const path = require('path');

// Deploy a contract then construct calldata for upgrade
async function upgradeMinipoolAbi(artifactPath, options) {
	// Helper function
	String.prototype.lowerCaseFirstLetter = function() {
		return this.charAt(0).toLowerCase() + this.slice(1);
	};
	// Get config
	const config = getConfig();
	// Initialize web3
	const web3 = new Web3(config.web3Provider);
	// Validate args
	if (artifactPath.length <= 3) throw new Error('Invalid artifact path');
	// Load and combine ABIs of delegate and minipool
	const rocketMinipoolDelegateArtifactPath = path.join(artifactPath, 'RocketMinipoolDelegate.json');
	const rocketMinipoolArtifactPath = path.join(artifactPath, 'RocketMinipool.json');
	const minipoolDelegateContractArtifact = JSON.parse(fs.readFileSync(rocketMinipoolDelegateArtifactPath).toString('utf8'));
	const minipoolContractArtifact = JSON.parse(fs.readFileSync(rocketMinipoolArtifactPath).toString('utf8'));
	const combinedAbi = minipoolDelegateContractArtifact.abi.concat(minipoolContractArtifact.abi);
	const contractName = 'rocketMinipool'
	// Compress the ABI
	const abiCompressed = await compressABI(combinedAbi);
	// Encode the transaction input
	if (!options.bootstrap) {
		// Encode the upgrade payload
		let calldata = web3.eth.abi.encodeFunctionCall(
			{
				name: 'proposalUpgrade',
				type: 'function',
				inputs: [{ type: 'string', name: '_type' }, { type: 'string', name: '_name' }, {
					type: 'string',
					name: '_contractAbi'
				}, { type: 'address', name: '_contractAddress' }]
			},
			['upgradeABI', contractName, trimNewlines(abiCompressed.trim()), '0x0000000000000000000000000000000000000000']
		);
		// Encode the payload into a proposal
		const rocketDaoNodeTrustedProposals = await getContract(web3, 'rocketDAONodeTrustedProposals');
		const proposalCalldata = rocketDaoNodeTrustedProposals.methods.propose(`Upgrade minipool ABI`, calldata).encodeABI();
		console.log('');
		console.log('Send a transaction with the below data from a trusted node to %s to propose upgrade of minipool abi', rocketDaoNodeTrustedProposals.options.address);
		console.log('');
		console.log(proposalCalldata);
	} else {
		// Encode the payload into a bootstrap upgrade
		const rocketDaoNodeTrusted = await getContract(web3, 'rocketDAONodeTrusted');
		const bootstrapCalldata = rocketDaoNodeTrusted.methods.bootstrapUpgrade('upgradeABI', contractName, trimNewlines(abiCompressed.trim()), '0x0000000000000000000000000000000000000000').encodeABI();
		console.log('');
		console.log('Send a transaction with the below data from guardian to %s to perform bootstrap upgrade of minipool abi', rocketDaoNodeTrusted.options.address);
		console.log('');
		console.log(bootstrapCalldata);
	}
}


// Export command
module.exports = createCommand('upgrade-minipool-abi')
	.arguments('<artifactPath>')
	.option('-b, --bootstrap', 'whether to use bootstrap instead of a proposal')
	.description('prepares calldata to either propose or bootstrap upgrade RocketMinipool ABI')
	.action(upgradeMinipoolAbi);

