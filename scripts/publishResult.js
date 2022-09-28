const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0xE93C1C49Ed593CaA13027C3B8987A9DdB8fE35c7";

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0xE5E77D25a53b801cA312aEBa6c798e47E992d77c";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

  const lastRequestId = await resultSender.lastRequestId();
  console.log("lastRequestId: ", lastRequestId);

  const newRequestId = lastRequestId + 1;

  const message = await resultSender.getMessage(1, newRequestId);

  const signer = await hre.ethers.getSigner();

  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  console.log("signature");
  console.log(signature);

  const timesstamp = Math.floor(Date.now() / 1000);

  const tx = await resultSender.publishResult(
    destinationChainHash,
    RESULT_RECEIVER_PROXY_ADDRESS,
    newRequestId,
    1,
    timesstamp,
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
