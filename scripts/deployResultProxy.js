const hre = require("hardhat");

const ProxySchainABI = require("../abis/proxySchainv2.json");

const RESULT_HANDLER_ADDRESS = "0xcC63e647758f33E473B1bD577D4bBBA0247fC23f";
const DELEGATOR_ADDRESS = "0x83DC292e959a9E89Bec308C92e89197Cea296D18";

const DESTINATION_CHAIN = "Mainnet";

async function main() {
  const ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
  const resultProxy = await ResultProxy.deploy(
    RESULT_HANDLER_ADDRESS,
    ProxySchainABI.message_proxy_chain_address,
    DELEGATOR_ADDRESS
  );

  await resultProxy.deployed();
  console.log(`Result Proxy deployed at: ${resultProxy.address}`);

  console.log(`Registering contract for IMA`);
  const proxySchainContract = await hre.ethers.getContractAt(
    ProxySchainABI.message_proxy_chain_abi,
    ProxySchainABI.message_proxy_chain_address
  );
  const tx = await proxySchainContract.registerExtraContract(
    DESTINATION_CHAIN,
    resultProxy.address
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
