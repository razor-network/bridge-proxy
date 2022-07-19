const hre = require("hardhat");

const MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS =
  "0x4D6f9B03e6448B7470fb5985bB1813A2f2508284";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const resultHandler = ResultHandler.attach(
    MAINNET_RESULT_HANDLER_CONTRACT_ADDRESS
  );

  for (let i = 1; i <= 5; i++) {
    const result = await resultHandler.getResult(i);
    console.log(
      `CollectionID: ${i}\t Result: ${result[0].toNumber()}\t Power: ${
        result[1]
      }`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
