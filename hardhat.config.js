require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
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
      accounts: [],
    },
    sChainV3: {
      url: "https://staging-v2.skalenodes.com/v1/attractive-merope",
      accounts: [],
    },
  },
};
