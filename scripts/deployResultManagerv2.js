const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const FORWARDER_ADDRESS = "0x3999142362705A2E59231C039aF49D82589e6325";
const TRANSPARENT_FORWARDER_ADDRESS = "0x76a6AB56E27823B2175F11b0041c489bFdb13c88";

const sleep = (m) => new Promise((r) => setTimeout(r, m));

async function main() {
  console.log("Deploying ResultManager contract...");
  const signer = await hre.ethers.getSigner();
  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManagerV2 = await ResultManager.deploy(SIGNER_ADDRESS);
  console.log("ResultManager contract deployed at:", resultManagerV2.address);
  console.log("Sleeping for 1 minute...")
  await sleep(60000);
  console.log("Awake...");
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = Forwarder.attach(FORWARDER_ADDRESS); // Forwarder address from previous deployment
  console.log("Forwarder contract deployed at", forwarder.address, "Setting ResultManager address: ", resultManagerV2.address);
  const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
  const tx0 = await forwarder.hasRole(FORWARDER_ADMIN_ROLE, signer.address);
  console.log(tx0)
  const tx1 = await forwarder.setResultManager(resultManagerV2.address);
  await tx1.wait();

//   console.log("Deploying Staking contract...");
//   const Staking = await hre.ethers.getContractFactory("Staking");
//   const staking = await Staking.deploy();
//   console.log("Staking contract deployed at:", staking.address);

    console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
  );
  await sleep(60000);
  const FORWARDER_ROLE = await resultManagerV2.FORWARDER_ROLE();
  const tx2 = await resultManagerV2.grantRole(FORWARDER_ROLE, forwarder.address);
  await tx2.wait();
    

//   const TransparentForwarder = await hre.ethers.getContractFactory(
//     "TransparentForwarder"
//   );
//   const transparentForwarder = TransparentForwarder.attach(TRANSPARENT_FORWARDER_ADDRESS); // Transparent Forwarder address from previous deployment

//   console.log(
//     `[Tranparent Forwarder] setting staking address to ${staking.address}`
//   );
//   const tx3 = await transparentForwarder.setStaking(staking.address);
//   await tx3.wait();
//   console.log("Transaction hash: ", tx3.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[Staking] Granting TRANSPARENT_FORWARDER_ROLE to Transparent Forwarder contract address`
//   );
//   const TRANSPARENT_FORWARDER_ROLE = await forwarder.TRANSPARENT_FORWARDER_ROLE();
//   const tx4 = await staking.grantRole(
//     TRANSPARENT_FORWARDER_ROLE,
//     transparentForwarder.address
//   );
//   await tx4.wait();
//   console.log("Transaction hash: ", tx4.hash);
//   console.log("--------------------------------------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


