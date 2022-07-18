const hre = require("hardhat");

// const ProxySchainABI = require("../abis/proxySchain.json");
const ProxySchainABI = require("../abis/proxySchainv2.json");

const RESULT_HANDLER_ADDRESS = "0x7631bf7Eb61c5B88C66BFb2abE36Cb6FC7774C16";

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
