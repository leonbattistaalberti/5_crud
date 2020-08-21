const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
	networks: {
		ropsten: {
			provider: () =>
				new HDWalletProvider(
					process.env.SEED,
					`https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`
				),
			network_id: "3",
		},
	},
};
