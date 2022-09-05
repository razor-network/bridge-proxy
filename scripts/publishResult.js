const hre = require("hardhat");

const destinationChainHash =
  "0x8d646f556e5d9d6f1edcf7a39b77f5ac253776eb34efcfd688aacbee518efc26";

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0xbf823D9323B74AE01096d84EcbE76Fb7e4D44209";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(SCHAIN_RESULT_PROXY_ADDRESS);

  const tx = await resultProxy.publishResult(destinationChainHash);
  await tx.wait();
  console.log("Transaction hash: ", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
