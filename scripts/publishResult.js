const hre = require("hardhat");
const PROXY_ADDRESS = "0x51Bb5928dDbE14344FB71e5db06974390CEC2Fba";

const ProxyChainABI = require("../abis/proxySchainv2.json");

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0x71c5C2a006F933C4D11B887De89524f62d92E8B0";

const abi = hre.ethers.utils.defaultAbiCoder;

const ids = [1, 2, 3, 4, 5];
const result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];

const encodedData = abi.encode(
  ["uint16[]", "uint256[]", "int8[]"],
  [ids, result, power]
);

const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const incorrectDestinationChainHash =
  "0x7beafa94c8bfb8f1c1a43104a34f72c524268aafbfe83bff17485539345c66ff";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = ResultProxy.attach(SCHAIN_RESULT_PROXY_ADDRESS);

  // const resultInBytes = await resultProxy.proxy();

  const resultInBytes = await resultProxy.publishResult(
    destinationChainHash,
    encodedData
  );
  await resultInBytes.wait();
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
