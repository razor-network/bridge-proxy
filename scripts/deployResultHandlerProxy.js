const hre = require("hardhat");
const proxySchainV3 = require("../abis/proxySchainv3.json");

const SOURCE_CHAIN = "whispering-turais";
const KEYGEN_ADDRESS = "0x905173B6C0A51925d3C9B619466c623c754Fb7BB";

async function main() {
  const ResultHandlerProxy = await hre.ethers.getContractFactory(
    "ResultHandler"
  );
  const instance = await hre.upgrades.deployProxy(ResultHandlerProxy, [
    KEYGEN_ADDRESS,
  ]);
  await instance.deployed();

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
