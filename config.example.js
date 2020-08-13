// Global config
module.exports = {
    networks: {
        local: {
            contractArtifactPath: '/path/to/rocketpool/build/contracts/',
            web3Provider: 'http://127.0.0.1:8545',
            gasLimit: 8000000,
        },
    },
};
