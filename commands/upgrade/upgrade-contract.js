// imports
const { createCommand, program } = require('commander');
const Web3 = require('web3');
const { getConfig } = require('../../utils/config');
const trimNewlines = require('trim-newlines');
const { compressABI, getContract } = require('../../utils/contract');
const fs = require('fs');


// Returns an undeployed web3 Contract instance by contract name
function loadContract(web3, file) {
}


// Deploy a contract then construct calldata for upgrade
async function upgradeContract(artifactPath, options) {
	// Helper function
	String.prototype.lowerCaseFirstLetter = function() {
		return this.charAt(0).toLowerCase() + this.slice(1);
	};
	// Get config
	const config = getConfig();
	// Initialize web3
	const web3 = new Web3(config.web3Provider);
	const accounts = await web3.eth.getAccounts();
	// Validate args
	if (artifactPath.length <= 3) throw new Error('Invalid artifact path');
	// Get RocketStorage
	const rocketStorage = await getContract(web3, 'RocketStorage');
	// Load contract
	const contractArtifact = JSON.parse(fs.readFileSync(artifactPath).toString('utf8'));
	const rocketContract = new web3.eth.Contract(contractArtifact.abi, null, { data: contractArtifact.bytecode });
	const contractName = contractArtifact.contractName.lowerCaseFirstLetter();
	let newContractAddress;
	if (options.deploy) {
		// Deploy the new contract
		newContractAddress = await new Promise((resolve, reject) => {
			rocketContract.deploy({ arguments: [rocketStorage.options.address] })
				.send({ from: accounts[0] })
				.on('receipt', function(receipt) { resolve(receipt.contractAddress); })
				.on('error', reject);
		});
		console.log('');
		console.log('Successfully deployed contract to %s', newContractAddress);
		console.log('');
	} else {
		newContractAddress = options.address;
		if (!newContractAddress) {
			console.error('Address must be supplied if not deploying (--address <address>)');
			return;
		}
	}
	// Compress the ABI
	const abiCompressed = await compressABI(rocketContract.options.jsonInterface);
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
			['upgradeContract', contractName, trimNewlines(abiCompressed.trim()), trimNewlines(newContractAddress.trim())]
		);
		console.log('');
		console.log('Successfully encoded contract %s calldata', contractName);
		console.log('');
		console.log(calldata);
		// Encode the payload into a proposal
		const rocketDaoNodeTrustedProposals = await getContract(web3, 'rocketDAONodeTrustedProposals');
		const proposalCalldata = rocketDaoNodeTrustedProposals.methods.propose(`Upgrade ${contractName} to ${newContractAddress}`, calldata).encodeABI();
		console.log('');
		console.log('Send a transaction with the below data from a trusted node to %s to propose upgrade of %s to %s', rocketDaoNodeTrustedProposals.options.address, contractName, newContractAddress);
		console.log('');
		console.log(proposalCalldata);
	} else {
		// Encode the payload into a bootstrap upgrade
		const rocketDaoNodeTrusted = await getContract(web3, 'rocketDAONodeTrusted');
		const bootstrapCalldata = rocketDaoNodeTrusted.methods.bootstrapUpgrade('upgradeContract', contractName, trimNewlines(abiCompressed.trim()), trimNewlines(newContractAddress.trim())).encodeABI();
		console.log('');
		console.log('Send a transaction with the below data from guardian to %s to perform bootstrap upgrade of %s to %s', rocketDaoNodeTrusted.options.address, contractName, newContractAddress);
		console.log('');
		console.log(bootstrapCalldata);
	}
}


// Export command
module.exports = createCommand('upgrade-contract')
	.arguments('<artifactPath>')
	.option('-b, --bootstrap', 'whether to use bootstrap instead of a proposal')
	.option('-d, --deploy', 'whether to deploy the upgraded contract')
	.option('-a, --address <address>', 'address of the upgraded contract (required if not deploying)')
	.description('prepares calldata to either propose or bootstrap a contract upgrade')
	.action(upgradeContract);

