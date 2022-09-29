require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require('hardhat-abi-exporter');
/** @type import('hardhat/config').HardhatUserConfig */

const {
  RINKEBY_RPC,
} = process.env;

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
        "0x11b0275c26eb8b6ce0fd130776faf5f7293e0cdbe63f6017b8b843906f60080f",
      ],
    },
    sChainV3: {
      url: "https://staging-v2.skalenodes.com/v1/attractive-merope",
      accounts: [
        "0xafb39e2f91d9ae624e00efb0bae865421c73a60047e2699f79dd40c8bcaf73fe"
      ],
    },
    rinkeby: {
      url: RINKEBY_RPC || "https://eth-rinkeby.alchemyapi.io/v2/wp4eHsQ2qW3Trprn8IHWCi6bE4a_HcuC",
      accounts: [
        "0x11b0275c26eb8b6ce0fd130776faf5f7293e0cdbe63f6017b8b843906f60080f"
      ],
    },
  },
};
