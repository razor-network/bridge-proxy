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

const encodedData = hre.ethers.utils.defaultAbiCoder.encode(
  ["uint16[]", "uint256[]", "int8[]", "bytes32[]"],
  [ids, result, power, namesHash]
);

const getMessage = async (resultSender) => {
  const message = await resultSender.getMessage(power, ids, namesHash, result);
  return message;
};

const getSignature = async (message, signer) => {
  const messageHash = hre.ethers.utils.arrayify(
    hre.ethers.utils.keccak256(message)
  );

  const signature = await signer.signMessage(messageHash);
  return signature;
};

describe("ResultSender", () => {
  let resultSender;
  let resultHandler;
  let signers;
  let DISPATCHER_ROLE;
  let KEYGEN_ADDRESS;

  before(async () => {
    signers = await hre.ethers.getSigners();

    const ResultSender = await hre.ethers.getContractFactory(
      "ResultSenderMock"
    );
    resultSender = await ResultSender.deploy();
    KEYGEN_ADDRESS = signers[0].address;

    const ResultHandler = await hre.ethers.getContractFactory(
      "ResultHandlerMock"
    );
    resultHandler = await hre.upgrades.deployProxy(ResultHandler, [
      KEYGEN_ADDRESS,
    ]);

    DISPATCHER_ROLE = await resultSender.DISPATCHER_ROLE();
  });

  it("Admin should have DEFAULT_ADMIN_ROLE", async () => {
    const admin = signers[0].address;
    const DEFAULT_ADMIN_ROLE = await resultSender.DEFAULT_ADMIN_ROLE();
    const hasAdminRole = await resultSender.hasRole(DEFAULT_ADMIN_ROLE, admin);

    expect(hasAdminRole).to.be.true;
  });

  it("Admin should have DISPATCHER_ROLE", async () => {
    const hasDispatcherRole = await resultSender.hasRole(
      DISPATCHER_ROLE,
      signers[0].address
    );
    expect(hasDispatcherRole).to.be.true;
  });

  it("Admin should be able to grant DISPATCHER_ROLE", async () => {
    await resultSender.grantRole(DISPATCHER_ROLE, signers[2].address);
    const hasDispatcherRole = await resultSender.hasRole(
      DISPATCHER_ROLE,
      signers[2].address
    );
    expect(hasDispatcherRole).to.be.true;
  });

  it("initialize should not be called more than once", async () => {
    await expect(resultHandler.initialize(KEYGEN_ADDRESS)).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("publishResult can be called only by address having DISPATCHER_ROLE", async () => {
    resultSender = await resultSender.connect(signers[1]);
    const DISPATCHER_ROLE = await resultSender.DISPATCHER_ROLE();

    const message = await getMessage(resultSender);
    const signature = await getSignature(message, signers[0]);

    await expect(
      resultSender.publishResult(resultHandler.address, 1, signature, message)
    ).to.be.revertedWith(
      `AccessControl: account ${signers[1].address.toLowerCase()} is missing role ${DISPATCHER_ROLE.toLowerCase()}`
    );
    resultSender = await resultSender.connect(signers[0]);
  });

  it("publish result should fail if KEYGEN_ADDRESS is wrong", async () => {
    const message = await getMessage(resultSender);
    const signature = await getSignature(message, signers[1]);

    await expect(
      resultSender.publishResult(resultHandler.address, 1, signature, message)
    ).to.be.revertedWith("invalid signature");
  });

  it("Publish result should update ResultHandler data", async () => {
    const message = await getMessage(resultSender);
    const signature = await getSignature(message, signers[0]);

    await resultSender.publishResult(
      resultHandler.address,
      1,
      signature,
      message
    );

    const activeCollectionIds = await resultHandler.getActiveCollections();
    expect(activeCollectionIds).to.have.same.members(ids);
  });
});
