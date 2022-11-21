const hre = require("hardhat");

const SIGNER_ADDRESS = "0x5eED350E394a2ab53023E8A4D706B4FC5117f401";

async function main() {
  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManager = await ResultManager.deploy(SIGNER_ADDRESS);

  console.log("ResultManager contract deployed at:", resultManager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
