const hre = require("hardhat");

const SIGNER_ADDRESS = "0x5eED350E394a2ab53023E8A4D706B4FC5117f401";

async function main() {
  const ResultManagerProxy = await hre.ethers.getContractFactory(
    "ResultManager"
  );
  const instance = await hre.upgrades.deployProxy(ResultManagerProxy, [
    SIGNER_ADDRESS,
  ]);
  await instance.deployed();
  console.log("ResultManager proxy address: ", instance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
