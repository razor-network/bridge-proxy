const hre = require("hardhat");
const PROXY_ADDRESS = "0x51Bb5928dDbE14344FB71e5db06974390CEC2Fba";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.attach(PROXY_ADDRESS);

  const resultInBytes = await resultProxy.publishResult();
  console.log("resultInBytes");
  console.log(resultInBytes);

  // await resultProxy.deployed();
  // console.log(`Result Proxy deployed at: ${resultProxy.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
