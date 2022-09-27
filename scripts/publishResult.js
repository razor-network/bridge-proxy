const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0x0C28A8881182591A62ea54F27F774bf254B78dbf";

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0xEe9C45A4aA4e62250ddE79e94222aBb9dE465b1d";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

  const lastRequestId = await resultSender.lastRequestId();
  console.log("lastRequestId: ", lastRequestId);

  const message = await resultSender.getMessage();

  const signer = await hre.ethers.getSigner();

  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  console.log("signature");
  console.log(signature);

  const newRequestId = lastRequestId + 1;
  console.log("newRequestId");
  console.log(newRequestId);
  const tx = await resultSender.publishResult(
    destinationChainHash,
    RESULT_RECEIVER_PROXY_ADDRESS,
    newRequestId,
    signature
  );

  // const tx = await resultSender.publishResult(
  //   destinationChainHash,
  //   RESULT_RECEIVER_PROXY_ADDRESS
  // );
  await tx.wait();
  console.log("Transaction hash: ", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
