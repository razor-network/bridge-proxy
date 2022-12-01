const hre = require("hardhat");

const RESULT_MANAGER_ADDRESS = "0x4535E7486c48Df8e1121be2A31b74aBb2b0a5B8b";

async function main() {
  console.log("Deploying forwarder contract");
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy(RESULT_MANAGER_ADDRESS);
  console.log("Forwarder contract deployed at:", forwarder.address);

  console.log("Deploying Transparent forwarder contract");
  const TransparentForwarder = await hre.ethers.getContractFactory(
    "TransparentForwarder"
  );
  const transparentForwarder = await TransparentForwarder.deploy(
    forwarder.address
  );
  console.log(
    "TransparentForwarder contract deployed at:",
    transparentForwarder.address
  );

  console.log("Setting TransparentForwarder address in Forwarder");
  const tx = await forwarder.setTransparentForwarder(
    transparentForwarder.address
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
