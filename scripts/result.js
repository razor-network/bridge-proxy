const hre = require("hardhat");

const RESULT_MANAGER_PROXY_ADDRESS =
  "0xF2aE9Fd8141E774A08EE3007dA76Ad9d058e713C";

async function main() {
  const ResultManagerProxy = await hre.ethers.getContractFactory(
    "ResultManager"
  );
  const resultManagerProxy = ResultManagerProxy.attach(
    RESULT_MANAGER_PROXY_ADDRESS
  );

  const signerAddress = await resultManagerProxy.signerAddress();
  console.log(`signerAddress: ${signerAddress}`);

  const collectionsResult = await resultManagerProxy.getResultFromID(1);
  console.log(`getResultFromID`);
  console.log(collectionsResult);

  const collectionsResult1 = await resultManagerProxy.getResult(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`getResult`);
  console.log(collectionsResult1);

  const collectionsResult2 = await resultManagerProxy.getCollectionID(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`getCollectionID`);
  console.log(collectionsResult2);

  const collectionsResult3 = await resultManagerProxy.getActiveCollections();
  console.log(`getActiveCollections`);
  console.log(collectionsResult3);

  const collectionsResult4 = await resultManagerProxy.getCollectionStatus(1);
  console.log(`collectionResult`);
  console.log(collectionsResult4);

  const block = await resultManagerProxy.blocks(1);
  console.log("block");
  console.log(block);

  const lastUpdatedTimestamp = await resultManagerProxy.lastUpdatedTimestamp();
  console.log("lastUpdatedTimestamp");
  console.log(lastUpdatedTimestamp);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
