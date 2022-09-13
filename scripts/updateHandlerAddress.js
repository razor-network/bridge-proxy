const hre = require("hardhat");

const RESULT_PROXY_ADDRESS = "0x54EB375F80f6feCA26BaA49A76dc7FB35bd04a03";

const RESULT_HANDLER_ADDRESS = "0x10144adD7B8cB532BE580cf508837f155416D21A";

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
