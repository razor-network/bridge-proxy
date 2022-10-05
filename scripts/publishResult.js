const hre = require("hardhat");

// * keccak256("attractive-merope")
const targetChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const RESULT_SENDER_ADDRESS = "0x68557306895C3E21d16B791e2AD9be5c54bd9c0c";

const RESULT_MANAGER_PROXY_ADDRESS =
  "0xF2aE9Fd8141E774A08EE3007dA76Ad9d058e713C";

async function main() {
  try {
    const ResultSender = await hre.ethers.getContractFactory("ResultSender");
    const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

    const epoch = 1;
    const requestId = 1;
    const timestamp = Math.floor(Date.now() / 1000);

    // Fetch the message
    const message = await resultSender.getMessage(epoch, requestId, timestamp);

    const signer = await hre.ethers.getSigner();
    const messageHash = hre.ethers.utils.arrayify(
      hre.ethers.utils.keccak256(message)
    );
    const signature = await signer.signMessage(messageHash);

    // Generate block using message and signature
    const messageBlock = await resultSender.getBlock(message, signature);

    // Send messageBlock to publishResult
    const tx = await resultSender.publishResult(
      targetChainHash,
      RESULT_MANAGER_PROXY_ADDRESS,
      messageBlock
    );

    await tx.wait();
    console.log("Transaction hash: ", tx.hash);
  } catch (error) {
    console.log(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
