const hre = require("hardhat");
const DELEGATOR_ADDRESS = "0xEe0F436708677c399466Fd61179f8D9864999903";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = await ResultHandler.deploy();
  await resultHandler.deployed();
  const RESULT_HANDLER_ADDRESS = resultHandler.address;

  console.log(`Result handler deployed at: ${RESULT_HANDLER_ADDRESS}`);

  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.deploy(
    DELEGATOR_ADDRESS,
    RESULT_HANDLER_ADDRESS
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
