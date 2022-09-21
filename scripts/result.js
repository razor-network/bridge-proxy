const hre = require("hardhat");

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0xaeC062ecf7Af0FdB9C9f134AD671027B22C3eF46";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = ResultHandler.attach(RESULT_RECEIVER_PROXY_ADDRESS);

  const collectionsResult = await resultHandler.getResultFromID(1);
  console.log(`collectionResult`);
  console.log(collectionsResult);

  const collectionsResult1 = await resultHandler.getResult(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`collectionResult`);
  console.log(collectionsResult1);

  const collectionsResult2 = await resultHandler.getCollectionID(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`collectionResult`);
  console.log(collectionsResult2);

  const collectionsResult3 = await resultHandler.getActiveCollections();
  console.log(`collectionResult`);
  console.log(collectionsResult3);

  const collectionsResult4 = await resultHandler.getCollectionStatus(1);
  console.log(`collectionResult`);
  console.log(collectionsResult4);

  const updatedCounter = await resultHandler.updatedCounter();
  console.log(`updatedCounter`);
  console.log(updatedCounter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
