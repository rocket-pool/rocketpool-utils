// imports
const fs = require('fs');
const pako = require('pako');
const { getConfig } = require('../utils/config');


// Get a web3 contract instance
async function getContract(web3, name) {

	// Helper function
	String.prototype.lowerCaseFirstLetter = function() {
		return this.charAt(0).toLowerCase() + this.slice(1);
	};

	// Get config
	const config = getConfig();

	// Get rocket storage instance
	const rocketStorage = new web3.eth.Contract([
		{
			'inputs': [
				{
					'internalType': 'bytes32',
					'name': '_key',
					'type': 'bytes32'
				}
			],
			'name': 'getAddress',
			'outputs': [
				{
					'internalType': 'address',
					'name': 'r',
					'type': 'address'
				}
			],
			'stateMutability': 'view',
			'type': 'function',
			'constant': true
		},
		{
			'inputs': [
				{
					'internalType': 'bytes32',
					'name': '_key',
					'type': 'bytes32'
				}
			],
			'name': 'getString',
			'outputs': [
				{
					'internalType': 'string',
					'name': '',
					'type': 'string'
				}
			],
			'stateMutability': 'view',
			'type': 'function',
			'constant': true
		},
	], config.rocketStorageAddress);

	// Retrieve contract address and ABI from network
	const contractAddress = await rocketStorage.methods.getAddress(web3.utils.keccak256(`contract.address${name.lowerCaseFirstLetter()}`)).call();
	const contractAbiPacked = await rocketStorage.methods.getString(web3.utils.keccak256(`contract.abi${name.lowerCaseFirstLetter()}`)).call();
	const contractAbi = decompressABI(contractAbiPacked);

	// Create web3 contract instance
	return new web3.eth.Contract(contractAbi, contractAddress);

}


// Compress / decompress contract ABIs
function compressABI(abi) {
	return Buffer.from(pako.deflate(JSON.stringify(abi))).toString('base64');
}


function decompressABI(abi) {
	return JSON.parse(pako.inflate(Buffer.from(abi, 'base64'), { to: 'string' }));
}


// Exports
module.exports = { getContract, compressABI, decompressABI };
