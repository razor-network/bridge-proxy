const hre = require("hardhat");
require("dotenv").config();

const SIGNER_ADDRESS =
  process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const COLLECTION_NAME_HASH =
  "0x7404e3d104ea7841c3d9e6fd20adfe99b4ad586bc08d8f3bd3afef894cf184de"; // BTCUSD
const PAYLOAD =
  "0xadd4c7847404e3d104ea7841c3d9e6fd20adfe99b4ad586bc08d8f3bd3afef894cf184de"; // getResult(bytes32) function signature + hash(BTCUSD)
const FORWARDER_ADDRESS = "0xa26232204879C4370806cA56F821b9fe97eAeF5B"; // This address should be updated depending on the chain script is running on
const FORWARDER_ABI = require("../abis/Forwarder.json");

async function main() {
  const signer = await hre.ethers.getSigner();
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = Forwarder.attach(FORWARDER_ADDRESS);
  console.log(
    `[Forwarder] Contract: ${forwarder.address} Setting collection name hash: ${COLLECTION_NAME_HASH} with payload ${PAYLOAD}`
  );
  const tx1 = await forwarder.setCollectionPayload(
    COLLECTION_NAME_HASH,
    PAYLOAD
  );
  await tx1.wait();
  console.log("Transaction hash: ", tx1.hash);
  console.log("----");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
