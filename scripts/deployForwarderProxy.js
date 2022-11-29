const hre = require("hardhat");

const RESULT_MANAGER_ADDRESS = "0x4535E7486c48Df8e1121be2A31b74aBb2b0a5B8b";

async function main() {
  const ForwarderProxy = await hre.ethers.getContractFactory("Forwarder");
  const instance = await hre.upgrades.deployProxy(ForwarderProxy, [
    RESULT_MANAGER_ADDRESS,
  ]);
  await instance.deployed();
  console.log("Forwarder proxy address: ", instance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
