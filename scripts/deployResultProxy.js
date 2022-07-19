const hre = require("hardhat");

// const ProxySchainABI = require("../abis/proxySchain.json");
const ProxySchainABI = require("../abis/proxySchainv2.json");

const RESULT_HANDLER_ADDRESS = "0x4D6f9B03e6448B7470fb5985bB1813A2f2508284";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.deploy(
    RESULT_HANDLER_ADDRESS,
    ProxySchainABI.message_proxy_chain_address
  );

  await resultProxy.deployed();
  console.log(`Result Proxy deployed at: ${resultProxy.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
