const hre = require("hardhat");
require('dotenv').config();

const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || "0xC68AcC784227DbEaE98Bb6F5aC3C57cCe1aE9B4B";
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const { checkTimeDifference } = require('./validateTimestamp');
const { calculateGasPrice } = require('./calculateGasPrice');

const RESULTGETTER_SELECTOR = "0xadd4c784";  
const UPDATE_SELECTOR = "0x2d444fd5"; 
const VALIDATE_SELECTOR = "0x41417a9d";
const SLEEP_TIME = 10000; // 10s
const sleep = (m) => new Promise((r) => setTimeout(r, m));


async function main() {
  console.log("Validating block timestamp of the deploying chain")
    if(!DEPLOYER_ADDRESS){
        console.log("DEPLOYER_ADDRESS not set in env");
        process.exit(0);
    } else {
        console.log("Deployer address:", DEPLOYER_ADDRESS);
    }
  await checkTimeDifference()
  .then(() => console.log('Finished checking time difference.'))
  .catch(error => console.error('An error occurred:', error));

  const gasPrice = await calculateGasPrice();
  console.log("Gas Price used", gasPrice.toString() + " wei");
  const signer = await hre.ethers.getSigner();

  console.log("Deploying ResultManager contract...");
  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManager = await ResultManager.deploy(SIGNER_ADDRESS, {
    gasPrice,
    gasLimit: 30000000,
  });
  await resultManager.deployed();
  console.log("ResultManager contract deployed at:", resultManager.address);
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log("Deploying forwarder contract...");
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy(resultManager.address, {
    gasPrice,
    gasLimit: 30000000,
  });
  await forwarder.deployed();
  console.log("Forwarder contract deployed at:", forwarder.address);
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`);
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log("Deploying Transparent forwarder contract...");
  const TransparentForwarder = await hre.ethers.getContractFactory(
    "TransparentForwarder"
  );
  const transparentForwarder = await TransparentForwarder.deploy(forwarder.address, {
    gasPrice,
    gasLimit: 30000000,
    }
  );
  await transparentForwarder.deployed();
  console.log(
    "TransparentForwarder contract deployed at:",
    transparentForwarder.address
  );
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`);
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log("Deploying Staking contract...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy({
    gasPrice,
    gasLimit: 30000000,
    });
    await staking.deployed();
  console.log("Staking contract deployed at:", staking.address);

  console.log("Contract Addresses:");
  console.log({
    ResultManager: resultManager.address,
    Forwarder: forwarder.address,
    TransparentForwarder: transparentForwarder.address,
    Staking: staking.address,
  });

  console.log("--------------------------------------------------------------");
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");
  console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
  );
  const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
  const tx1 = await resultManager.grantRole(FORWARDER_ROLE, forwarder.address);
  await tx1.wait();
  console.log("Transaction hash: ", tx1.hash);
  console.log("--------------------------------------------------------------");

  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    "[Forwarder] Granting TRANSPARENT_FORWARDER_ROLE to transparent forwarder contract address"
  );
  const TRANSPARENT_FORWARDER_ROLE =
    await forwarder.TRANSPARENT_FORWARDER_ROLE();
  const tx2 = await forwarder.grantRole(
    TRANSPARENT_FORWARDER_ROLE,
    transparentForwarder.address
  );
  await tx2.wait();
  console.log("Transaction hash: ", tx2.hash);
  console.log("--------------------------------------------------------------");
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Forwarder] Granting FORWARDER_ADMIN_ROLE to admin(${signer.address}) `
  );
  const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
  const tx3 = await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signer.address);
  await tx3.wait();
  console.log("Transaction hash: ", tx3.hash);
  console.log("--------------------------------------------------------------");

  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Forwarder] Setting resultGetter selector to ${RESULTGETTER_SELECTOR}`
  );
  const tx4 = await forwarder.setResultGetterSelector(RESULTGETTER_SELECTOR);
  await tx4.wait();
  console.log("Transaction hash: ", tx4.hash);
  console.log("--------------------------------------------------------------");

  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Forwarder] Setting update selector to ${UPDATE_SELECTOR}`
  );
  const tx5 = await forwarder.setUpdateSelector(UPDATE_SELECTOR);
  await tx5.wait();
  console.log("Transaction hash: ", tx5.hash);
  console.log("--------------------------------------------------------------");

  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Forwarder] Setting validate selector to ${VALIDATE_SELECTOR}`
  );
  const tx6 = await forwarder.setValidateSelector(VALIDATE_SELECTOR);
  await tx6.wait();
  console.log("Transaction hash: ", tx6.hash);
  console.log("--------------------------------------------------------------");  
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[TransparentForwarder] Granting TRANSPARENT_FORWARDER_ADMIN_ROLE to admin(${signer.address})`
  );
  const TRANSPARENT_FORWARDER_ADMIN_ROLE =
    await transparentForwarder.TRANSPARENT_FORWARDER_ADMIN_ROLE();
  const tx7 = await transparentForwarder.grantRole(
    TRANSPARENT_FORWARDER_ADMIN_ROLE,
    signer.address
  );
  await tx7.wait();
  console.log("Transaction hash: ", tx7.hash);
  console.log("--------------------------------------------------------------");
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Tranparent Forwarder] setting staking address to ${staking.address}`
  );
  const tx8 = await transparentForwarder.setStaking(staking.address);
  await tx8.wait();
  console.log("Transaction hash: ", tx8.hash);
  console.log("--------------------------------------------------------------");
  console.log(`Sleeping for ${SLEEP_TIME/1000}s...`)
  await sleep(SLEEP_TIME);
  console.log("Awake...");

  console.log(
    `[Staking] Granting TRANSPARENT_FORWARDER_ROLE to Transparent Forwarder contract address`
  );
  const tx9 = await staking.grantRole(
    TRANSPARENT_FORWARDER_ROLE,
    transparentForwarder.address
  );
  await tx9.wait();
  console.log("Transaction hash: ", tx9.hash);
  console.log("--------------------------------------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
