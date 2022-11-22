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

describe("Forwarder tests", () => {
  let resultSender;
  let resultManager;
  let signers;
  let epoch;
  let requestId = 0;
  let forwarder;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const ResultManager = await hre.ethers.getContractFactory(
      "ResultManagerMock"
    );
    resultManager = await hre.upgrades.deployProxy(ResultManager, [
      signers[0].address,
    ]);

    const ResultSender = await hre.ethers.getContractFactory(
      "ResultSenderMock"
    );
    resultSender = await ResultSender.deploy(signers[0].address);

    const Forwarder = await hre.ethers.getContractFactory("Forwarder");
    forwarder = await Forwarder.deploy(resultManager.address);

    epoch = 1;
  });

  describe("Forwarder tests", async () => {
    it("Deployer should have DEFAULT_ADMIN_ROLE", async () => {
      const admin = signers[0].address;
      const DEFAULT_ADMIN_ROLE = await forwarder.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await forwarder.hasRole(DEFAULT_ADMIN_ROLE, admin);
      expect(hasAdminRole).to.be.true;
    });

    it("Only Admin should be able to update result manager address", async () => {
      await expect(
        forwarder.connect(signers[1]).setResultManager(resultManager.address)
      ).to.be.reverted;
    });

    it("setting resultManager address for non contract address should revert", async () => {
      await expect(
        forwarder.setResultManager(signers[1].address)
      ).to.be.rejectedWith("Not a contract address");
    });

    it("getResult call should revert for unassigned collection payload", async () => {
      await forwarder.setPermission(signers[0].address);
      await expect(forwarder.getResult(namesHash[2])).to.be.rejectedWith(
        "Invalid collection name"
      );
    });

    it("Forwarder should return required result", async () => {
      requestId++;
      const message = await getMessage(resultSender, epoch, requestId);
      const signature = await getSignature(message, signers[0]);
      const block = await getBlock(resultSender, message, signature);

      await resultManager.setBlock(block);

      const payload = await forwarder.getPayload(
        "getResult(bytes32)",
        namesHash[0]
      );
      await forwarder.setCollectionPayload(namesHash[0], payload);

      const [result, power] = await resultManager.getResult(namesHash[0]);
      const [forwarderResult, forwarderPower] = await forwarder.getResult(
        namesHash[0]
      );
      expect(result).to.be.equal(forwarderResult);
      expect(power).to.be.equal(forwarderPower);
    });
  });
});
