const hre = require("hardhat");
const proxySchainV3 = require("../abis/proxySchainv3.json");

const SOURCE_CHAIN = "whispering-turais";
const RESULT_PROXY_ADDRESS = "0xc8B077666Ee9094eA7e0DD879c8540C1c585085F";

async function main() {
  const ResultHandler = await hre.ethers.getContractFactory("ResultHandler");
  const instance = await hre.upgrades.deployProxy(ResultHandler, [
    RESULT_PROXY_ADDRESS,
  ]);
  await instance.deployed();

  console.log("instance");
  console.log(instance);
  console.log("instance.address: ", instance.address);

  const proxySchainContract = await hre.ethers.getContractAt(
    proxySchainV3.message_proxy_chain_abi,
    proxySchainV3.message_proxy_chain_address
  );
  console.log("Registering extra contract on Schain");
  const tx = await await proxySchainContract.registerExtraContract(
    SOURCE_CHAIN,
    instance.address
  );
  await tx.wait();
  console.log("tx");
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
