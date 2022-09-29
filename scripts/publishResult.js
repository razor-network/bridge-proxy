const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0xfa6D7a3a902020561e1D9D098Bac444D3B7e15b6";

const RESULT_HANDLER_PROXY_ADDRESS =
  "0xE8d70335AE7fc0c145917EA303D507b18f3fE854";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

  const lastRequestId = await resultSender.lastRequestId();
  console.log("lastRequestId: ", lastRequestId);

  const newRequestId = lastRequestId + 1;
  const timesstamp = Math.floor(Date.now() / 1000);

  const message = await resultSender.getMessage(1, newRequestId, timesstamp);

  const signer = await hre.ethers.getSigner();

  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  console.log("signature");
  console.log(signature);

  const tx = await resultSender.publishResult(
    destinationChainHash,
    RESULT_HANDLER_PROXY_ADDRESS,
    newRequestId,
    1,
    timesstamp,
    signature
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
