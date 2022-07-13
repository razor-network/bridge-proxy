const hre = require("hardhat");
const DELEGATOR_ADDRESS = "0xEe0F436708677c399466Fd61179f8D9864999903";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.deploy(DELEGATOR_ADDRESS);

  await resultProxy.deployed();
  console.log(`Result Proxy deployed at: ${resultProxy.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
