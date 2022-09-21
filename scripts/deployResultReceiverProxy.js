const hre = require("hardhat");
const proxySchainV3 = require("../abis/proxySchainv3.json");

const SOURCE_CHAIN = "whispering-turais";
const RESULT_SENDER_ADDRESS = "0xfF590bb926C81370A09e20554F992cb45A2d56F0";

async function main() {
  const ResultReceiverProxy = await hre.ethers.getContractFactory(
    "ResultReceiverProxy"
  );
  const instance = await hre.upgrades.deployProxy(ResultReceiverProxy, [
    RESULT_SENDER_ADDRESS,
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
