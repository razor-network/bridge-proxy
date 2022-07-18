const hre = require("hardhat");

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = await ResultHandler.deploy();
  await resultHandler.deployed();
  const RESULT_HANDLER_ADDRESS = resultHandler.address;

  console.log(`Result handler deployed at: ${RESULT_HANDLER_ADDRESS}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
