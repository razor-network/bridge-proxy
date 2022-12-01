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

const getMessage = async (resultSender, epoch, requestId) => {
  const message = await resultSender.getMessage(
    power,
    ids,
    namesHash,
    result,
    epoch,
    requestId
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

const getBlock = async (resultSender, message, signature) => {
  const block = await resultSender.getBlock(message, signature);
  return block;
};

describe("Data bridge tests", () => {
  let resultSender;
  let resultManager;
  let signers;
  let SIGNER_ADDRESS;
  let epoch;
  let requestId = 0;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const ResultSender = await hre.ethers.getContractFactory(
      "ResultSenderMock"
    );
    SIGNER_ADDRESS = signers[0].address;
    resultSender = await ResultSender.deploy(SIGNER_ADDRESS);

    const ResultManager = await hre.ethers.getContractFactory(
      "ResultManagerMock"
    );
    resultManager = await ResultManager.deploy(SIGNER_ADDRESS);

    epoch = 1;
  });

  describe("ResultSender tests", async () => {
    it("Admin should have DEFAULT_ADMIN_ROLE", async () => {
      const admin = signers[0].address;
      const DEFAULT_ADMIN_ROLE = await resultSender.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await resultSender.hasRole(
        DEFAULT_ADMIN_ROLE,
        admin
      );

      expect(hasAdminRole).to.be.true;
    });

    it("Signer address should be same as deployer address", async () => {
      const signerAddress = await resultSender.signerAddress();
      expect(signerAddress).to.be.equal(signers[0].address);
    });

    it("Admin/Signer should be able to update signer address", async () => {
      const newSignerAddress = signers[1].address;

      await resultSender.updateSignerAddress(newSignerAddress);
      let signerAddress = await resultSender.signerAddress();
      expect(signerAddress).to.be.equal(newSignerAddress);

      await resultSender.updateSignerAddress(signers[0].address);
      signerAddress = await resultSender.signerAddress();
      expect(signerAddress).to.be.equal(signers[0].address);
    });

    it("updateSignerAddress should revert for non admin/signer accounts", async () => {
      await expect(
        resultSender.connect(signers[1]).updateSignerAddress(signers[0].address)
      ).to.be.revertedWith("Invalid Caller");
    });

    it("publish result should fail if signature is invalid", async () => {
      requestId++;
      const message = await getMessage(resultSender, epoch, requestId);
      const signature = await getSignature(message, signers[1]);
      const block = await getBlock(resultSender, message, signature);

      await expect(
        resultSender.publishResult(resultManager.address, block)
      ).to.be.revertedWith("invalid signature");
    });
  });

  describe("ResultManager tests", async () => {
    it("Admin should have DEFAULT_ADMIN_ROLE", async () => {
      const admin = signers[0].address;
      const DEFAULT_ADMIN_ROLE = await resultManager.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await resultManager.hasRole(
        DEFAULT_ADMIN_ROLE,
        admin
      );

      expect(hasAdminRole).to.be.true;
    });

    it("Admin/Signer should be able to update signer address", async () => {
      const newSignerAddress = signers[1].address;

      await resultManager.updateSignerAddress(newSignerAddress);
      let signerAddress = await resultManager.signerAddress();
      expect(signerAddress).to.be.equal(newSignerAddress);

      await resultManager.updateSignerAddress(signers[0].address);
      signerAddress = await resultManager.signerAddress();
      expect(signerAddress).to.be.equal(signers[0].address);
    });

    it("Publish result should update collection results", async () => {
      requestId++;
      const message = await getMessage(resultSender, epoch, requestId);
      const signature = await getSignature(message, signers[0]);
      const block = await getBlock(resultSender, message, signature);

      await resultSender.publishResult(resultManager.address, block);

      for (let i = 0; i < ids.length; i++) {
        // * test getCollectionID
        const cId = await resultManager.getCollectionID(namesHash[i]);
        expect(cId).to.be.equal(ids[i]);

        // * test getResult
        let [cResult, cPower] = await resultManager.getResult(namesHash[i]);
        expect(cPower).to.be.equal(power[i]);
        expect(cResult.toNumber()).to.be.equal(result[i]);

        // * test getResultFromID
        [cResult, cPower] = await resultManager.getResultFromID(ids[i]);
        expect(cPower).to.be.equal(power[i]);
        expect(cResult.toNumber()).to.be.equal(result[i]);
      }

      // * test activeCollectionIds
      const activeCollectionIds = await resultManager.getActiveCollections();
      expect(activeCollectionIds).to.have.same.members(ids);

      // * test getCollectionStatus
      for (let i = 0; i < ids.length + 1; i++) {
        const isActive = await resultManager.getCollectionStatus(i);
        const isExist = ids.includes(i);
        expect(isActive).to.be.equal(isExist);
      }
    });

    it("Publish result should create block with requestId", async () => {
      requestId++;
      const message = await getMessage(resultSender, epoch, requestId);
      const signature = await getSignature(message, signers[0]);
      const messageBlock = await getBlock(resultSender, message, signature);

      await resultSender.publishResult(resultManager.address, messageBlock);

      const block = await resultManager.blocks(requestId);
      expect(block.message).to.be.not.equal("0x");
    });
  });
});
