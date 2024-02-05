const hre = require("hardhat");
const { expect } = require("chai");
const { generateTree, getProof } = require("./helpers/tree");

const ids = [1, 2, 3, 4, 5];
let result = [12122, 212121, 21212, 212, 21];
const power = [2, 2, 2, 2, 5];
let timestamp = [1620000000, 1620000000, 1620000000, 1620000000, 1620000000];

const namesHash = [
  "0x1bbf634c3ad0a99dd58667a617f7773ccb7f37901afa8e9ea1e32212bddb83c9",
  "0x60f80af122a08d5feb55b4bc442814adfa75e095370d49d5657c23adf1efcf23",
  "0xf4f695ea9b25bb19437503d3494e8b744124bfef02c8221e6be4bce31a8ef3c0",
  "0xa6ace279d909674e37f74fbb3052afa3e05bfdf6ce343c254e31a0606a1928f9",
  "0x0f5e947b204a798dd86405ac2f21fed0d109e748bcd057b913eb87b6ffe07c3e",
];


const tree = generateTree(power, ids, namesHash, result, timestamp);

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

  it("functions should revert for not having FORWARDER_ROLE", async () => {
    const [proof, resultDecoded, signature] = await getProof(
      tree,
      1,
      signers[0]
    );
    await expect(
      resultManager.validateResult(
        tree.root,
        proof,
        resultDecoded,
        signature
      )
    ).to.be.reverted
    
    await expect(
      resultManager.updateResult(
        tree.root,
        proof,
        resultDecoded,
        signature
      )
    ).to.be.reverted

    await expect(
      resultManager.getResult(resultDecoded[2])
    ).to.be.reverted
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
    const [validResult, result, power, timestamp] = await resultManager.validateResult(
      merkleRoot,
      proof,
      resultDecoded,
      signature
    );
    
    expect(validResult).to.be.true;
    expect(result).to.be.equal(resultDecoded[3]);
    expect(power).to.be.equal(resultDecoded[0]);
    expect(timestamp).to.be.equal(resultDecoded[4]);
  });

  it("validateResult should revert for invalid signature", async () => {
    const merkleRoot = tree.root;
    const [proof, resultDecoded, signature] = await getProof(
      tree,
      1,
      signers[1]
    );

    const [validResult, result, power, timestamp] = await resultManager.validateResult(
      merkleRoot,
      proof,
      resultDecoded,
      signature
    );

    expect(validResult).to.be.false;
    expect(result).to.be.equal(0);
    expect(power).to.be.equal(0);
    expect(timestamp).to.be.equal(0);
  });

  it("validateResult should revert for invalid merkle proof", async () => {
    const merkleRoot = tree.root;
    const [, resultDecoded_4, signature_4] = await getProof(
      tree,
      4,
      signers[0]
    );
    const [proof_5, , ] = await getProof(
      tree,
      5,
      signers[0]
    );

    const [validResult, result, power, timestamp] = await resultManager.validateResult(
      merkleRoot,
      proof_5,
      resultDecoded_4,
      signature_4
    );

    expect(validResult).to.be.false;
    expect(result).to.be.equal(0);
    expect(power).to.be.equal(0);
    expect(timestamp).to.be.equal(0);
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
    // * value
    expect(colResult[0]).to.be.equal(resultDecoded[3]);
    // * power
    expect(colResult[1]).to.be.equal(resultDecoded[0]);
    // * timestamp
    expect(colResult[2]).to.be.equal(resultDecoded[4]);
  });

  it("updateResult should revert for invalid signature", async () => {
    let [proof, resultDecoded, signature] = await getProof(
      tree,
      4,
      signers[1]
    );
    // should revert with message as invalid signature
    await expect(
      resultManager.updateResult(tree.root, proof, resultDecoded, signature)
    ).to.be.revertedWithCustomError(
      resultManager,
      "InvalidSignature"
      );
  });

  it("updateResult should revert for invalid merkle proof", async () => {
    const [, resultDecoded_4, signature_4] = await getProof(
      tree,
      4,
      signers[0]
    );
    const [proof_5, , ] = await getProof(
      tree,
      5,
      signers[0]
    );
    // should revert with message as invalid merkle proof
    await expect(
      resultManager.updateResult(tree.root, proof_5, resultDecoded_4, signature_4)
    ).to.be.revertedWithCustomError(
      resultManager,
      "InvalidMerkleProof"
      );
  });

  it("should update result if timestamp is greater than previous result", async () => {
    let timestampUpdated = [1620000001, 1620000000, 1620000000, 1620000000, 1620000000];
    let resultUpdated = [12123, 212121, 21212, 212, 21];
    let tree_2 = generateTree(power, ids, namesHash, resultUpdated, timestampUpdated);

    const [updatedProof, updatedResultDecoded, updatedSignature] = await getProof(
      tree_2,
      1,
      signers[0]
    );

    let resultBefore = await resultManager.getResult(updatedResultDecoded[2]);

    expect(
      await resultManager.updateResult(
       tree_2.root,
       updatedProof,
       updatedResultDecoded,
       updatedSignature
      )
   ).to.be.not.reverted;

    let resultAfterUpdation = await resultManager.getResult(updatedResultDecoded[2]);

    expect(resultBefore[2]).to.be.lessThan(resultAfterUpdation[2]);
    expect(resultBefore[0]).to.be.lessThan(resultAfterUpdation[0]);
      
    const [staleProof, staleResultDecoded, staleSignature] = await getProof(
      tree,
      1,
      signers[0]
    );

    expect(
      await resultManager.updateResult(
       tree.root,
       staleProof,
       staleResultDecoded,
       staleSignature
      )
   ).to.be.not.reverted;

   let resultAfterStaleUpdation = await resultManager.getResult(updatedResultDecoded[2]);

    expect(resultAfterUpdation[2]).to.be.equal(resultAfterStaleUpdation[2]);
    expect(resultAfterUpdation[0]).to.be.equal(resultAfterStaleUpdation[0]);
  });

  it("should delete result if called by RESULT_MANAGER_ADMIN_ROLE", async () => {
    const RESULT_MANAGER_ADMIN_ROLE = await resultManager.RESULT_MANAGER_ADMIN_ROLE();
    await expect(
      resultManager.connect(signers[1]).deleteResult(namesHash[0])
    ).to.be.reverted;

    await resultManager.grantRole(RESULT_MANAGER_ADMIN_ROLE, signers[1].address);
    await expect(
      await resultManager.connect(signers[1]).deleteResult(namesHash[0])
    ).to.be.not.reverted;
    await resultManager.revokeRole(RESULT_MANAGER_ADMIN_ROLE, signers[1].address);

    // should revert with message as invalid merkle proof
    await expect(
      resultManager.getResult(namesHash[4])
    ).to.be.revertedWithCustomError(
      resultManager,
      "ZeroResult"
      );
  });
});