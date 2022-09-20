const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0xc8B077666Ee9094eA7e0DD879c8540C1c585085F";

const RESULT_HANDLER_PROXY_ADDRESS =
  "0x779589CbcbF1F98383E323A29Af13DEBF3B792CA";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(SCHAIN_RESULT_PROXY_ADDRESS);

  const tx = await resultProxy.publishResult(
    destinationChainHash,
    RESULT_HANDLER_PROXY_ADDRESS
  );
  await tx.wait();
  console.log("Transaction hash: ", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
