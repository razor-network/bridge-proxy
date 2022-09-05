const hre = require("hardhat");

const RESULT_PROXY_ADDRESS = "0xbf823D9323B74AE01096d84EcbE76Fb7e4D44209";

const RESULT_HANDLER_ADDRESS = "0x8DFdbC21f1F406A92F05C8B192fAd10e3b79eeb6";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(RESULT_PROXY_ADDRESS);

  const tx = await resultProxy.updateResultHandlerAddress(
    RESULT_HANDLER_ADDRESS
  );
  console.log("tx");
  console.log(tx);

  const newAddress = await resultProxy.resultHandler();
  console.log(`New result handler address: ${newAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
