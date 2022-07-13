require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    skalev2: {
      url: "https://staging-v2.skalenodes.com/v1/whispering-turais",
      accounts: [
        "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
      ],
    },
  },
};
