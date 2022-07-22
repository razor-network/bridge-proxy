const hre = require("hardhat");

const abi = hre.ethers.utils.defaultAbiCoder;

const ids = [1, 2, 3, 4, 5];
const result = [4000, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];

const encodedData = abi.encode(
  ["uint16[]", "uint256[]", "int8[]"],
  [ids, result, power]
);

// keccak256("attractive-merope")
const destinationChainHash =
  "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";

const SCHAIN_RESULT_PROXY_ADDRESS =
  "0x57C6099D1dbe241e499a5109CC15203eD8D471E0";

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
