const hre = require("hardhat");
// const ProxyMainnetABI = require("../abis/proxyMainnet.json");
const ProxyMainnetABI = require("../abis/proxySchainv3.json");

// const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
//   "0x87B6a0ab90d826189cC004Dc2ff16E2b472309db";
const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
  "0xb605aFC49b3Fe7282832665b8dC94623790Fe2E6";

const main = async () => {
  try {
    const proxyMainnetContract = await hre.ethers.getContractAt(
      ProxyMainnetABI.message_proxy_chain_abi,
      ProxyMainnetABI.message_proxy_chain_address
    );
    const register = await proxyMainnetContract.registerExtraContract(
      "whispering-turais",
      MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS
    );
    await register.wait();
    console.log("register");
    console.log(register);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

main();
