const hre = require("hardhat");
// const ProxySchainABI = require("../abis/proxySchain.json");
const ProxySchainABI = require("../abis/proxySchainv2.json");

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0x57C6099D1dbe241e499a5109CC15203eD8D471E0";

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
