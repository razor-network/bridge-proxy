const hre = require("hardhat");
const { expect } = require("chai");

describe("ResultProxy", () => {
  let ResultProxy;
  let resultProxy;
  let signers;

  const destinationChainHash =
    "0x44e247f49a9e6321f857375220890622a446abe945db7ed24b82fcbbbae07d12";
  const RESULT_HANDLER_PROXY_ADDRESS =
    "0x0412541C409024eA65c8030DD213bD5767E4b3F2";

  before(async () => {
    ResultProxy = await hre.ethers.getContractFactory("ResultProxy");
    signers = await hre.ethers.getSigners();
    resultProxy = await ResultProxy.deploy(
      "0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd",
      "0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd",
      "0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd"
    );
    await resultProxy.deployed();
  });

  it("Should have admin role", async () => {
    const admin = signers[0].address;
    const DEFAULT_ADMIN_ROLE = await resultProxy.DEFAULT_ADMIN_ROLE();
    const hasAdminRole = await resultProxy.hasRole(DEFAULT_ADMIN_ROLE, admin);

    expect(hasAdminRole).to.be.true;
  });

  it("Admin should have DISPATCHER_ROLE", async () => {
    const DISPATCHER_ROLE = await resultProxy.DISPATCHER_ROLE();
    const hasDispatcherRole = await resultProxy.hasRole(
      DISPATCHER_ROLE,
      signers[0].address
    );
    expect(hasDispatcherRole).to.be.true;
  });

  it("publishResult can be only called by address having DISPATCHER_ROLE", async () => {
    resultProxy = await resultProxy.connect(signers[1]);
    const DISPATCHER_ROLE = await resultProxy.DISPATCHER_ROLE();
    await expect(
      resultProxy.publishResult(
        destinationChainHash,
        RESULT_HANDLER_PROXY_ADDRESS
      )
    ).to.be.revertedWith(
      `AccessControl: account ${signers[1].address.toLowerCase()} is missing role ${DISPATCHER_ROLE.toLowerCase()}`
    );
  });
});
