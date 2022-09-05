const hre = require("hardhat");

const ProxyMainnetABI = require("../abis/proxyMainnet.json");

const SOURCE_CHAIN = "whispering-turais";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = await ResultHandler.deploy();
  await resultHandler.deployed();
  const RESULT_HANDLER_ADDRESS = resultHandler.address;

  console.log(`Result handler deployed at: ${RESULT_HANDLER_ADDRESS}`);

  const proxyMainnetContract = await hre.ethers.getContractAt(
    ProxyMainnetABI.message_proxy_mainnet_abi,
    ProxyMainnetABI.message_proxy_mainnet_address
  );
  const tx = await proxyMainnetContract.registerExtraContract(
    SOURCE_CHAIN,
    RESULT_HANDLER_ADDRESS
  );
  await tx.wait();
  console.log("tx");
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
