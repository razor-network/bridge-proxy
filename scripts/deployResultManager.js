const hre = require("hardhat");

const SIGNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
