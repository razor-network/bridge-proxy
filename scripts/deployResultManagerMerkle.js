const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B"; // Update this to DESTINATION CHAIN SIGNER_ADDRESS
const TRANSPARENT_FORWARDER_ADDRESS = "0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84"; // Update this to DESTINATION CHAIN TRANSPARENT_FORWARDER_ADDRESS


const sleep = (m) => new Promise((r) => setTimeout(r, m));

async function main() {
    console.log("Deploying ResultManager contract...");
    const signer = await hre.ethers.getSigner();
    const ResultManager = await hre.ethers.getContractFactory("ResultManager");
    const resultManagerMerkle = await ResultManager.deploy(SIGNER_ADDRESS);
    console.log("ResultManager contract deployed at:", resultManagerMerkle.address);

    console.log("Deploying forwarder contract...");
    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    const forwarder = await Forwarder.deploy(resultManagerMerkle.address);
    console.log("Forwarder contract deployed at:", forwarder.address);

    console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
    );
    const FORWARDER_ROLE = await resultManagerMerkle.FORWARDER_ROLE();
    const tx1 = await resultManagerMerkle.grantRole(FORWARDER_ROLE, forwarder.address);
    await tx1.wait();
    console.log("Transaction hash: ", tx1.hash);

    const TransparentForwarder = await hre.ethers.getContractFactory("TransparentForwarder");
    const transparentForwarder = TransparentForwarder.attach(TRANSPARENT_FORWARDER_ADDRESS); // Transparent Forwarder address from previous deployment
    console.log(
    `[Transparent Forwarder] setting forwarder address to ${forwarder.address}`
    );
    const tx2 = await transparentForwarder.setForwarder(forwarder.address);
    await tx2.wait();
    console.log("Transaction hash: ", tx2.hash);
    console.log("Sleeping for 30s...")
    await sleep(30000);
    console.log("Awake...");

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
    console.log("Sleeping for 30s...")
    await sleep(30000);
    console.log("Awake...");

    console.log(
    `[Forwarder] Granting FORWARDER_ADMIN_ROLE to admin(${signer.address}) `
    );
    const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
    const tx4 = await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signer.address);
    await tx4.wait();
    console.log("Transaction hash: ", tx4.hash);
    console.log("--------------------------------------------------------------");
    const tx5 = await forwarder.setResultGetterSelector("0xadd4c784");
    await tx5.wait();
    console.log("Transaction hash: ", tx5.hash);
    console.log("--------------------------------------------------------------");

    const tx6 = await forwarder.setUpdateSelector("0x2d444fd5");
    await tx6.wait();
    console.log("Transaction hash: ", tx6.hash);
    console.log("--------------------------------------------------------------");

    const tx7 = await forwarder.setValidateSelector("0x41417a9d");
    await tx7.wait();
    console.log("Transaction hash: ", tx7.hash);
    console.log("--------------------------------------------------------------");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


