const hre = require("hardhat");
// const ProxyMainnetABI = require("../abis/proxyMainnet.json");
const ProxyMainnetABI = require("../abis/proxySchainv3.json");

const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
  "0x7F7D2f85aD97307B95bCb1533EE8dA3adafD235b";

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
