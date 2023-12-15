const hre = require("hardhat");
const { expect } = require("chai");
const { generateTree, getProof } = require("./helpers/tree");

const abiCoder = new hre.ethers.utils.AbiCoder();

const tree = generateTree();

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

    // * Grant RESULT_MANAGER_ADMIN_ROLE to admin
    const RESULT_MANAGER_ADMIN_ROLE =
      await resultManager.RESULT_MANAGER_ADMIN_ROLE();
    await resultManager.grantRole(
      RESULT_MANAGER_ADMIN_ROLE,
      signers[0].address
    );

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

  it("validateResult should return true for valid result", async () => {
    const FORWARDER_ROLE = await resultManager.FORWARDER_ROLE();
    await resultManager.grantRole(FORWARDER_ROLE, signers[0].address);
    const merkleRoot = tree.root;
    const [proof, resultDecoded, signature] = await getProof(
      tree,
      1,
      signers[0]
    );
    const result = await resultManager.validateResult(
      merkleRoot,
      proof,
      resultDecoded,
      signature
    );
    expect(result).to.be.true;
  });

  it("updateResult should update the collection result", async () => {
    const [proof, resultDecoded, signature] = await getProof(
      tree,
      1,
      signers[0]
    );
    expect(
      await resultManager.updateResult(
        tree.root,
        proof,
        resultDecoded,
        signature
      )
    ).to.be.not.reverted;

    const colResult = await resultManager.getResult(resultDecoded[2]);
    console.log({ colResult });
    // * value
    expect(colResult[0]).to.be.equal(resultDecoded[3]);
    // * power
    expect(colResult[1]).to.be.equal(resultDecoded[0]);
    // * timestamp
    expect(colResult[2]).to.be.equal(resultDecoded[4]);
  });
});
