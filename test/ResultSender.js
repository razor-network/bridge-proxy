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

describe("ResultSender", () => {
  let resultSender;
  let resultReceiverProxy;
  let signers;
  let DISPATCHER_ROLE;
  let RESULT_PROXY_ADDRESS;

  before(async () => {
    const ResultSender = await hre.ethers.getContractFactory(
      "ResultSenderMock"
    );
    resultSender = await ResultSender.deploy();
    RESULT_PROXY_ADDRESS = resultSender.address;

    const ResultReceiverProxy = await hre.ethers.getContractFactory(
      "ResultReceiverProxyMock"
    );
    resultReceiverProxy = await hre.upgrades.deployProxy(ResultReceiverProxy, [
      RESULT_PROXY_ADDRESS,
    ]);

    signers = await hre.ethers.getSigners();
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

  it("publishResult can be called only by address having DISPATCHER_ROLE", async () => {
    resultSender = await resultSender.connect(signers[1]);
    const DISPATCHER_ROLE = await resultSender.DISPATCHER_ROLE();
    await expect(
      resultSender.publishResult(resultReceiverProxy.address, encodedData)
    ).to.be.revertedWith(
      `AccessControl: account ${signers[1].address.toLowerCase()} is missing role ${DISPATCHER_ROLE.toLowerCase()}`
    );
  });

  it("Collection result should update on publishResult", async () => {
    resultSender = await resultSender.connect(signers[0]);
    await resultSender.publishResult(resultReceiverProxy.address, encodedData);
    const updatedCounter = await resultReceiverProxy.updatedCounter();
    expect(updatedCounter).to.be.equal(1);
  });

  it("Collection result should be same as bridge data", async () => {
    for (let i = 0; i < ids.length; i++) {
      const collectionResult = await resultReceiverProxy.getResultFromID(
        ids[i]
      );
      expect(collectionResult[0].toNumber()).to.be.equal(result[i]);
      expect(collectionResult[1]).to.be.equal(power[i]);
    }

    const updatedCounter = await resultReceiverProxy.updatedCounter();
    expect(updatedCounter).to.be.equal(1);
  });

  it("Only admin can update resultSender address in ResulHandler contract", async () => {
    resultReceiverProxy = await resultReceiverProxy.connect(signers[1]);
    await expect(
      resultReceiverProxy.updateResultSender(
        "0x9ffF410Ecf9acaC08dE61482f91096843f9A035A"
      )
    ).to.be.revertedWith("Ownable: caller is not the owner");

    resultReceiverProxy = await resultReceiverProxy.connect(signers[0]);
    await resultReceiverProxy.updateResultSender(RESULT_PROXY_ADDRESS);
  });

  it("initialize should not be called more than once", async () => {
    await expect(
      resultReceiverProxy.initialize(RESULT_PROXY_ADDRESS)
    ).to.be.revertedWith("Initializable: contract is already initialized");
  });

  it("postMessage should fail if resultSender address is incorrect", async () => {
    await resultReceiverProxy.updateResultSender(
      "0x9ffF410Ecf9acaC08dE61482f91096843f9A035A"
    );
    await expect(
      resultSender.publishResult(resultReceiverProxy.address, encodedData)
    ).to.be.revertedWith("Not Result proxy contract");

    await resultReceiverProxy.updateResultSender(RESULT_PROXY_ADDRESS);
  });
});
