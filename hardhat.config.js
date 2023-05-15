require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-abi-exporter");
require("solidity-coverage");
/** @type import('hardhat/config').HardhatUserConfig */

const { RINKEBY_RPC } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    sChainLocal: {
      url: "http://localhost:15000",
      accounts: [
        "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
        "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
      ],
    },
    sChainV2: {
      url: "https://staging-v2.skalenodes.com/v1/whispering-turais",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    sChainV3: {
      url: "https://staging-v2.skalenodes.com/v1/attractive-merope",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    rinkeby: {
      url: RINKEBY_RPC || "",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    calypsoMainnet: {
      chainId: 1564830818,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000, // this is important, because otherwise the request can time out before you've reviewed and confirmed your transaction on the Ledger
    },
    nebulaMainnet: {
      chainId: 1482601649,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    titanMainnet: {
      chainId: 1350216234,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
    nebulaTestnet: {
      chainId: 503129905,
      url: "http://127.0.0.1:1248", // this is the RPC endpoint exposed by Frame
      timeout: 60000,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true, // Colors on terminal corrupts the output.
    currency: "USD",
  },
};
