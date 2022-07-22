const hre = require("hardhat");

const RESULT_PROXY_ADDRESS = "0xcBAcB0bFD136E43b998E45eB096E2a06dCb2a5C7";

const RESULT_HANDLER_ADDRESS = "0x1C44BFe51762CF87aF4C95ABebB6607298eaF04a";

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
