const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const COLLECTION_NAME_HASH =
  "0x7404e3d104ea7841c3d9e6fd20adfe99b4ad586bc08d8f3bd3afef894cf184de"; // BTCUSD
const PAYLOAD =
  "0xadd4c7847404e3d104ea7841c3d9e6fd20adfe99b4ad586bc08d8f3bd3afef894cf184de"; // getResult(bytes32) function signature + hash(BTCUSD)
const FORWARDER_ADDRESS = "0xa26232204879C4370806cA56F821b9fe97eAeF5B";
const FORWARDER_ABI = require("../abis/Forwarder.json");


async function main() {
//   console.log("Deploying ResultManager contract...");
  const signer = await hre.ethers.getSigner();
  const forwarder = new ethers.Contract(FORWARDER_ADDRESS, FORWARDER_ABI, signer);
console.log(
    `[Forwarder] Contract: ${FORWARDER_ADDRESS} Setting collection name hash: ${COLLECTION_NAME_HASH} with payload ${PAYLOAD}`
  );
  const tx1 = await forwarder.setCollectionPayload(
    COLLECTION_NAME_HASH,
    PAYLOAD
  );
  await tx1.wait();
  console.log("Transaction hash: ", tx1.hash);
  console.log("----");

//   const ResultManager = await hre.ethers.getContractFactory("ResultManager");
//   const resultManager = await ResultManager.deploy(SIGNER_ADDRESS);
//   console.log("ResultManager contract deployed at:", resultManager.address);

//   console.log("Deploying forwarder contract...");
//   const Forwarder = await hre.ethers.getContractFactory("Forwarder");
//   const forwarder = await Forwarder.deploy(resultManager.address);
//   console.log("Forwarder contract deployed at:", forwarder.address);

//   console.log("Deploying Transparent forwarder contract...");
//   const TransparentForwarder = await hre.ethers.getContractFactory(
//     "TransparentForwarder"
//   );
//   const transparentForwarder = await TransparentForwarder.deploy(
//     forwarder.address
//   );
//   console.log(
//     "TransparentForwarder contract deployed at:",
//     transparentForwarder.address
//   );

//   console.log("Deploying Staking contract...");
//   const Staking = await hre.ethers.getContractFactory("Staking");
//   const staking = await Staking.deploy();
//   console.log("Staking contract deployed at:", staking.address);

//   console.log("Contract Addresses:");
//   console.log({
//     ResultManager: resultManager.address,
//     Forwarder: forwarder.address,
//     TransparentForwarder: transparentForwarder.address,
//     Staking: staking.address,
//   });

//   console.log("--------------------------------------------------------------");

//   console.log(
//     "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
//   );
//   const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
//   const tx1 = await resultManager.grantRole(FORWARDER_ROLE, forwarder.address);
//   await tx1.wait();
//   console.log("Transaction hash: ", tx1.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     "[Forwarder] Granting TRANSPARENT_FORWARDER_ROLE to transparent forwarder contract address"
//   );
//   const TRANSPARENT_FORWARDER_ROLE =
//     await forwarder.TRANSPARENT_FORWARDER_ROLE();
//   const tx2 = await forwarder.grantRole(
//     TRANSPARENT_FORWARDER_ROLE,
//     transparentForwarder.address
//   );
//   await tx2.wait();
//   console.log("Transaction hash: ", tx2.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[Forwarder] Granting FORWARDER_ADMIN_ROLE to admin(${signer.address}) `
//   );
//   const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
//   const tx3 = await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signer.address);
//   await tx3.wait();
//   console.log("Transaction hash: ", tx3.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[Forwarder] Setting collection name hash: ${COLLECTION_NAME_HASH} with payload ${PAYLOAD}`
//   );
//   const tx4 = await forwarder.setCollectionPayload(
//     COLLECTION_NAME_HASH,
//     PAYLOAD
//   );
//   await tx4.wait();
//   console.log("Transaction hash: ", tx4.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[TransparentForwarder] Granting TRANSPARENT_FORWARDER_ADMIN_ROLE to admin(${signer.address})`
//   );
//   const TRANSPARENT_FORWARDER_ADMIN_ROLE =
//     await transparentForwarder.TRANSPARENT_FORWARDER_ADMIN_ROLE();
//   const tx5 = await transparentForwarder.grantRole(
//     TRANSPARENT_FORWARDER_ADMIN_ROLE,
//     signer.address
//   );
//   await tx5.wait();
//   console.log("Transaction hash: ", tx5.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[Tranparent Forwarder] setting staking address to ${staking.address}`
//   );
//   const tx6 = await transparentForwarder.setStaking(staking.address);
//   await tx6.wait();
//   console.log("Transaction hash: ", tx6.hash);
//   console.log("--------------------------------------------------------------");

//   console.log(
//     `[Staking] Granting TRANSPARENT_FORWARDER_ROLE to Transparent Forwarder contract address`
//   );
//   const tx7 = await staking.grantRole(
//     TRANSPARENT_FORWARDER_ROLE,
//     transparentForwarder.address
//   );
//   await tx7.wait();
//   console.log("Transaction hash: ", tx7.hash);
//   console.log("--------------------------------------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
