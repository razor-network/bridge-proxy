const hre = require("hardhat");

const PROXY_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

async function main() {
  try {
    const ForwarderV2 = await hre.ethers.getContractFactory("ForwarderV2");
    const tx = await hre.upgrades.upgradeProxy(PROXY_ADDRESS, ForwarderV2);
    console.log("tx");
    console.log(tx);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
