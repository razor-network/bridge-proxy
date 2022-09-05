const hre = require("hardhat");

const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
  "0x8DFdbC21f1F406A92F05C8B192fAd10e3b79eeb6";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = ResultHandler.attach(
    MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS
  );

  const collectionsResult = await resultHandler.getAllResult();
  console.log(`collectionResult`);
  console.log(collectionsResult);

  const updatedCounter = await resultHandler.updatedCounter();
  console.log(`updatedCounter`);
  console.log(updatedCounter);
  // for (let i = 1; i <= 5; i++) {
  //   const result = await resultHandler.getResult(i);
  //   console.log(
  //     `CollectionID: ${i}\t Result: ${result[0].toNumber()}\t Power: ${
  //       result[1]
  //     }`
  //   );
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
