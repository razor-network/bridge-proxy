const hre = require("hardhat");

const RESULT_HANDLER_PROXY_ADDRESS =
  "0xff12b2c1F167863Fc0c5aC6584889E0759731fc7";

async function main() {
  const ResultHandlerProxy = await hre.ethers.getContractFactory(
    "ResultHandler"
  );
  const resultHandlerProxy = ResultHandlerProxy.attach(
    RESULT_HANDLER_PROXY_ADDRESS
  );

  await resultHandlerProxy.setKeygen(
    "0x905173b6c0a51925d3c9b619466c623c754fb7bb"
  );

  const keygenAddress = await resultHandlerProxy.keygenAddress();
  console.log(`keygenAddress: ${keygenAddress}`);

  const collectionsResult = await resultHandlerProxy.getResultFromID(1);
  console.log(`getResultFromID`);
  console.log(collectionsResult);

  const collectionsResult1 = await resultHandlerProxy.getResult(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`getResult`);
  console.log(collectionsResult1);

  const collectionsResult2 = await resultHandlerProxy.getCollectionID(
    "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9"
  );
  console.log(`getCollectionID`);
  console.log(collectionsResult2);

  const collectionsResult3 = await resultHandlerProxy.getActiveCollections();
  console.log(`getActiveCollections`);
  console.log(collectionsResult3);

  const collectionsResult4 = await resultHandlerProxy.getCollectionStatus(1);
  console.log(`collectionResult`);
  console.log(collectionsResult4);

  const block = await resultHandlerProxy.blocks(2);
  console.log("block");
  console.log(block);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
