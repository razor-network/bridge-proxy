const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0xfF590bb926C81370A09e20554F992cb45A2d56F0";

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0x14C74129C283114857c3A4AE82e0fee79CD54E20";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

  const tx = await resultSender.publishResult(
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
