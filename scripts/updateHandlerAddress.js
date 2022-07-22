const hre = require("hardhat");

const RESULT_PROXY_ADDRESS = "0x57C6099D1dbe241e499a5109CC15203eD8D471E0";

const RESULT_HANDLER_ADDRESS = "0x7F7D2f85aD97307B95bCb1533EE8dA3adafD235b";

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
