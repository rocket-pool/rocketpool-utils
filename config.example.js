const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = 'jungle neck govern chief unaware rubber frequent tissue service license alcohol velvet';

module.exports = {
	networks: {
		local: {
			rocketStorageAddress: '0x70a5F2eB9e4C003B105399b471DAeDbC8d00B1c5',
			web3Provider: new HDWalletProvider(mnemonic, 'http://127.0.0.1:8545'),
			gasLimit: 8000000
		},
		goerli: {
			rocketStorageAddress: '0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3',
			web3Provider: new HDWalletProvider(mnemonic, 'http://127.0.0.1:8545'),
			gasLimit: 8000000
		},
	},
};
