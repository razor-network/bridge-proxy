const hre = require("hardhat");

const RESULT_HANDLER_PROXY_ADDRESS =
  "0x779589CbcbF1F98383E323A29Af13DEBF3B792CA";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = ResultHandler.attach(RESULT_HANDLER_PROXY_ADDRESS);

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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
