const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0xCec573e1FeC01441e66Ca4b26f04f88A57258457";

const RESULT_RECEIVER_PROXY_ADDRESS =
  "0xff12b2c1F167863Fc0c5aC6584889E0759731fc7";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

  const lastRequestId = await resultSender.lastRequestId();
  console.log("lastRequestId: ", lastRequestId.toNumber());

  const message = await resultSender.getMessage();

  const signer = await hre.ethers.getSigner();

  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  console.log("signature");
  console.log(signature);

  const newRequestId = lastRequestId.add("1");
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
