const hre = require("hardhat");

const RESULT_MANAGER_ADDRESS = "0xb90CFe3913ffC84164b8ca19Aa9E6234D44a0e36";
const FORWARDER_ADDRESS = "0x443b242Ba0C4efd9a8d300e48bE0A9b2b8ca419B";
const TRANSPARENT_FORWARDER_ADDRESS =
  "0x0CEce449B01C5711bCb425A01AD0C2e197514828";
const STAKING_ADDRESS = "0x0D7f099329Bc476b5934Fdf2F524f7A8578f54c7";

const COLLECTION_NAME_HASH =
  "0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // ETHUSD
const PAYLOAD =
  "0xadd4c78459102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160"; // getResult(hash(ETHUSD))

// * 1. contract: RM, grant FORWARDER_ROLE to forwarder address
// * 2. contract: Forwarder, grant TRANSPARENT_FORWARDER_ROLE to transparent forwarder address
// * 3. contract: Forwarder. grant FORWARDER_ADMIN_ROLE to admin (to set collection payload)
// * 4. contract: Forwarder, set collection payload
// * 5. contract: TF, grant TRANSPARENT_FORWARDER_ADMIN_ROLE to admin
// * 6. contract: TF, set staking to Transparent forwarder address
// * 7. contract: Staking, grant TRANSPARENT_FORWARDER_ROLE to Transparent forwarder address

async function main() {
  const signer = await hre.ethers.getSigner();

  const ResultManager = await hre.ethers.getContractFactory("ResultManager");
  const resultManager = ResultManager.attach(RESULT_MANAGER_ADDRESS);
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = Forwarder.attach(FORWARDER_ADDRESS);
  const TransparentForwarder = await hre.ethers.getContractFactory(
    "TransparentForwarder"
  );
  const transparentForwarder = TransparentForwarder.attach(
    TRANSPARENT_FORWARDER_ADDRESS
  );
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = Staking.attach(STAKING_ADDRESS);

  console.log(
    "[ResultManager] Granting FORWARDER_ROLE to forwarder contract address"
  );
  const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
  const tx1 = await resultManager.grantRole(FORWARDER_ROLE, FORWARDER_ADDRESS);
  await tx1.wait();
  console.log("Transaction hash: ", tx1.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    "[Forwarder] Granting TRANSPARENT_FORWARDER_ROLE to transparent forwarder contract address"
  );
  const TRANSPARENT_FORWARDER_ROLE =
    await forwarder.TRANSPARENT_FORWARDER_ROLE();
  const tx2 = await forwarder.grantRole(
    TRANSPARENT_FORWARDER_ROLE,
    TRANSPARENT_FORWARDER_ADDRESS
  );
  await tx2.wait();
  console.log("Transaction hash: ", tx2.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[Forwarder] Granting FORWARDER_ADMIN_ROLE to admin(${signer.address}) `
  );
  const FORWARDER_ADMIN_ROLE = await forwarder.FORWARDER_ADMIN_ROLE();
  const tx3 = await forwarder.grantRole(FORWARDER_ADMIN_ROLE, signer.address);
  await tx3.wait();
  console.log("Transaction hash: ", tx3.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[Forwarder] Setting collection name hash: ${COLLECTION_NAME_HASH} with payload ${PAYLOAD}`
  );
  const tx4 = await forwarder.setCollectionPayload(
    COLLECTION_NAME_HASH,
    PAYLOAD
  );
  await tx4.wait();
  console.log("Transaction hash: ", tx4.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[TransparentForwarder] Granting TRANSPARENT_FORWARDER_ADMIN_ROLE to admin(${signer.address})`
  );
  const TRANSPARENT_FORWARDER_ADMIN_ROLE =
    await transparentForwarder.TRANSPARENT_FORWARDER_ADMIN_ROLE();
  const tx5 = await transparentForwarder.grantRole(
    TRANSPARENT_FORWARDER_ADMIN_ROLE,
    signer.address
  );
  await tx5.wait();
  console.log("Transaction hash: ", tx5.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[Tranparent Forwarder] setting staking address to ${STAKING_ADDRESS}`
  );
  const tx6 = await transparentForwarder.setStaking(STAKING_ADDRESS);
  await tx6.wait();
  console.log("Transaction hash: ", tx6.hash);
  console.log("--------------------------------------------------------------");

  console.log(
    `[Staking] Granting TRANSPARENT_FORWARDER_ROLE to Transparent Forwarder contract address`
  );
  const tx7 = await staking.grantRole(
    TRANSPARENT_FORWARDER_ROLE,
    TRANSPARENT_FORWARDER_ADDRESS
  );
  await tx7.wait();
  console.log("Transaction hash: ", tx7.hash);
  console.log("--------------------------------------------------------------");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
