const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");

const secrets = JSON.parse(fs.readFileSync(".secrets").toString.trim());

module.exports = {
	network: {
		ropsten: {
			provider: () =>
				new HDWalletProvider(
					secrets.seed,
					`https://ropsten.infura.io/v3/${secrets.projecId}`
				),
		},
	},
};
