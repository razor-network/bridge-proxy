const hre = require("hardhat");

const ProxySchainABI = require("../abis/proxySchainv2.json");

const RESULT_HANDLER_ADDRESS = "0xb605aFC49b3Fe7282832665b8dC94623790Fe2E6";
const DELEGATOR_ADDRESS = "0xE9043a524c886A3556849bCcf307f4208ef7e675";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.deploy(
    RESULT_HANDLER_ADDRESS,
    ProxySchainABI.message_proxy_chain_address,
    DELEGATOR_ADDRESS
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
