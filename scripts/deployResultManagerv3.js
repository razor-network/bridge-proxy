const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const FORWARDER_ADDRESS = "0x3999142362705A2E59231C039aF49D82589e6325";
const TRANSPARENT_FORWARDER_ADDRESS = "0x76a6AB56E27823B2175F11b0041c489bFdb13c88";
const COLLECTION_NAME_HASH =
  "0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // ETHUSD
const PAYLOAD =
  "0xadd4c78459102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // getResult(hash(ETHUSD))
  
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

    console.log("Deploying forwarder contract...");
    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    const forwarder = await Forwarder.deploy(resultManagerV2.address);
    console.log("Forwarder contract deployed at:", forwarder.address);

    console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
  );
  await sleep(60000);
  const FORWARDER_ROLE = await resultManagerV2.FORWARDER_ROLE();
  const tx1 = await resultManagerV2.grantRole(FORWARDER_ROLE, forwarder.address);
  await tx1.wait();
  console.log("Transaction hash: ", tx1.hash);

  const TransparentForwarder = await hre.ethers.getContractFactory("TransparentForwarder");
  const transparentForwarder = TransparentForwarder.attach(TRANSPARENT_FORWARDER_ADDRESS); // Forwarder address from previous deployment
    
    console.log(
        `[Transparent Forwarder] setting forwarder address to ${forwarder.address}`
    );
    const tx2 = await transparentForwarder.setForwarder(forwarder.address);
    await tx2.wait();
    console.log("Transaction hash: ", tx2.hash);

    console.log(
        "[Forwarder] Granting TRANSPARENT_FORWARDER_ROLE to transparent forwarder contract address"
      );
      const TRANSPARENT_FORWARDER_ROLE =
        await forwarder.TRANSPARENT_FORWARDER_ROLE();
      const tx3 = await forwarder.grantRole(
        TRANSPARENT_FORWARDER_ROLE,
        transparentForwarder.address
      );
      await tx3.wait();
      console.log("Transaction hash: ", tx3.hash);
      console.log("--------------------------------------------------------------");

      console.log(
        `[Forwarder] Granting FORWARDER_ADMIN_ROLE to admin(${signer.address}) `
      );
      const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
      const tx4 = await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signer.address);
      await tx4.wait();
      console.log("Transaction hash: ", tx4.hash);
      console.log("--------------------------------------------------------------");

      console.log(
        `[Forwarder] Setting collection name hash: ${COLLECTION_NAME_HASH} with payload ${PAYLOAD}`
      );
      const tx5 = await forwarder.setCollectionPayload(
        COLLECTION_NAME_HASH,
        PAYLOAD
      );
      await tx5.wait();
      console.log("Transaction hash: ", tx5.hash);
      console.log("--------------------------------------------------------------");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


