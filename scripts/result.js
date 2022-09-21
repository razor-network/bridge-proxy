const hre = require("hardhat");

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0x14C74129C283114857c3A4AE82e0fee79CD54E20";

async function main() {
  const ResultReceiverProxy = await hre.ethers.getContractFactory(
    "ResultReceiverProxy"
  );
  const resultReceiverProxy = ResultReceiverProxy.attach(
    RESULT_RECEIVER_PROXY_ADDRESS
  );

  const collectionsResult = await resultReceiverProxy.getResultFromID(1);
  console.log(`collectionResult`);
  console.log(collectionsResult);

  const collectionsResult1 = await resultReceiverProxy.getResult(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`collectionResult`);
  console.log(collectionsResult1);

  const collectionsResult2 = await resultReceiverProxy.getCollectionID(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`collectionResult`);
  console.log(collectionsResult2);

  const collectionsResult3 = await resultReceiverProxy.getActiveCollections();
  console.log(`collectionResult`);
  console.log(collectionsResult3);

  const collectionsResult4 = await resultReceiverProxy.getCollectionStatus(1);
  console.log(`collectionResult`);
  console.log(collectionsResult4);

  const updatedCounter = await resultReceiverProxy.updatedCounter();
  console.log(`updatedCounter`);
  console.log(updatedCounter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
