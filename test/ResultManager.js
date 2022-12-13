const hre = require("hardhat");
const { expect } = require("chai");

const ids = [1, 2, 3, 4, 5];
const result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];

const namesHash = [
  "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9",
  "0x60f80af122a08d5feb55b4bc442814adfa75e095370d49d5657c23adf1efcf23",
  "0xf4f695ea9b25bb19437503d3494e8b744124bfef02c8221e6be4bce31a8ef3c0",
  "0xa6ace279d909674e37f74fbb3052afa3e05bfdf6ce343c254e31a0606a1928f9",
  "0x0f5e947b204a798dd86405ac2f21fed0d109e748bcd057b913eb87b6ffe07c3e",
];

const abiCoder = new hre.ethers.utils.AbiCoder();

const getValues = () => {
  let values = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    values.push({
      power: power[i],
      collectionId: id,
      name: namesHash[i],
      value: result[i],
    });
  }
  return values;
};

const getMessage = (epoch) => {
  const timestampBN = hre.ethers.BigNumber.from("1231231");
  const values = getValues();
  const message = abiCoder.encode(
    [
      "uint32",
      "uint256",
      "tuple[](int8 power, uint16 collectionId, bytes32 name, uint256 value)",
    ],
    [epoch, timestampBN, values]
  );
  return message;
};

const getSignature = async (message, signer) => {
  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  return signature;
};

const getBlock = async (signer, epoch) => {
  const message = getMessage(epoch);
  const signature = await getSignature(message, signer);
  return {
    signature,
    message,
  };
};

describe("Result Manager tests", async () => {
  let resultManager;
  let signers;
  let SIGNER_ADDRESS;
  let epoch;

  before(async () => {
    signers = await hre.ethers.getSigners();
    SIGNER_ADDRESS = signers[0].address;

    const ResultManager = await hre.ethers.getContractFactory("ResultManager");
    resultManager = await ResultManager.deploy(SIGNER_ADDRESS);

    epoch = 1;
  });

  it("Deployer should have DEFAULT_ADMIN_ROLE in ResultManager", async () => {
    const admin = signers[0].address;
    const DEFAULT_ADMIN_ROLE = await resultManager.DEFAULT_ADMIN_ROLE();
    const hasAdminRole = await resultManager.hasRole(DEFAULT_ADMIN_ROLE, admin);
    expect(hasAdminRole).to.be.true;
  });

  it("Signer address should be same as deployer address", async () => {
    const signerAddress = await resultManager.signerAddress();
    expect(signerAddress).to.be.equal(signers[0].address);
  });

  it("Admin should be able to update signer address", async () => {
    const newSignerAddress = signers[1].address;

    await resultManager.updateSignerAddress(newSignerAddress);
    let signerAddress = await resultManager.signerAddress();
    expect(signerAddress).to.be.equal(newSignerAddress);

    await resultManager.updateSignerAddress(signers[0].address);
    signerAddress = await resultManager.signerAddress();
    expect(signerAddress).to.be.equal(signers[0].address);
  });

  it("updateSignerAddress should revert for non admin accounts", async () => {
    await expect(
      resultManager.connect(signers[1]).updateSignerAddress(signers[0].address)
    ).to.be.reverted;
  });

  it("publish result should fail if signature is invalid", async () => {
    const block = await getBlock(signers[1], epoch);

    await expect(resultManager.setBlock(block)).to.be.revertedWith(
      "invalid signature"
    );
  });

  it("getResult should be only accessed by forwarder", async () => {
    const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
    await resultManager.grantRole(FORWARDER_ROLE, signers[1].address);
    await expect(resultManager.getResult(namesHash[0])).to.be.revertedWith(
      "ResultManager: Invalid caller"
    );
    await expect(resultManager.connect(signers[1]).getResult(namesHash[0])).not
      .be.reverted;
  });

  it("setBlock should revert for same epoch", async () => {
    const block = await getBlock(signers[0], epoch);
    await expect(resultManager.setBlock(block)).to.be.not.reverted;
    await expect(resultManager.setBlock(block)).to.be.rejectedWith(
      "Block already set for the epoch"
    );
    epoch++;
  });
});
