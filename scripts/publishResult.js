const hre = require("hardhat");

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";
  
  // 0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26
const RESULT_SENDER_ADDRESS = "0x48F3E84e6Ffaf3f55D44D141144a424a424dB83c";

const RESULT_HANDLER_PROXY_ADDRESS =
  "0x801DdA93f02C0b30E7495bCC788D51271863Ec8c";

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
