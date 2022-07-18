const hre = require("hardhat");
// const ProxySchainABI = require("../abis/proxySchain.json");
const ProxySchainABI = require("../abis/proxySchainv2.json");

// const SCHAIN_RESULT_PROXY_ADDRESS =
//   "0x71c5C2a006F933C4D11B887De89524f62d92E8B0";
const SCHAIN_RESULT_PROXY_ADDRESS =
  "0x9EF4fD40aCB9A36988D8F919e2bc313DCF9413b2";

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
