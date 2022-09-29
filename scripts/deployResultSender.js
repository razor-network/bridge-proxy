const hre = require("hardhat");

const ProxySchainABI = require("../abis/proxySchainv2.json");

const DELEGATOR_ADDRESS = "0x4535E7486c48Df8e1121be2A31b74aBb2b0a5B8b";
const COLLECTION_MANAGER_ADDRESS = "0x4A6d18E64AF3dC24dAA7a0abbA00670476395A2c";

const DESTINATION_CHAIN = "Mainnet";

async function main() {
  const ResultSender = await hre.ethers.getContractFactory("ResultSender");
  const resultSender = await ResultSender.deploy(
    DELEGATOR_ADDRESS,
    COLLECTION_MANAGER_ADDRESS,
    ProxySchainABI.message_proxy_chain_address
  );

  await resultSender.deployed();
  console.log(`ResultSender contract deployed at: ${resultSender.address}`);

  console.log(`Registering contract for IMA`);
  const proxySchainContract = await hre.ethers.getContractAt(
    ProxySchainABI.message_proxy_chain_abi,
    ProxySchainABI.message_proxy_chain_address
  );
  const tx = await proxySchainContract.registerExtraContract(
    DESTINATION_CHAIN,
    resultSender.address
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
