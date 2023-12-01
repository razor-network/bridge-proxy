const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const TOKEN_ADDRESS = "0xcbf70914Fae03B3acB91E953De60CfDAaCA8145f";

async function main() {
  console.log("Deploying ResultManager contract...");

  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManagerV2 = await ResultManager.deploy(SIGNER_ADDRESS);
  console.log("ResultManager contract deployed at:", resultManagerV2.address);

  console.log("Deploying forwarder contract...");
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");

  const forwarder = Forwarder.attach(FORWARDER_ADDRESS); // Forwarder address from previous deployment
  console.log("Forwarder contract deployed at", forwarder.address);

  const tx1 = forwarder.setResultManager(resultManagerV2.address);
  tx1.wait();

  console.log("Deploying Staking contract...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(TOKEN_ADDRESS); // Token address required here 
  console.log("Staking contract deployed at:", staking.address);

    console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
  );
  const FORWARDER_ROLE = await resultManagerV2.FORWARDER_ROLE();
  const tx2 = await resultManagerV2.grantRole(FORWARDER_ROLE, forwarder.address);
  await tx2.wait();
    

  const TransparentForwarder = await hre.ethers.getContractFactory(
    "TransparentForwarder"
  );
  const transparentForwarder = TransparentForwarder.attach(TRANSPARENT_FORWARDER_ADDRESS); // Transparent Forwarder address from previous deployment

  console.log(
    `[Tranparent Forwarder] setting staking address to ${staking.address}`
  );
  const tx3 = await transparentForwarder.setStaking(staking.address);
  await tx3.wait();
  console.log("Transaction hash: ", tx3.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[Staking] Granting TRANSPARENT_FORWARDER_ROLE to Transparent Forwarder contract address`
  );
  const TRANSPARENT_FORWARDER_ROLE = await forwarder.TRANSPARENT_FORWARDER_ROLE();
  const tx4 = await staking.grantRole(
    TRANSPARENT_FORWARDER_ROLE,
    transparentForwarder.address
  );
  await tx4.wait();
  console.log("Transaction hash: ", tx4.hash);
  console.log("--------------------------------------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
