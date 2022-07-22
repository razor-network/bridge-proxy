const hre = require("hardhat");
const ProxySchainABI = require("../abis/proxySchainv2.json");

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0xcBAcB0bFD136E43b998E45eB096E2a06dCb2a5C7";

const main = async () => {
  try {
    const proxySchainContract = await hre.ethers.getContractAt(
      ProxySchainABI.message_proxy_chain_abi,
      ProxySchainABI.message_proxy_chain_address
    );
    const register = await proxySchainContract.registerExtraContract(
      "attractive-merope",
      SCHAIN_RESULT_PROXY_ADDRESS
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
