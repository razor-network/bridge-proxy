const hre = require("hardhat");

const SIGNER_ADDRESS = "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";

async function main() {
  console.log("Deploying ResultManager contract...");
  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManager = await ResultManager.deploy(SIGNER_ADDRESS);
  console.log("ResultManager contract deployed at:", resultManager.address);

  console.log("Deploying forwarder contract...");
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy(resultManager.address);
  console.log("Forwarder contract deployed at:", forwarder.address);

  console.log("Deploying Transparent forwarder contract...");
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

  console.log("Deploying Staking contract...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(transparentForwarder.address);
  console.log("Staking contract deployed at:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
