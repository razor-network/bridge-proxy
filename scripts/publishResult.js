const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0x9ffF410Ecf9acaC08dE61482f91096843f9A035A";

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0xaeC062ecf7Af0FdB9C9f134AD671027B22C3eF46";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(RESULT_SENDER_ADDRESS);

  const tx = await resultProxy.publishResult(
    destinationChainHash,
    RESULT_RECEIVER_PROXY_ADDRESS
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
