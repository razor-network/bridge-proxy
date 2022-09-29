const hre = require("hardhat");

const destinationChainHash =
  "0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26";
  
  // 0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26
const RESULT_SENDER_ADDRESS = "0xfa6D7a3a902020561e1D9D098Bac444D3B7e15b6";

const RESULT_HANDLER_PROXY_ADDRESS =
  "0x665f152ee96c6c6448A81e1002BC99A70D4A29AD";

async function main() {
  try{
    const ResultSender = await hre.ethers.getContractFactory("ResultSender");
    const resultSender = ResultSender.attach(RESULT_SENDER_ADDRESS);

    const lastRequestId = await resultSender.lastRequestId();
    console.log("lastRequestId: ", lastRequestId);
  
    const newRequestId = lastRequestId + 1;
    const timesstamp = Math.floor(Date.now() / 1000);
  
    const message = await resultSender.getMessage(1, newRequestId, timesstamp);
    console.log("message");
    console.log(message);
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
  } catch (error) {
    console.log(error)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
