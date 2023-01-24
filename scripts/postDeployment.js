/**
 * 1. Set collectionPayload in Forwarder
 * 2. Grant FORWARDER_ROLE to Forwarder contract in Result Manager contract
 */

const hre = require("hardhat");

const RESULT_MANAGER_ADDRESS = "0xa26232204879C4370806cA56F821b9fe97eAeF5B";
const FORWARDER_ADDRESS = "0xbF5c5AD799b2245BA36562BebfcbAbc5D508Eb84";

async function main() {
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = Forwarder.attach(FORWARDER_ADDRESS);

  console.log("Sending tx to update collectionPayload");
  // * Set collection payload
  const collectionNameHash =
    "0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // ETHUSD
  const payload =
    "0xadd4c78459102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // getResult(hash(ETHUSD))
  const tx = await forwarder.setCollectionPayload(collectionNameHash, payload);
  await tx.wait();
  console.log("Transaction Hash:", tx.hash);

  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManager = ResultManager.attach(RESULT_MANAGER_ADDRESS);

  console.log(
    "Granting FORWARDER_ROLE to Forwarder contract in Result Manager contract"
  );
  const FORWARDER_ROLE =
    "0x3fb90a982568460bdf5505b984928e3c942db3525e60c25e39051cacec08b60f";
  const tx1 = await resultManager.grantRole(FORWARDER_ROLE, FORWARDER_ADDRESS);
  console.log("Transaction Hash:", tx1.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
